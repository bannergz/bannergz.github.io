import { render } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { portfolioData } from "@/data/portfolio-data";

describe("Footer", () => {
  it("renders the title from the data layer, not a hardcoded string", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain(portfolioData.title);
  });

  it("renders the name", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain(portfolioData.name);
  });

  it("carries no stale hardcoded role", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).not.toContain(
      "Technical Lead & Software Architect"
    );
  });
});
