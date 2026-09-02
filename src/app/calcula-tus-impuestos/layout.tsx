import type { Metadata } from "next";
import type { ReactNode } from "react";
import { portfolioData } from "@/data/portfolio-data";
import { preguntasFrecuentes } from "@/data/calculadora-faq";
import { SITE_URL } from "@/lib/site";

const RUTA = "/calcula-tus-impuestos";
const PAGE_URL = `${SITE_URL}${RUTA}`;
const OG_IMAGE = "/og/calcula-tus-impuestos.jpg";
const TITLE = "Calculadora de Impuesto a la Renta 2026 Perú: ¿cuánto me descuenta SUNAT?";
const DESCRIPTION =
  "Calcula cuánto te descuenta SUNAT en 2026 con tu sueldo en planilla o por recibo por honorarios: UIT S/ 5,500, 7 UIT, gastos de 3 UIT y escala progresiva.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "calculadora impuesto a la renta 2026",
    "cuánto me descuenta SUNAT",
    "renta de quinta categoría",
    "renta de cuarta categoría",
    "recibo por honorarios",
    "UIT 2026",
    "impuestos Perú",
  ],
  alternates: { canonical: RUTA },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: PAGE_URL,
    siteName: portfolioData.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "¿Cuánto me descuenta SUNAT? Calculadora de Impuesto a la Renta 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de Impuesto a la Renta 2026 – Perú",
  alternateName: "¿Cuánto me descuenta SUNAT?",
  url: PAGE_URL,
  description: DESCRIPTION,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  inLanguage: "es-PE",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "PEN" },
  image: `${SITE_URL}${OG_IMAGE}`,
  datePublished: "2026-09-02",
  author: { "@type": "Person", name: portfolioData.name, url: SITE_URL },
  about: [
    { "@type": "Thing", name: "Impuesto a la Renta de cuarta categoría" },
    { "@type": "Thing", name: "Impuesto a la Renta de quinta categoría" },
    { "@type": "Thing", name: "UIT 2026" },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: preguntasFrecuentes.map((f) => ({
    "@type": "Question",
    name: f.pregunta,
    acceptedAnswer: { "@type": "Answer", text: f.respuesta },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Calcula tus impuestos", item: PAGE_URL },
  ],
};

export default function CalculadoraLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {[webAppJsonLd, faqJsonLd, breadcrumbJsonLd].map((ld) => (
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
