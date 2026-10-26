import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import { portfolioData } from "@/data/portfolio-data";
import { WORK } from "@/data/c4-diagram";

function countOccurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

describe("home page", () => {
  it("renders the long summary exactly once", () => {
    const { container } = render(<Home />);
    expect(countOccurrences(container.textContent ?? "", portfolioData.summary)).toBe(1);
  });

  it("renders the tagline exactly once", () => {
    const { container } = render(<Home />);
    expect(countOccurrences(container.textContent ?? "", portfolioData.tagline)).toBe(1);
  });

  it("carries no stale role copy anywhere on the page", () => {
    const { container } = render(<Home />);
    const text = container.textContent ?? "";
    expect(text).not.toContain("Technical Lead & Software Architect");
    expect(text).not.toContain("Technical Lead or Software Architect");
    expect(text).not.toContain("Senior Technical Lead");
    expect(text).not.toContain("Everis");
  });

  it("reads in the order of the zoom, from context to contact", () => {
    const { container } = render(<Home />);
    const ids = Array.from(container.querySelectorAll("section[id]")).map((s) => s.id);
    expect(ids).toEqual(["hero", "about", "career", "work", "figures", "tools", "contact"]);
  });

  it("keeps every figure, role, education and language from the data layer", () => {
    const { container } = render(<Home />);
    const text = container.textContent ?? "";
    portfolioData.achievements.forEach((a) => expect(text).toContain(a.metric));
    portfolioData.experience.forEach((job) => {
      expect(text).toContain(job.company);
      job.highlights.forEach((h) => expect(text).toContain(h));
    });
    expect(text).toContain(portfolioData.education[0].institution);
    expect(text).toContain(portfolioData.languages[0].language);
  });

  it("links to both free tools and the CV", () => {
    render(<Home />);
    expect(screen.getAllByRole("link", { name: /Software Architecture Atlas/ })[0]).toHaveAttribute(
      "href",
      "/architecture",
    );
    expect(screen.getAllByRole("link", { name: /income-tax calculator|Impuesto a la Renta/ })[0]).toHaveAttribute(
      "href",
      "/calcula-tus-impuestos",
    );
    expect(screen.getByRole("link", { name: "Download my CV" })).toHaveAttribute("download");
  });

  // Same hedge as the data layer: the harness is contributed to, not authored.
  it("labels the harness as a contribution in the work index", () => {
    const harness = WORK.find((w) => w.key === "harness");
    expect(harness?.meta).toMatch(/^Contributor/);
    expect(harness?.tag).toMatch(/Contributor/);
  });
});

describe("home page · the C4 diagram", () => {
  const pressed = () =>
    within(screen.getByRole("group", { name: "Zoom level" }))
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-pressed") === "true")
      .map((b) => b.textContent);

  it("starts at the system context and zooms with its buttons", async () => {
    const user = userEvent.setup();
    render(<Home />);
    expect(pressed()).toEqual(["1"]);

    await user.click(screen.getByRole("button", { name: /^Level 2/ }));
    expect(pressed()).toEqual(["2"]);
    expect(screen.getByText(/· Containers: the career/)).toBeInTheDocument();
  });

  it("zooms to the components when a work item is pointed at", async () => {
    const user = userEvent.setup();
    render(<Home />);
    const portal = screen.getByRole("link", { name: /Developer portal/ });

    await user.hover(portal);

    expect(pressed()).toEqual(["3"]);
    expect(portal).toHaveAttribute("aria-current", "true");
  });
});
