import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalculadoraImpuestos } from "@/components/calculadora/CalculadoraImpuestos";

describe("CalculadoraImpuestos", () => {
  // El estado vive en la URL: sin esto, el enlace que escribe un test entra
  // como estado inicial del siguiente.
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("abre con un caso real ya calculado: S/ 5,000 en planilla con 14 sueldos", () => {
    const { container } = render(<CalculadoraImpuestos />);
    const text = container.textContent ?? "";
    expect(screen.getByLabelText("Ingreso bruto mensual")).toHaveValue(5000);
    expect(text).toContain("2,886");
    expect(text).toContain("Te queda al mes");
    expect(text).toContain("4,115");
  });

  it("muestra el tipo de cambio solo cuando el ingreso es en dólares", async () => {
    const user = userEvent.setup();
    render(<CalculadoraImpuestos />);
    expect(screen.queryByLabelText("Tipo de cambio")).not.toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Dólares" }));
    expect(screen.getByLabelText("Tipo de cambio")).toHaveValue(3.36);
  });

  it("recalcula al cambiar a recibo por honorarios y muestra los pasos del 616", async () => {
    const user = userEvent.setup();
    const { container } = render(<CalculadoraImpuestos />);
    await user.click(screen.getByRole("radio", { name: "Recibo por honorarios" }));
    await user.click(screen.getByRole("radio", { name: "Dólares" }));
    const monto = screen.getByLabelText("Ingreso bruto mensual");
    await user.clear(monto);
    await user.type(monto, "4000");
    const text = container.textContent ?? "";
    expect(text).toContain("11,023");
    expect(text).toContain("Te devuelven al final");
    expect(text).toContain("1,879");
    expect(text).toContain("Formulario Virtual 616");
    expect(text).toContain("3041");
    expect(screen.queryByLabelText("Aporte previsional")).not.toBeInTheDocument();
  });

  it("avisa cuando los gastos superan el tope de 3 UIT", async () => {
    const user = userEvent.setup();
    const { container } = render(<CalculadoraImpuestos />);
    const alquiler = screen.getByLabelText("Alquiler");
    await user.clear(alquiler);
    await user.type(alquiler, "60000");
    expect(container.textContent).toContain("Tope de 3 UIT alcanzado");
  });

  it("marca la opción activa de cada grupo con aria-checked", () => {
    render(<CalculadoraImpuestos />);
    expect(screen.getByRole("radio", { name: "Planilla" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Recibo por honorarios" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });
});

describe("CalculadoraImpuestos · teclado y autocompletado", () => {
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("recorre el grupo con las flechas: un radiogroup no se navega con Tab", async () => {
    const user = userEvent.setup();
    render(<CalculadoraImpuestos />);

    const planilla = screen.getByRole("radio", { name: "Planilla" });
    planilla.focus();
    await user.keyboard("{ArrowRight}");

    const honorarios = screen.getByRole("radio", { name: "Recibo por honorarios" });
    expect(honorarios).toHaveAttribute("aria-checked", "true");
    // El foco tiene que acompañar: si se queda atrás, la flecha siguiente
    // parte del botón equivocado.
    expect(honorarios).toHaveFocus();
  });

  it("da la vuelta al final del grupo", async () => {
    const user = userEvent.setup();
    render(<CalculadoraImpuestos />);

    screen.getByRole("radio", { name: "Planilla" }).focus();
    await user.keyboard("{ArrowLeft}");

    expect(screen.getByRole("radio", { name: "Recibo por honorarios" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("solo la opción activa es tabulable", () => {
    render(<CalculadoraImpuestos />);
    expect(screen.getByRole("radio", { name: "Planilla" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "Recibo por honorarios" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("no invita al gestor de contraseñas: los campos llevan name y autocomplete off", () => {
    const { container } = render(<CalculadoraImpuestos />);
    const campos = container.querySelectorAll("input, select");
    expect(campos.length).toBeGreaterThan(0);
    for (const campo of campos) {
      expect(campo).toHaveAttribute("name");
      expect(campo).toHaveAttribute("autocomplete", "off");
    }
  });
});

describe("CalculadoraImpuestos · enlace compartible", () => {
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("abre con los valores del enlace", () => {
    window.history.replaceState(null, "", "/calcula-tus-impuestos/?monto=12000&regimen=cuarta");
    render(<CalculadoraImpuestos />);

    expect(screen.getByLabelText("Ingreso bruto mensual")).toHaveValue(12000);
    expect(screen.getByRole("radio", { name: "Recibo por honorarios" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("un enlace manipulado no rompe el render: cae a los valores por defecto", () => {
    window.history.replaceState(null, "", "/?monto=-1&pension=0.5&regimen=tercera");
    render(<CalculadoraImpuestos />);

    expect(screen.getByLabelText("Ingreso bruto mensual")).toHaveValue(5000);
    expect(screen.getByLabelText("Aporte previsional")).toHaveValue("0.129");
  });

  it("lleva a la URL lo que el usuario cambia", async () => {
    const user = userEvent.setup();
    render(<CalculadoraImpuestos />);

    const monto = screen.getByLabelText("Ingreso bruto mensual");
    await user.clear(monto);
    await user.type(monto, "12000");

    await waitFor(() => expect(window.location.search).toBe("?monto=12000"), { timeout: 2000 });
  });

  it("copia el enlace del cálculo", async () => {
    // userEvent instala su propio portapapeles: se lee de ahí, no de un espía.
    const user = userEvent.setup();
    render(<CalculadoraImpuestos />);

    await user.click(screen.getByRole("radio", { name: "Recibo por honorarios" }));
    await user.click(screen.getByRole("button", { name: /copiar enlace/i }));

    expect(await navigator.clipboard.readText()).toContain("?regimen=cuarta");
    expect(await screen.findByText("Enlace copiado.")).toBeInTheDocument();
  });
});

describe("CalculadoraImpuestos · lectores de pantalla", () => {
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("publica el resultado en una región viva desde el primer render", () => {
    render(<CalculadoraImpuestos />);

    const region = screen.getByText(/Impuesto del año: .+ soles\./);
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region.textContent).toContain("Tasa efectiva:");
    expect(region.textContent).toContain("Te queda al mes:");
  });

  it("anuncia el resultado nuevo cuando el usuario deja de escribir", async () => {
    const user = userEvent.setup();
    render(<CalculadoraImpuestos />);

    const alquiler = screen.getByLabelText("Alquiler");
    await user.clear(alquiler);
    await user.type(alquiler, "60000");

    await waitFor(
      () =>
        expect(screen.getByText(/Impuesto del año:/).textContent).toContain(
          "Tope de 3 UIT alcanzado",
        ),
      { timeout: 3000 },
    );
  });
});

describe("CalculadoraImpuestos - rueda del mouse", () => {
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("no deja que un scroll cambie el monto: el campo suelta el foco", () => {
    render(<CalculadoraImpuestos />);

    const monto = screen.getByLabelText("Ingreso bruto mensual");
    monto.focus();
    expect(monto).toHaveFocus();

    fireEvent.wheel(monto);

    expect(monto).not.toHaveFocus();
    expect(monto).toHaveValue(5000);
  });
});
