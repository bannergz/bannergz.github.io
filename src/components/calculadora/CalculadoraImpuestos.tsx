"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type WheelEvent,
} from "react";
import { escribirUrlSearch, urlAbsoluta, useUrlSearch } from "@/hooks/useUrlSearch";
import {
  codificarEstado,
  decodificarEstado,
  type EstadoCalculadora,
} from "@/lib/calculadora-url";
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

/** La rampa del ámbar, de clara a oscura: un tono por tramo de la escala. */
const COLOR_TRAMO = ["#FFE9B0", "#FFD166", "#FFB627", "#D9930F", "#A66C05"] as const;

const GASTOS_UI: ReadonlyArray<{ key: keyof GastosDeducibles; label: string; step: number }> = [
  { key: "alquiler", label: "Alquiler", step: 500 },
  { key: "medicos", label: "Médicos y dentistas", step: 500 },
  { key: "serviciosCuarta", label: "Servicios profesionales", step: 500 },
  { key: "restaurantes", label: "Restaurantes y hoteles", step: 500 },
  { key: "essaludHogar", label: "EsSalud trabajadores del hogar", step: 100 },
];

const INPUT_BASE =
  "rounded-sm border border-line bg-panel-hi px-3 py-2 font-mono text-base tabular-nums text-fg transition-colors focus:border-accent";
const INPUT = `w-full ${INPUT_BASE}`;
const LABEL = "col-label";

/** La rueda del mouse sobre un `type="number"` enfocado cambia el valor sin que
 *  nadie lo pida, y el usuario solo queria bajar la pagina: al primer giro el
 *  campo suelta el foco y el desplazamiento sigue de largo. */
const soltarFoco = (e: WheelEvent<HTMLInputElement>) => e.currentTarget.blur();

function aNumero(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

function pct(tasa: number): string {
  return `${Math.round(tasa * 100)}\u00A0%`;
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
  const grupoRef = useRef<HTMLDivElement>(null);
  const actual = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  // Un radiogroup se recorre con flechas: Tab entra y sale del grupo entero,
  // y adentro solo el seleccionado es tabulable. Sin esto, anunciar "radio"
  // prometería un teclado que no existe.
  const alPulsar = (e: KeyboardEvent<HTMLDivElement>) => {
    const paso =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (paso === 0) return;
    e.preventDefault();
    const destino = (actual + paso + options.length) % options.length;
    onChange(options[destino].value);
    // El foco acompaña a la selección: si se queda atras, la siguiente flecha
    // parte del botón equivocado.
    grupoRef.current?.querySelectorAll("button")[destino]?.focus();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className={LABEL}>{label}</span>
      <div
        ref={grupoRef}
        role="radiogroup"
        aria-label={label}
        onKeyDown={alPulsar}
        className="flex rounded-sm border border-line bg-panel-hi p-1"
      >
        {options.map((o) => {
          const activo = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={activo}
              tabIndex={activo ? 0 : -1}
              onClick={() => onChange(o.value)}
              className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
                activo ? "bg-accent text-on-accent" : "text-text-muted hover:text-fg"
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
    tono === "good" ? "text-positive" : tono === "flat" ? "text-fg" : "text-accent";
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-line bg-panel p-6">
      <span className={LABEL}>{titulo}</span>
      <span className={`font-mono text-3xl font-semibold tabular-nums tracking-tight ${color}`}>
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
      ? "border-accent bg-accent/10 text-accent"
      : aviso.tipo === "good"
        ? "border-positive bg-positive/10 text-positive"
        : "border-accent bg-accent/5 text-accent";
  return (
    <div className={`rounded-sm border-l-2 px-5 py-4 ${estilo}`}>
      <p className="text-xs font-semibold uppercase tracking-wider">{aviso.titulo}</p>
      <p className="mt-1 text-sm leading-relaxed text-fg">{aviso.texto}</p>
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
      ? "bg-panel-hi font-semibold"
      : variante === "base"
        ? "bg-accent/10 font-semibold"
        : variante === "total"
          ? "border-t-2 border-line bg-panel-hi font-bold"
          : "";
  const num =
    variante === "minus"
      ? "text-accent"
      : variante === "base" || variante === "total"
        ? "text-accent"
        : "text-fg";
  return (
    <tr className={`border-b border-line last:border-b-0 ${fila}`}>
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
      <div className="rounded-lg border border-dashed border-line-hi bg-panel p-5 text-sm text-text-muted">
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
        className="flex h-10 w-full overflow-hidden rounded-sm bg-panel-hi"
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
            <b className="font-semibold tabular-nums text-fg">S/&nbsp;{soles0(c.base)}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

function Paso({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-4 border-b border-line py-4 last:border-b-0">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-sm bg-accent/15 font-mono text-xs font-semibold text-accent">
        {n}
      </span>
      <span className="text-sm leading-relaxed text-fg">{children}</span>
    </li>
  );
}

function Codigo({ children }: { children: ReactNode }) {
  return <code className="rounded-sm bg-panel-hi px-1.5 py-0.5 font-mono text-[0.85em] text-fg">{children}</code>;
}

/* ------------------------------------------------------------------ */
/* Compartir                                                           */
/* ------------------------------------------------------------------ */

type EstadoCopia = "listo" | "ok" | "falla";

/**
 * El cálculo ya viaja en la barra de direcciones, pero nadie mira la barra:
 * este botón es lo que hace visible que el resultado tiene enlace propio.
 */
function BotonCompartir({ query }: { query: string }) {
  const [copia, setCopia] = useState<EstadoCopia>("listo");

  useEffect(() => {
    if (copia === "listo") return;
    const t = setTimeout(() => setCopia("listo"), 4000);
    return () => clearTimeout(t);
  }, [copia]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(urlAbsoluta(query));
      setCopia("ok");
    } catch {
      // Sin portapapeles disponible (contexto no seguro, permiso denegado):
      // el enlace igual está arriba, así que lo decimos en vez de callar.
      setCopia("falla");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        type="button"
        onClick={() => void copiar()}
        className="inline-flex items-center gap-2 rounded-sm border border-line-hi px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5 21 3m0 0h-5.25M21 3v5.25M10.5 6H6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-4.5"
          />
        </svg>
        Copiar enlace de este cálculo
      </button>
      <span role="status" className="text-sm text-text-muted">
        {copia === "ok" && "Enlace copiado."}
        {copia === "falla" && "No se pudo copiar. El enlace está en la barra de direcciones."}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Anuncio para lectores de pantalla                                   */
/* ------------------------------------------------------------------ */

/**
 * Las tres cifras cambian con cada tecla y `aria-live="polite"` encola todos los
 * cambios: sin demora, escribir "60000" en un campo deja cinco anuncios en cola
 * que el usuario tiene que esperar a que terminen. Se anuncia cuando deja de
 * escribir.
 *
 * Arranca con el texto ya puesto —no vacío— para que el resumen exista en el
 * primer render: una región viva sólo anuncia lo que cambia después, así que de
 * este modo la página no se anuncia sola al cargar.
 */
function useAnuncioDemorado(texto: string, ms = 700): string {
  const [anuncio, setAnuncio] = useState(texto);

  useEffect(() => {
    const t = setTimeout(() => setAnuncio(texto), ms);
    return () => clearTimeout(t);
  }, [texto, ms]);

  return anuncio;
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

/**
 * Un enlace distinto es, literalmente, otra calculadora: `key` la remonta con
 * el estado que trae la URL. Remontar es más simple y más seguro que sincronizar
 * el estado con la URL dentro de un efecto, y sólo ocurre dos veces —al hidratar
 * un enlace con parámetros y al usar atrás/adelante— porque las escrituras
 * propias no mueven el snapshot.
 */
export function CalculadoraImpuestos() {
  const search = useUrlSearch();
  return <Motor key={search} search={search} />;
}

function Motor({ search }: { search: string }) {
  const [estado, setEstado] = useState(() => decodificarEstado(search));
  const { moneda, monto, tipoCambio, regimen, sueldos, pension, pagador, gastos } = estado;

  const setCampo = <K extends keyof EstadoCalculadora>(clave: K, valor: EstadoCalculadora[K]) =>
    setEstado((e) => ({ ...e, [clave]: valor }));

  const setMoneda = (v: Moneda) => setCampo("moneda", v);
  const setMonto = (v: string) => setCampo("monto", v);
  const setTipoCambio = (v: string) => setCampo("tipoCambio", v);
  const setRegimen = (v: Regimen) => setCampo("regimen", v);
  const setSueldos = (v: SueldosAlAno) => setCampo("sueldos", v);
  const setPension = (v: string) => setCampo("pension", v);
  const setPagador = (v: Pagador) => setCampo("pagador", v);
  const setGasto = (key: keyof GastosDeducibles, value: string) =>
    setEstado((e) => ({ ...e, gastos: { ...e.gastos, [key]: value } }));

  const query = codificarEstado(estado, search);

  useEffect(() => {
    // 400 ms: escribir en cada tecla choca con el límite de `replaceState` de
    // los navegadores en cuanto alguien mantiene pulsada una flecha del teclado
    // sobre un `input type="number"`.
    const t = setTimeout(() => escribirUrlSearch(query), 400);
    return () => clearTimeout(t);
  }, [query]);

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
      nota: `Promedio. Bruto S/\u00A0${soles0(r.ingresoMensualPEN)} menos IR S/\u00A0${soles0(r.retencionMensualPromedio)}${
        r.pensionMensual > 0 ? ` y previsional S/&nbsp;${soles0(r.pensionMensual)}` : ""
      }. La retención real varía mes a mes.`,
    };
  } else if (!r.obligadoPagoMensual) {
    tercera = {
      titulo: "Adelanto mensual",
      valor: "0",
      tono: "flat",
      nota: `Estás bajo el mínimo de S/\u00A0${soles0(MENSUAL_SIN_OBLIGACION)} al mes`,
    };
  } else if (r.saldo >= 0) {
    tercera = {
      titulo: "Te devuelven al final",
      valor: soles0(r.saldo),
      tono: "good",
      nota: `Adelantas S/\u00A0${soles0(r.pagoACuentaMensual)} al mes y debes S/\u00A0${soles0(r.impuesto)}`,
    };
  } else {
    tercera = {
      titulo: "Te falta pagar",
      valor: soles0(Math.abs(r.saldo)),
      tono: "accent",
      nota: `Adelantas S/\u00A0${soles0(r.pagoACuentaAnual)} y debes S/\u00A0${soles0(r.impuesto)}`,
    };
  }

  /* ---- avisos ---- */
  const avisos: Aviso[] = [];
  if (r.deduccion3Topada) {
    avisos.push({
      tipo: "warn",
      titulo: "Tope de 3 UIT alcanzado",
      texto: `Tus gastos dan S/\u00A0${soles2(r.deduccion3Bruta)} de deducción pero el máximo es S/\u00A0${soles0(TOPE_3_UIT)}. Registrar más gastos de estas categorías ya no baja tu impuesto.`,
    });
  } else if (r.deduccion3Bruta === 0) {
    avisos.push({
      tipo: "info",
      titulo: "No estás usando las 3 UIT",
      texto: `Es la única deducción que depende de ti. Con alquiler o consumo en restaurantes pagados con tarjeta y comprobante a tu nombre puedes bajar hasta S/\u00A0${soles0(TOPE_3_UIT)} de tu renta imponible.`,
    });
  }
  if (!esQuinta && r.puedeSuspender) {
    avisos.push({
      tipo: "good",
      titulo: "Puedes pedir suspensión de retenciones",
      texto: `Tu proyección anual de S/\u00A0${soles0(r.rentaBrutaAnual)} no supera el tope de S/\u00A0${soles0(ANUAL_SUSPENSION)}, así que puedes solicitar la constancia y dejar de adelantar el 8\u00A0%.`,
    });
  }
  if (!esQuinta && r.rentaBrutaAnual > ANUAL_SUSPENSION && r.saldo > 0) {
    avisos.push({
      tipo: "info",
      titulo: "Vas a adelantar de más",
      texto: `El 8\u00A0% se calcula sobre tu ingreso bruto, pero el impuesto se calcula sobre tu renta neta, que es mucho menor. La diferencia de S/\u00A0${soles0(r.saldo)} se recupera solo si presentas la declaración anual.`,
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
        : `Si el recibo supera S/\u00A0${soles0(RETENCION_RHE_DESDE)} tu cliente te retiene el 8\u00A0%. Si es menor, el adelanto lo haces tú.`,
    );
    if (!r.obligadoPagoMensual) {
      pasos.push(
        <>
          Ganas menos de S/&nbsp;{soles0(MENSUAL_SIN_OBLIGACION)} al mes, así que{" "}
          <b>no tienes obligación de declarar mensualmente</b>.
        </>,
      );
    } else {
      pasos.push(
        <>
          Declara y paga el <b>Formulario Virtual 616</b> cada mes: S/&nbsp;{soles2(r.pagoACuentaMensual)}.
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
        {r.saldo > 0 ? ` y en que recuperas los S/\u00A0${soles0(r.saldo)} que adelantaste de más.` : "."}
      </>,
    );
  }

  /* ---- resumen hablado: lo que cambia cuando cambia un dato ---- */
  const anuncio = useAnuncioDemorado(
    [
      `Impuesto del año: ${soles0(r.impuesto)} soles.`,
      `Tasa efectiva: ${r.tasaEfectiva.toFixed(2)} por ciento.`,
      `${tercera.titulo}: ${tercera.valor} soles.`,
      avisos.length > 0 ? `Avisos: ${avisos.map((a) => a.titulo).join("; ")}.` : "",
    ]
      .join(" ")
      .trim(),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_1fr] lg:items-start">
      {/* ---------------- panel de entrada ---------------- */}
      <aside className="flex flex-col gap-6 rounded-lg border border-line bg-panel p-6 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain">
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
            name="monto"
            type="number"
            autoComplete="off"
            min={0}
            step={100}
            inputMode="decimal"
            onWheel={soltarFoco}
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
              name="tc"
              type="number"
              autoComplete="off"
              min={0.01}
              step={0.001}
              inputMode="decimal"
              onWheel={soltarFoco}
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
                14 incluye las dos gratificaciones más la bonificación extraordinaria del 9&nbsp;% de la
                Ley 30334, que también es renta gravada.
              </Pista>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pension" className={LABEL}>
                Aporte previsional
              </label>
              <select
                id="pension"
                name="pension"
                autoComplete="off"
                className={INPUT}
                value={pension}
                onChange={(e) => setPension(e.target.value)}
              >
                <option value="0.13">ONP — 13&nbsp;%</option>
                <option value="0.129">AFP — 12.9&nbsp;% aprox.</option>
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

        <div className="flex flex-col gap-3 border-t border-line pt-5">
          <h2 className="text-sm font-semibold text-fg">Gastos deducibles del año</h2>
          <Pista>
            Lo que pagaste con tarjeta o transferencia y con comprobante electrónico a tu nombre. En
            efectivo no cuenta.
          </Pista>
          {GASTOS_UI.map((g) => (
            <div key={g.key} className="flex items-center gap-3">
              <div className="flex flex-1 flex-col leading-snug">
                <label htmlFor={`gasto-${g.key}`} className="text-sm text-fg">
                  {g.label}
                </label>
                <span className="text-xs tabular-nums text-text-muted">
                  {pct(PORCENTAJE_GASTO[g.key])} deducible
                </span>
              </div>
              <input
                id={`gasto-${g.key}`}
                name={`gasto-${g.key}`}
                type="number"
                autoComplete="off"
                min={0}
                step={g.step}
                inputMode="decimal"
                onWheel={soltarFoco}
                className={`${INPUT_BASE} w-24 flex-none px-2 py-1.5 text-sm`}
                value={gastos[g.key]}
                onChange={(e) => setGasto(g.key, e.target.value)}
              />
            </div>
          ))}
          <div className="flex items-center justify-between gap-2 pt-1 text-sm">
            <span className="text-text-muted">Deducción lograda</span>
            <b className="tabular-nums text-accent">
              S/&nbsp;{soles2(r.deduccion3)} de S/&nbsp;{soles0(TOPE_3_UIT)}
            </b>
          </div>
        </div>
      </aside>

      {/* ---------------- resultados ---------------- */}
      <div className="flex min-w-0 flex-col gap-8">
        {/* Los números se rehacen sin que nada tome el foco ni aparezca un
            control nuevo: sin esta región viva, un lector de pantalla no tiene
            forma de saber que el resultado cambió. */}
        <p role="status" aria-live="polite" className="sr-only">
          {anuncio}
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <Tarjeta
            titulo="Impuesto del año"
            prefijo="S/"
            valor={soles0(r.impuesto)}
            nota={`Renta bruta anual S/\u00A0${soles0(r.rentaBrutaAnual)} · ${r.composicionAnual}`}
          />
          <Tarjeta
            titulo="Tasa efectiva"
            valor={r.tasaEfectiva.toFixed(2)}
            sufijo="%"
            tono="flat"
            nota={
              r.impuesto === 0
                ? "No pagas impuesto a la renta con estos datos"
                : `De cada S/\u00A0100 que ganas, S/\u00A0${r.tasaEfectiva.toFixed(2)} van a SUNAT`
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

        <BotonCompartir query={query} />

        {avisos.length > 0 && (
          <div className="flex flex-col gap-3">
            {avisos.map((a) => (
              <Nota key={a.titulo} aviso={a} />
            ))}
          </div>
        )}

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-balance text-fg">Cómo sale el número</h2>
            <p className="mt-1 text-sm text-text-muted">
              El orden es el de la ley: primero la deducción de la categoría, después las 7 UIT y las
              3 UIT, y recién sobre ese saldo corre la escala.
            </p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-line bg-panel">
            <table className="w-full text-sm">
              <thead className="border-b border-line">
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
                      concepto="Deducción del 20\u00A0%"
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
                      concepto={`S/\u00A0${soles2(c.base)} al ${pct(c.tramo.tasa)}`}
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
            <h2 className="text-2xl font-bold tracking-tight text-fg">Dónde cae tu ingreso</h2>
            <p className="mt-1 text-sm text-text-muted">
              La escala es marginal: cada tramo paga su propia tasa, no toda la renta paga la tasa más
              alta que alcanzas.
            </p>
          </div>
          <BarraTramos r={r} />
          <div className="overflow-x-auto rounded-lg border border-line bg-panel">
            <table className="w-full text-sm">
              <thead className="border-b border-line">
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
                    className={`border-b border-line last:border-b-0 ${
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
          <h2 className="text-2xl font-bold tracking-tight text-fg">Qué te toca hacer</h2>
          <ol className="rounded-lg border border-line bg-panel px-6">
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
