import { render, screen } from "@testing-library/react";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { portfolioData } from "@/data/portfolio-data";

describe("ExperienceSection", () => {
  it("renders the section title", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Professional")).toBeInTheDocument();
    expect(screen.getByText("Experience")).toBeInTheDocument();
  });

  it("renders all companies", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("YaVendio")).toBeInTheDocument();
    expect(screen.getByText("Yape")).toBeInTheDocument();
    expect(screen.getByText("Globant Perú")).toBeInTheDocument();
    expect(screen.getByText("NTT DATA")).toBeInTheDocument();
    expect(screen.getByText("IBM")).toBeInTheDocument();
  });

  it("badges exactly one role as current", () => {
    render(<ExperienceSection />);
    expect(screen.getAllByText("Current")).toHaveLength(1);
  });

  it("renders job roles", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Principal Engineer")).toBeInTheDocument();
    const techLeadElements = screen.getAllByText("Software Technical Lead");
    expect(techLeadElements).toHaveLength(2);
    expect(
      screen.getByText("Software Application Java Developer")
    ).toBeInTheDocument();
  });

  it("lleva las cifras que antes eran su propia sección", () => {
    render(<ExperienceSection />);
    portfolioData.achievements.forEach((logro) => {
      expect(screen.getByText(logro.metric)).toBeInTheDocument();
      expect(screen.getByText(logro.description)).toBeInTheDocument();
    });
  });

  it("abre con el resumen profesional, no con una bajada genérica", () => {
    const { container } = render(<ExperienceSection />);
    expect(container.textContent).toContain(portfolioData.summary);
  });
});
