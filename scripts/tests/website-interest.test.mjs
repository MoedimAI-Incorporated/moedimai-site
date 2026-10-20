import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createInterestHandler } from "../../lib/website-interest.ts";
const payload = (extra = {}) => ({
  name: "Website Test",
  email: "visitor@example.com",
  kind: "waitlist",
  consent: true,
  requestId: randomUUID(),
  ...extra,
});
const req = (body, headers = {}) =>
  new Request("https://www.moedim.ai/api/interest", {
    method: "POST",
    headers: {
      origin: "https://www.moedim.ai",
      "content-type": "application/json",
      "x-vercel-forwarded-for": "192.0.2.1",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const configured = (extra) =>
  createInterestHandler({
    apiKey: "test-only-not-a-credential",
    from: "MoedimAI Website <website@moedimai.com>",
    fetchImpl: async () => Response.json({ id: "email-fixture" }),
    ...extra,
  });
test("minimal valid enquiry fixes recipient and sets visitor as reply-to", async () => {
  let captured;
  const handle = configured({
    fetchImpl: async (url, options) => {
      captured = { url, options };
      return Response.json({ id: "fixture" });
    },
  });
  const p = payload();
  const response = await handle(req(p));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).sent, true);
  const out = JSON.parse(captured.options.body);
  assert.deepEqual(out.to, ["vivian@moedim.ai"]);
  assert.equal(out.reply_to, p.email);
  assert.equal(out.from, "MoedimAI Website <website@moedimai.com>");
  assert.equal(captured.options.headers["Idempotency-Key"], `website-interest/${p.requestId}`);
  assert.equal(out.html, undefined);
});
test("all enquiry types accept full valid data and preserve plain text", async () => {
  for (const kind of [
    "enterprise",
    "government",
    "development",
    "investor",
    "general",
    "waitlist",
  ]) {
    const h = configured({
      fetchImpl: async (_url, o) => {
        const out = JSON.parse(o.body);
        assert.ok(out.text.includes("<sample>"));
        assert.ok(out.text.includes("Example Organisation"));
        return Response.json({ id: "fixture" });
      },
    });
    assert.equal(
      (
        await h(
          req(
            payload({
              kind,
              organisation: "Example Organisation",
              message: "A complete enquiry\n<sample>",
            }),
          ),
        )
      ).status,
      200,
    );
  }
});
test("malformed, invalid, oversized, injected and unconsented input never sends", async () => {
  let calls = 0;
  const h = configured({
    fetchImpl: async () => {
      calls++;
      return Response.json({ id: "fixture" });
    },
  });
  for (const p of [
    "{broken",
    payload({ email: "bad" }),
    payload({ name: "\r\nInjected" }),
    payload({ name: "" }),
    payload({ consent: false }),
    payload({ to: "attacker@example.com" }),
    payload({ kind: "unknown" }),
    payload({ message: "x".repeat(3001) }),
    payload({ message: "\u0000" }),
  ])
    assert.equal((await h(req(p))).status, 400);
  assert.equal((await h(req("x".repeat(16001)))).status, 413);
  assert.equal(calls, 0);
});
test("origin, content type and honeypot reject without email", async () => {
  let calls = 0;
  const h = configured({
    fetchImpl: async () => {
      calls++;
      return Response.json({ id: "fixture" });
    },
  });
  assert.equal((await h(req(payload(), { origin: "https://other.example" }))).status, 403);
  assert.equal((await h(req(payload(), { "content-type": "text/plain" }))).status, 415);
  assert.equal((await h(req(payload({ website: "spam.example" })))).status, 400);
  assert.equal(calls, 0);
});
test("missing configuration and provider failure never claim success or expose details", async () => {
  const handlers = [
    createInterestHandler({}),
    configured({
      fetchImpl: async () => Response.json({ message: "private provider detail" }, { status: 401 }),
    }),
    configured({
      fetchImpl: async () => {
        throw Error("timeout private detail");
      },
    }),
    configured({ fetchImpl: async () => Response.json({}) }),
  ];
  for (const h of handlers) {
    const r = await h(req(payload()));
    assert.equal(r.status, 503);
    const out = await r.json();
    assert.equal(out.sent, undefined);
    assert.match(out.error, /vivian@moedim.ai/);
    assert.ok(out.errorId);
    assert.ok(!JSON.stringify(out).includes("private"));
  }
});
test("same request ID is forwarded unchanged for provider idempotency", async () => {
  const keys = [];
  const h = configured({
    fetchImpl: async (_url, o) => {
      keys.push(o.headers["Idempotency-Key"]);
      return Response.json({ id: "same-fixture" });
    },
  });
  const p = payload();
  await Promise.all([h(req(p)), h(req(p))]);
  assert.equal(keys[0], keys[1]);
});
test("near-concurrent traffic hits local limit without exceeding five provider calls", async () => {
  let count = 0;
  const h = configured({
    fetchImpl: async () => {
      count++;
      return Response.json({ id: "fixture" });
    },
  });
  const responses = await Promise.all(Array.from({ length: 12 }, () => h(req(payload()))));
  assert.equal(count, 5);
  assert.equal(responses.filter((r) => r.status === 429).length, 7);
});
test("expired local limit resets", async () => {
  let time = 100;
  const h = configured({ now: () => time });
  for (let i = 0; i < 5; i++) assert.equal((await h(req(payload()))).status, 200);
  assert.equal((await h(req(payload()))).status, 429);
  time += 900001;
  assert.equal((await h(req(payload()))).status, 200);
});
