import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/components/sections/HeroSection";
import { portfolioData } from "@/data/portfolio-data";

describe("HeroSection", () => {
  it("renders the name", () => {
    render(<HeroSection />);
    expect(screen.getByText("Banner Gonzales")).toBeInTheDocument();
  });

  it("renders the title", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(
        "Software Architect | AI & Agentic Systems | Fintech at Scale"
      )
    ).toBeInTheDocument();
  });

  it("renders the tagline, not the long summary", () => {
    render(<HeroSection />);
    expect(screen.getByText(portfolioData.tagline)).toBeInTheDocument();
    expect(screen.queryByText(portfolioData.summary)).not.toBeInTheDocument();
  });

  it("renders availability badge", () => {
    render(<HeroSection />);
    expect(
      screen.getByText("Available for new opportunities")
    ).toBeInTheDocument();
  });

  it("renders a single primary CTA plus secondary actions", () => {
    render(<HeroSection />);
    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
    expect(screen.getByText("Download CV")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn profile")).toBeInTheDocument();
  });

  it("drops the redundant View Experience CTA", () => {
    render(<HeroSection />);
    expect(screen.queryByText("View Experience")).not.toBeInTheDocument();
  });

  it("renders every hero stat from the data layer", () => {
    render(<HeroSection />);
    portfolioData.heroStats.forEach((stat) => {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    });
  });

  it("renders the AI stat that carries the positioning", () => {
    render(<HeroSection />);
    expect(screen.getByText("300%")).toBeInTheDocument();
    expect(screen.getByText("AI Efficiency Gain")).toBeInTheDocument();
  });
});
