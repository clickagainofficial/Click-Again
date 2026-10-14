import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { insights } from "@/content/insights";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Insights",
  description: `Practical notes from ${site.name} on getting customers for your business, and keeping them coming back.`,
  alternates: { canonical: "/insights" },
  // nothing to index until the first post is up
  robots: insights.length ? { index: true, follow: true } : { index: false, follow: true },
};

function formatDate(iso: string) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  return new Date(t).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Insights() {
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
        <ul className="in-grid">
          {insights.map((post) => (
            <li key={post.slug}>
              <Link className="in-card" href={`/insights/${post.slug}`}>
                <span className="in-meta">
                  <span className="in-tag">{post.tag}</span>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </span>
                <span className="in-title">{post.title}</span>
                <span className="in-summary">{post.summary}</span>
                <span className="in-go">Read →</span>
              </Link>
            </li>
          ))}
        </ul>
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
