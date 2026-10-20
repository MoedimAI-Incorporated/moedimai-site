import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Moedim handles personal information across its public and operating services.",
};

const SECTIONS = [
  [
    "Website enquiries and product waitlist",
    "When you contact us through the website, we collect your name, email address, optional organisation, message and the type of enquiry. Resend processes this information to deliver the message to MoedimAI. We use it to respond to your request. If you join the product waitlist, you agree to receive product and early-access updates and can unsubscribe by replying to an email or contacting vivian@moedim.ai. The website does not add general enquiries to a marketing list.",
  ],
  [
    "What we collect",
    "Account and contact details; farmer and program registration facts; farm, plot, location, field-visit, photo and document evidence; approved communications; buyer, partner and staff records; and security, device and service logs.",
  ],
  [
    "Why we use it",
    "To operate approved agricultural programs, verify field and supply-chain evidence, communicate with participants, protect accounts, meet contractual and compliance duties, improve service reliability, and respond to support, privacy and security requests.",
  ],
  [
    "Who receives it",
    "Authorized Moedim staff and approved program participants receive only the access needed for their work. Infrastructure, authentication, communications, mapping and monitoring providers process limited information for Moedim under their applicable terms and reviewed controls. Buyer, certifier, auditor, partner or regulator disclosure is scoped to an approved purpose or legal requirement.",
  ],
  [
    "Moedim Field map services",
    "Google Maps may process map requests, device metadata, map interactions and SDK diagnostics to deliver and improve its maps. Mapbox processes the map and tile requests needed to render or download approved offline packs; optional Mapbox location telemetry is disabled in Moedim Field. Moedim does not use either mapping provider for advertising.",
  ],
  [
    "Moedim Field QR scanning",
    "Moedim Field uses Google ML Kit through the phone camera to scan approved QR codes. QR camera images and decoded values are processed on the device and are not sent to Google by ML Kit. The SDK may send limited app, device, installation, performance and usage information to Google for service diagnostics and analytics. Moedim does not use this information for advertising or tracking.",
  ],
  [
    "International processing",
    "Moedim uses service providers and teams in more than one country. Our internal privacy register records processing regions, transfer purposes, safeguard decisions, evidence and the next required review. Items that still need legal or provider confirmation remain visibly due rather than being presented as approved.",
  ],
  [
    "Retention",
    "We keep information only for the approved program, contractual, certification, safety, dispute, audit and legal periods that apply to it. Our internal register assigns a reviewable retention and deletion rule to each processing activity. Backups expire on their own controlled schedule.",
  ],
  [
    "Security",
    "We use role and tenant access controls, database row-level security, encrypted connections, private media storage, privileged-account MFA, audit trails, rate limits, monitoring and recurring control reviews. No system is risk-free, so we maintain an incident process and a public reporting route.",
  ],
] as const;

export default function PrivacyPage() {
  return (
    <section className="container py-16 md:py-20">
      <p className="font-sans text-xs uppercase tracking-[0.18em] text-gold-500">Privacy notice</p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
        Your information should support the work you agreed to—not become an open-ended asset.
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-cream-50/85">
        This notice explains the main ways MoedimAI Incorporated and the relevant Moedim operating
        organization handle personal information through moedim.ai, the Moedim operating platform,
        public intake, field tools and approved communications. Last updated 20 October 2026.
      </p>
      <div className="mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
        {SECTIONS.map(([title, body]) => (
          <article key={title} className="rounded-md border border-cream-50/10 bg-navy-900/40 p-5">
            <h2 className="font-display text-xl text-cream-50">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-cream-50/75">{body}</p>
          </article>
        ))}
      </div>
      <article className="mt-10 max-w-4xl rounded-md border border-gold-500/25 bg-navy-900 p-6">
        <h2 className="font-display text-2xl text-cream-50">Your choices and rights</h2>
        <p className="mt-3 text-sm leading-relaxed text-cream-50/80">
          Depending on the law and program that applies, you may ask to access, correct, delete,
          restrict or object to processing; withdraw consent where consent is used; or ask how a
          decision or transfer was handled. Some records must be retained for certification,
          contracts, safety, legal claims or other legal duties. We will explain any limit that
          applies.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-cream-50/80">
          Send a privacy request to{" "}
          <a
            href="mailto:vivian@moedim.ai?subject=Privacy%20request"
            className="text-gold-500 underline-offset-4 hover:underline"
          >
            vivian@moedim.ai
          </a>
          . Do not send passwords, authentication codes, national-ID images or detailed incident
          evidence by ordinary email. We may need to verify your identity before acting.
        </p>
      </article>
      <p className="mt-8 max-w-4xl text-xs leading-relaxed text-cream-50/55">
        This public notice is reviewed against the internal processing and provider registers.
        Program-specific notices or consent forms may add more detail and will control where they
        provide a more specific commitment.
      </p>
    </section>
  );
}
