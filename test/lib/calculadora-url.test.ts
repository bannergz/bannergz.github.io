import {
  ESTADO_INICIAL,
  codificarEstado,
  decodificarEstado,
  type EstadoCalculadora,
} from "@/lib/calculadora-url";

describe("calculadora-url", () => {
  describe("decodificarEstado", () => {
    it("sin query devuelve el caso por defecto", () => {
      expect(decodificarEstado("")).toEqual(ESTADO_INICIAL);
    });

    it("lee un enlace completo", () => {
      const e = decodificarEstado(
        "?moneda=USD&monto=4000&tc=3.75&regimen=cuarta&pagador=exterior&alquiler=12000&servicios=800",
      );
      expect(e.moneda).toBe("USD");
      expect(e.monto).toBe("4000");
      expect(e.tipoCambio).toBe("3.75");
      expect(e.regimen).toBe("cuarta");
      expect(e.pagador).toBe("exterior");
      expect(e.gastos.alquiler).toBe("12000");
      expect(e.gastos.serviciosCuarta).toBe("800");
      // Lo que el enlace no dice se queda en el defecto.
      expect(e.gastos.medicos).toBe("0");
      expect(e.sueldos).toBe(14);
    });

    it.each([
      ["texto", "?monto=mucho"],
      ["negativo", "?monto=-5000"],
      ["exponente", "?monto=1e9"],
      ["vacío", "?monto="],
      ["con espacios", "?monto=5 000"],
      ["demasiados dígitos", "?monto=12345678901"],
    ])("ignora un monto %s y usa el defecto", (_caso, search) => {
      expect(decodificarEstado(search).monto).toBe(ESTADO_INICIAL.monto);
    });

    it("rechaza una pensión fuera del select: dejaría el control en blanco", () => {
      expect(decodificarEstado("?pension=0.5").pension).toBe(ESTADO_INICIAL.pension);
      expect(decodificarEstado("?pension=0.13").pension).toBe("0.13");
      expect(decodificarEstado("?pension=0").pension).toBe("0");
    });

    it("sólo acepta 12 o 14 sueldos", () => {
      expect(decodificarEstado("?sueldos=12").sueldos).toBe(12);
      expect(decodificarEstado("?sueldos=13").sueldos).toBe(14);
    });

    it("ignora un régimen o una moneda inventados", () => {
      expect(decodificarEstado("?regimen=tercera&moneda=EUR")).toEqual(ESTADO_INICIAL);
    });
  });

  describe("codificarEstado", () => {
    it("el estado por defecto no ensucia la URL", () => {
      expect(codificarEstado(ESTADO_INICIAL)).toBe("");
    });

    it("serializa sólo lo que el usuario cambió", () => {
      const e: EstadoCalculadora = { ...ESTADO_INICIAL, monto: "9000" };
      expect(codificarEstado(e)).toBe("?monto=9000");
    });

    it("no serializa un campo a medio escribir: el enlace prometería otro cálculo", () => {
      const e: EstadoCalculadora = { ...ESTADO_INICIAL, monto: "" };
      expect(codificarEstado(e)).toBe("");
    });

    it("conserva los parámetros ajenos de la query", () => {
      const e: EstadoCalculadora = { ...ESTADO_INICIAL, regimen: "cuarta" };
      const search = codificarEstado(e, "?utm_source=linkedin&monto=1");
      expect(search).toContain("utm_source=linkedin");
      expect(search).toContain("regimen=cuarta");
      // El `monto=1` de la query original era nuestro y ya no aplica.
      expect(search).not.toContain("monto=");
    });
  });

  it("ida y vuelta: todo estado alcanzable sobrevive al enlace", () => {
    const e: EstadoCalculadora = {
      moneda: "USD",
      monto: "7350.5",
      tipoCambio: "3.812",
      regimen: "cuarta",
      sueldos: 12,
      pension: "0.13",
      pagador: "exterior",
      gastos: {
        alquiler: "18000",
        medicos: "2400",
        serviciosCuarta: "500",
        restaurantes: "3600",
        essaludHogar: "1200",
      },
    };
    expect(decodificarEstado(codificarEstado(e))).toEqual(e);
  });
});
