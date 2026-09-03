import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { LayoutContent } from "./layout-content";
import { portfolioData } from "@/data/portfolio-data";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

/** Ledger pone toda cifra en mono tabular: métricas, montos y periodos. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const OG_IMAGE = "/BannerGonzalesWhite.png";
const PAGE_TITLE = `${portfolioData.name} — ${portfolioData.title}`;

export const viewport: Viewport = {
  themeColor: "#0d0c0b",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: PAGE_TITLE,
  description: portfolioData.tagline,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: PAGE_TITLE,
    description: portfolioData.tagline,
    url: SITE_URL,
    siteName: portfolioData.name,
    images: [{ url: OG_IMAGE, alt: portfolioData.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: portfolioData.tagline,
    images: [OG_IMAGE],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: portfolioData.name,
  jobTitle: portfolioData.experience[0].role,
  worksFor: {
    "@type": "Organization",
    name: portfolioData.experience[0].company,
  },
  url: SITE_URL,
  email: `mailto:${portfolioData.contact.email}`,
  description: portfolioData.tagline,
  sameAs: [
    `https://${portfolioData.contact.linkedin}`,
    "https://github.com/bannergz",
  ],
  knowsLanguage: portfolioData.languages.map((lang) => lang.language),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
