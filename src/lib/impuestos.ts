/**
 * Impuesto a la Renta de trabajo (cuarta y quinta categoría) — ejercicio 2026.
 *
 * Todo el cálculo es puro: recibe una entrada y devuelve un resultado, sin
 * tocar el DOM. Las constantes vienen de la ley y de las resoluciones de SUNAT
 * citadas al lado de cada una, para que el número final se pueda auditar.
 */

/** UIT 2026 — DS 301-2025-EF. */
export const UIT = 5500;
/** Deducción del 20 % de cuarta, topada en 24 UIT — Art. 45 LIR. */
export const TOPE_DEDUCCION_20 = 24 * UIT;
/** Mínimo no imponible — Art. 46 LIR. */
export const DEDUCCION_7_UIT = 7 * UIT;
/** Deducción adicional por gastos, topada en 3 UIT — Art. 46 LIR. */
export const TOPE_3_UIT = 3 * UIT;
/** Ingreso mensual bajo el cual no hay pago a cuenta — RS 000390-2025/SUNAT. */
export const MENSUAL_SIN_OBLIGACION = 4010;
/** Proyección anual bajo la cual procede la suspensión — RS 000390-2025/SUNAT. */
export const ANUAL_SUSPENSION = 48125;
/** Pago a cuenta de cuarta — Art. 86 LIR. */
export const TASA_PAGO_A_CUENTA = 0.08;
/** Bonificación extraordinaria sobre las gratificaciones — Ley 30334. */
export const BONIFICACION_LEY_30334 = 0.09;
/** Desde este monto por recibo el cliente domiciliado retiene el 8 %. */
export const RETENCION_RHE_DESDE = 1500;

export type Regimen = "quinta" | "cuarta";
export type Moneda = "PEN" | "USD";
export type Pagador = "local" | "exterior";
export type SueldosAlAno = 12 | 14;

export interface Tramo {
  /** Límite superior del tramo en soles; Infinity para el último. */
  hasta: number;
  tasa: number;
  nombre: string;
}

/** Escala progresiva acumulativa — Art. 53 LIR. */
export const TRAMOS: readonly Tramo[] = [
  { hasta: 5 * UIT, tasa: 0.08, nombre: "Hasta 5 UIT" },
  { hasta: 20 * UIT, tasa: 0.14, nombre: "Más de 5 hasta 20 UIT" },
  { hasta: 35 * UIT, tasa: 0.17, nombre: "Más de 20 hasta 35 UIT" },
  { hasta: 45 * UIT, tasa: 0.2, nombre: "Más de 35 hasta 45 UIT" },
  { hasta: Infinity, tasa: 0.3, nombre: "Más de 45 UIT" },
];

export interface GastosDeducibles {
  alquiler: number;
  medicos: number;
  serviciosCuarta: number;
  restaurantes: number;
  essaludHogar: number;
}

/** Porcentaje deducible de cada categoría de gasto — Art. 46 LIR y reglamento. */
export const PORCENTAJE_GASTO: Readonly<Record<keyof GastosDeducibles, number>> = {
  alquiler: 0.3,
  medicos: 0.3,
  serviciosCuarta: 0.3,
  restaurantes: 0.15,
  essaludHogar: 1,
};

export interface EntradaRenta {
  ingresoMensual: number;
  moneda: Moneda;
  /** Soles por dólar; solo se usa cuando la moneda es USD. */
  tipoCambio: number;
  regimen: Regimen;
  /** Solo planilla. */
  sueldosAlAno: SueldosAlAno;
  /** Solo planilla: 0.13 ONP, ~0.129 AFP, 0 ninguno. */
  tasaPension: number;
  /** Solo honorarios. */
  pagador: Pagador;
  gastos: GastosDeducibles;
}

export interface CorteTramo {
  tramo: Tramo;
  desde: number;
  hasta: number;
  /** Renta imponible que cae en este tramo. */
  base: number;
  impuesto: number;
}

export interface ResultadoRenta {
  ingresoMensualPEN: number;
  rentaBrutaAnual: number;
  /** Cómo se compone el año: "12 sueldos + 2 gratificaciones…". */
  composicionAnual: string;
  deduccion20: number;
  deduccion20Topada: boolean;
  rentaNetaCategoria: number;
  deduccion7Aplicada: number;
  deduccion3Bruta: number;
  deduccion3: number;
  deduccion3Topada: boolean;
  rentaImponible: number;
  impuesto: number;
  /** Porcentaje del ingreso bruto anual que se va en impuesto. */
  tasaEfectiva: number;
  cortes: CorteTramo[];
  obligadoPagoMensual: boolean;
  pagoACuentaMensual: number;
  pagoACuentaAnual: number;
  /** Positivo: adelantaste de más. Negativo: te falta pagar. */
  saldo: number;
  puedeSuspender: boolean;
  pensionMensual: number;
  retencionMensualPromedio: number;
  netoMensual: number;
}

function positivo(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function deduccionPorGastos(gastos: GastosDeducibles): number {
  return (Object.keys(PORCENTAJE_GASTO) as Array<keyof GastosDeducibles>).reduce(
    (total, k) => total + positivo(gastos[k]) * PORCENTAJE_GASTO[k],
    0,
  );
}

function repartirEnTramos(rentaImponible: number): { impuesto: number; cortes: CorteTramo[] } {
  let impuesto = 0;
  let desde = 0;
  const cortes: CorteTramo[] = [];
  for (const tramo of TRAMOS) {
    const base = Math.max(0, Math.min(rentaImponible, tramo.hasta) - desde);
    const imp = base * tramo.tasa;
    impuesto += imp;
    cortes.push({ tramo, desde, hasta: tramo.hasta, base, impuesto: imp });
    desde = tramo.hasta;
  }
  return { impuesto, cortes };
}

export function calcularRenta(entrada: EntradaRenta): ResultadoRenta {
  const tipoCambio = entrada.moneda === "USD" ? positivo(entrada.tipoCambio) : 1;
  const ingresoMensualPEN = positivo(entrada.ingresoMensual) * tipoCambio;
  const esCuarta = entrada.regimen === "cuarta";

  let rentaBrutaAnual: number;
  let composicionAnual: string;
  if (esCuarta) {
    rentaBrutaAnual = ingresoMensualPEN * 12;
    composicionAnual = "12 pagos";
  } else if (entrada.sueldosAlAno === 14) {
    rentaBrutaAnual =
      ingresoMensualPEN * 12 + ingresoMensualPEN * 2 * (1 + BONIFICACION_LEY_30334);
    composicionAnual = "12 sueldos + 2 gratificaciones + bonificación 9\u00A0%";
  } else {
    rentaBrutaAnual = ingresoMensualPEN * 12;
    composicionAnual = "12 sueldos";
  }

  const deduccion20 = esCuarta ? Math.min(rentaBrutaAnual * 0.2, TOPE_DEDUCCION_20) : 0;
  const deduccion20Topada = esCuarta && rentaBrutaAnual * 0.2 > TOPE_DEDUCCION_20;
  const rentaNetaCategoria = rentaBrutaAnual - deduccion20;

  const deduccion3Bruta = deduccionPorGastos(entrada.gastos);
  const deduccion3 = Math.min(deduccion3Bruta, TOPE_3_UIT);
  const deduccion7Aplicada = Math.min(DEDUCCION_7_UIT, rentaNetaCategoria);
  const rentaImponible = Math.max(0, rentaNetaCategoria - DEDUCCION_7_UIT - deduccion3);

  const { impuesto, cortes } = repartirEnTramos(rentaImponible);
  const tasaEfectiva = rentaBrutaAnual > 0 ? (impuesto / rentaBrutaAnual) * 100 : 0;

  const obligadoPagoMensual = esCuarta && ingresoMensualPEN > MENSUAL_SIN_OBLIGACION;
  const pagoACuentaMensual = obligadoPagoMensual ? ingresoMensualPEN * TASA_PAGO_A_CUENTA : 0;
  const pagoACuentaAnual = obligadoPagoMensual ? rentaBrutaAnual * TASA_PAGO_A_CUENTA : 0;
  const saldo = pagoACuentaAnual - impuesto;
  const puedeSuspender = esCuarta && rentaBrutaAnual > 0 && rentaBrutaAnual <= ANUAL_SUSPENSION;

  const pensionMensual = esCuarta ? 0 : ingresoMensualPEN * positivo(entrada.tasaPension);
  const retencionMensualPromedio = esCuarta ? 0 : impuesto / 12;
  const netoMensual =
    ingresoMensualPEN - pensionMensual - retencionMensualPromedio - pagoACuentaMensual;

  return {
    ingresoMensualPEN,
    rentaBrutaAnual,
    composicionAnual,
    deduccion20,
    deduccion20Topada,
    rentaNetaCategoria,
    deduccion7Aplicada,
    deduccion3Bruta,
    deduccion3,
    deduccion3Topada: deduccion3Bruta > TOPE_3_UIT,
    rentaImponible,
    impuesto,
    tasaEfectiva,
    cortes,
    obligadoPagoMensual,
    pagoACuentaMensual,
    pagoACuentaAnual,
    saldo,
    puedeSuspender,
    pensionMensual,
    retencionMensualPromedio,
    netoMensual,
  };
}

const nf2 = new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nf0 = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });

/** "8,713.36" */
export function soles2(n: number): string {
  return nf2.format(n);
}

/** "8,713" */
export function soles0(n: number): string {
  return nf0.format(Math.round(n));
}
