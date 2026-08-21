/**
 * Canonical origin of the deployed site.
 *
 * This is the custom domain, NOT the github.io origin that GitHub Pages
 * serves from: `bannergz.github.io` issues a 301 to this host, so declaring
 * it as canonical points search engines and link unfurlers at a URL that only
 * redirects back here.
 *
 * Every absolute URL the site emits — canonical, Open Graph, Twitter card,
 * JSON-LD, robots.txt and sitemap.xml — resolves from this one constant so
 * they cannot drift apart again.
 */
export const SITE_URL = "https://www.bannergonzales.com";
