import { render } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { portfolioData } from "@/data/portfolio-data";

describe("Footer", () => {
  it("renders the title from the data layer, not a hardcoded string", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain(portfolioData.title);
  });

  it("renders the name", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain(portfolioData.name);
  });

  it("carries no stale hardcoded role", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).not.toContain(
      "Technical Lead & Software Architect"
    );
  });
});

describe("Footer tools", () => {
  it("links to the tax calculator with descriptive Spanish anchor text", () => {
    const { container } = render(<Footer />);
    const link = container.querySelector('a[href="/calcula-tus-impuestos"]');
    expect(link).not.toBeNull();
    expect(link?.textContent).toMatch(/SUNAT/);
    expect(link?.getAttribute("hreflang")).toBe("es");
  });
});

describe("Footer reference", () => {
  it("links to the architecture atlas with descriptive anchor text", () => {
    const { container } = render(<Footer />);
    const link = container.querySelector('a[href="/architecture"]');
    expect(link).not.toBeNull();
    expect(link?.textContent).toMatch(/Software Architecture Atlas/);
  });

  it("carries no hreflang on the atlas: it is English, like the rest of the site", () => {
    const { container } = render(<Footer />);
    const link = container.querySelector('a[href="/architecture"]');
    expect(link?.getAttribute("hreflang")).toBeNull();
  });
});
