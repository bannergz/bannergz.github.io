import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";

describe("Header", () => {
  it("apunta cada ancla a la home, para que funcione desde una subpágina", () => {
    const { container } = render(<Header />);
    const hrefs = Array.from(container.querySelectorAll("a[href]")).map(
      (a) => a.getAttribute("href") ?? "",
    );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href.startsWith("/")).toBe(true);
    }
    expect(hrefs).toContain("/#contact");
    expect(hrefs).toContain("/");
  });

  it("no ofrece anclas a secciones que ya no existen", () => {
    const { container } = render(<Header />);
    const hrefs = Array.from(container.querySelectorAll("a[href]")).map(
      (a) => a.getAttribute("href") ?? "",
    );
    for (const muerta of ["/#about", "/#achievements", "/#education"]) {
      expect(hrefs).not.toContain(muerta);
    }
  });
});

describe("Header · menú móvil", () => {
  it("dice qué elemento controla, no solo que está expandido", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const boton = screen.getByRole("button", { name: "Toggle menu" });
    expect(boton).toHaveAttribute("aria-expanded", "false");

    await user.click(boton);

    expect(boton).toHaveAttribute("aria-expanded", "true");
    const controlado = boton.getAttribute("aria-controls");
    expect(controlado).toBeTruthy();
    // El id declarado tiene que existir de verdad: un aria-controls colgando
    // de la nada es peor que no ponerlo.
    expect(document.getElementById(controlado as string)).toBeInTheDocument();
  });

  it("cierra con Escape y devuelve el foco al botón que lo abrió", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const boton = screen.getByRole("button", { name: "Toggle menu" });
    await user.click(boton);
    const id = boton.getAttribute("aria-controls") as string;
    expect(document.getElementById(id)).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(document.getElementById(id)).toBeNull();
    expect(boton).toHaveAttribute("aria-expanded", "false");
    expect(boton).toHaveFocus();
  });
});
