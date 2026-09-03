"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNoris = pathname.startsWith("/noris");

  if (isNoris) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Primer tabulador de la pagina: sin esto, el teclado recorre la
          navegacion entera antes de llegar al contenido, en cada pagina. */}
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[60] -translate-y-[300%] rounded-sm bg-accent px-4 py-2 font-semibold text-on-accent focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      {/* tabIndex -1: algunos navegadores mueven el scroll pero no el foco si
          el destino del salto no es enfocable. */}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
