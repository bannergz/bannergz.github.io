"use client";

import { useState, type ReactNode } from "react";
import {
  ANUAL_SUSPENSION,
  MENSUAL_SIN_OBLIGACION,
  PORCENTAJE_GASTO,
  RETENCION_RHE_DESDE,
  TOPE_3_UIT,
  calcularRenta,
  soles0,
  soles2,
  type CorteTramo,
  type GastosDeducibles,
  type Moneda,
  type Pagador,
  type Regimen,
  type ResultadoRenta,
  type SueldosAlAno,
} from "@/lib/impuestos";

/** Azules del sitio, de claro a oscuro: un tono por tramo de la escala. */
const COLOR_TRAMO = ["#bfdbfe", "#60a5fa", "#3b82f6", "#1d4ed8", "#1e3a8a"] as const;

type GastosTexto = Record<keyof GastosDeducibles, string>;

const GASTOS_UI: ReadonlyArray<{ key: keyof GastosDeducibles; label: string; step: number }> = [
  { key: "alquiler", label: "Alquiler", step: 500 },
  { key: "medicos", label: "Médicos y dentistas", step: 500 },
  { key: "serviciosCuarta", label: "Servicios profesionales", step: 500 },
  { key: "restaurantes", label: "Restaurantes y hoteles", step: 500 },
  { key: "essaludHogar", label: "EsSalud trabajadores del hogar", step: 100 },
];

const INPUT_BASE =
  "rounded-xl border border-gray-200 bg-white px-3 py-2 text-base tabular-nums text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const INPUT = `w-full ${INPUT_BASE}`;
const LABEL = "text-xs font-semibold uppercase tracking-wider text-text-muted";

function aNumero(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

function pct(tasa: number): string {
  return `${Math.round(tasa * 100)} %`;
}

/* ------------------------------------------------------------------ */
/* Controles                                                           */
/* ------------------------------------------------------------------ */

function Segmentado<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={LABEL}>{label}</span>
      <div
        role="group"
        aria-label={label}
        className="flex rounded-full border border-gray-200 bg-surface-dark p-1"
      >
        {options.map((o) => {
          const activo = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={activo}
              onClick={() => onChange(o.value)}
              className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                activo ? "bg-accent text-white shadow-sm" : "text-text-muted hover:text-primary"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Pista({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-text-muted">{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Resultados                                                          */
/* ------------------------------------------------------------------ */

type Tono = "accent" | "good" | "flat";

function Tarjeta({
  titulo,
  valor,
  prefijo,
  sufijo,
  nota,
  tono = "accent",
}: {
  titulo: string;
  valor: string;
  prefijo?: string;
  sufijo?: string;
  nota: string;
  tono?: Tono;
}) {
  const color =
    tono === "good" ? "text-emerald" : tono === "flat" ? "text-primary" : "text-accent";
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <span className={LABEL}>{titulo}</span>
      <span className={`text-3xl font-bold tabular-nums tracking-tight ${color}`}>
        {prefijo && <span className="mr-1 text-base font-medium text-text-muted">{prefijo}</span>}
        {valor}
        {sufijo && <span className="ml-1 text-base font-medium text-text-muted">{sufijo}</span>}
      </span>
      <span className="text-sm leading-snug text-text-muted">{nota}</span>
    </div>
  );
}

type Aviso = { tipo: "info" | "warn" | "good"; titulo: string; texto: string };

function Nota({ aviso }: { aviso: Aviso }) {
  const estilo =
    aviso.tipo === "warn"
      ? "border-gold bg-gold/10 text-amber-800"
      : aviso.tipo === "good"
        ? "border-emerald bg-emerald/10 text-emerald-800"
        : "border-accent bg-accent/5 text-accent-dark";
  return (
    <div className={`rounded-xl border-l-4 px-5 py-4 ${estilo}`}>
      <p className="text-xs font-semibold uppercase tracking-wider">{aviso.titulo}</p>
      <p className="mt-1 text-sm leading-relaxed text-primary">{aviso.texto}</p>
    </div>
  );
}

function Fila({
  concepto,
  cita,
  parcial,
  acumulado,
  variante,
}: {
  concepto: string;
  cita?: string;
  parcial: string;
  acumulado: string;
  variante?: "minus" | "sum" | "base" | "total";
}) {
  const fila =
    variante === "sum"
      ? "bg-surface-dark font-semibold"
      : variante === "base"
        ? "bg-accent/10 font-semibold"
        : variante === "total"
          ? "border-t-2 border-gray-200 bg-surface-dark font-bold"
          : "";
  const num =
    variante === "minus"
      ? "text-amber-700"
      : variante === "base" || variante === "total"
        ? "text-accent"
        : "text-primary";
  return (
    <tr className={`border-b border-gray-100 last:border-b-0 ${fila}`}>
      <td className="px-4 py-3">
        {concepto}
        {cita && <span className="mt-0.5 block text-xs font-normal text-text-muted">{cita}</span>}
      </td>
      <td className={`whitespace-nowrap px-4 py-3 text-right tabular-nums ${num}`}>{parcial}</td>
      <td className={`whitespace-nowrap px-4 py-3 text-right tabular-nums ${num}`}>{acumulado}</td>
    </tr>
  );
}

function Th({ children, right }: { children: ReactNode; right?: boolean }) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted ${
        right ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function rango(c: CorteTramo): string {
  if (c.hasta === Infinity) return `Desde ${soles0(c.desde)}`;
  if (c.desde === 0) return `Hasta ${soles0(c.hasta)}`;
  return `${soles0(c.desde)} – ${soles0(c.hasta)}`;
}

function BarraTramos({ r }: { r: ResultadoRenta }) {
  if (r.rentaImponible <= 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-5 text-sm text-text-muted">
        Tu renta imponible es cero: las deducciones cubren todo tu ingreso, así que no hay
        impuesto que repartir en tramos.
      </div>
    );
  }
  const activos = r.cortes.map((c, i) => ({ c, i })).filter(({ c }) => c.base > 0);
  return (
    <div className="flex flex-col gap-3">
      <div
        role="img"
        aria-label="Distribución de la renta imponible por tramo"
        className="flex h-10 w-full overflow-hidden rounded-full bg-surface-dark"
      >
        {activos.map(({ c, i }) => (
          <span
            key={i}
            className="block h-full"
            style={{
              width: `${((c.base / r.rentaImponible) * 100).toFixed(3)}%`,
              background: COLOR_TRAMO[i],
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {activos.map(({ c, i }) => (
          <span key={i} className="flex items-center gap-2 text-sm text-text-muted">
            <i className="block h-3 w-3 rounded-sm" style={{ background: COLOR_TRAMO[i] }} />
            {pct(c.tramo.tasa)} sobre{" "}
            <b className="font-semibold tabular-nums text-primary">S/ {soles0(c.base)}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

function Paso({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-4 border-b border-gray-100 py-4 last:border-b-0">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
        {n}
      </span>
      <span className="text-sm leading-relaxed text-primary">{children}</span>
    </li>
  );
}

function Codigo({ children }: { children: ReactNode }) {
  return <code className="rounded bg-surface-dark px-1.5 py-0.5 text-[0.85em]">{children}</code>;
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

export function CalculadoraImpuestos() {
  const [moneda, setMoneda] = useState<Moneda>("PEN");
  const [monto, setMonto] = useState("5000");
  const [tipoCambio, setTipoCambio] = useState("3.36");
  const [regimen, setRegimen] = useState<Regimen>("quinta");
  const [sueldos, setSueldos] = useState<SueldosAlAno>(14);
  const [pension, setPension] = useState("0.129");
  const [pagador, setPagador] = useState<Pagador>("local");
  const [gastos, setGastos] = useState<GastosTexto>({
    alquiler: "0",
    medicos: "0",
    serviciosCuarta: "0",
    restaurantes: "0",
    essaludHogar: "0",
  });

  const esQuinta = regimen === "quinta";
  const r = calcularRenta({
    ingresoMensual: aNumero(monto),
    moneda,
    tipoCambio: aNumero(tipoCambio),
    regimen,
    sueldosAlAno: sueldos,
    tasaPension: aNumero(pension),
    pagador,
    gastos: {
      alquiler: aNumero(gastos.alquiler),
      medicos: aNumero(gastos.medicos),
      serviciosCuarta: aNumero(gastos.serviciosCuarta),
      restaurantes: aNumero(gastos.restaurantes),
      essaludHogar: aNumero(gastos.essaludHogar),
    },
  });

  /* ---- tercera tarjeta: cambia de sentido según el caso ---- */
  let tercera: { titulo: string; valor: string; nota: string; tono: Tono };
  if (esQuinta) {
    tercera = {
      titulo: "Te queda al mes",
      valor: soles0(r.netoMensual),
      tono: "good",
      nota: `Promedio. Bruto S/ ${soles0(r.ingresoMensualPEN)} menos IR S/ ${soles0(r.retencionMensualPromedio)}${
        r.pensionMensual > 0 ? ` y previsional S/ ${soles0(r.pensionMensual)}` : ""
      }. La retención real varía mes a mes.`,
    };
  } else if (!r.obligadoPagoMensual) {
    tercera = {
      titulo: "Adelanto mensual",
      valor: "0",
      tono: "flat",
      nota: `Estás bajo el mínimo de S/ ${soles0(MENSUAL_SIN_OBLIGACION)} al mes`,
    };
  } else if (r.saldo >= 0) {
    tercera = {
      titulo: "Te devuelven al final",
      valor: soles0(r.saldo),
      tono: "good",
      nota: `Adelantas S/ ${soles0(r.pagoACuentaMensual)} al mes y debes S/ ${soles0(r.impuesto)}`,
    };
  } else {
    tercera = {
      titulo: "Te falta pagar",
      valor: soles0(Math.abs(r.saldo)),
      tono: "accent",
      nota: `Adelantas S/ ${soles0(r.pagoACuentaAnual)} y debes S/ ${soles0(r.impuesto)}`,
    };
  }

  /* ---- avisos ---- */
  const avisos: Aviso[] = [];
  if (r.deduccion3Topada) {
    avisos.push({
      tipo: "warn",
      titulo: "Tope de 3 UIT alcanzado",
      texto: `Tus gastos dan S/ ${soles2(r.deduccion3Bruta)} de deducción pero el máximo es S/ ${soles0(TOPE_3_UIT)}. Registrar más gastos de estas categorías ya no baja tu impuesto.`,
    });
  } else if (r.deduccion3Bruta === 0) {
    avisos.push({
      tipo: "info",
      titulo: "No estás usando las 3 UIT",
      texto: `Es la única deducción que depende de ti. Con alquiler o consumo en restaurantes pagados con tarjeta y comprobante a tu nombre puedes bajar hasta S/ ${soles0(TOPE_3_UIT)} de tu renta imponible.`,
    });
  }
  if (!esQuinta && r.puedeSuspender) {
    avisos.push({
      tipo: "good",
      titulo: "Puedes pedir suspensión de retenciones",
      texto: `Tu proyección anual de S/ ${soles0(r.rentaBrutaAnual)} no supera el tope de S/ ${soles0(ANUAL_SUSPENSION)}, así que puedes solicitar la constancia y dejar de adelantar el 8 %.`,
    });
  }
  if (!esQuinta && r.rentaBrutaAnual > ANUAL_SUSPENSION && r.saldo > 0) {
    avisos.push({
      tipo: "info",
      titulo: "Vas a adelantar de más",
      texto: `El 8 % se calcula sobre tu ingreso bruto, pero el impuesto se calcula sobre tu renta neta, que es mucho menor. La diferencia de S/ ${soles0(r.saldo)} se recupera solo si presentas la declaración anual.`,
    });
  }
  if (esQuinta && r.impuesto > 0) {
    avisos.push({
      tipo: "info",
      titulo: "Tu empleador retiene y declara",
      texto:
        "No tienes que presentar nada cada mes. Si tienes gastos de las 3 UIT, SUNAT los cruza y devuelve de oficio, pero conviene revisar que tus comprobantes estén a tu nombre.",
    });
  }

  /* ---- pasos ---- */
  const pasos: ReactNode[] = [];
  if (esQuinta) {
    pasos.push(
      "Tu empleador te retiene el impuesto cada mes y lo paga a SUNAT. Tú no presentas declaración mensual.",
      "Pide y guarda comprobantes electrónicos a tu nombre por alquiler, médicos, restaurantes y hoteles, pagados con tarjeta o transferencia.",
      "Entre marzo y abril del año siguiente revisa tu devolución. SUNAT devuelve de oficio a los trabajadores de quinta, pero solo por lo que tenga registrado.",
    );
  } else {
    pasos.push(
      <>
        Emite <b>recibo por honorarios electrónico</b> por cada pago, desde SUNAT Operaciones en
        Línea.
      </>,
      pagador === "exterior"
        ? "Nadie te retiene: un pagador del exterior no es agente de retención en el Perú."
        : `Si el recibo supera S/ ${soles0(RETENCION_RHE_DESDE)} tu cliente te retiene el 8 %. Si es menor, el adelanto lo haces tú.`,
    );
    if (!r.obligadoPagoMensual) {
      pasos.push(
        <>
          Ganas menos de S/ {soles0(MENSUAL_SIN_OBLIGACION)} al mes, así que{" "}
          <b>no tienes obligación de declarar mensualmente</b>.
        </>,
      );
    } else {
      pasos.push(
        <>
          Declara y paga el <b>Formulario Virtual 616</b> cada mes: S/ {soles2(r.pagoACuentaMensual)}.
          Ruta:{" "}
          <Codigo>
            Mis declaraciones y pagos → Pago y presentación de otras declaraciones → Trabajadores
            Independientes 616
          </Codigo>
          .
        </>,
        <>
          Si pagas en ventanilla del banco, el código de tributo es <Codigo>3041</Codigo>, cuarta
          categoría cuenta propia. El 3042 es de retenciones y lo usa quien retiene, no tú.
        </>,
      );
    }
    pasos.push(
      <>
        Presenta la <b>declaración anual</b> entre marzo y abril del año siguiente. Es el único
        momento en que se aplican las 7 UIT y las 3 UIT
        {r.saldo > 0 ? ` y en que recuperas los S/ ${soles0(r.saldo)} que adelantaste de más.` : "."}
      </>,
    );
  }

  const setGasto = (key: keyof GastosDeducibles, value: string) =>
    setGastos((g) => ({ ...g, [key]: value }));

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_1fr] lg:items-start">
      {/* ---------------- panel de entrada ---------------- */}
      <aside className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain">
        <Segmentado
          label="Moneda del ingreso"
          value={moneda}
          onChange={setMoneda}
          options={[
            { value: "PEN", label: "Soles" },
            { value: "USD", label: "Dólares" },
          ]}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="monto" className={LABEL}>
            Ingreso bruto mensual
          </label>
          <input
            id="monto"
            type="number"
            min={0}
            step={100}
            inputMode="decimal"
            className={INPUT}
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>

        {moneda === "USD" && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tc" className={LABEL}>
              Tipo de cambio
            </label>
            <input
              id="tc"
              type="number"
              min={0.01}
              step={0.001}
              inputMode="decimal"
              className={INPUT}
              value={tipoCambio}
              onChange={(e) => setTipoCambio(e.target.value)}
            />
            <Pista>
              Para declarar se usa el promedio ponderado <b>compra</b> de la SBS del día en que se
              percibió cada pago, no un valor fijo.
            </Pista>
          </div>
        )}

        <Segmentado
          label="Cómo te pagan"
          value={regimen}
          onChange={setRegimen}
          options={[
            { value: "quinta", label: "Planilla" },
            { value: "cuarta", label: "Recibo por honorarios" },
          ]}
        />

        {esQuinta && (
          <>
            <div className="flex flex-col gap-1.5">
              <Segmentado
                label="Sueldos al año"
                value={sueldos}
                onChange={setSueldos}
                options={[
                  { value: 14, label: "14 con gratificaciones" },
                  { value: 12, label: "12" },
                ]}
              />
              <Pista>
                14 incluye las dos gratificaciones más la bonificación extraordinaria del 9 % de la
                Ley 30334, que también es renta gravada.
              </Pista>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pension" className={LABEL}>
                Aporte previsional
              </label>
              <select
                id="pension"
                className={INPUT}
                value={pension}
                onChange={(e) => setPension(e.target.value)}
              >
                <option value="0.13">ONP — 13 %</option>
                <option value="0.129">AFP — 12.9 % aprox.</option>
                <option value="0">Ninguno</option>
              </select>
              <Pista>No es impuesto ni va a SUNAT. Se muestra aparte porque sí sale de tu sueldo.</Pista>
            </div>
          </>
        )}

        {!esQuinta && (
          <div className="flex flex-col gap-1.5">
            <Segmentado
              label="Quién te paga"
              value={pagador}
              onChange={setPagador}
              options={[
                { value: "local", label: "Empresa peruana" },
                { value: "exterior", label: "Del exterior" },
              ]}
            />
            <Pista>Un pagador del exterior no retiene: el pago a cuenta mensual lo asumes tú.</Pista>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
          <h3 className="text-sm font-semibold text-primary">Gastos deducibles del año</h3>
          <Pista>
            Lo que pagaste con tarjeta o transferencia y con comprobante electrónico a tu nombre. En
            efectivo no cuenta.
          </Pista>
          {GASTOS_UI.map((g) => (
            <div key={g.key} className="flex items-center gap-3">
              <div className="flex flex-1 flex-col leading-snug">
                <label htmlFor={`gasto-${g.key}`} className="text-sm text-primary">
                  {g.label}
                </label>
                <span className="text-xs tabular-nums text-text-muted">
                  {pct(PORCENTAJE_GASTO[g.key])} deducible
                </span>
              </div>
              <input
                id={`gasto-${g.key}`}
                type="number"
                min={0}
                step={g.step}
                inputMode="decimal"
                className={`${INPUT_BASE} w-24 flex-none px-2 py-1.5 text-sm`}
                value={gastos[g.key]}
                onChange={(e) => setGasto(g.key, e.target.value)}
              />
            </div>
          ))}
          <div className="flex items-center justify-between gap-2 pt-1 text-sm">
            <span className="text-text-muted">Deducción lograda</span>
            <b className="tabular-nums text-accent">
              S/ {soles2(r.deduccion3)} de S/ {soles0(TOPE_3_UIT)}
            </b>
          </div>
        </div>
      </aside>

      {/* ---------------- resultados ---------------- */}
      <div className="flex min-w-0 flex-col gap-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Tarjeta
            titulo="Impuesto del año"
            prefijo="S/"
            valor={soles0(r.impuesto)}
            nota={`Renta bruta anual S/ ${soles0(r.rentaBrutaAnual)} · ${r.composicionAnual}`}
          />
          <Tarjeta
            titulo="Tasa efectiva"
            valor={r.tasaEfectiva.toFixed(2)}
            sufijo="%"
            tono="flat"
            nota={
              r.impuesto === 0
                ? "No pagas impuesto a la renta con estos datos"
                : `De cada S/ 100 que ganas, S/ ${r.tasaEfectiva.toFixed(2)} van a SUNAT`
            }
          />
          <Tarjeta
            titulo={tercera.titulo}
            prefijo="S/"
            valor={tercera.valor}
            nota={tercera.nota}
            tono={tercera.tono}
          />
        </div>

        {avisos.length > 0 && (
          <div className="flex flex-col gap-3">
            {avisos.map((a) => (
              <Nota key={a.titulo} aviso={a} />
            ))}
          </div>
        )}

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Cómo sale el número</h2>
            <p className="mt-1 text-sm text-text-muted">
              El orden es el de la ley: primero la deducción de la categoría, después las 7 UIT y las
              3 UIT, y recién sobre ese saldo corre la escala.
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <Th>Concepto</Th>
                  <Th right>Parcial</Th>
                  <Th right>Acumulado S/</Th>
                </tr>
              </thead>
              <tbody>
                <Fila
                  concepto="Renta bruta anual"
                  cita={r.composicionAnual}
                  parcial="—"
                  acumulado={soles2(r.rentaBrutaAnual)}
                />
                {!esQuinta && (
                  <>
                    <Fila
                      concepto="Deducción del 20 %"
                      cita={`Art. 45.° LIR${r.deduccion20Topada ? " · topada en 24 UIT" : ""}`}
                      parcial={`(${soles2(r.deduccion20)})`}
                      acumulado="—"
                      variante="minus"
                    />
                    <Fila
                      concepto="Renta neta de cuarta"
                      parcial="—"
                      acumulado={soles2(r.rentaNetaCategoria)}
                      variante="sum"
                    />
                  </>
                )}
                <Fila
                  concepto="Deducción de 7 UIT"
                  cita="Art. 46.° LIR · mínimo no imponible"
                  parcial={`(${soles2(r.deduccion7Aplicada)})`}
                  acumulado="—"
                  variante="minus"
                />
                <Fila
                  concepto="Deducción adicional"
                  cita={
                    r.deduccion3Topada
                      ? "Art. 46.° LIR · topada en 3 UIT"
                      : "Art. 46.° LIR · según tus gastos"
                  }
                  parcial={`(${soles2(r.deduccion3)})`}
                  acumulado="—"
                  variante="minus"
                />
                <Fila
                  concepto="Renta neta de trabajo imponible"
                  parcial="—"
                  acumulado={soles2(r.rentaImponible)}
                  variante="base"
                />
                {r.cortes
                  .filter((c) => c.base > 0)
                  .map((c) => (
                    <Fila
                      key={c.tramo.nombre}
                      concepto={`S/ ${soles2(c.base)} al ${pct(c.tramo.tasa)}`}
                      parcial={soles2(c.base)}
                      acumulado={soles2(c.impuesto)}
                    />
                  ))}
                <Fila
                  concepto="Impuesto a la renta del ejercicio"
                  parcial="—"
                  acumulado={soles2(r.impuesto)}
                  variante="total"
                />
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Dónde cae tu ingreso</h2>
            <p className="mt-1 text-sm text-text-muted">
              La escala es marginal: cada tramo paga su propia tasa, no toda la renta paga la tasa más
              alta que alcanzas.
            </p>
          </div>
          <BarraTramos r={r} />
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <Th>Tramo</Th>
                  <Th right>Renta neta de trabajo</Th>
                  <Th right>Tasa</Th>
                  <Th right>Tu impuesto</Th>
                </tr>
              </thead>
              <tbody>
                {r.cortes.map((c) => (
                  <tr
                    key={c.tramo.nombre}
                    className={`border-b border-gray-100 last:border-b-0 ${
                      c.base > 0 ? "bg-accent/10 font-semibold" : ""
                    }`}
                  >
                    <td className="px-4 py-3">{c.tramo.nombre}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                      {rango(c)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                      {pct(c.tramo.tasa)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                      {c.base > 0 ? soles2(c.impuesto) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-primary">Qué te toca hacer</h2>
          <ol className="rounded-2xl border border-gray-100 bg-white px-6 shadow-sm">
            {pasos.map((p, i) => (
              <Paso key={i} n={i + 1}>
                {p}
              </Paso>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
