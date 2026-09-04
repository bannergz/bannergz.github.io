import type { Metadata } from "next";
import type { ReactNode } from "react";
import { portfolioData } from "@/data/portfolio-data";
import {
  estaciones,
  familias,
  preguntas,
  totalPatrones,
} from "@/data/atlas-arquitectura";
import { SITE_URL } from "@/lib/site";

const RUTA = "/architecture";
const PAGE_URL = `${SITE_URL}${RUTA}`;
const OG_IMAGE = "/BannerGonzalesWhite.png";
const TITLE = "Atlas de arquitectura: patrones, trampas y las 10 preguntas";
const DESCRIPTION = `Catálogo de ${totalPatrones} patrones de arquitectura de software en siete familias: qué hace cada uno, qué cuesta y cuándo no usarlo.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "patrones de arquitectura de software",
    "arquitectura de software en español",
    "sistemas distribuidos",
    "resiliencia",
    "idempotencia",
    "circuit breaker",
    "cola durable",
    "antipatrones",
  ],
  alternates: { canonical: RUTA },
  openGraph: {
    type: "article",
    locale: "es_PE",
    url: PAGE_URL,
    siteName: portfolioData.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: "Atlas de arquitectura" }],
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
  headline: "Atlas de arquitectura",
  description: DESCRIPTION,
  url: PAGE_URL,
  inLanguage: "es",
  isAccessibleForFree: true,
  author: { "@type": "Person", name: portfolioData.name, url: SITE_URL },
  publisher: { "@type": "Person", name: portfolioData.name, url: SITE_URL },
  image: `${SITE_URL}${OG_IMAGE}`,
  datePublished: "2026-09-04",
  // Las secciones salen del mismo dato que la página: si mañana entra una
  // familia nueva, el marcado estructurado no se queda viejo.
  articleSection: [
    "Las seis estaciones",
    "La escalera de acoplamiento",
    ...familias.map((f) => f.titulo),
    "Principios",
    "Trampas",
    "Las diez preguntas",
  ],
  about: [
    ...estaciones.map((e) => ({ "@type": "Thing", name: e.nombre })),
    { "@type": "Thing", name: "Patrones de arquitectura de software" },
  ],
  mentions: preguntas.map((p) => ({ "@type": "Question", name: p.pregunta })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Atlas de arquitectura", item: PAGE_URL },
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
