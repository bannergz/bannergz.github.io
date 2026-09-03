/**
 * La URL como estado compartible de la calculadora.
 *
 * Dos reglas gobiernan el formato:
 *
 *  - **Sólo se serializa lo que difiere del valor por defecto.** Un enlace dice
 *    únicamente lo que el usuario cambió, y la barra de direcciones no se llena
 *    de ruido en cuanto tocas un control.
 *  - **Al leer, todo valor desconocido cae al defecto.** La query es entrada de
 *    usuario —cualquiera la edita a mano— así que nada de lo que venga de ahí
 *    puede romper el render: un `pension=0.5` dejaría el `<select>` en blanco.
 *
 * Las dos juntas dan la propiedad que el módulo garantiza y que el test fija:
 * `decodificarEstado(codificarEstado(e)) === e` para todo estado alcanzable
 * desde la interfaz.
 */

import type { GastosDeducibles, Moneda, Pagador, Regimen, SueldosAlAno } from "./impuestos";

/** Los montos viven como texto porque son el valor de un `<input>`. */
export type GastosTexto = Record<keyof GastosDeducibles, string>;

export interface EstadoCalculadora {
  moneda: Moneda;
  monto: string;
  tipoCambio: string;
  regimen: Regimen;
  sueldos: SueldosAlAno;
  pension: string;
  pagador: Pagador;
  gastos: GastosTexto;
}

/** Un caso realista ya calculado: la página nunca abre en blanco. */
export const ESTADO_INICIAL: EstadoCalculadora = {
  moneda: "PEN",
  monto: "5000",
  tipoCambio: "3.36",
  regimen: "quinta",
  sueldos: 14,
  pension: "0.129",
  pagador: "local",
  gastos: {
    alquiler: "0",
    medicos: "0",
    serviciosCuarta: "0",
    restaurantes: "0",
    essaludHogar: "0",
  },
};

/** Nombre público de cada gasto: legible en la URL, no la clave interna. */
const PARAM_GASTO = {
  alquiler: "alquiler",
  medicos: "medicos",
  serviciosCuarta: "servicios",
  restaurantes: "restaurantes",
  essaludHogar: "essalud",
} as const satisfies Record<keyof GastosDeducibles, string>;

const CLAVES_GASTO = Object.keys(PARAM_GASTO) as Array<keyof GastosDeducibles>;

/** Todo lo que este módulo administra; el resto de la query no es asunto suyo. */
const PARAMS_PROPIOS: readonly string[] = [
  "moneda",
  "monto",
  "tc",
  "regimen",
  "sueldos",
  "pension",
  "pagador",
  ...Object.values(PARAM_GASTO),
];

/** Enteros y decimales positivos. Sin signo, sin exponente, sin espacios. */
const NUMERO = /^\d{1,9}(\.\d{1,4})?$/;

/** Las tres del `<select>` de aporte previsional, exactas: si no coincide, el
 *  control quedaría sin opción seleccionada. */
const PENSIONES = ["0.13", "0.129", "0"] as const;

function texto(valor: string | null, porDefecto: string): string {
  return valor !== null && NUMERO.test(valor) ? valor : porDefecto;
}

function opcion<T extends string>(
  valor: string | null,
  validas: readonly T[],
  porDefecto: T,
): T {
  return validas.includes(valor as T) ? (valor as T) : porDefecto;
}

export function decodificarEstado(search: string): EstadoCalculadora {
  const p = new URLSearchParams(search);
  const d = ESTADO_INICIAL;
  const sueldos = p.get("sueldos");

  return {
    moneda: opcion(p.get("moneda"), ["PEN", "USD"] as const, d.moneda),
    monto: texto(p.get("monto"), d.monto),
    tipoCambio: texto(p.get("tc"), d.tipoCambio),
    regimen: opcion(p.get("regimen"), ["quinta", "cuarta"] as const, d.regimen),
    sueldos: sueldos === "12" ? 12 : sueldos === "14" ? 14 : d.sueldos,
    pension: opcion(p.get("pension"), PENSIONES, d.pension),
    pagador: opcion(p.get("pagador"), ["local", "exterior"] as const, d.pagador),
    gastos: Object.fromEntries(
      CLAVES_GASTO.map((k) => [k, texto(p.get(PARAM_GASTO[k]), d.gastos[k])]),
    ) as GastosTexto,
  };
}

/**
 * @param searchOriginal la query con la que llegó el visitante. Se conservan sus
 * parámetros ajenos (`utm_source` y compañía): escribir el estado no debe
 * borrarle a nadie de dónde vino.
 */
export function codificarEstado(estado: EstadoCalculadora, searchOriginal = ""): string {
  const p = new URLSearchParams(searchOriginal);
  for (const nombre of PARAMS_PROPIOS) p.delete(nombre);

  const d = ESTADO_INICIAL;
  const ponerTexto = (nombre: string, valor: string, porDefecto: string) => {
    // Un campo vacío o a medio escribir no se serializa: al releerlo caería al
    // defecto igual, y el enlace prometería un cálculo que no es el de nadie.
    if (valor !== porDefecto && NUMERO.test(valor)) p.set(nombre, valor);
  };

  if (estado.moneda !== d.moneda) p.set("moneda", estado.moneda);
  ponerTexto("monto", estado.monto, d.monto);
  ponerTexto("tc", estado.tipoCambio, d.tipoCambio);
  if (estado.regimen !== d.regimen) p.set("regimen", estado.regimen);
  if (estado.sueldos !== d.sueldos) p.set("sueldos", String(estado.sueldos));
  if (estado.pension !== d.pension) p.set("pension", estado.pension);
  if (estado.pagador !== d.pagador) p.set("pagador", estado.pagador);
  for (const k of CLAVES_GASTO) ponerTexto(PARAM_GASTO[k], estado.gastos[k], d.gastos[k]);

  const query = p.toString();
  return query ? `?${query}` : "";
}
