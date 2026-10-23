import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

import { marked } from "marked";

import { insights, type Insight } from "@/content/insights";

/** Today's date in India as "YYYY-MM-DD", which is what post dates are written in. */
function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isPublished(post: Insight) {
  return post.date <= todayInIndia();
}

/** Posts that are live today, newest first. Anything dated later waits. */
export function publishedInsights() {
  return insights
    .filter(isPublished)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export type TocItem = { id: string; text: string };

export type RenderedInsight = Insight & {
  html: string;
  toc: TocItem[];
  words: number;
  minutes: number;
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

const stripTags = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

/**
 * The post's Markdown as HTML, plus the outline for the "On this page" list.
 * Done by post-processing marked's plain output rather than overriding its
 * renderer, so a marked upgrade can't quietly change how posts look.
 */
export function renderInsight(post: Insight): RenderedInsight {
  const file = path.join(process.cwd(), "content/insights", `${post.slug}.md`);
  const md = readFileSync(file, "utf8");

  let html = marked.parse(md, { gfm: true, async: false }) as string;

  // Headings get ids so the outline can link to them; H2s form the outline.
  const toc: TocItem[] = [];
  const used = new Set<string>();
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, level, inner) => {
    let id = slugify(inner) || "section";
    while (used.has(id)) id += "-2";
    used.add(id);
    if (level === "2") toc.push({ id, text: stripTags(inner) });
    return `<h${level} id="${id}"><a class="ip-anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inner}</h${level}>`;
  });

  // Links to other sites open in a new tab and pass no referrer weight.
  html = html.replace(
    /<a href="(https?:\/\/[^"]+)"/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  );

  // Tables scroll sideways on a phone instead of breaking the layout.
  html = html
    .replace(/<table>/g, '<div class="ip-table"><table>')
    .replace(/<\/table>/g, "</table></div>");

  const words = md.split(/\s+/).filter(Boolean).length;
  return { ...post, html, toc, words, minutes: Math.max(1, Math.round(words / 220)) };
}

/** Reading time for a card, without rendering the whole post. */
export function readingMinutes(post: Insight) {
  const file = path.join(process.cwd(), "content/insights", `${post.slug}.md`);
  const words = readFileSync(file, "utf8").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** What a post card needs, worked out on the server. */
export function cardData(post: Insight) {
  return {
    slug: post.slug,
    title: post.title,
    tag: post.tag,
    place: post.place,
    date: post.date,
    dateLabel: formatDate(post.date, "short"),
    minutes: readingMinutes(post),
  };
}

export function formatDate(iso: string, month: "long" | "short" = "long") {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  return new Date(t).toLocaleDateString("en-IN", {
    day: "numeric",
    month,
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
