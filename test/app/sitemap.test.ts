import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/site";

describe("sitemap", () => {
  it("lista la home y la calculadora, nada más", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toEqual([`${SITE_URL}/`, `${SITE_URL}/calcula-tus-impuestos`]);
  });
});
