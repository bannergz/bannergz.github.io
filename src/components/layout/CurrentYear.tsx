"use client";

import { useSyncExternalStore } from "react";

/** El año no cambia mientras la pestaña está abierta: no hay a quién notificar. */
const subscribe = () => () => {};

const getCurrentYear = () => new Date().getFullYear();

/**
 * El sitio es un export estático: `new Date()` en un server component se
 * evalúa en el build y congela el año hasta el siguiente deploy. Este
 * componente sirve el año del build durante SSR e hidratación, y el año
 * real del navegador después, sin mismatch de hidratación.
 */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(
    subscribe,
    getCurrentYear,
    () => buildYear,
  );

  return <>{year}</>;
}
