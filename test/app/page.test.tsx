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
    expect(text).not.toContain("Senior Technical Lead");
    expect(text).not.toContain("Everis");
  });
});
