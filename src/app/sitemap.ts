import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Only the public portfolio is listed. `/noris` is `noindex` by design and
 * `/_not-found` is not a real destination, so neither belongs in a sitemap.
 */
// `output: export` requires every route handler to be explicitly static;
// without this Next fails the build with "dynamic not configured".
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
