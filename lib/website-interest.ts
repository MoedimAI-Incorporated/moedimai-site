import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";

const recipient = "vivian@moedim.ai";
const kinds = [
  "waitlist",
  "enterprise",
  "government",
  "development",
  "investor",
  "general",
] as const;
const titles: Record<(typeof kinds)[number], string> = {
  waitlist: "Product waitlist",
  enterprise: "Enterprise enquiry",
  government: "Government enquiry",
  development: "Development partner enquiry",
  investor: "Investor information request",
  general: "Website enquiry",
};
const singleLine = (max: number) =>
  z
    .string()
    .max(max)
    .refine((v) => !/[\r\n\x00-\x1f\x7f]/.test(v))
    .transform((v) => v.trim())
    .pipe(z.string().min(1));
const payloadSchema = z
  .object({
    name: singleLine(150),
    email: singleLine(254).pipe(z.string().email()),
    organisation: z
      .string()
      .trim()
      .max(200)
      .refine((v) => !/[\r\n\x00-\x1f\x7f]/.test(v))
      .default(""),
    message: z
      .string()
      .trim()
      .max(3000)
      .refine((v) => !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(v))
      .default(""),
    kind: z.enum(kinds),
    consent: z.literal(true),
    website: z.string().max(200).default(""),
    requestId: z.string().uuid(),
  })
  .strict();

type Options = {
  apiKey?: string;
  from?: string;
  fetchImpl?: typeof fetch;
  now?: () => number;
};

/** Public marketing email only. No operational DB, AI or customer-system authority. */
export function createInterestHandler(options: Options) {
  const send = options.fetchImpl ?? fetch;
  const now = options.now ?? Date.now;
  // Per-instance backstop, not distributed protection. A Vercel Firewall rule is
  // also required at release; provider quota and idempotency remain in force.
  const buckets = new Map<string, { count: number; until: number }>();
  let total = { count: 0, until: 0 };
  const reply = (status: number, body: object, extra: Record<string, string> = {}) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });

  return async function handle(request: Request): Promise<Response> {
    const errorId = randomUUID();
    const unavailable = () =>
      reply(503, {
        error: "We couldn’t send your enquiry. Please email vivian@moedim.ai or try again later.",
        errorId,
      });
    if (request.method !== "POST")
      return reply(405, { error: "Use the enquiry form to send a message." }, { Allow: "POST" });
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin)
      return reply(403, { error: "Please submit the form from this website." });
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
      return reply(415, { error: "Please use the website enquiry form." });
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { error: "Please complete the enquiry form." });
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.length;
        if (size > 16000) {
          await reader.cancel();
          return reply(413, { error: "Please shorten your message and try again." });
        }
        chunks.push(part.value);
      }
    } catch {
      return reply(400, { error: "Please try submitting the form again." });
    }
    let data;
    try {
      data = payloadSchema.safeParse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    } catch {
      return reply(400, { error: "Please complete the enquiry form and try again." });
    }
    if (!data.success)
      return reply(400, {
        error:
          "Check your name, email and message, and agree to the contact notice before sending.",
      });
    if (data.data.website)
      return reply(400, {
        error: "Your enquiry could not be sent. Please email vivian@moedim.ai.",
      });
    if (
      !options.apiKey ||
      !options.from ||
      !/^[^\r\n]+<[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+>$/.test(options.from)
    )
      return unavailable();
    const time = now();
    for (const [key, value] of buckets) if (value.until <= time) buckets.delete(key);
    // Vercel supplies this header; no raw IP or submitted PII is logged/stored.
    const ip = request.headers.get("x-vercel-forwarded-for") ?? "unidentified";
    const key = createHash("sha256").update(ip).digest("hex");
    const bucket = buckets.get(key) ?? { count: 0, until: time + 900000 };
    if (total.until <= time) total = { count: 0, until: time + 3600000 };
    if (bucket.count >= 5 || total.count >= 40 || buckets.size >= 1000)
      return reply(
        429,
        { error: "Please wait before trying again, or email vivian@moedim.ai." },
        { "Retry-After": "900" },
      );
    bucket.count++;
    total.count++;
    buckets.set(key, bucket);
    const p = data.data;
    const text = `${titles[p.kind]}\n\nName: ${p.name}\nEmail: ${p.email}\nOrganisation: ${p.organisation || "Not provided"}\n\nMessage:\n${p.message || (p.kind === "waitlist" ? "Please keep me informed about MoedimAI products and early access." : "Please contact me about this enquiry.")}\n\nSubmitted through the MoedimAI website. Contact permission confirmed.\nReference: ${p.requestId}`;
    try {
      const response = await send("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${options.apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `website-interest/${p.requestId}`,
        },
        body: JSON.stringify({
          from: options.from,
          to: [recipient],
          reply_to: p.email,
          subject: `MoedimAI: ${titles[p.kind]}`,
          text,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) return unavailable();
      const result: unknown = await response.json();
      if (
        !result ||
        typeof result !== "object" ||
        !("id" in result) ||
        typeof result.id !== "string" ||
        !result.id
      )
        return unavailable();
      return reply(200, { sent: true, reference: p.requestId });
    } catch {
      return unavailable();
    }
  };
}
