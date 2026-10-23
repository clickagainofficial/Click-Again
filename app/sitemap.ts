import type { MetadataRoute } from "next";

import { publishedInsights } from "@/lib/insights";
import { site } from "@/site.config";

/**
 * Every public URL, built from the same config the pages are. Add a service
 * or a post and it appears here on its own — there is no second list to keep
 * in step.
 */
// re-built hourly, so a scheduled post joins the sitemap on its publish date
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const insights = publishedInsights();
  const url = (path: string) => new URL(path, site.url).toString();

  // Real edit dates only, never the build time: a lastmod that moves on every
  // deploy teaches crawlers to ignore it.
  const updated = new Date(site.updated);
  // "14 October 2026" — read as UTC so it is the same date on any server
  const legalUpdated = new Date(`${site.legal.updated} UTC`);
  // the list page changes whenever a post is added
  const newestPost = insights.reduce(
    (latest, p) => {
      const d = new Date(p.updated ?? p.date);
      return d > latest ? d : latest;
    },
    updated
  );

  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: updated, changeFrequency: "monthly", priority: 1 },
    { url: url("/solutions"), lastModified: updated, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/about"), lastModified: updated, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/insights"), lastModified: newestPost, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/contact"), lastModified: updated, changeFrequency: "yearly", priority: 0.8 },
    { url: url("/privacy"), lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.2 },
  ];

  const solutions: MetadataRoute.Sitemap = site.services.map((s) => ({
    url: url(`/solutions/${s.slug}`),
    lastModified: updated,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const posts: MetadataRoute.Sitemap = insights.map((post) => ({
    url: url(`/insights/${post.slug}`),
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...solutions, ...posts];
}
