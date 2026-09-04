import { atlasEn } from "@/data/atlas/en";
import { atlasEs } from "@/data/atlas/es";
import { contarPatrones } from "@/data/atlas/tipos";
import type { Atlas } from "@/data/atlas/tipos";

/**
 * El atlas nació de un análisis interno de una flota concreta. La versión
 * pública es material de referencia general: si un nombre de servicio, un
 * ticket o un proveedor se cuela de vuelta en el contenido, este test lo
 * frena antes del deploy. Se revisan los DOS idiomas, porque una traducción
 * nueva es exactamente donde se volvería a colar.
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

/** Recorre el objeto entero y devuelve cada string con su ruta. */
function textos(valor: unknown, ruta = ""): Array<[string, string]> {
  if (typeof valor === "string") return [[ruta, valor]];
  if (Array.isArray(valor)) {
    return valor.flatMap((v, i) => textos(v, `${ruta}[${i}]`));
  }
  if (valor && typeof valor === "object") {
    return Object.entries(valor).flatMap(([k, v]) =>
      textos(v, ruta ? `${ruta}.${k}` : k),
    );
  }
  return [];
}

const idiomas: ReadonlyArray<[string, Atlas]> = [
  ["en", atlasEn],
  ["es", atlasEs],
];

describe.each(idiomas)("atlas %s", (_nombre, atlas) => {
  it("no menciona ningún servicio, ticket ni proveedor privado", () => {
    const contenido = JSON.stringify(atlas).toLowerCase();
    for (const termino of TERMINOS_PRIVADOS) {
      expect(contenido).not.toContain(termino);
    }
  });

  it("no deja ningún texto vacío", () => {
    const vacios = textos(atlas)
      .filter(([, texto]) => texto.trim() === "")
      .map(([ruta]) => ruta);
    expect(vacios).toEqual([]);
  });
});

describe("paridad entre los dos idiomas", () => {
  it("cuenta los mismos patrones: el hero dice la misma cifra en los dos", () => {
    expect(contarPatrones(atlasEs)).toBe(contarPatrones(atlasEn));
  });

  it("tiene las mismas familias, con el mismo id y el mismo número", () => {
    expect(atlasEs.familias.map((f) => f.id)).toEqual(
      atlasEn.familias.map((f) => f.id),
    );
    expect(atlasEs.familias.map((f) => f.numero)).toEqual(
      atlasEn.familias.map((f) => f.numero),
    );
  });

  it("traduce cada familia entera, sin dejar patrones afuera", () => {
    expect(atlasEs.familias.map((f) => f.patrones.length)).toEqual(
      atlasEn.familias.map((f) => f.patrones.length),
    );
  });

  it("mantiene el largo de las listas sueltas", () => {
    expect(atlasEs.principios).toHaveLength(atlasEn.principios.length);
    expect(atlasEs.trampas).toHaveLength(atlasEn.trampas.length);
    expect(atlasEs.preguntas).toHaveLength(atlasEn.preguntas.length);
    expect(atlasEs.escalones).toHaveLength(atlasEn.escalones.length);
    expect(atlasEs.estaciones).toHaveLength(atlasEn.estaciones.length);
    expect(atlasEs.estaciones.map((e) => e.patrones.length)).toEqual(
      atlasEn.estaciones.map((e) => e.patrones.length),
    );
  });

  it("conserva los anclas sin traducir: un enlace profundo cae igual en los dos", () => {
    // Los ids son navegación, no contenido. Traducirlos rompería cualquier
    // enlace a `#datos` y el propio índice al cambiar de idioma en caliente.
    for (const familia of atlasEn.familias) {
      expect(familia.id).toMatch(/^[a-z]+$/);
    }
    expect(atlasEs.escalones.map((e) => e.nivel)).toEqual(
      atlasEn.escalones.map((e) => e.nivel),
    );
    expect(atlasEs.estaciones.map((e) => e.numero)).toEqual(
      atlasEn.estaciones.map((e) => e.numero),
    );
  });

  it("está traducido de verdad, no copiado", () => {
    // Un archivo duplicado y a medio traducir pasaría todos los tests de
    // arriba: lo único que lo delata es que el texto sea el mismo.
    atlasEn.familias.forEach((familia, i) => {
      expect(atlasEs.familias[i].intro).not.toBe(familia.intro);
      familia.patrones.forEach((patron, j) => {
        expect(atlasEs.familias[i].patrones[j].que).not.toBe(patron.que);
      });
    });
    atlasEn.preguntas.forEach((pregunta, i) => {
      expect(atlasEs.preguntas[i].porQue).not.toBe(pregunta.porQue);
    });
  });

  it("declara idiomas distintos y una tecla distinta para salir de cada uno", () => {
    expect(atlasEn.ui.idioma).toBe("en");
    expect(atlasEs.ui.idioma).toBe("es");
    expect(atlasEn.ui.egg.tecla).toBe("s");
    expect(atlasEs.ui.egg.tecla).not.toBe(atlasEn.ui.egg.tecla);
  });

  it("usa teclas de una sola letra minúscula: la comparación del teclado es exacta", () => {
    for (const atlas of [atlasEn, atlasEs]) {
      expect(atlas.ui.egg.tecla).toMatch(/^[a-z]$/);
    }
  });
});
