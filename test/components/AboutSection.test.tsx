import { render } from "@testing-library/react";
import { AboutSection } from "@/components/sections/AboutSection";
import { portfolioData } from "@/data/portfolio-data";

describe("AboutSection", () => {
  it("renders the long summary", () => {
    const { container } = render(<AboutSection />);
    expect(container.textContent).toContain(portfolioData.summary);
  });

  it("does not ask for a role below the current one", () => {
    const { container } = render(<AboutSection />);
    expect(container.textContent).not.toContain("Senior Technical Lead");
    expect(container.textContent).toContain("Principal Engineer");
  });
});
