import type { Metadata, Viewport } from "next";

/** El resto del sitio es tinta oscura; esta página es un cielo. Sin esto la
 *  barra del navegador queda negra encima del azul. */
export const viewport: Viewport = {
  themeColor: "#4a5f9e",
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: "Noris",
  description: undefined,
  robots: { index: false, follow: false },
  alternates: { canonical: "/noris" },
  openGraph: {
    title: "Noris",
    description: undefined,
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Noris",
    description: undefined,
    images: [],
  },
};

export default function NorisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
