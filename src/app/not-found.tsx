import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  // El `noindex` no se declara acá: Next ya lo emite solo en esta ruta, y
  // declararlo otra vez deja dos <meta name="robots"> en el mismo <head>.
};

/** Next trae un 404 propio, pero llega sin cabecera, sin pie y sin salida:
 *  quien cae acá se queda mirando una línea de texto negra sobre blanco.
 *  Ledger pone la cifra al frente, así que el 404 es la cifra. */
export default function NotFound() {
  return (
    <section className="section-container flex min-h-[70svh] flex-col justify-center pt-28">
      <p className="col-label">Error</p>
      <p className="figure-accent mt-3 text-7xl leading-none lg:text-8xl">404</p>

      <h1 className="section-title mt-8">This Page Doesn&rsquo;t Exist</h1>
      <p className="section-subtitle">
        The address may be mistyped, or the page may have moved. Everything about my work lives
        on the home page &mdash; experience, skills, and how to reach me.
      </p>

      <div className="flex flex-wrap gap-4">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/calcula-tus-impuestos" className="btn-outline">
          Peru Income Tax Calculator
        </Link>
      </div>
    </section>
  );
}
