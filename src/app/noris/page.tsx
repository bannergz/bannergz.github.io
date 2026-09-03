"use client";

import { useEffect, useRef } from "react";
import { Fraunces, Karla } from "next/font/google";
import { sembrarCampo } from "./campo";
import estilos from "./noris.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["600"],
  variable: "--font-fraunces",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-karla",
  display: "swap",
});

export default function NorisPage() {
  const lienzoRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = lienzoRef.current;
    if (!lienzo) return;
    const campo = sembrarCampo(lienzo);
    return () => campo.destruir();
  }, []);

  // lang="es": la página entera está en español dentro de un <html lang="en">,
  // y sin esto un lector de pantalla le lee la dedicatoria con voz inglesa.
  return (
    <div lang="es" className={`${fraunces.variable} ${karla.variable} ${estilos.campo}`}>
      {/* El campo es decoración: lo que hay que leer es la dedicatoria, y esa
          es texto de verdad, no píxeles. */}
      <canvas ref={lienzoRef} className={estilos.lienzo} aria-hidden="true" />

      <p className={estilos.pista}>Mueve el dedo por el campo &mdash; tú eres el sol</p>

      <div className={estilos.dedicatoria}>
        <p className={`${estilos.mensaje} ${estilos.entra}`}>
          Flores para ti por siempre, mi amorcita bella, te amo{" "}
          <span className={estilos.corazon} aria-hidden="true">
            &hearts;
          </span>
        </p>
        <p className={`${estilos.firma} ${estilos.entra}`}>para Nora &middot; 21 de septiembre</p>
      </div>
    </div>
  );
}
