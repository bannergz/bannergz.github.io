import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * `/noris` is deliberately NOT disallowed here.
 *
 * That route already carries `robots: noindex, nofollow` in its own metadata,
 * and a crawler has to fetch a page to read that directive — disallowing it
 * would block the fetch and leave the page eligible for indexing by inbound
 * links alone. Listing the path in a public robots.txt would also advertise it.
 */
// `output: export` requires every route handler to be explicitly static;
// without this Next fails the build with "dynamic not configured".
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
