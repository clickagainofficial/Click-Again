import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import InsightCards from "@/components/InsightCards";
import { cardData, publishedInsights } from "@/lib/insights";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  shareTitle: `Insights — ${site.name}`,
  description: `Practical notes from ${site.name} on getting customers for your business, and keeping them coming back.`,
  path: "/insights",
});

// re-checked hourly, so a scheduled post appears on its date without a deploy
export const revalidate = 3600;

export default function Insights() {
  const insights = publishedInsights();

  return (
    <div className="shell">
      <section className="page-head">
        <p className="eyebrow">Insights</p>
        <h1>Notes on bringing customers back</h1>
        <p className="page-lede">
          Practical ideas for getting found, earning trust, and turning a first
          customer into a regular.
        </p>
      </section>

      {insights.length ? (
        <div className="in-list">
          <InsightCards posts={insights.map(cardData)} />
        </div>
      ) : (
        <div className="in-empty">
          <Image
            className="in-empty-art"
            src="/How-we-work/web/thinky.webp"
            alt=""
            width={239}
            height={560}
          />
          <div>
            <p className="in-empty-head">No posts yet.</p>
            <p className="in-empty-text">
              We&apos;re writing our first ones — short, practical notes you can
              use in your own business. Check back soon.
            </p>
            <div className="in-empty-links">
              <Link className="btn" href="/solutions">
                See what we do
              </Link>
              <Link className="btn-ghost" href="/contact">
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
