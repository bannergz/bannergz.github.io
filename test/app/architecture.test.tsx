import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArchitecturePage from "@/app/architecture/page";
import { metadata } from "@/app/architecture/layout";
import { atlasEn } from "@/data/atlas/en";
import { atlasEs } from "@/data/atlas/es";
import { contarPatrones } from "@/data/atlas/tipos";
import { SITE_URL } from "@/lib/site";

const RUTA = "/architecture";

const h1 = () => document.querySelector("h1")?.textContent ?? "";

describe("página /architecture", () => {
  it("abre en inglés, que es el idioma del sitio", () => {
    render(<ArchitecturePage />);
    expect(h1()).toContain("Software architecture atlas");
  });

  it("declara el idioma en el nodo y no en <html>, porque puede cambiar", () => {
    const { container } = render(<ArchitecturePage />);
    expect(container.querySelector('[lang="en"]')).not.toBeNull();
    expect(container.querySelector('[lang="es"]')).toBeNull();
  });

  it("renderiza las seis familias de patrones y los principios", () => {
    const { container } = render(<ArchitecturePage />);
    const text = container.textContent ?? "";
    expect(atlasEn.familias).toHaveLength(6);
    for (const familia of atlasEn.familias) {
      expect(text).toContain(familia.titulo);
      for (const patron of familia.patrones) {
        expect(text).toContain(patron.nombre);
      }
    }
    for (const principio of atlasEn.principios) {
      expect(text).toContain(principio.nombre);
    }
  });

  it("renderiza las trampas y las diez preguntas como texto indexable", () => {
    const { container } = render(<ArchitecturePage />);
    const text = container.textContent ?? "";
    expect(atlasEn.preguntas).toHaveLength(10);
    for (const trampa of atlasEn.trampas) {
      expect(text).toContain(trampa.nombre);
    }
    for (const pregunta of atlasEn.preguntas) {
      expect(text).toContain(pregunta.pregunta);
    }
  });

  it("cuenta los patrones en vez de escribir la cifra a mano", () => {
    const { container } = render(<ArchitecturePage />);
    expect(container.textContent).toContain(String(contarPatrones(atlasEn)));
  });

  it("da a cada sección un ancla estable para volver a ella", () => {
    const { container } = render(<ArchitecturePage />);
    for (const familia of atlasEn.familias) {
      expect(container.querySelector(`#${familia.id}`)).not.toBeNull();
    }
    for (const id of ["mapa", "escalera", "principios", "trampas", "preguntas"]) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
  });
});

describe("el easter egg del idioma", () => {
  it("cambia a español al repetir la ese cinco veces", async () => {
    const usuario = userEvent.setup();
    const { container } = render(<ArchitecturePage />);

    await usuario.keyboard("sssss");

    expect(await screen.findByText(atlasEs.preguntas[0].pregunta)).toBeInTheDocument();
    expect(h1()).toContain("Atlas de arquitectura");
    expect(container.querySelector('[lang="es"]')).not.toBeNull();
  });

  it("vuelve al inglés repitiendo la tecla que ofrece la versión española", async () => {
    const usuario = userEvent.setup();
    const { container } = render(<ArchitecturePage />);

    await usuario.keyboard("sssss");
    await screen.findByText(atlasEs.preguntas[0].pregunta);
    await usuario.keyboard("eeeee");

    expect(await screen.findByText(atlasEn.preguntas[0].pregunta)).toBeInTheDocument();
    expect(container.querySelector('[lang="es"]')).toBeNull();
  });

  it("no cambia con cuatro: cinco es cinco", async () => {
    const usuario = userEvent.setup();
    render(<ArchitecturePage />);

    await usuario.keyboard("ssss");

    expect(h1()).toContain("Software architecture atlas");
  });

  it("cualquier otra letra corta la racha", async () => {
    const usuario = userEvent.setup();
    render(<ArchitecturePage />);

    // Tres, un tropiezo, y tres más: escribir en la página no debería
    // cambiarle el idioma a nadie sin querer.
    await usuario.keyboard("sssxsss");

    expect(h1()).toContain("Software architecture atlas");
  });

  it("ignora la tecla mantenida: hay que tocar, no apoyarse", () => {
    render(<ArchitecturePage />);

    // Con autorrepetición esto dispararía decenas de veces por segundo y la
    // página quedaría saltando de idioma sola.
    for (let i = 0; i < 10; i += 1) {
      fireEvent.keyDown(window, { key: "s", repeat: true });
    }

    expect(h1()).toContain("Software architecture atlas");
  });

  it("ignora la tecla cuando viene con un modificador: es un atajo, no el juego", () => {
    render(<ArchitecturePage />);

    for (let i = 0; i < 5; i += 1) {
      fireEvent.keyDown(window, { key: "s", ctrlKey: true });
    }

    expect(h1()).toContain("Software architecture atlas");
  });

  it("también se activa tocando el control, porque en un teléfono no hay teclado", async () => {
    const usuario = userEvent.setup();
    render(<ArchitecturePage />);

    const control = screen.getByRole("button", {
      name: atlasEn.ui.egg.instruccion,
    });
    for (let i = 0; i < 5; i += 1) {
      await usuario.click(control);
    }

    expect(await screen.findByText(atlasEs.preguntas[0].pregunta)).toBeInTheDocument();
  });

  it("no anuncia ningún idioma hasta que alguien lo haya elegido", async () => {
    const usuario = userEvent.setup();
    render(<ArchitecturePage />);

    expect(screen.queryByRole("status")).toBeNull();

    await usuario.keyboard("sssss");
    await screen.findByText(atlasEs.preguntas[0].pregunta);

    expect(screen.getByRole("status")).toHaveTextContent(atlasEs.ui.egg.anuncio);
  });
});

describe("metadata de /architecture", () => {
  it("es indexable y canónica en la ruta pedida", () => {
    expect(metadata.robots).toBeUndefined();
    expect(metadata.alternates?.canonical).toBe(RUTA);
  });

  it("tiene título y descripción de largo razonable para buscadores", () => {
    expect(String(metadata.title)).toContain("Software architecture atlas");
    const description = String(metadata.description);
    expect(description.length).toBeGreaterThanOrEqual(80);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("describe la versión inglesa, que es la única que un crawler ve", () => {
    // El español llega por JavaScript y sólo si alguien encuentra el egg:
    // anunciarlo acá sería prometer un contenido que el crawler no alcanza.
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og.locale).toBe("en_US");
    expect(og.url).toBe(`${SITE_URL}${RUTA}`);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("cuenta los patrones en la descripción en vez de escribir la cifra", () => {
    expect(String(metadata.description)).toContain(String(contarPatrones(atlasEn)));
  });
});
