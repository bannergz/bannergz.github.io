import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/components/sections/HeroSection";

describe("HeroSection", () => {
  it("renders the name", () => {
    render(<HeroSection />);
    expect(screen.getByText("Banner Gonzales")).toBeInTheDocument();
  });

  it("renders the title", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(
        "Technical Lead | Software Architect | Fintech Platforms"
      )
    ).toBeInTheDocument();
  });

  it("renders availability badge", () => {
    render(<HeroSection />);
    expect(
      screen.getByText("Available for new opportunities")
    ).toBeInTheDocument();
  });

  it("renders call-to-action buttons", () => {
    render(<HeroSection />);
    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("View Experience")).toBeInTheDocument();
  });

  it("renders stats", () => {
    render(<HeroSection />);
    expect(screen.getByText("8+")).toBeInTheDocument();
    expect(screen.getByText("Years Experience")).toBeInTheDocument();
    expect(screen.getByText("20+")).toBeInTheDocument();
    expect(screen.getByText("Enterprise APIs")).toBeInTheDocument();
  });
});
