"use client";

import { useEffect, useRef, useState } from "react";
import { Fraunces, Karla } from "next/font/google";
import { sembrarCampo, type Campo } from "./campo";
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
  const campoRef = useRef<Campo | null>(null);
  const [animado, setAnimado] = useState(false);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    const lienzo = lienzoRef.current;
    if (!lienzo) return;
    const campo = sembrarCampo(lienzo);
    campoRef.current = campo;
    // El botón sólo existe si hay algo que pausar: sin canvas, o con quietud
    // pedida, el campo ya está detenido y el control sobraría.
    setAnimado(campo.animado());
    return () => {
      campo.destruir();
      campoRef.current = null;
    };
  }, []);

  const alternarPausa = () => {
    const campo = campoRef.current;
    if (!campo) return;
    if (pausado) campo.reanudar();
    else campo.pausar();
    setPausado(!pausado);
  };

  // lang="es": la página entera está en español dentro de un <html lang="en">,
  // y sin esto un lector de pantalla le lee la dedicatoria con voz inglesa.
  return (
    <div lang="es" className={`${fraunces.variable} ${karla.variable} ${estilos.campo}`}>
      {/* El campo es decoración: lo que hay que leer es la dedicatoria, y esa
          es texto de verdad, no píxeles. */}
      <canvas ref={lienzoRef} className={estilos.lienzo} aria-hidden="true" />

      <p className={estilos.pista}>Mueve el dedo por el campo &mdash; tú eres el sol</p>

      <div className={estilos.dedicatoria}>
        {/* Es el título de la página, no un párrafo suelto: sin un h1 esta
            página no aparece en la lista de encabezados de nadie. */}
        <h1 className={`${estilos.mensaje} ${estilos.entra}`}>
          Flores para ti por siempre, mi amorcita bella, te amo{" "}
          <span className={estilos.corazon} aria-hidden="true">
            &hearts;
          </span>
        </h1>
        <p className={`${estilos.firma} ${estilos.entra}`}>para Nora &middot; 21 de septiembre</p>

        {/* El campo se mueve solo y no para: quien lo necesite quieto tiene
            que poder detenerlo, no sólo quien lo pidió en su sistema. */}
        {animado && (
          <button type="button" onClick={alternarPausa} className={estilos.pausa}>
            {pausado ? "Reanudar el campo" : "Pausar el campo"}
          </button>
        )}
      </div>
    </div>
  );
}
