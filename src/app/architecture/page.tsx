import type { CSSProperties } from "react";
import {
  escalones,
  estaciones,
  familias,
  preguntas,
  principios,
  totalPatrones,
  trampas,
} from "@/data/atlas-arquitectura";

/**
 * Índice fijo de la página. Vive acá y no en el dato porque mezcla secciones
 * de contenido (las familias) con secciones de estructura (el mapa, la
 * escalera): es navegación, no atlas.
 */
const INDICE: ReadonlyArray<{ href: string; label: string }> = [
  { href: "#mapa", label: "Mapa" },
  { href: "#escalera", label: "Escalera" },
  ...familias.map((f) => ({ href: `#${f.id}`, label: `${f.numero} · ${f.abrev}` })),
  { href: "#principios", label: "07 · Principios" },
  { href: "#trampas", label: "Trampas" },
  { href: "#preguntas", label: "Las 10 preguntas" },
];

const PARA_QUE: ReadonlyArray<{ titulo: string; texto: string }> = [
  {
    titulo: "Qué es",
    texto:
      "Un catálogo de los patrones que existen, qué resuelve cada uno, qué cuesta y cuándo no usarlo.",
  },
  {
    titulo: "Para qué",
    texto:
      "Para que la decisión de diseño sea explícita antes del código, en vez de tomarse por omisión.",
  },
  {
    titulo: "Cómo se lee",
    texto:
      "Buscá la estación donde duele, entrá a la familia, leé la ficha. Después contestá las diez preguntas.",
  },
  {
    titulo: "Qué no es",
    texto:
      "Una lista de cosas para agregar. La mitad del atlas existe para justificar no usar la otra mitad.",
  },
];

/* --------------------------------------------------------------------------
   Estilos de los dos diagramas.

   Van en `style` y no en clases de Tailwind a propósito: `fill` y `stroke`
   son propiedades que el sitio no usa en ningún otro lado, y resolver la
   variable del tema directamente deja el SVG inmune al orden del CSS
   generado.
   -------------------------------------------------------------------------- */
const CAJA: CSSProperties = {
  fill: "var(--color-panel-hi)",
  stroke: "var(--color-line-hi)",
  strokeWidth: 1.2,
};
const FICHA: CSSProperties = {
  fill: "var(--color-panel)",
  stroke: "var(--color-line)",
  strokeWidth: 1.1,
};
const FICHA_DURABLE: CSSProperties = {
  fill: "var(--color-panel-hi)",
  stroke: "var(--color-accent)",
  strokeWidth: 1.4,
};
const TEXTO: CSSProperties = { fill: "var(--color-fg)" };
const TEXTO_TENUE: CSSProperties = { fill: "var(--color-text-muted)" };
const TEXTO_ACENTO: CSSProperties = { fill: "var(--color-accent)" };
const TRAZO: CSSProperties = {
  stroke: "var(--color-text-muted)",
  strokeWidth: 1.6,
  fill: "none",
};

/** Coordenadas del mapa: cuatro estaciones en fila y dos que cuelgan del trabajo. */
const POSICIONES = [
  { x: 20, y: 92 },
  { x: 255, y: 92 },
  { x: 490, y: 92 },
  { x: 725, y: 92 },
  { x: 960, y: 32 },
  { x: 960, y: 262 },
] as const;

function MapaEstaciones() {
  return (
    <svg
      viewBox="0 0 1160 448"
      role="img"
      aria-label="El camino de un evento externo por seis estaciones: origen, borde, amortiguador y trabajo en fila, y desde el trabajo dos ramas, una hacia el estado y otra hacia la salida a terceros. Cada estación lista los patrones que viven en ella."
      className="block h-auto w-full min-w-[900px]"
    >
      <defs>
        <marker
          id="atlas-flecha"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" style={TEXTO_TENUE} />
        </marker>
      </defs>

      <text x="20" y="30" style={TEXTO} className="text-[15px] font-semibold">
        El camino de un evento externo
      </text>
      <text x="20" y="52" style={TEXTO_TENUE} className="text-[12.5px]">
        de un webhook de un tercero hasta el dato ya indexado
      </text>

      <line x1="200" y1="115" x2="251" y2="115" style={TRAZO} markerEnd="url(#atlas-flecha)" />
      <line x1="435" y1="115" x2="486" y2="115" style={TRAZO} markerEnd="url(#atlas-flecha)" />
      <line x1="670" y1="115" x2="721" y2="115" style={TRAZO} markerEnd="url(#atlas-flecha)" />
      <path d="M905,115 H932 V55 H956" style={TRAZO} markerEnd="url(#atlas-flecha)" />
      <path d="M905,115 H932 V285 H956" style={TRAZO} markerEnd="url(#atlas-flecha)" />

      <text x="225" y="106" textAnchor="middle" style={TEXTO_TENUE} className="font-mono text-[10px]">
        empuja
      </text>
      <text x="460" y="106" textAnchor="middle" style={TEXTO_TENUE} className="font-mono text-[10px]">
        acepta
      </text>
      <text x="695" y="106" textAnchor="middle" style={TEXTO_TENUE} className="font-mono text-[10px]">
        entrega
      </text>
      <text x="960" y="24" style={TEXTO_TENUE} className="font-mono text-[10px]">
        escribe
      </text>
      <text x="960" y="254" style={TEXTO_TENUE} className="font-mono text-[10px]">
        llama a terceros
      </text>

      {estaciones.map((estacion, i) => {
        const { x, y } = POSICIONES[i];
        return (
          <g key={estacion.numero}>
            <rect x={x} y={y} width="180" height="46" rx="3" style={CAJA} />
            <text
              x={x + 12}
              y={y + 20}
              style={TEXTO_ACENTO}
              className="font-mono text-[10px] font-semibold tracking-[0.08em]"
            >
              {estacion.numero}
            </text>
            <text x={x + 12} y={y + 37} style={TEXTO} className="text-[14.5px] font-semibold">
              {estacion.nombre}
            </text>
            {estacion.patrones.map((patron, j) => (
              <g key={patron}>
                <rect
                  x={x}
                  y={y + 60 + j * 30}
                  width="180"
                  height="24"
                  rx="3"
                  style={FICHA}
                />
                <text
                  x={x + 11}
                  y={y + 76 + j * 30}
                  style={TEXTO}
                  className="text-[11.5px]"
                >
                  {patron}
                </text>
              </g>
            ))}
          </g>
        );
      })}

      <line
        x1="20"
        y1="376"
        x2="905"
        y2="376"
        style={{ stroke: "var(--color-line-hi)", strokeWidth: 1.2 }}
        strokeDasharray="3 4"
      />
      <text x="20" y="398" style={TEXTO_TENUE} className="font-mono text-[10px]">
        atraviesan las seis: observabilidad (traza, métrica, log)
      </text>
      <text x="20" y="414" style={TEXTO_TENUE} className="font-mono text-[10px]">
        feature flags · idempotencia · contratos versionados
      </text>
    </svg>
  );
}

/** Parte un nombre largo en dos líneas para que entre en el ancho del escalón. */
function dosLineas(texto: string): [string, string] {
  if (texto.length <= 18) return [texto, ""];
  const corte = texto.lastIndexOf(" ", Math.ceil(texto.length / 2));
  if (corte <= 0) return [texto, ""];
  return [texto.slice(0, corte), texto.slice(corte + 1)];
}

/** Por debajo de este índice el trabajo vive en memoria y muere con el proceso. */
const PRIMER_ESCALON_DURABLE = 3;

function EscaleraAcoplamiento() {
  return (
    <svg
      viewBox="0 0 1060 420"
      role="img"
      aria-label="Escalera de seis escalones que sube de izquierda a derecha: llamada síncrona directa, más timeout y reintento, más circuit breaker, cola de trabajo durable, evento publicado y workflow durable. Una línea vertical punteada entre el tercer y el cuarto escalón marca la frontera de durabilidad: a la izquierda el trabajo muere con el proceso."
      className="block h-auto w-full min-w-[860px]"
    >
      <defs>
        <marker
          id="atlas-eje"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" style={TEXTO_TENUE} />
        </marker>
      </defs>

      <path
        d="M36,376 V70"
        style={{ stroke: "var(--color-line-hi)", strokeWidth: 1.2, fill: "none" }}
        markerEnd="url(#atlas-eje)"
      />
      <path
        d="M36,376 H1034"
        style={{ stroke: "var(--color-line-hi)", strokeWidth: 1.2, fill: "none" }}
        markerEnd="url(#atlas-eje)"
      />
      <text x="30" y="62" style={TEXTO_TENUE} className="font-mono text-[10px]">
        ↑ lo que sobrevive a una caída
      </text>
      <text x="1030" y="398" textAnchor="end" style={TEXTO_TENUE} className="font-mono text-[10px]">
        lo que cuesta operarlo →
      </text>

      <line
        x1="530"
        y1="64"
        x2="530"
        y2="376"
        style={{ stroke: "var(--color-accent)", strokeWidth: 1.4 }}
        strokeDasharray="5 4"
      />
      <text
        x="530"
        y="34"
        textAnchor="middle"
        style={TEXTO_ACENTO}
        className="font-mono text-[10px] font-semibold tracking-[0.08em]"
      >
        FRONTERA DE DURABILIDAD
      </text>
      <text x="530" y="52" textAnchor="middle" style={TEXTO_TENUE} className="text-[11px]">
        a la izquierda, el trabajo vive en memoria y muere con el proceso
      </text>

      {escalones.map((escalon, i) => {
        const x = 56 + i * 160;
        const y = 330 - i * 46;
        const durable = i >= PRIMER_ESCALON_DURABLE;
        const [linea1, linea2] = dosLineas(escalon.nombre);
        return (
          <g key={escalon.nivel}>
            <rect
              x={x}
              y={y}
              width="148"
              height="32"
              rx="3"
              style={durable ? FICHA_DURABLE : FICHA}
            />
            <text
              x={x + 10}
              y={y + 20}
              style={durable ? TEXTO_ACENTO : TEXTO_TENUE}
              className="font-mono text-[10px] font-semibold"
            >
              {escalon.nivel}
            </text>
            <text
              x={x + 74}
              y={y - 17}
              textAnchor="middle"
              style={TEXTO}
              className="text-[12px] font-medium"
            >
              {linea1}
            </text>
            {linea2 ? (
              <text
                x={x + 74}
                y={y - 4}
                textAnchor="middle"
                style={TEXTO_TENUE}
                className="text-[11px]"
              >
                {linea2}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

const CIFRAS = [
  { valor: String(totalPatrones), etiqueta: "Patrones y principios" },
  { valor: String(familias.length + 1), etiqueta: "Familias" },
  { valor: String(estaciones.length), etiqueta: "Estaciones del camino" },
  { valor: String(preguntas.length), etiqueta: "Preguntas antes de codear" },
];

export default function ArchitecturePage() {
  return (
    <div lang="es">
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/8 blur-3xl" />
        </div>

        <div className="section-container relative z-10 pt-32 pb-14">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-positive" />
              <span className="text-sm font-medium text-accent">
                Referencia de trabajo · en español
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-balance text-fg md:text-5xl lg:text-6xl">
              Atlas de <span className="text-accent">arquitectura</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted">
              El mapa de decisiones que se toman antes de escribir la primera línea: qué patrones
              existen, dónde vive cada uno, qué cuesta y cuándo <em>no</em> usarlo. No es una lista
              de cosas para agregar — es el vocabulario para discutir un diseño antes de
              implementarlo.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-line pt-10 md:grid-cols-4">
              {CIFRAS.map((c) => (
                <div key={c.etiqueta}>
                  <p className="figure text-2xl lg:text-3xl">{c.valor}</p>
                  <p className="col-label mt-2">{c.etiqueta}</p>
                </div>
              ))}
            </div>

            <dl className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
              {PARA_QUE.map((item) => (
                <div key={item.titulo} className="bg-panel p-5">
                  <dt className="col-label">{item.titulo}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-text-muted">{item.texto}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------- índice ---------------- */}
      <nav
        aria-label="Secciones del atlas"
        className="sticky top-[76px] z-40 border-y border-line bg-ink/95 backdrop-blur-md"
      >
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 py-2 lg:px-8">
          {INDICE.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="col-label block rounded-sm px-3 py-2 whitespace-nowrap transition-colors hover:bg-panel hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ---------------- el mapa ---------------- */}
      <section id="mapa" className="scroll-mt-36 bg-ink">
        <div className="section-container py-16">
          <span className="col-label text-accent">El mapa</span>
          <h2 className="section-title mt-3">Dónde vive cada patrón</h2>
          <p className="section-subtitle">
            Casi todo lo que entra a un sistema recorre las mismas seis estaciones. Cada patrón
            pertenece a una: si sabés en qué estación duele, sabés en qué familia buscar.
          </p>
          <figure>
            <div className="overflow-x-auto rounded-lg border border-line bg-panel p-5">
              <MapaEstaciones />
            </div>
            <figcaption className="mt-4 max-w-3xl text-sm leading-relaxed text-text-muted">
              Las estaciones no son opcionales: un evento las atraviesa todas, aunque una esté
              vacía. Una estación vacía no es una estación que no existe — es una decisión que
              nadie tomó, y se nota recién con carga.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------- la escalera ---------------- */}
      <section id="escalera" className="scroll-mt-36 border-t border-line bg-ink">
        <div className="section-container py-16">
          <span className="col-label text-accent">La escalera</span>
          <h2 className="section-title mt-3">
            Acoplamiento: cada escalón compra durabilidad y cobra operación
          </h2>
          <p className="section-subtitle">
            La discusión «¿lo hacemos asíncrono?» casi nunca es binaria. Son seis escalones, y el
            trabajo del diseño es elegir <em>cuál</em>, no subir hasta arriba porque suena moderno.
          </p>

          <figure>
            <div className="overflow-x-auto rounded-lg border border-line bg-panel p-5">
              <EscaleraAcoplamiento />
            </div>
            <figcaption className="mt-4 max-w-3xl text-sm leading-relaxed text-text-muted">
              La línea punteada es la única frontera que importa de verdad:{" "}
              <b className="font-semibold text-fg">
                a su izquierda el trabajo vive en la memoria de un proceso
              </b>{" "}
              y desaparece con un reinicio, un OOM o un redeploy. Subir un escalón de más cuesta
              operación real; quedarse abajo cuando el negocio no tolera perder el evento cuesta un
              incidente.
            </figcaption>
          </figure>

          <div className="mt-8 overflow-x-auto rounded-lg border border-line bg-panel">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line-hi bg-panel-hi">
                  <th className="col-label px-4 py-3 text-left">Escalón</th>
                  <th className="col-label px-4 py-3 text-left">Qué sobrevive</th>
                  <th className="col-label px-4 py-3 text-left">Qué pagás</th>
                  <th className="col-label px-4 py-3 text-left">Cuándo es la respuesta correcta</th>
                </tr>
              </thead>
              <tbody>
                {escalones.map((escalon) => (
                  <tr key={escalon.nivel} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-3 align-top">
                      <span className="figure-accent text-xs">{escalon.nivel}</span>
                      <span className="mt-1 block text-sm font-medium text-fg">
                        {escalon.nombre}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-text-muted">{escalon.sobrevive}</td>
                    <td className="px-4 py-3 align-top text-text-muted">{escalon.cuesta}</td>
                    <td className="px-4 py-3 align-top text-text-muted">{escalon.cuando}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------------- el catálogo ---------------- */}
      {familias.map((familia) => (
        <section
          key={familia.id}
          id={familia.id}
          className="scroll-mt-36 border-t border-line bg-ink"
        >
          <div className="section-container py-16">
            <span className="col-label text-accent">Familia {familia.numero}</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-balance text-fg lg:text-3xl">
              {familia.titulo}{" "}
              <span className="font-normal text-text-muted">— {familia.pregunta}</span>
            </h2>
            <p className="section-subtitle mt-4">{familia.intro}</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {familia.patrones.map((patron) => (
                <article key={patron.nombre} className="panel-card flex flex-col gap-2">
                  <h3 className="font-mono text-sm font-semibold tracking-tight text-accent">
                    {patron.nombre}
                  </h3>
                  <p className="text-sm leading-relaxed text-fg">{patron.que}</p>
                  {patron.trampa ? (
                    <p className="mt-auto pt-1 text-xs leading-relaxed text-text-muted">
                      <span aria-hidden="true" className="text-accent-dim">
                        ↳{" "}
                      </span>
                      {patron.trampa}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ---------------- principios ---------------- */}
      <section id="principios" className="scroll-mt-36 border-t border-line bg-ink">
        <div className="section-container py-16">
          <span className="col-label text-accent">Familia 07</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-balance text-fg lg:text-3xl">
            Principios{" "}
            <span className="font-normal text-text-muted">
              — lo que aplica aunque no elijas ningún patrón
            </span>
          </h2>
          <p className="section-subtitle mt-4">
            Los patrones se eligen; los principios se respetan. Son los que aparecen una y otra vez
            en las revisiones de código.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {principios.map((principio) => (
              <div
                key={principio.nombre}
                className="rounded-lg border border-line bg-panel px-4 py-3"
              >
                <p className="font-mono text-xs font-semibold text-accent">{principio.nombre}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{principio.que}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- trampas ---------------- */}
      <section id="trampas" className="scroll-mt-36 border-t border-line bg-ink">
        <div className="section-container py-16">
          <span className="col-label text-accent">Antipatrones</span>
          <h2 className="section-title mt-3">Trampas: patrones que se eligen sin darse cuenta</h2>
          <p className="section-subtitle">
            Un antipatrón casi nunca se elige a propósito. Aparece por omisión, cuando nadie hizo la
            pregunta. Estos son los que más caro salen.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trampas.map((trampa) => (
              <article key={trampa.nombre} className="panel-card flex flex-col gap-2">
                <h3 className="font-mono text-sm font-semibold text-negative">{trampa.nombre}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{trampa.que}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- las diez preguntas ---------------- */}
      <section id="preguntas" className="scroll-mt-36 border-t border-line bg-ink">
        <div className="section-container py-16">
          <span className="col-label text-accent">El checklist</span>
          <h2 className="section-title mt-3">Las diez preguntas, antes de abrir el editor</h2>
          <p className="section-subtitle">
            Diez respuestas escritas, de una o dos líneas cada una. Si una respuesta es «no sé»,
            medirla es lo primero que hay que hacer.
          </p>

          <ol className="overflow-hidden rounded-lg border border-line bg-panel">
            {preguntas.map((pregunta, i) => (
              <li
                key={pregunta.pregunta}
                className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line px-5 py-4 last:border-b-0"
              >
                <span className="figure-accent pt-0.5 text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block">
                  <b className="block text-base font-semibold text-fg">{pregunta.pregunta}</b>
                  <span className="mt-1 block text-sm leading-relaxed text-text-muted">
                    {pregunta.porQue}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-10 max-w-3xl rounded-lg border border-line-hi bg-panel-hi p-6">
            <p className="text-base leading-relaxed text-fg">
              El objetivo no es ceremonia. Es que la conversación de arquitectura ocurra antes del
              código y quede escrita, para que dentro de seis meses se pueda leer por qué el sistema
              es como es.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Ninguna de estas diez preguntas es cara de contestar. Todas son carísimas de contestar
              tarde.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
