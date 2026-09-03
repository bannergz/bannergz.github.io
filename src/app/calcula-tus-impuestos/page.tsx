import { CalculadoraImpuestos } from "@/components/calculadora/CalculadoraImpuestos";
import { fuentesOficiales, preguntasFrecuentes } from "@/data/calculadora-faq";
import { DEDUCCION_7_UIT, TOPE_3_UIT, UIT, soles0 } from "@/lib/impuestos";

const cifras = [
  { valor: `S/\u00A0${soles0(UIT)}`, etiqueta: "UIT 2026" },
  { valor: `S/\u00A0${soles0(DEDUCCION_7_UIT)}`, etiqueta: "7 UIT libres de impuesto" },
  { valor: `S/\u00A0${soles0(TOPE_3_UIT)}`, etiqueta: "Hasta 3 UIT más por gastos" },
  { valor: "8\u00A0% → 30\u00A0%", etiqueta: "Escala progresiva" },
];

export default function CalculaTusImpuestosPage() {
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
                Impuesto a la Renta · Perú · Ejercicio 2026
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-balance text-fg md:text-5xl lg:text-6xl">
              ¿Cuánto me descuenta <span className="text-accent">SUNAT</span>?
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted">
              Calculadora gratuita del impuesto a la renta de trabajo: pon tu sueldo, elige si estás
              en planilla o emites recibo por honorarios, y mira cuánto pagas, por qué, y qué te toca
              hacer. Con las reglas vigentes y fuentes oficiales, sin registrarte.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-line pt-10 md:grid-cols-4">
              {cifras.map((c) => (
                <div key={c.etiqueta}>
                  <p className="figure whitespace-nowrap text-2xl lg:text-3xl">{c.valor}</p>
                  <p className="col-label mt-2">{c.etiqueta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- calculadora ---------------- */}
      <section id="calculadora" className="bg-ink">
        <div className="section-container">
          <CalculadoraImpuestos />
        </div>
      </section>

      {/* ---------------- preguntas frecuentes ---------------- */}
      <section id="preguntas" className="border-t border-line bg-ink">
        <div className="section-container">
          <h2 className="section-title">Preguntas frecuentes</h2>
          <p className="section-subtitle">
            Lo que la gente busca antes de llegar al número: qué es la UIT, qué son las 7 UIT y cuándo
            hay que declarar.
          </p>
          <dl className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {preguntasFrecuentes.map((f) => (
              <div key={f.pregunta} className="flex flex-col gap-2">
                <dt className="text-lg font-semibold text-fg">{f.pregunta}</dt>
                <dd className="text-base leading-relaxed text-text-muted">{f.respuesta}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- fuentes ---------------- */}
      <section id="fuentes" className="border-t border-line bg-ink">
        <div className="section-container">
          <h2 className="section-title">Fuentes oficiales</h2>
          <p className="section-subtitle">
            Cada regla del cálculo sale de aquí. Si algo cambia, cambia primero en estas páginas.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fuentesOficiales.map((f) => (
              <a
                key={f.url}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="panel-card flex flex-col gap-1"
              >
                <span className="font-semibold text-fg">{f.titulo}</span>
                <span className="text-xs font-medium text-accent">{f.dominio}</span>
                <span className="mt-1 text-sm leading-relaxed text-text-muted">{f.detalle}</span>
              </a>
            ))}
          </div>

          <div className="mt-12 max-w-3xl space-y-3 border-t border-line pt-8 text-sm leading-relaxed text-text-muted">
            <p>
              <b className="font-semibold text-fg">Referencia, no asesoría.</b> El cálculo aplica
              la UIT 2026 de S/&nbsp;5,500 (DS 301-2025-EF), la deducción del 20&nbsp;% con tope de 24 UIT
              (Art. 45.° LIR), las 7 UIT y hasta 3 UIT adicionales (Art. 46.° LIR) y la escala del
              Art. 53.° LIR. Los montos de pago a cuenta y suspensión son los de la RS
              000390-2025/SUNAT: S/&nbsp;4,010 mensuales y S/&nbsp;48,125 anuales.
            </p>
            <p>
              <b className="font-semibold text-fg">Lo que no cubre.</b> Rentas de primera,
              segunda o tercera categoría; CTS y beneficios laborales; ingresos como director,
              mandatario o síndico, que son cuarta categoría pero <b>no</b> tienen la deducción del
              20&nbsp;%. El aporte a AFP es un estimado: la comisión y la prima varían por administradora.
              Para tu caso concreto, confirma con un contador.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
