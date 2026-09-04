/**
 * La forma del atlas de /architecture.
 *
 * El contenido vive en `en.ts` y `es.ts`, dos objetos con esta misma forma.
 * La página se construye en inglés y el español llega por `import()` sólo si
 * alguien encuentra el easter egg, así que este tipo es lo único que las dos
 * versiones comparten en el bundle inicial.
 */

export type Idioma = "en" | "es";

export interface Patron {
  /** Nombre canónico del patrón, tal como se lo busca en la literatura. */
  nombre: string;
  /** Qué hace, en una o dos frases. */
  que: string;
  /** Cómo se paga: el modo de fallo que aparece cuando se elige mal. */
  trampa?: string;
}

export interface Familia {
  /**
   * Ancla de la sección. Es la única parte del atlas que NO se traduce: un
   * enlace a `#datos` tiene que caer en el mismo lugar en los dos idiomas, y
   * el cambio de idioma ocurre sin recargar la página.
   */
  id: string;
  numero: string;
  titulo: string;
  /** Etiqueta corta, para el índice fijo: el título completo no entra. */
  abrev: string;
  /** La pregunta que la familia contesta. Es lo que la hace buscable. */
  pregunta: string;
  intro: string;
  patrones: ReadonlyArray<Patron>;
}

export interface Principio {
  nombre: string;
  que: string;
}

export interface Trampa {
  nombre: string;
  que: string;
}

export interface Pregunta {
  pregunta: string;
  porQue: string;
}

export interface Escalon {
  nivel: string;
  nombre: string;
  sobrevive: string;
  cuesta: string;
  cuando: string;
}

export interface Estacion {
  numero: string;
  nombre: string;
  patrones: ReadonlyArray<string>;
}

/**
 * Un párrafo con una parte resaltada. El énfasis es parte de la voz del
 * texto, así que viaja con él en vez de quedarse cableado en el JSX.
 */
export interface ParrafoEnfasis {
  antes: string;
  enfasis: string;
  despues: string;
}

/** Una sección con etiqueta, título y bajada: la cabecera se repite seis veces. */
export interface Cabecera {
  etiqueta: string;
  titulo: string;
  bajada: string;
}

/**
 * Todo el texto de la página que no es atlas: cabeceras, rótulos de tabla y
 * los textos que van dentro de los dos SVG. Vive acá y no en la página porque
 * si no, la mitad visible se quedaría en inglés al cambiar de idioma.
 */
export interface Interfaz {
  idioma: Idioma;
  insignia: string;
  tituloPlano: string;
  tituloAcento: string;
  intro: ParrafoEnfasis;
  /** Las cuatro etiquetas del hero; las cifras se cuentan, no se escriben. */
  cifras: readonly [string, string, string, string];
  paraQue: ReadonlyArray<{ titulo: string; texto: string }>;
  indice: {
    etiqueta: string;
    mapa: string;
    escalera: string;
    principios: string;
    trampas: string;
    preguntas: string;
  };
  mapa: Cabecera & {
    pie: string;
    svg: {
      alt: string;
      titulo: string;
      subtitulo: string;
      /** Los cinco verbos sobre las flechas, en el orden del dibujo. */
      verbos: readonly [string, string, string, string, string];
      transversal1: string;
      transversal2: string;
    };
  };
  escalera: Cabecera & {
    pie: ParrafoEnfasis;
    svg: {
      alt: string;
      ejeY: string;
      ejeX: string;
      frontera: string;
      fronteraPie: string;
    };
    tabla: readonly [string, string, string, string];
  };
  familiaPrefijo: string;
  principios: Cabecera & { complemento: string };
  trampas: Cabecera;
  preguntas: Cabecera & { cierre: string; remate: string };
  /** El easter egg: cinco teclas, y lo que dicen antes y después. */
  egg: {
    /** La tecla que hay que repetir para saltar al OTRO idioma. */
    tecla: string;
    /** El rótulo visible junto a las teclas. */
    invitacion: string;
    /** Nombre accesible del control: dice el mecanismo completo, sin misterio. */
    instruccion: string;
    /** Se anuncia por `aria-live` cuando el idioma ya cambió. */
    anuncio: string;
  };
}

export interface Atlas {
  ui: Interfaz;
  familias: ReadonlyArray<Familia>;
  principios: ReadonlyArray<Principio>;
  trampas: ReadonlyArray<Trampa>;
  preguntas: ReadonlyArray<Pregunta>;
  escalones: ReadonlyArray<Escalon>;
  estaciones: ReadonlyArray<Estacion>;
}

/**
 * Se cuentan, no se escriben a mano: el hero no puede mentir sobre el cuerpo.
 * Y como las dos versiones traducen los mismos patrones, la cifra tiene que
 * dar igual en inglés y en español — hay un test que lo sostiene.
 */
export function contarPatrones(atlas: Atlas): number {
  return (
    atlas.familias.reduce((n, f) => n + f.patrones.length, 0) +
    atlas.principios.length
  );
}
