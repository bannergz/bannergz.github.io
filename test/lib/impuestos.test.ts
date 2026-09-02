import {
  ANUAL_SUSPENSION,
  DEDUCCION_7_UIT,
  MENSUAL_SIN_OBLIGACION,
  TOPE_3_UIT,
  TOPE_DEDUCCION_20,
  TRAMOS,
  UIT,
  calcularRenta,
  deduccionPorGastos,
  type EntradaRenta,
} from "@/lib/impuestos";

const sinGastos = {
  alquiler: 0,
  medicos: 0,
  serviciosCuarta: 0,
  restaurantes: 0,
  essaludHogar: 0,
};

function planilla(overrides: Partial<EntradaRenta> = {}): EntradaRenta {
  return {
    ingresoMensual: 5000,
    moneda: "PEN",
    tipoCambio: 3.36,
    regimen: "quinta",
    sueldosAlAno: 14,
    tasaPension: 0.129,
    pagador: "local",
    gastos: sinGastos,
    ...overrides,
  };
}

function honorarios(overrides: Partial<EntradaRenta> = {}): EntradaRenta {
  return planilla({ regimen: "cuarta", sueldosAlAno: 12, tasaPension: 0, ...overrides });
}

describe("constantes del ejercicio 2026", () => {
  it("usa la UIT de S/ 5,500 y los topes derivados de ella", () => {
    expect(UIT).toBe(5500);
    expect(DEDUCCION_7_UIT).toBe(38500);
    expect(TOPE_3_UIT).toBe(16500);
    expect(TOPE_DEDUCCION_20).toBe(132000);
  });

  it("usa los umbrales de la RS 000390-2025/SUNAT", () => {
    expect(MENSUAL_SIN_OBLIGACION).toBe(4010);
    expect(ANUAL_SUSPENSION).toBe(48125);
  });

  it("declara la escala progresiva del Art. 53 en cinco tramos", () => {
    expect(TRAMOS.map((t) => t.tasa)).toEqual([0.08, 0.14, 0.17, 0.2, 0.3]);
    expect(TRAMOS.map((t) => t.hasta)).toEqual([27500, 110000, 192500, 247500, Infinity]);
  });
});

describe("planilla (quinta categoría)", () => {
  it("con 14 sueldos suma dos gratificaciones más la bonificación del 9 %", () => {
    const r = calcularRenta(planilla());
    expect(r.rentaBrutaAnual).toBeCloseTo(70900, 2);
  });

  it("con 12 sueldos la renta bruta es doce veces el mensual", () => {
    const r = calcularRenta(planilla({ sueldosAlAno: 12 }));
    expect(r.rentaBrutaAnual).toBe(60000);
  });

  it("no aplica la deducción del 20 %", () => {
    const r = calcularRenta(planilla());
    expect(r.deduccion20).toBe(0);
    expect(r.rentaNetaCategoria).toBeCloseTo(70900, 2);
  });

  it("calcula el impuesto marginal del caso base: S/ 5,000 con 14 sueldos", () => {
    const r = calcularRenta(planilla());
    expect(r.rentaImponible).toBeCloseTo(32400, 2);
    expect(r.impuesto).toBeCloseTo(2886, 2);
    expect(r.tasaEfectiva).toBeCloseTo(4.0705, 3);
  });

  it("reparte el descuento mensual entre IR promedio y aporte previsional", () => {
    const r = calcularRenta(planilla());
    expect(r.retencionMensualPromedio).toBeCloseTo(240.5, 2);
    expect(r.pensionMensual).toBeCloseTo(645, 2);
    expect(r.netoMensual).toBeCloseTo(4114.5, 2);
  });

  it("no genera pago a cuenta ni saldo: retiene el empleador", () => {
    const r = calcularRenta(planilla());
    expect(r.pagoACuentaMensual).toBe(0);
    expect(r.pagoACuentaAnual).toBe(0);
    expect(r.obligadoPagoMensual).toBe(false);
  });

  it("con un sueldo bajo la renta imponible y el impuesto son cero", () => {
    const r = calcularRenta(planilla({ ingresoMensual: 3000, sueldosAlAno: 12 }));
    expect(r.rentaImponible).toBe(0);
    expect(r.impuesto).toBe(0);
    expect(r.tasaEfectiva).toBe(0);
    expect(r.deduccion7Aplicada).toBe(36000);
  });
});

describe("recibo por honorarios (cuarta categoría)", () => {
  const caso = honorarios({
    ingresoMensual: 4000,
    moneda: "USD",
    tipoCambio: 3.36,
    pagador: "exterior",
    gastos: { ...sinGastos, alquiler: 60000 },
  });

  it("convierte dólares a soles con el tipo de cambio indicado", () => {
    const r = calcularRenta(caso);
    expect(r.ingresoMensualPEN).toBeCloseTo(13440, 2);
    expect(r.rentaBrutaAnual).toBeCloseTo(161280, 2);
  });

  it("aplica la deducción del 20 % y las 7 UIT en ese orden", () => {
    const r = calcularRenta(caso);
    expect(r.deduccion20).toBeCloseTo(32256, 2);
    expect(r.deduccion20Topada).toBe(false);
    expect(r.rentaNetaCategoria).toBeCloseTo(129024, 2);
  });

  it("topa la deducción adicional en 3 UIT", () => {
    const r = calcularRenta(caso);
    expect(r.deduccion3Bruta).toBeCloseTo(18000, 2);
    expect(r.deduccion3).toBe(TOPE_3_UIT);
    expect(r.deduccion3Topada).toBe(true);
  });

  it("calcula el impuesto del ejercicio con la escala marginal", () => {
    const r = calcularRenta(caso);
    expect(r.rentaImponible).toBeCloseTo(74024, 2);
    expect(r.impuesto).toBeCloseTo(8713.36, 2);
  });

  it("el pago a cuenta del 8 % supera al impuesto y deja saldo a favor", () => {
    const r = calcularRenta(caso);
    expect(r.obligadoPagoMensual).toBe(true);
    expect(r.pagoACuentaMensual).toBeCloseTo(1075.2, 2);
    expect(r.pagoACuentaAnual).toBeCloseTo(12902.4, 2);
    expect(r.saldo).toBeCloseTo(4189.04, 2);
    expect(r.puedeSuspender).toBe(false);
  });

  it("topa la deducción del 20 % en 24 UIT y llega al tramo del 30 %", () => {
    // 60,000 × 12 = 720,000; el 20 % serían 144,000, pero el tope es 24 UIT.
    const r = calcularRenta(honorarios({ ingresoMensual: 60000 }));
    expect(r.deduccion20).toBe(TOPE_DEDUCCION_20);
    expect(r.deduccion20Topada).toBe(true);
    expect(r.rentaImponible).toBeCloseTo(549500, 2);
    expect(r.impuesto).toBeCloseTo(129375, 2);
    expect(r.cortes[4].base).toBeCloseTo(302000, 2);
  });

  it("bajo S/ 4,010 al mes no hay pago a cuenta y procede la suspensión", () => {
    const r = calcularRenta(honorarios({ ingresoMensual: 3500 }));
    expect(r.obligadoPagoMensual).toBe(false);
    expect(r.pagoACuentaMensual).toBe(0);
    expect(r.puedeSuspender).toBe(true);
  });

  it("no descuenta pensión aunque se pase una tasa: no hay empleador que la retenga", () => {
    const r = calcularRenta(honorarios({ ingresoMensual: 6000, tasaPension: 0.13 }));
    expect(r.pensionMensual).toBe(0);
    expect(r.netoMensual).toBeCloseTo(6000 - 480, 2);
  });
});

describe("cortes por tramo", () => {
  it("siempre lista los cinco tramos, con base cero en los que no se alcanzan", () => {
    const r = calcularRenta(planilla());
    expect(r.cortes).toHaveLength(5);
    expect(r.cortes.map((c) => c.base > 0)).toEqual([true, true, false, false, false]);
    expect(r.cortes[1].base).toBeCloseTo(4900, 2);
    expect(r.cortes[1].impuesto).toBeCloseTo(686, 2);
  });

  it("marca los límites de cada tramo en soles", () => {
    const r = calcularRenta(planilla());
    expect(r.cortes.map((c) => [c.desde, c.hasta])).toEqual([
      [0, 27500],
      [27500, 110000],
      [110000, 192500],
      [192500, 247500],
      [247500, Infinity],
    ]);
  });
});

describe("gastos deducibles", () => {
  it("aplica el porcentaje de cada categoría", () => {
    expect(
      deduccionPorGastos({
        alquiler: 10000,
        medicos: 2000,
        serviciosCuarta: 1000,
        restaurantes: 10000,
        essaludHogar: 1000,
      }),
    ).toBeCloseTo(3000 + 600 + 300 + 1500 + 1000, 2);
  });

  it("ignora montos negativos o no numéricos", () => {
    expect(deduccionPorGastos({ ...sinGastos, alquiler: -500, restaurantes: NaN })).toBe(0);
  });
});

describe("entradas inválidas", () => {
  it("trata un ingreso negativo o NaN como cero", () => {
    expect(calcularRenta(planilla({ ingresoMensual: -100 })).rentaBrutaAnual).toBe(0);
    expect(calcularRenta(planilla({ ingresoMensual: NaN })).impuesto).toBe(0);
  });

  it("con tipo de cambio inválido en dólares el ingreso en soles es cero", () => {
    const r = calcularRenta(honorarios({ moneda: "USD", tipoCambio: 0 }));
    expect(r.ingresoMensualPEN).toBe(0);
    expect(r.impuesto).toBe(0);
  });
});
