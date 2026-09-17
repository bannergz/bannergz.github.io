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
  "claude.ai",
];

/**
 * La sección `ui.practica` cuenta dónde se usa el atlas, así que es la única
 * que puede nombrar a la empresa. Todo lo demás sigue sin poder hacerlo, y
 * ella tampoco puede nombrar servicios, tickets ni proveedores.
 */
const EMPRESA = "yavendio";

/** El atlas sin la sección de práctica: lo que es referencia general. */
const referencia = (atlas: Atlas) =>
  JSON.stringify(atlas, (clave, valor) =>
    clave === "practica" ? undefined : valor,
  ).toLowerCase();

/**
 * El harness lo escribió otra persona; el skill es lo único propio. Cada
 * mención del harness lo atribuye a la empresa, en el idioma de la mención.
 */
const DUENO_DEL_HARNESS: Record<string, string> = {
  en: "company’s",
  es: "de la empresa",
};

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

describe.each(idiomas)("atlas %s", (nombre, atlas) => {
  it("no menciona ningún servicio, ticket ni proveedor privado", () => {
    const contenido = referencia(atlas);
    for (const termino of TERMINOS_PRIVADOS) {
      expect(contenido).not.toContain(termino);
    }
  });

  it("nombra a la empresa sólo en la práctica, y nada más de adentro", () => {
    const practica = JSON.stringify(atlas.ui.practica).toLowerCase();
    expect(practica).toContain(EMPRESA);
    for (const termino of TERMINOS_PRIVADOS.filter((t) => t !== EMPRESA)) {
      expect(practica).not.toContain(termino);
    }
  });

  it("atribuye el harness a la empresa cada vez que lo nombra", () => {
    const menciones = textos(atlas.ui.practica).filter(([, texto]) =>
      /harness/i.test(texto),
    );
    expect(menciones.length).toBeGreaterThan(0);
    for (const [, texto] of menciones) {
      expect(texto).toContain(DUENO_DEL_HARNESS[nombre]);
    }
  });

  it("sólo enlaza a secciones que existen en la página", () => {
    const secciones = [
      "mapa",
      "escalera",
      ...atlas.familias.map((f) => f.id),
      "principios",
      "trampas",
      "preguntas",
    ];
    for (const parte of atlas.ui.practica.usa) {
      expect(secciones).toContain(parte.ancla);
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
    expect(atlasEs.ui.practica.intro.despues).not.toBe(
      atlasEn.ui.practica.intro.despues,
    );
    atlasEn.ui.practica.niveles.forEach((nivel, i) => {
      expect(atlasEs.ui.practica.niveles[i].corre).not.toBe(nivel.corre);
    });
  });

  it("describe el mismo skill con los mismos niveles y los mismos enlaces", () => {
    // El nombre del skill y los códigos de nivel son identificadores: son los
    // que quedan escritos en un ticket, así que no se traducen.
    expect(atlasEn.ui.practica.skill).toBe("ya-architecture-design");
    expect(atlasEs.ui.practica.skill).toBe(atlasEn.ui.practica.skill);
    expect(atlasEn.ui.practica.niveles.map((n) => n.nivel)).toEqual([
      "N0",
      "N1",
      "N2",
      "N?",
    ]);
    expect(atlasEs.ui.practica.niveles.map((n) => n.nivel)).toEqual(
      atlasEn.ui.practica.niveles.map((n) => n.nivel),
    );
    expect(atlasEs.ui.practica.usa.map((u) => u.ancla)).toEqual(
      atlasEn.ui.practica.usa.map((u) => u.ancla),
    );
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
