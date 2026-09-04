import type { Metadata } from "next";
import type { ReactNode } from "react";
import { portfolioData } from "@/data/portfolio-data";
import { atlasEn } from "@/data/atlas/en";
import { contarPatrones } from "@/data/atlas/tipos";
import { SITE_URL } from "@/lib/site";

const RUTA = "/architecture";
const PAGE_URL = `${SITE_URL}${RUTA}`;
const OG_IMAGE = "/BannerGonzalesWhite.png";

/**
 * La metadata describe la versión INGLESA, que es la que se construye y la
 * única que un buscador ve: el español llega por JavaScript recién cuando
 * alguien encuentra el easter egg, así que anunciarlo acá sería prometer un
 * contenido que el crawler no va a encontrar.
 */
const { ui, familias } = atlasEn;
const TITLE = "Software architecture atlas: patterns, traps and the 10 questions";
const DESCRIPTION = `A catalogue of ${contarPatrones(atlasEn)} software architecture patterns in seven families: what each one does, what it costs and when not to use it.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "software architecture patterns",
    "distributed systems",
    "resilience patterns",
    "idempotency",
    "circuit breaker",
    "durable queue",
    "antipatterns",
    "architecture decision checklist",
  ],
  alternates: { canonical: RUTA },
  openGraph: {
    type: "article",
    locale: "en_US",
    url: PAGE_URL,
    siteName: portfolioData.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: "Software architecture atlas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Software architecture atlas",
  description: DESCRIPTION,
  url: PAGE_URL,
  inLanguage: "en",
  isAccessibleForFree: true,
  author: { "@type": "Person", name: portfolioData.name, url: SITE_URL },
  publisher: { "@type": "Person", name: portfolioData.name, url: SITE_URL },
  image: `${SITE_URL}${OG_IMAGE}`,
  datePublished: "2026-09-04",
  // Las secciones salen del mismo dato que la página: si mañana entra una
  // familia nueva, el marcado estructurado no se queda viejo.
  articleSection: [
    ui.mapa.titulo,
    ui.escalera.titulo,
    ...familias.map((f) => f.titulo),
    ui.principios.titulo,
    ui.trampas.titulo,
    ui.preguntas.titulo,
  ],
  about: [
    ...atlasEn.estaciones.map((e) => ({ "@type": "Thing", name: e.nombre })),
    { "@type": "Thing", name: "Software architecture patterns" },
  ],
  mentions: atlasEn.preguntas.map((p) => ({
    "@type": "Question",
    name: p.pregunta,
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Software architecture atlas",
      item: PAGE_URL,
    },
  ],
};

export default function ArchitectureLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {[articleJsonLd, breadcrumbJsonLd].map((ld) => (
        <script
          key={ld["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      {children}
    </>
  );
}
