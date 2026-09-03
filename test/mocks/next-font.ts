/**
 * Mock de `next/font/google`.
 *
 * Un export por familia usada en la app: los imports son con nombre, y tanto
 * jest como tsc tienen que verlos. Al cambiar de tipografía se agrega la línea
 * correspondiente acá — si falta, la suite falla con
 * "(0 , google_1.X) is not a function".
 */
type FontLoader = (options?: { variable?: string }) => {
  variable: string;
  className: string;
  style: { fontFamily: string };
};

const mockFont = (family: string, fallbackVar: string): FontLoader => {
  return (options = {}) => ({
    variable: options.variable ?? fallbackVar,
    className: `font-${fallbackVar.replace("--font-", "")}`,
    style: { fontFamily: family },
  });
};

export const Archivo = mockFont("Archivo", "--font-archivo");
export const IBM_Plex_Mono = mockFont("IBM Plex Mono", "--font-plex-mono");
