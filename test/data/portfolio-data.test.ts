import { portfolioData } from "@/data/portfolio-data";

describe("portfolioData", () => {
  it("has the correct name", () => {
    expect(portfolioData.name).toBe("Banner Gonzales");
  });

  it("has the correct title", () => {
    expect(portfolioData.title).toBe(
      "Technical Lead | Software Architect | Fintech Platforms"
    );
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
    expect(portfolioData.experience.length).toBe(4);
    expect(portfolioData.experience[0].company).toBe("Yape");
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
