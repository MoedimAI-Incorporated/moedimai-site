import { PUBLIC_SITE_URL } from "@/lib/site-url";

const baseUrl = PUBLIC_SITE_URL;

/**
 * Organization JSON-LD. Emitted on every page via the root layout.
 * Canonical identity record for MoedimAI.
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${baseUrl}/#organization`,
  name: "MoedimAI",
  alternateName: ["MoedimAI Verified", "Jaribu by MoedimAI"],
  url: baseUrl,
  logo: {
    "@type": "ImageObject",
    url: `${baseUrl}/images/moedimai-logo-light.png`,
  },
  description:
    "MoedimAI is building intelligence and coordination technology for global trade, delivered through enterprise deployments, subscription products and embedded services.",
  slogan: "Intelligence and coordination for global trade",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    "@id": `${baseUrl}/about#founder`,
    name: "Vivian Nwakah",
    jobTitle: "Founder and Chief Executive Officer",
    image: `${baseUrl}/images/vivian-nwakah-headshot.jpg`,
    sameAs: ["https://www.linkedin.com/in/viviannwakah/"],
  },
  address: [
    { "@type": "PostalAddress", addressCountry: "KE", addressLocality: "Nairobi" },
    { "@type": "PostalAddress", addressCountry: "NL", addressLocality: "Rotterdam" },
    {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressLocality: "Dover",
      addressRegion: "DE",
    },
  ],
  knowsAbout: [
    "Trade intelligence",
    "Supply qualification",
    "Requirements assessment",
    "Evidence review",
    "Trade coordination",
  ],
  areaServed: [
    { "@type": "Country", name: "Kenya" },
    { "@type": "Place", name: "European Union" },
    { "@type": "Country", name: "United States" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "vivian@moedim.ai",
    contactType: "sales",
    areaServed: ["EU", "US", "KE"],
    availableLanguage: ["English", "Swahili"],
  },
  makesOffer: ["Enterprise trade intelligence solutions", "Government and development solutions"],
  subjectOf: [
    {
      "@type": "CreativeWork",
      name: "The State of Verified Bioeconomy Infrastructure in Africa",
      url: `${baseUrl}/state-of-verified-bioeconomy-infrastructure-africa`,
    },
  ],
} as const;

/**
 * WebSite JSON-LD. Emitted alongside Organization.
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${baseUrl}/#website`,
  url: baseUrl,
  name: "MoedimAI",
  description:
    "Technology layer, AI supply-chain benchmarking platform, and verification engine for Africa's bioeconomy, including buyer specifications, source records, value addition, verification, MRV, logistics routing, distribution, export, and buyer-ready supply.",
  publisher: { "@id": `${baseUrl}/#organization` },
  inLanguage: "en",
  hasPart: [
    `${baseUrl}/state-of-verified-bioeconomy-infrastructure-africa`,
    `${baseUrl}/africa-bioeconomy-infrastructure`,
    `${baseUrl}/bioeconomy-operating-system`,
    `${baseUrl}/ai-for-bioeconomy-value-chains`,
    `${baseUrl}/answers.md`,
    `${baseUrl}/llms.txt`,
  ],
} as const;
