import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NorisPage from "@/app/noris/page";
import { sembrarCampo } from "@/app/noris/campo";

/** Un contexto 2D de mentira: jsdom no trae canvas, y lo que interesa probar
 *  es que el motor dibuje y que se apague, no cómo se ve. */
function contextoFalso() {
  const llamadas: string[] = [];
  const degradado = { addColorStop: () => {} };
  const ctx = new Proxy(
    {},
    {
      get(_destino, prop) {
        if (prop === "createLinearGradient" || prop === "createRadialGradient") {
          return () => degradado;
        }
        return () => {
          llamadas.push(String(prop));
        };
      },
      set: () => true,
    },
  );
  return { ctx, llamadas };
}

function usarContexto(ctx: unknown) {
  HTMLCanvasElement.prototype.getContext = (() => ctx) as HTMLCanvasElement["getContext"];
}

describe("página de Noris", () => {
  it("deja la dedicatoria como texto, no como píxeles del canvas", () => {
    render(<NorisPage />);

    expect(
      screen.getByText(/Flores para ti por siempre, mi amorcita bella, te amo/),
    ).toBeInTheDocument();
    expect(screen.getByText(/para Nora/)).toBeInTheDocument();
  });

  it("la dedicatoria es el h1: es el título de la página, no un párrafo", () => {
    const { container } = render(<NorisPage />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toContain("Flores para ti por siempre");
  });

  it("declara el contenido en español aunque el sitio esté en inglés", () => {
    // Sin esto la dedicatoria se lee con voz inglesa, que es justo la página
    // donde más importa: es lo único que Nora va a escuchar.
    const { container } = render(<NorisPage />);
    expect(container.querySelector('[lang="es"]')).not.toBeNull();
  });

  it("esconde el campo de los lectores de pantalla: es decoración", () => {
    const { container } = render(<NorisPage />);
    const lienzo = container.querySelector("canvas");
    expect(lienzo).toHaveAttribute("aria-hidden", "true");
  });

  it("se monta y se desmonta sin canvas disponible", () => {
    const { unmount } = render(<NorisPage />);
    expect(() => unmount()).not.toThrow();
  });
});

describe("página de Noris · pausa", () => {
  const original = HTMLCanvasElement.prototype.getContext;
  const consultaOriginal = window.matchMedia;

  function fingirNavegador(quietud: boolean) {
    const { ctx } = contextoFalso();
    usarContexto(ctx);
    window.matchMedia = ((consulta: string) => ({
      matches: quietud && consulta.includes("prefers-reduced-motion"),
      media: consulta,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
  }

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = original;
    window.matchMedia = consultaOriginal;
  });

  it("ofrece detener el campo, que si no se mueve solo y para siempre", async () => {
    const user = userEvent.setup();
    fingirNavegador(false);
    render(<NorisPage />);

    const boton = screen.getByRole("button", { name: /pausar el campo/i });
    await user.click(boton);
    expect(screen.getByRole("button", { name: /reanudar el campo/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reanudar el campo/i }));
    expect(screen.getByRole("button", { name: /pausar el campo/i })).toBeInTheDocument();
  });

  it("no ofrece pausa donde ya está quieto: no habría nada que detener", () => {
    fingirNavegador(true);
    render(<NorisPage />);
    expect(screen.queryByRole("button", { name: /pausar el campo/i })).not.toBeInTheDocument();
  });

  it("tampoco donde no hay canvas", () => {
    usarContexto(null);
    render(<NorisPage />);
    expect(screen.queryByRole("button", { name: /pausar/i })).not.toBeInTheDocument();
  });
});

describe("campo de girasoles", () => {
  const original = HTMLCanvasElement.prototype.getContext;
  const consultaOriginal = window.matchMedia;

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = original;
    window.matchMedia = consultaOriginal;
    jest.restoreAllMocks();
  });

  it("no rompe donde no hay contexto 2D", () => {
    usarContexto(null);
    const campo = sembrarCampo(document.createElement("canvas"));
    expect(() => campo.destruir()).not.toThrow();
  });

  it("con movimiento reducido pinta un solo cuadro, ya florecido y sin bucle", () => {
    const { ctx, llamadas } = contextoFalso();
    usarContexto(ctx);
    // Quien pidió menos movimiento ve el campo entero, quieto, de una vez.
    window.matchMedia = ((consulta: string) => ({
      matches: consulta.includes("prefers-reduced-motion"),
      media: consulta,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    const pedirCuadro = jest.spyOn(window, "requestAnimationFrame");

    const campo = sembrarCampo(document.createElement("canvas"));

    expect(llamadas).toContain("fillRect");
    expect(llamadas).toContain("arc");
    expect(llamadas).toContain("quadraticCurveTo");
    expect(pedirCuadro).not.toHaveBeenCalled();
    campo.destruir();
  });

  it("sin esa preferencia arranca el bucle de animación", () => {
    const { ctx } = contextoFalso();
    usarContexto(ctx);
    const pedirCuadro = jest.spyOn(window, "requestAnimationFrame");

    const campo = sembrarCampo(document.createElement("canvas"));

    expect(pedirCuadro).toHaveBeenCalled();
    campo.destruir();
  });

  it("pausar corta el bucle y reanudar lo vuelve a pedir", () => {
    const { ctx } = contextoFalso();
    usarContexto(ctx);
    const cancelar = jest.spyOn(window, "cancelAnimationFrame");
    const pedirCuadro = jest.spyOn(window, "requestAnimationFrame");

    const campo = sembrarCampo(document.createElement("canvas"));
    const pedidosAlArrancar = pedirCuadro.mock.calls.length;

    campo.pausar();
    expect(cancelar).toHaveBeenCalled();
    expect(pedirCuadro.mock.calls.length).toBe(pedidosAlArrancar);

    campo.reanudar();
    expect(pedirCuadro.mock.calls.length).toBeGreaterThan(pedidosAlArrancar);
    campo.destruir();
  });

  it("escucha la preferencia de movimiento y la suelta al destruirse", () => {
    const { ctx } = contextoFalso();
    usarContexto(ctx);
    const escuchar = jest.fn();
    const soltar = jest.fn();
    // La preferencia puede cambiar con la página abierta: leerla sólo al
    // montar dejaba el campo moviéndose después de pedir quietud.
    window.matchMedia = ((consulta: string) => ({
      matches: false,
      media: consulta,
      addEventListener: escuchar,
      removeEventListener: soltar,
    })) as unknown as typeof window.matchMedia;

    const campo = sembrarCampo(document.createElement("canvas"));
    expect(escuchar).toHaveBeenCalledWith("change", expect.any(Function));

    campo.destruir();
    expect(soltar).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("apaga el bucle y suelta los listeners al destruirse", () => {
    const { ctx } = contextoFalso();
    usarContexto(ctx);
    const cancelar = jest.spyOn(window, "cancelAnimationFrame");
    const soltar = jest.spyOn(window, "removeEventListener");

    // El original dejaba el requestAnimationFrame corriendo después de salir
    // de la página: el bucle seguía repintando un canvas que ya no existía.
    sembrarCampo(document.createElement("canvas")).destruir();

    expect(cancelar).toHaveBeenCalled();
    const eventos = soltar.mock.calls.map((c) => c[0]);
    expect(eventos).toEqual(expect.arrayContaining(["pointermove", "pointerdown", "resize"]));
  });
});
