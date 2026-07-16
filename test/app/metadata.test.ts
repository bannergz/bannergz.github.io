import { metadata } from "@/app/layout";
import { portfolioData } from "@/data/portfolio-data";

describe("root metadata", () => {
  it("has a title containing the name", () => {
    expect(String(metadata.title)).toContain(portfolioData.name);
  });

  it("has a non-empty description", () => {
    expect(metadata.description).toBeTruthy();
    expect(metadata.description).toBe(portfolioData.tagline);
  });

  it("has a metadataBase so relative asset URLs resolve", () => {
    expect(metadata.metadataBase).toBeInstanceOf(URL);
  });

  it("has OpenGraph with an image", () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.images).toBeDefined();
  });

  it("has a Twitter card", () => {
    expect(metadata.twitter).toBeDefined();
  });
});
