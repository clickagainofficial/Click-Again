import type { MetadataRoute } from "next";

import { insights } from "@/content/insights";
import { site } from "@/site.config";

/**
 * Every public URL, built from the same config the pages are. Add a service
 * or a post and it appears here on its own — there is no second list to keep
 * in step.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();

  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/solutions"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/about"), changeFrequency: "yearly", priority: 0.7 },
    { url: url("/insights"), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const solutions: MetadataRoute.Sitemap = site.services.map((s) => ({
    url: url(`/solutions/${s.slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const posts: MetadataRoute.Sitemap = insights.map((post) => ({
    url: url(`/insights/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...solutions, ...posts];
}
