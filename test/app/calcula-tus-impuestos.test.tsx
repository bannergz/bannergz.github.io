import { render } from "@testing-library/react";
import CalculadoraPage from "@/app/calcula-tus-impuestos/page";
import CalculadoraLayout, { metadata } from "@/app/calcula-tus-impuestos/layout";
import { preguntasFrecuentes } from "@/data/calculadora-faq";
import { SITE_URL } from "@/lib/site";

const RUTA = "/calcula-tus-impuestos";

describe("página /calcula-tus-impuestos", () => {
  it("lleva el H1 de la pregunta que la gente busca", () => {
    render(<CalculadoraPage />);
    const h1 = document.querySelector("h1");
    expect(h1?.textContent).toContain("¿Cuánto me descuenta SUNAT?");
  });

  it("declara el contenido en español aunque el sitio esté en inglés", () => {
    const { container } = render(<CalculadoraPage />);
    expect(container.querySelector('[lang="es"]')).not.toBeNull();
  });

  it("renderiza las preguntas frecuentes como texto indexable", () => {
    const { container } = render(<CalculadoraPage />);
    const text = container.textContent ?? "";
    expect(preguntasFrecuentes.length).toBeGreaterThanOrEqual(4);
    for (const faq of preguntasFrecuentes) {
      expect(text).toContain(faq.pregunta);
    }
  });

  it("enlaza a las fuentes oficiales de SUNAT y la SBS", () => {
    const { container } = render(<CalculadoraPage />);
    const hrefs = Array.from(container.querySelectorAll("a[href]")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs.some((h) => h?.includes("sunat.gob.pe"))).toBe(true);
    expect(hrefs.some((h) => h?.includes("sbs.gob.pe"))).toBe(true);
  });
});

describe("metadata de /calcula-tus-impuestos", () => {
  it("tiene título con el año y SUNAT, y descripción de largo razonable", () => {
    const title = String(metadata.title);
    expect(title).toContain("2026");
    expect(title).toContain("SUNAT");
    const description = String(metadata.description);
    expect(description.length).toBeGreaterThanOrEqual(80);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("es indexable y canónica en la ruta pedida", () => {
    expect(metadata.robots).toBeUndefined();
    expect(metadata.alternates?.canonical).toBe(RUTA);
  });

  it("describe la página en español para las redes con una imagen propia", () => {
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og.locale).toBe("es_PE");
    expect(og.url).toBe(`${SITE_URL}${RUTA}`);
    expect(Array.isArray(og.images) && og.images.length).toBeTruthy();
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });
});

describe("jerarquía de encabezados", () => {
  it("no salta niveles: el panel colgaba del h1 con un h3", () => {
    const { container } = render(<CalculadoraPage />);
    const niveles = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((h) =>
      Number(h.tagName[1]),
    );
    expect(niveles[0]).toBe(1);
    for (let i = 1; i < niveles.length; i++) {
      expect(niveles[i]).toBeLessThanOrEqual(niveles[i - 1] + 1);
    }
  });
});

describe("datos estructurados de /calcula-tus-impuestos", () => {
  it("emite WebApplication, FAQPage y BreadcrumbList en JSON-LD", () => {
    const { container } = render(
      <CalculadoraLayout>
        <div />
      </CalculadoraLayout>,
    );
    const scripts = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]'),
    ).map((s) => s.textContent ?? "");
    const all = scripts.join("\n");
    expect(all).toContain('"WebApplication"');
    expect(all).toContain('"FAQPage"');
    expect(all).toContain('"BreadcrumbList"');
    expect(all).toContain(`${SITE_URL}${RUTA}`);
    for (const s of scripts) expect(() => JSON.parse(s)).not.toThrow();
  });
});
