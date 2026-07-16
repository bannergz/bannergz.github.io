import { portfolioData } from "@/data/portfolio-data";

describe("portfolioData", () => {
  it("has the correct name", () => {
    expect(portfolioData.name).toBe("Banner Gonzales");
  });

  it("has the correct title", () => {
    expect(portfolioData.title).toBe(
      "Software Architect | AI & Agentic Systems | Fintech at Scale"
    );
  });

  it("has a tagline distinct from and shorter than the summary", () => {
    expect(portfolioData.tagline).toBeTruthy();
    expect(portfolioData.tagline).not.toBe(portfolioData.summary);
    expect(portfolioData.tagline.length).toBeLessThan(
      portfolioData.summary.length
    );
  });

  it("leads positioning with AI", () => {
    expect(portfolioData.title).toContain("AI");
    expect(portfolioData.specializations[0]).toBe("Agentic AI Systems");
  });

  it("has four hero stats with unique values (HeroSection keys on value)", () => {
    expect(portfolioData.heroStats).toHaveLength(4);
    const values = portfolioData.heroStats.map((s) => s.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it("leads the hero stats with experience and closes with the AI metric", () => {
    expect(portfolioData.heroStats[0].value).toBe("8+");
    expect(portfolioData.heroStats[3].value).toBe("300%");
    expect(portfolioData.heroStats[3].label).toBe("AI Efficiency Gain");
  });

  it("has valid contact information", () => {
    expect(portfolioData.contact.email).toBe("bannergz1999@gmail.com");
    expect(portfolioData.contact.phone).toBe("+51 994 486 755");
    expect(portfolioData.contact.linkedin).toBe("linkedin.com/in/bannergz");
  });

  it("has skill categories defined", () => {
    expect(portfolioData.skillCategories.length).toBeGreaterThan(0);
    portfolioData.skillCategories.forEach((category) => {
      expect(category.title).toBeDefined();
      expect(category.skills.length).toBeGreaterThan(0);
    });
  });

  it("has experience entries", () => {
    expect(portfolioData.experience.length).toBe(5);
    expect(portfolioData.experience[0].company).toBe("YaVendio");
  });

  it("shows YaVendio as the current role", () => {
    expect(portfolioData.experience[0].role).toBe("Principal Engineer");
    expect(portfolioData.experience[0].period).toContain("Present");
  });

  it("closes the Yape tenure", () => {
    const yape = portfolioData.experience.find((e) => e.company === "Yape");
    expect(yape?.period).toBe("Nov 2022 – Mar 2026");
    expect(yape?.period).not.toContain("Present");
  });

  it("has exactly one current role", () => {
    const current = portfolioData.experience.filter((e) =>
      e.period.includes("Present")
    );
    expect(current).toHaveLength(1);
  });

  it("uses current employer names", () => {
    const companies = portfolioData.experience.map((e) => e.company);
    expect(companies).toContain("NTT DATA");
    expect(companies).not.toContain("Everis Perú");
  });

  it("has unique company names (ExperienceSection keys on company)", () => {
    const companies = portfolioData.experience.map((e) => e.company);
    expect(new Set(companies).size).toBe(companies.length);
  });

  it("never claims authorship of the internal AI harness", () => {
    const highlights = portfolioData.experience.flatMap((e) => e.highlights);
    expect(
      highlights.some((h) => h.includes("Contributor to and power user of"))
    ).toBe(true);
    const harnessClaims = highlights.filter((h) =>
      /(built|authored|created) the .*harness/i.test(h)
    );
    expect(harnessClaims).toEqual([]);
  });

  it("has achievements", () => {
    expect(portfolioData.achievements.length).toBeGreaterThan(0);
  });

  it("has education entries", () => {
    expect(portfolioData.education.length).toBeGreaterThan(0);
  });

  it("has language entries", () => {
    expect(portfolioData.languages.length).toBe(2);
  });
});
