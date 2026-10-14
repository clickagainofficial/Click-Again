import type { MetadataRoute } from "next";

import { site } from "@/site.config";

/**
 * Crawlers and AI agents are welcome on the public pages. The dashboard and
 * the API are not public, so they stay out of the index — the admin routes
 * are already behind a session, this just keeps them out of results too.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
