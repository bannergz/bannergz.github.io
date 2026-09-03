import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LayoutContent } from "@/app/layout-content";

let rutaActual = "/";
jest.mock("next/navigation", () => ({ usePathname: () => rutaActual }));

describe("LayoutContent · saltar al contenido", () => {
  beforeEach(() => {
    rutaActual = "/";
  });

  it("ofrece el salto como primer elemento tabulable de la página", async () => {
    const user = userEvent.setup();
    render(
      <LayoutContent>
        <p>contenido</p>
      </LayoutContent>,
    );

    await user.tab();

    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveFocus();
  });

  it("apunta a un <main> que existe y puede recibir el foco", () => {
    const { container } = render(
      <LayoutContent>
        <p>contenido</p>
      </LayoutContent>,
    );

    const salto = screen.getByRole("link", { name: "Skip to content" });
    const destino = salto.getAttribute("href")?.slice(1) as string;

    const main = container.querySelector("main");
    expect(main).toHaveAttribute("id", destino);
    // Sin tabIndex, varios navegadores mueven el scroll pero dejan el foco
    // donde estaba, y el siguiente tabulador vuelve a la navegación.
    expect(main).toHaveAttribute("tabindex", "-1");
  });

  it("no pone el enlace en /noris, que no tiene navegación que saltar", () => {
    rutaActual = "/noris";
    render(
      <LayoutContent>
        <p>contenido</p>
      </LayoutContent>,
    );

    expect(screen.queryByRole("link", { name: "Skip to content" })).not.toBeInTheDocument();
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
  });
});
