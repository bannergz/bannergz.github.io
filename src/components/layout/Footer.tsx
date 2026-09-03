import Link from "next/link";
import { portfolioData } from "@/data/portfolio-data";
import { CurrentYear } from "./CurrentYear";

export function Footer() {
  const { name, title, contact } = portfolioData;
  const buildYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-panel pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] text-fg">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div>
            <p className="font-mono text-xl font-semibold">
              BG<span className="text-accent">.</span>
            </p>
            <p className="mt-1 text-sm text-text-muted">
              {name} &mdash; {title}
            </p>
          </div>

          <nav aria-label="Free tools">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Free tools
            </p>
            <ul className="mt-3">
              <li>
                <Link
                  href="/calcula-tus-impuestos"
                  hrefLang="es"
                  className="text-sm font-medium text-fg transition-colors hover:text-accent"
                >
                  Calculadora de Impuesto a la Renta 2026 &mdash; ¿cuánto me descuenta SUNAT?
                </Link>
                <p className="mt-1 text-xs text-text-muted">
                  Planilla o recibo por honorarios, UIT 2026 y gastos deducibles (Perú)
                </p>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-6">
            <a
              href={`https://${contact.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted transition-colors hover:text-accent"
              aria-label="LinkedIn"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="text-text-muted transition-colors hover:text-accent"
              aria-label="Email"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            <a
              href="https://github.com/bannergz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted transition-colors hover:text-accent"
              aria-label="GitHub"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.914.832.091-.647.35-1.088.636-1.34-2.22-.253-4.555-1.111-4.555-4.945 0-1.091.39-1.984 1.029-2.683-.103-.253-.447-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.853.004 1.71.115 2.513.338 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.688-4.563 4.938.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .269.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-8 text-center">
          <p className="text-sm text-text-muted">
            &copy; <CurrentYear buildYear={buildYear} /> {name}. All rights reserved. Built with Next.js
            &amp; Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
