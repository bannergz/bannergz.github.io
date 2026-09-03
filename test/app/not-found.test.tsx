import { render, screen } from "@testing-library/react";
import NotFound, { metadata } from "@/app/not-found";

describe("página 404", () => {
  it("dice qué pasó en un encabezado, no sólo con la cifra", () => {
    render(<NotFound />);
    const h1 = document.querySelector("h1");
    expect(h1?.textContent).toContain("This page doesn");
  });

  it("ofrece la salida que el 404 de fábrica no tiene: volver al inicio", () => {
    render(<NotFound />);
    const inicio = screen.getByRole("link", { name: /back to home/i });
    expect(inicio).toHaveAttribute("href", "/");
  });

  it("apunta también a la otra página real del sitio", () => {
    render(<NotFound />);
    expect(screen.getByRole("link", { name: /calculator/i })).toHaveAttribute(
      "href",
      "/calcula-tus-impuestos",
    );
  });

  it("se titula por lo que pasó, no con el título del portafolio", () => {
    // El `noindex` lo pone Next solo en esta ruta; se verifica en el HTML
    // construido, no acá, para no terminar con dos <meta name="robots">.
    expect(metadata.title).toBe("Page not found");
  });
});
