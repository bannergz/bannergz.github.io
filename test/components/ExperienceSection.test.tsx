import { render, screen } from "@testing-library/react";
import { ExperienceSection } from "@/components/sections/ExperienceSection";

describe("ExperienceSection", () => {
  it("renders the section title", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Professional")).toBeInTheDocument();
    expect(screen.getByText("Experience")).toBeInTheDocument();
  });

  it("renders all companies", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Yape")).toBeInTheDocument();
    expect(screen.getByText("Globant Perú")).toBeInTheDocument();
    expect(screen.getByText("Everis Perú")).toBeInTheDocument();
    expect(screen.getByText("IBM Perú")).toBeInTheDocument();
  });

  it("renders current position badge", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("renders job roles", () => {
    render(<ExperienceSection />);
    const techLeadElements = screen.getAllByText("Software Technical Lead");
    expect(techLeadElements).toHaveLength(2);
    expect(
      screen.getByText("Software Application Java Developer")
    ).toBeInTheDocument();
  });
});
