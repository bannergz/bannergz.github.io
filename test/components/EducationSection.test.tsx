import { render, screen } from "@testing-library/react";
import { EducationSection } from "@/components/sections/EducationSection";
import { portfolioData } from "@/data/portfolio-data";

describe("EducationSection", () => {
  it("renders the formal education entry", () => {
    const { container } = render(<EducationSection />);
    expect(container.textContent).toContain(portfolioData.education[0].degree);
    expect(container.textContent).toContain(
      portfolioData.education[0].institution
    );
  });

  it("claims no certifications or courses the CV does not list", () => {
    const { container } = render(<EducationSection />);
    expect(container.textContent).not.toMatch(/certification/i);
    expect(container.textContent).not.toMatch(/course/i);
  });

  it("does not render specializations as credentials", () => {
    const { container } = render(<EducationSection />);
    portfolioData.specializations.forEach((spec) => {
      expect(container.textContent).not.toContain(spec);
    });
  });

  it("does not skip a heading level under the section h2", () => {
    render(<EducationSection />);
    expect(
      screen.getByRole("heading", { level: 3, name: portfolioData.education[0].degree }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 4 })).not.toBeInTheDocument();
  });
});
