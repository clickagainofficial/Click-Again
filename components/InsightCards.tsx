"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type InsightCardData = {
  slug: string;
  title: string;
  tag: string;
  place: string;
  date: string;
  dateLabel: string;
  minutes: number;
};

/**
 * The post cards on /insights: dark cards with a cover panel in place of a
 * photo, and topic tabs above them that filter without a page load. The
 * tabs appear only once there's more than one topic to choose from.
 */
export default function InsightCards({
  posts,
  tabs = true,
}: {
  posts: InsightCardData[];
  tabs?: boolean;
}) {
  const topics = useMemo(() => {
    const count = new Map<string, number>();
    posts.forEach((p) => count.set(p.tag, (count.get(p.tag) ?? 0) + 1));
    return [...count.entries()];
  }, [posts]);
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? posts.filter((p) => p.tag === active) : posts;

  return (
    <>
      {tabs && topics.length > 1 ? (
        <div className="ic-tabs" role="tablist" aria-label="Filter by topic">
          <button
            role="tab"
            aria-selected={active === null}
            className={active === null ? "is-on" : undefined}
            onClick={() => setActive(null)}
          >
            All<sup>{posts.length}</sup>
          </button>
          {topics.map(([topic, n]) => (
            <button
              key={topic}
              role="tab"
              aria-selected={active === topic}
              className={active === topic ? "is-on" : undefined}
              onClick={() => setActive(topic)}
            >
              {topic}
              <sup>{n}</sup>
            </button>
          ))}
        </div>
      ) : null}

      <ul className="ic-grid">
        {shown.map((p) => (
          <li key={p.slug}>
            <article className="ic-card">
              <Link href={`/insights/${p.slug}`} className="ic-cover" tabIndex={-1} aria-hidden="true">
                <span className="ic-cover-top">
                  <span>Click Again</span>
                  <span>Insights</span>
                </span>
                <span className="ic-cover-topic">{p.tag}</span>
                <span className="ic-cover-read">{p.minutes} min read</span>
              </Link>
              <p className="ic-date">
                Published <time dateTime={p.date}>{p.dateLabel}</time>
              </p>

              <h3 className="ic-title">
                <Link href={`/insights/${p.slug}`}>{p.title}</Link>
              </h3>

              <div className="ic-foot">
                <span className="ic-chips">
                  <span>{p.tag}</span>
                  <span>{p.place}</span>
                </span>
                <Link href={`/insights/${p.slug}`} className="ic-btn" aria-label={`Read: ${p.title}`}>
                  Read now
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
