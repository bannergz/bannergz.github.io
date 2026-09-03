import { render } from "@testing-library/react";
import Home from "@/app/page";
import { portfolioData } from "@/data/portfolio-data";

function countOccurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

describe("home page", () => {
  it("renders the long summary exactly once", () => {
    const { container } = render(<Home />);
    expect(countOccurrences(container.textContent ?? "", portfolioData.summary)).toBe(1);
  });

  it("renders the tagline exactly once", () => {
    const { container } = render(<Home />);
    expect(countOccurrences(container.textContent ?? "", portfolioData.tagline)).toBe(1);
  });

  it("carries no stale role copy anywhere on the page", () => {
    const { container } = render(<Home />);
    const text = container.textContent ?? "";
    expect(text).not.toContain("Technical Lead & Software Architect");
    expect(text).not.toContain("Technical Lead or Software Architect");
    expect(text).not.toContain("Senior Technical Lead");
    expect(text).not.toContain("Everis");
  });

  it("son cuatro secciones y ninguna de las podadas sobrevive", () => {
    const { container } = render(<Home />);
    const ids = Array.from(container.querySelectorAll("section[id]")).map((s) => s.id);
    expect(ids).toEqual(["hero", "experience", "skills", "contact"]);
    for (const podada of ["about", "achievements", "education"]) {
      expect(ids).not.toContain(podada);
    }
  });

  it("no pierde por el camino lo que las secciones podadas contaban", () => {
    const { container } = render(<Home />);
    const texto = container.textContent ?? "";
    // Cada cifra de Achievements y la ficha de Education siguen en la página,
    // solo que dentro de la sección que les da contexto.
    portfolioData.achievements.forEach((logro) =>
      expect(texto).toContain(logro.metric),
    );
    expect(texto).toContain(portfolioData.education[0].institution);
    expect(texto).toContain(portfolioData.languages[0].language);
  });
});
