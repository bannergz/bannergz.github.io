"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { atlasEn } from "@/data/atlas/en";
import type { Atlas, Idioma } from "@/data/atlas/tipos";

/**
 * Cuántas veces hay que repetir la tecla. Cinco es el número: suficiente para
 * que no ocurra escribiendo en el buscador del navegador, corto para que no
 * se sienta un castigo cuando ya entendiste el juego.
 */
export const PULSACIONES = 5;

/** Si dejaste de insistir, no estabas jugando: la racha se cae sola. */
const OLVIDO_MS = 1500;

/**
 * El inglés viaja en el chunk de la página; el español llega recién acá. Para
 * la enorme mayoría de las visitas ese `import()` no ocurre nunca, así que el
 * atlas en español no pesa en la primera carga.
 */
async function cargar(idioma: Idioma): Promise<Atlas> {
  if (idioma === "en") return atlasEn;
  const { atlasEs } = await import("@/data/atlas/es");
  return atlasEs;
}

const otro = (idioma: Idioma): Idioma => (idioma === "en" ? "es" : "en");

export interface CambioDeIdioma {
  atlas: Atlas;
  /** Cuántas pulsaciones lleva la racha en curso, para pintarlas. */
  racha: number;
  /** Suma una pulsación. La usan el teclado y el propio control. */
  pulsar: () => void;
  /** Falso hasta el primer cambio: evita anunciar un idioma que nadie eligió. */
  cambiado: boolean;
}

/**
 * El easter egg de /architecture: repetir una tecla cambia el idioma de la
 * página entera, sin recargar y sin tocar la URL.
 */
export function useCambioDeIdioma(): CambioDeIdioma {
  const [atlas, setAtlas] = useState<Atlas>(atlasEn);
  const [racha, setRacha] = useState(0);
  const [cambiado, setCambiado] = useState(false);
  const olvido = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { idioma } = atlas.ui;
  const { tecla } = atlas.ui.egg;

  const pulsar = useCallback(() => {
    if (olvido.current) clearTimeout(olvido.current);
    olvido.current = setTimeout(() => setRacha(0), OLVIDO_MS);
    setRacha((n) => n + 1);
  }, []);

  useEffect(() => () => {
    if (olvido.current) clearTimeout(olvido.current);
  }, []);

  // Escuchar en `window` y no en la sección: quien juega a esto no tiene por
  // qué haber hecho foco en nada primero.
  useEffect(() => {
    function alTeclear(evento: KeyboardEvent) {
      // Un atajo del navegador o del sistema no es una pulsación del juego.
      if (evento.metaKey || evento.ctrlKey || evento.altKey) return;
      // Mantener la tecla apretada dispararía treinta veces por segundo y
      // dejaría la página saltando de idioma sola: hay que tocar, no apoyar.
      if (evento.repeat) return;

      const destino = evento.target as HTMLElement | null;
      if (destino?.isContentEditable) return;
      const etiqueta = destino?.tagName;
      if (etiqueta === "INPUT" || etiqueta === "TEXTAREA" || etiqueta === "SELECT") {
        return;
      }

      // Sólo las teclas que escriben un carácter cortan la racha: Shift, Tab
      // o una flecha son parte de moverse por la página, no de escribir otra
      // cosa.
      if (evento.key.length !== 1) return;
      if (evento.key.toLowerCase() !== tecla) {
        setRacha(0);
        return;
      }
      pulsar();
    }

    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [tecla, pulsar]);

  useEffect(() => {
    if (racha < PULSACIONES) return;
    let vigente = true;
    void cargar(otro(idioma)).then((proximo) => {
      if (!vigente) return;
      setAtlas(proximo);
      setCambiado(true);
      setRacha(0);
    });
    return () => {
      vigente = false;
    };
  }, [racha, idioma]);

  return { atlas, racha, pulsar, cambiado };
}
