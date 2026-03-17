import { render, screen } from "@testing-library/react";
import { ContactSection } from "@/components/sections/ContactSection";

describe("ContactSection", () => {
  it("renders the section title", () => {
    render(<ContactSection />);
    expect(screen.getByText("Together")).toBeInTheDocument();
  });

  it("renders email contact", () => {
    render(<ContactSection />);
    const emails = screen.getAllByText("bannergz1999@gmail.com");
    expect(emails.length).toBeGreaterThan(0);
  });

  it("renders phone contact", () => {
    render(<ContactSection />);
    expect(screen.getByText("+51 994 486 755")).toBeInTheDocument();
  });

  it("renders LinkedIn link", () => {
    render(<ContactSection />);
    const linkedinLinks = screen.getAllByText("LinkedIn Profile");
    expect(linkedinLinks.length).toBeGreaterThan(0);
  });
});
