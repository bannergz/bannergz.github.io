import { render } from "@testing-library/react";
import ArchitecturePage from "@/app/architecture/page";
import { metadata } from "@/app/architecture/layout";
import {
  familias,
  preguntas,
  principios,
  totalPatrones,
  trampas,
} from "@/data/atlas-arquitectura";
import { SITE_URL } from "@/lib/site";

const RUTA = "/architecture";

/**
 * El atlas nació de un análisis interno de una flota concreta. La versión
 * pública es material de referencia general: si un nombre de servicio, un
 * ticket o un proveedor se cuela de vuelta en el contenido, este test lo
 * frena antes del deploy.
 */
const TERMINOS_PRIVADOS = [
  "yavendio",
  "eng-3",
  "conversations-rs",
  "message-gateway",
  "ya-feature-flags",
  "signoz",
  "sentry",
  "shopify",
  "kong",
];

describe("página /architecture", () => {
  it("lleva el H1 del atlas", () => {
    render(<ArchitecturePage />);
    expect(document.querySelector("h1")?.textContent).toContain(
      "Atlas de arquitectura",
    );
  });

  it("declara el contenido en español aunque el sitio esté en inglés", () => {
    const { container } = render(<ArchitecturePage />);
    expect(container.querySelector('[lang="es"]')).not.toBeNull();
  });

  it("renderiza las seis familias de patrones y los principios", () => {
    const { container } = render(<ArchitecturePage />);
    const text = container.textContent ?? "";
    expect(familias).toHaveLength(6);
    for (const familia of familias) {
      expect(text).toContain(familia.titulo);
      for (const patron of familia.patrones) {
        expect(text).toContain(patron.nombre);
      }
    }
    for (const principio of principios) {
      expect(text).toContain(principio.nombre);
    }
  });

  it("renderiza las trampas y las diez preguntas como texto indexable", () => {
    const { container } = render(<ArchitecturePage />);
    const text = container.textContent ?? "";
    expect(preguntas).toHaveLength(10);
    for (const trampa of trampas) {
      expect(text).toContain(trampa.nombre);
    }
    for (const pregunta of preguntas) {
      expect(text).toContain(pregunta.pregunta);
    }
  });

  it("no menciona ningún servicio, ticket ni proveedor privado", () => {
    const { container } = render(<ArchitecturePage />);
    const text = (container.textContent ?? "").toLowerCase();
    for (const termino of TERMINOS_PRIVADOS) {
      expect(text).not.toContain(termino);
    }
  });

  it("cuenta los patrones en vez de escribir la cifra a mano", () => {
    const { container } = render(<ArchitecturePage />);
    expect(container.textContent).toContain(String(totalPatrones));
  });

  it("da a cada sección un ancla estable para volver a ella", () => {
    const { container } = render(<ArchitecturePage />);
    for (const familia of familias) {
      expect(container.querySelector(`#${familia.id}`)).not.toBeNull();
    }
    for (const id of ["mapa", "escalera", "principios", "trampas", "preguntas"]) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
  });
});

describe("metadata de /architecture", () => {
  it("es indexable y canónica en la ruta pedida", () => {
    expect(metadata.robots).toBeUndefined();
    expect(metadata.alternates?.canonical).toBe(RUTA);
  });

  it("tiene título y descripción de largo razonable para buscadores", () => {
    expect(String(metadata.title)).toContain("Atlas de arquitectura");
    const description = String(metadata.description);
    expect(description.length).toBeGreaterThanOrEqual(80);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("describe la página en español para las redes", () => {
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og.locale).toBe("es_PE");
    expect(og.url).toBe(`${SITE_URL}${RUTA}`);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });
});
