import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalculadoraImpuestos } from "@/components/calculadora/CalculadoraImpuestos";

describe("CalculadoraImpuestos", () => {
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
    await user.click(screen.getByRole("button", { name: "Dólares" }));
    expect(screen.getByLabelText("Tipo de cambio")).toHaveValue(3.36);
  });

  it("recalcula al cambiar a recibo por honorarios y muestra los pasos del 616", async () => {
    const user = userEvent.setup();
    const { container } = render(<CalculadoraImpuestos />);
    await user.click(screen.getByRole("button", { name: "Recibo por honorarios" }));
    await user.click(screen.getByRole("button", { name: "Dólares" }));
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

  it("marca el botón activo de cada grupo con aria-pressed", () => {
    render(<CalculadoraImpuestos />);
    expect(screen.getByRole("button", { name: "Planilla" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Recibo por honorarios" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
