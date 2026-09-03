import { metadata } from "@/app/layout";
import { portfolioData } from "@/data/portfolio-data";
import { SITE_URL } from "@/lib/site";

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

  it("declares the custom domain, not the github.io origin it redirects from", () => {
    // github.io 301s to the custom domain: declaring it canonical points
    // crawlers and link unfurlers at a URL that only redirects back.
    expect(SITE_URL).toBe("https://www.bannergonzales.com");
    // `metadataBase` se declara `string | URL | null`, y solo `URL` tiene
    // `origin`: se estrecha con la propia aserción antes de leerlo.
    const base = metadata.metadataBase;
    expect(base).toBeInstanceOf(URL);
    expect((base as URL).origin).toBe(SITE_URL);
    expect(metadata.openGraph?.url).toBe(SITE_URL);
    expect(JSON.stringify(metadata)).not.toContain("github.io");
  });

  it("has OpenGraph with an image", () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.images).toBeDefined();
  });

  it("has a Twitter card", () => {
    expect(metadata.twitter).toBeDefined();
  });
});
