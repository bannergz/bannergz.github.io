"use client";

import { useSyncExternalStore } from "react";

/**
 * La barra de direcciones vista como store externo.
 *
 * Es `useSyncExternalStore` y no un efecto por dos razones concretas:
 *
 *  1. El sitio es un export estático. El HTML se pre-renderiza sin query, así
 *     que el snapshot del servidor tiene que ser `""` y el del cliente la URL
 *     real — exactamente el contrato de este hook. Leerla en un efecto sería
 *     `setState` dentro de `useEffect`, que el compilador de React rechaza.
 *  2. `popstate` es un evento externo de verdad: atrás y adelante del navegador
 *     tienen que devolver el cálculo que el visitante estaba mirando.
 *
 * El snapshot se cachea y **sólo** se refresca con `popstate`. Que nuestras
 * propias escrituras no lo muevan es deliberado: si lo movieran, cada tecla
 * cambiaría el `key` del formulario y lo remontaría en pleno tipeo.
 */

const listeners = new Set<() => void>();
let snapshot: string | null = null;

function alPopstate(): void {
  snapshot = window.location.search;
  for (const avisar of listeners) avisar();
}

function subscribe(alCambiar: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("popstate", alPopstate);
  listeners.add(alCambiar);

  return () => {
    listeners.delete(alCambiar);
    if (listeners.size === 0) {
      window.removeEventListener("popstate", alPopstate);
      // Nadie escucha: el caché ya no representa nada y la próxima lectura debe
      // volver a preguntarle a la URL.
      snapshot = null;
    }
  };
}

function getSnapshot(): string {
  snapshot ??= window.location.search;
  return snapshot;
}

/** El HTML estático se sirve sin query: el servidor no la conoce. */
function getServerSnapshot(): string {
  return "";
}

export function useUrlSearch(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Enlace absoluto a la página actual con `search` aplicado. */
export function urlAbsoluta(search: string): string {
  const { origin, pathname, hash } = window.location;
  return `${origin}${pathname}${search}${hash}`;
}

/**
 * `replaceState` y no `pushState`: una entrada de historial por tecla dejaría
 * el botón "atrás" inservible.
 *
 * Los navegadores limitan cuántas veces se puede llamar —Safari lanza
 * `SecurityError` pasadas 100 en 30 s, y mantener pulsada una flecha en un
 * `input type="number"` llega ahí en segundos—. Como el estado real vive en
 * React y la URL es sólo su proyección, que una escritura se pierda atrasa el
 * enlace un momento y nada más.
 */
export function escribirUrlSearch(search: string): void {
  if (search === window.location.search) return;
  try {
    window.history.replaceState(window.history.state, "", urlAbsoluta(search));
  } catch {
    /* El siguiente cambio vuelve a intentarlo. */
  }
}
