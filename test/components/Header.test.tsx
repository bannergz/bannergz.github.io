import { render } from "@testing-library/react";
import { Header } from "@/components/layout/Header";

describe("Header", () => {
  it("apunta cada ancla a la home, para que funcione desde una subpágina", () => {
    const { container } = render(<Header />);
    const hrefs = Array.from(container.querySelectorAll("a[href]")).map(
      (a) => a.getAttribute("href") ?? "",
    );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href.startsWith("/")).toBe(true);
    }
    expect(hrefs).toContain("/#contact");
    expect(hrefs).toContain("/");
  });
});
