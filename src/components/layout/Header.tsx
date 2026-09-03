"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAV_LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#contact", label: "Contact" },
];

/** El botón lo declara en `aria-controls`, así que tiene que ser estable. */
const MENU_ID = "menu-principal";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);

  // Abierto, el menú tapa la página entera. Sin Escape, quien navega con
  // teclado solo sale volviendo al botón que lo abrió.
  useEffect(() => {
    if (!isMenuOpen) return;

    const alPulsar = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsMenuOpen(false);
      // El foco vuelve a donde estaba: cerrar no debe soltarlo al inicio.
      botonRef.current?.focus();
    };

    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-line bg-ink/90 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] backdrop-blur-md">
      {/* Con nombre: la página tiene dos landmarks de navegación y sin
          etiqueta se anuncian iguales. */}
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8"
      >
        <Link
          href="/"
          className="font-mono text-xl font-semibold tracking-tight text-fg"
        >
          BG<span className="text-accent">.</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-text-muted transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#contact" className="btn-primary text-sm">
              Hire Me
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          ref={botonRef}
          type="button"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls={MENU_ID}
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6 text-fg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu. Se renderiza siempre y se oculta con `hidden`: un
          `aria-controls` que apunta a un id inexistente no controla nada. */}
      <div
        id={MENU_ID}
        hidden={!isMenuOpen}
        className="border-t border-line bg-panel md:hidden"
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-sm px-4 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-panel-hi hover:text-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2">
            <Link
              href="/#contact"
              className="btn-primary w-full justify-center text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Hire Me
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
