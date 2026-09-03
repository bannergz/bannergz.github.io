import { render, screen } from "@testing-library/react";
import { ContactSection } from "@/components/sections/ContactSection";

describe("ContactSection", () => {
  it("renders the section title", () => {
    render(<ContactSection />);
    expect(screen.getByText("Together")).toBeInTheDocument();
  });

  it("renders email contact", () => {
    render(<ContactSection />);
    const emails = screen.getAllByText("bannergz1999@gmail.com");
    expect(emails.length).toBeGreaterThan(0);
  });

  it("renders phone contact", () => {
    render(<ContactSection />);
    expect(screen.getByText("+51 994 486 755")).toBeInTheDocument();
  });

  it("renders LinkedIn link", () => {
    render(<ContactSection />);
    const linkedinLinks = screen.getAllByText("LinkedIn Profile");
    expect(linkedinLinks.length).toBeGreaterThan(0);
  });

  it("makes the phone dialable: the tel: href drops the spaces", () => {
    render(<ContactSection />);
    expect(screen.getByRole("link", { name: "+51 994 486 755" })).toHaveAttribute(
      "href",
      "tel:+51994486755",
    );
  });

  it("makes the email card actionable, not just readable", () => {
    render(<ContactSection />);
    const emails = screen.getAllByRole("link", { name: "bannergz1999@gmail.com" });
    expect(emails.length).toBeGreaterThan(1);
    emails.forEach((link) =>
      expect(link).toHaveAttribute("href", "mailto:bannergz1999@gmail.com"),
    );
  });

  it("hides the decorative icons: every one sits next to its own label", () => {
    const { container } = render(<ContactSection />);
    const iconos = container.querySelectorAll("svg");
    expect(iconos.length).toBeGreaterThan(0);
    iconos.forEach((icono) => expect(icono).toHaveAttribute("aria-hidden", "true"));
  });
});
