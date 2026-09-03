import { render, screen } from "@testing-library/react";
import { SkillsSection } from "@/components/sections/SkillsSection";

describe("SkillsSection", () => {
  it("renders the section title", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Technical")).toBeInTheDocument();
    expect(screen.getByText("Expertise")).toBeInTheDocument();
  });

  it("renders all skill categories", () => {
    render(<SkillsSection />);
    expect(screen.getByText("AI & Agentic Systems")).toBeInTheDocument();
    expect(screen.getByText("Software Architecture")).toBeInTheDocument();
    expect(screen.getByText("Backend & Frameworks")).toBeInTheDocument();
    expect(screen.getByText("Cloud & Infrastructure")).toBeInTheDocument();
    const observabilityElements = screen.getAllByText("Observability");
    expect(observabilityElements.length).toBeGreaterThan(0);
    expect(screen.getByText("Data & Persistence")).toBeInTheDocument();
    expect(screen.getByText("Testing & Quality")).toBeInTheDocument();
    expect(screen.getByText("Engineering Practices")).toBeInTheDocument();
  });

  it("renders individual skills", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Agentic Workflows")).toBeInTheDocument();
    expect(screen.getByText("Rust")).toBeInTheDocument();
    expect(screen.getByText("Microservices Architecture")).toBeInTheDocument();
    expect(screen.getByText("Java (Spring Boot, Quarkus)")).toBeInTheDocument();
    expect(screen.getByText("AWS")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("TDD / BDD")).toBeInTheDocument();
  });

  it("does not announce the category twice: the emoji is decorative", () => {
    const { container } = render(<SkillsSection />);
    expect(
      screen.getAllByRole("heading", { level: 3, name: "AI & Agentic Systems" }),
    ).toHaveLength(1);
    expect(container.querySelector('[role="img"]')).toBeNull();
  });
});
