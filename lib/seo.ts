import type { Metadata } from "next";

import { site } from "@/site.config";

/**
 * Metadata for one public page, with its own Open Graph and Twitter card.
 *
 * Without this, a page that sets only a title inherits the root layout's
 * openGraph — home's title and home's URL — so a /contact link pasted into
 * WhatsApp showed the home card. And a page that sets its own openGraph
 * object replaces the root one wholesale, dropping the share image. Every
 * page goes through here so both stay right.
 *
 * `title` is what the page sets (the layout's "%s | Click Again" template
 * still applies); `shareTitle` is the full line for the share card, which
 * the template doesn't reach.
 */
export function pageMetadata({
  title,
  shareTitle,
  description,
  path,
  type = "website",
  publishedTime,
}: {
  title: Metadata["title"];
  shareTitle: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const image = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: shareTitle,
  };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName: site.name,
      locale: "en_IN",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [image.url],
    },
  };
}

/**
 * Cuts copy to fit a meta description (~160 characters) at a word
 * boundary, so search results show a whole sentence-start instead of a
 * word chopped in half.
 */
export function clip(text: string, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:—–-]+$/, "") + "…";
}
