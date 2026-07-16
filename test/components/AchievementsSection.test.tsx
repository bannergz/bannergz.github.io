import { render, screen } from "@testing-library/react";
import { AchievementsSection } from "@/components/sections/AchievementsSection";

describe("AchievementsSection", () => {
  it("renders the section title", () => {
    render(<AchievementsSection />);
    expect(screen.getByText("Key")).toBeInTheDocument();
    expect(screen.getByText("Achievements")).toBeInTheDocument();
  });

  it("renders achievement metrics", () => {
    render(<AchievementsSection />);
    expect(screen.getByText("5x")).toBeInTheDocument();
    expect(screen.getByText("250%")).toBeInTheDocument();
    expect(screen.getByText("19+")).toBeInTheDocument();
    expect(screen.getByText("60+")).toBeInTheDocument();
    expect(screen.getByText("Org-wide")).toBeInTheDocument();
  });

  it("does not duplicate the hero stats", () => {
    render(<AchievementsSection />);
    expect(screen.queryByText("Millions")).not.toBeInTheDocument();
    expect(screen.queryByText("20+")).not.toBeInTheDocument();
  });
});
