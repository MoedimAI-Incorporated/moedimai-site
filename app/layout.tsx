import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { AnalyticsProviders } from "@/components/analytics/providers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Schema, organizationSchema, websiteSchema } from "@/lib/schema";
import { PUBLIC_SITE_URL } from "@/lib/site-url";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(PUBLIC_SITE_URL),
  applicationName: "MoedimAI",
  title: {
    default: "MoedimAI | Intelligence and coordination for global trade",
    template: "%s · MoedimAI",
  },
  description:
    "MoedimAI is building intelligence and coordination technology for global trade, through enterprise deployments, subscription products and embedded services.",
  keywords: [
    "trade intelligence",
    "AI for global trade",
    "supply-chain decisions",
    "enterprise trade software",
    "MoedimAI",
  ],
  creator: "MoedimAI",
  publisher: "MoedimAI",
  category: "Trade intelligence software",
  verification: {
    other: {
      "facebook-domain-verification": "o67ward8eo3mj6v9dr1fpytr7p2czj",
      "msvalidate.01": "F590464E50673F8106374C2FC6DAB795",
    },
  },
  manifest: "/site.webmanifest?v=20260609",
  icons: {
    icon: [
      { url: "/favicon.ico?v=20260609", sizes: "any" },
      { url: "/favicon-16x16.png?v=20260609", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=20260609", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png?v=20260609", sizes: "48x48", type: "image/png" },
      { url: "/icon-48.png?v=20260609", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png?v=20260609", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png?v=20260609", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=20260609", sizes: "512x512", type: "image/png" },
      { url: "/icon.png?v=20260609", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=20260609", sizes: "180x180", type: "image/png" }],
  },
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": [
        { url: "/llms.txt", title: "AI agent index" },
        { url: "/llms-full.txt", title: "AI agent full context" },
      ],
    },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "MoedimAI",
    title: "MoedimAI",
    description:
      "Intelligence and coordination for global trade. Enterprise deployments, off-the-shelf products and embedded services.",
    images: [
      {
        url: "/site/investor-trade.webp",
        width: 1200,
        height: 630,
        alt: "MoedimAI intelligence and coordination for global trade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoedimAI",
    description:
      "Intelligence and coordination for global trade. Enterprise deployments, off-the-shelf products and embedded services.",
    images: ["/site/investor-trade.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0D13",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-navy-900 text-cream-50 antialiased">
        <Schema data={[organizationSchema, websiteSchema]} />
        <AnalyticsProviders>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </AnalyticsProviders>
      </body>
    </html>
  );
}
