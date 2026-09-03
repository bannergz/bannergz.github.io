import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";

describe("Header", () => {
  it("nombra su landmark: la página tiene dos navegaciones", () => {
    render(<Header />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });

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
  it("controla un elemento que existe también con el menú cerrado", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const boton = screen.getByRole("button", { name: "Toggle menu" });
    const controlado = boton.getAttribute("aria-controls");
    expect(controlado).toBeTruthy();

    // Cerrado: el destino ya está en el DOM, solo oculto. Un aria-controls
    // que apunta a un id inexistente no controla nada.
    const menu = document.getElementById(controlado as string);
    expect(menu).toBeInTheDocument();
    expect(menu).not.toBeVisible();
    expect(boton).toHaveAttribute("aria-expanded", "false");

    await user.click(boton);

    expect(boton).toHaveAttribute("aria-expanded", "true");
    expect(menu).toBeVisible();
  });

  it("cierra con Escape y devuelve el foco al botón que lo abrió", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const boton = screen.getByRole("button", { name: "Toggle menu" });
    await user.click(boton);
    const menu = document.getElementById(boton.getAttribute("aria-controls") as string);
    expect(menu).toBeVisible();

    await user.keyboard("{Escape}");

    expect(menu).not.toBeVisible();
    expect(boton).toHaveAttribute("aria-expanded", "false");
    expect(boton).toHaveFocus();
  });
});
