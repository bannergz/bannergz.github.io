"use client";

import type { Interfaz } from "@/data/atlas/tipos";
import { PULSACIONES } from "@/hooks/useCambioDeIdioma";

const TECLAS = Array.from({ length: PULSACIONES }, (_, i) => i);

interface Props {
  egg: Interfaz["egg"];
  racha: number;
  cambiado: boolean;
  onPulsar: () => void;
}

/**
 * La pista del easter egg, al pie del atlas.
 *
 * No dice «cambiar idioma»: muestra la tecla y se va encendiendo mientras la
 * repetís, así que el mecanismo se entiende jugándolo. Y es un botón de
 * verdad, no un adorno: en un teléfono no hay teclado que espamear, y una
 * página que esconde la mitad de su contenido detrás de una tecla física
 * dejaría afuera a media visita.
 */
export function CambioDeIdioma({ egg, racha, cambiado, onPulsar }: Props) {
  const encendidas = Math.min(racha, PULSACIONES);

  return (
    <section className="border-t border-line bg-ink">
      <div className="section-container flex flex-col items-center gap-3 py-12">
        <button
          type="button"
          onClick={onPulsar}
          aria-label={egg.instruccion}
          className="group flex flex-wrap items-center justify-center gap-x-3 gap-y-3 rounded-md px-3 py-2"
        >
          <span className="flex gap-1.5">
            {TECLAS.map((i) => {
              const encendida = i < encendidas;
              return (
                <kbd
                  key={i}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-[5px] border font-mono text-xs font-semibold transition duration-150 motion-reduce:transition-none ${
                    encendida
                      ? "-translate-y-0.5 border-accent bg-accent text-on-accent motion-reduce:translate-y-0"
                      : "border-line-hi bg-panel text-text-muted group-hover:border-accent-dim"
                  }`}
                >
                  {egg.tecla}
                </kbd>
              );
            })}
          </span>
          <span className="text-sm text-text-muted transition-colors group-hover:text-fg">
            {egg.invitacion}
          </span>
        </button>

        {/* Sólo después del primer cambio: si viviera desde el arranque, un
            lector de pantalla anunciaría al cargar un idioma que nadie eligió. */}
        {cambiado ? (
          <p role="status" className="sr-only">
            {egg.anuncio}
          </p>
        ) : null}
      </div>
    </section>
  );
}
