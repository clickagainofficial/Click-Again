import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { formatDate, publishedInsights, readingMinutes } from "@/lib/insights";
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
  const [lead, ...rest] = insights;

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

      {lead ? (
        <div className="in-list">
          <Link className="in-feature" href={`/insights/${lead.slug}`}>
            <span className="in-meta">
              <span className="in-tag">{lead.tag}</span>
              <span>Latest</span>
            </span>
            <span className="in-feature-title">{lead.title}</span>
            <span className="in-feature-summary">{lead.summary}</span>
            <span className="in-feature-foot">
              <span>
                {site.founder.name} · <time dateTime={lead.date}>{formatDate(lead.date)}</time> ·{" "}
                {readingMinutes(lead)} min read
              </span>
              <span className="in-go">Read the guide →</span>
            </span>
          </Link>

          {rest.length ? (
            <ul className="in-grid">
              {rest.map((post) => (
                <li key={post.slug}>
                  <Link className="in-card" href={`/insights/${post.slug}`}>
                    <span className="in-meta">
                      <span className="in-tag">{post.tag}</span>
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </span>
                    <span className="in-title">{post.title}</span>
                    <span className="in-summary">{post.summary}</span>
                    <span className="in-go">{readingMinutes(post)} min read →</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
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
