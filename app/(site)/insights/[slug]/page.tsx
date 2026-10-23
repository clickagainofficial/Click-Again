import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import InsightCards from "@/components/InsightCards";
import JsonLd from "@/components/JsonLd";
import ReadingProgress from "@/components/ReadingProgress";
import { insights } from "@/content/insights";
import {
  cardData,
  formatDate,
  isPublished,
  publishedInsights,
  renderInsight,
} from "@/lib/insights";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { clip, pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

type Params = { params: Promise<{ slug: string }> };

// Scheduled posts go live on their date without a deploy: the page is
// re-checked hourly, and a post dated in the future 404s until then.
export const revalidate = 3600;

export function generateStaticParams() {
  return publishedInsights().map((post) => ({ slug: post.slug }));
}

function findLive(slug: string) {
  const post = insights.find((p) => p.slug === slug);
  return post && isPublished(post) ? post : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = findLive(slug);
  if (!post) return {};

  return pageMetadata({
    title: { absolute: post.seoTitle },
    shareTitle: post.title,
    description: clip(post.summary),
    path: `/insights/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated ?? post.date,
    image: `/insights/${post.slug}/og`,
  });
}

const initials = site.founder.name
  .split(/\s+/)
  .map((w) => w[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

export default async function InsightPost({ params }: Params) {
  const { slug } = await params;
  const live = findLive(slug);
  if (!live) notFound();

  const post = renderInsight(live);
  const url = new URL(`/insights/${post.slug}`, site.url).toString();
  const related = publishedInsights().filter((p) => p.slug !== post.slug).slice(0, 2);
  const outline = [
    ...post.toc,
    ...(post.faqs.length ? [{ id: "faq", text: "Questions people ask" }] : []),
  ];
  const share = encodeURIComponent(`${post.title} ${url}`);

  return (
    <>
      <ReadingProgress target="#ip-article" />
      <div className="shell">
        <JsonLd
          data={[
            articleSchema(post),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Insights", path: "/insights" },
              { name: post.title, path: `/insights/${post.slug}` },
            ]),
            ...(post.faqs.length ? [faqSchema(post.faqs)] : []),
          ]}
        />

        <article className="ip" id="ip-article">
          <header className="ip-head">
            <p className="eyebrow">
              <Link href="/insights">Insights</Link>
              <span className="eyebrow-sep">/</span>
              {post.tag}
            </p>
            <h1>{post.title}</h1>
            <p className="ip-lede">{post.summary}</p>

            <div className="ip-byline">
              <span className="ip-avatar" aria-hidden="true">
                {initials}
              </span>
              <span className="ip-by">
                <Link href="/about" className="ip-by-name">
                  {site.founder.name}
                </Link>
                <span className="ip-by-role">
                  {site.founder.role}, {site.name}
                </span>
              </span>
              <span className="ip-meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.updated && post.updated !== post.date ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                    </span>
                  </>
                ) : null}
                <span aria-hidden="true">·</span>
                <span>{post.minutes} min read</span>
              </span>
            </div>
          </header>

          <div className="ip-layout">
            <aside className="ip-aside" aria-label="On this page">
              <div className="ip-aside-inner">
                <p className="ip-aside-label">On this page</p>
                <ol className="ip-toc">
                  {outline.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`}>{item.text}</a>
                    </li>
                  ))}
                </ol>

                <div className="ip-share">
                  <p className="ip-aside-label">Share</p>
                  <div className="ip-share-links">
                    <a
                      href={`https://wa.me/?text=${share}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                    <a
                      href={`https://x.com/intent/post?text=${share}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      X
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            <div className="ip-main">
              <section className="ip-short" aria-labelledby="ip-short-h">
                <h2 id="ip-short-h">In short</h2>
                <ul>
                  {post.takeaways.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>

              <details className="ip-toc-m">
                <summary>On this page</summary>
                <ol className="ip-toc">
                  {outline.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`}>{item.text}</a>
                    </li>
                  ))}
                </ol>
              </details>

              <div className="ip-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

              {post.faqs.length ? (
                <section className="ip-faq" aria-labelledby="faq">
                  <h2 id="faq">Questions people ask</h2>
                  {post.faqs.map((f) => (
                    <details key={f.q}>
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                    </details>
                  ))}
                </section>
              ) : null}

              {post.sources.length ? (
                <section className="ip-sources" aria-labelledby="ip-sources-h">
                  <h2 id="ip-sources-h">Sources</h2>
                  <ol>
                    {post.sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer">
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              <section className="ip-author" aria-label="About the author">
                <span className="ip-avatar is-lg" aria-hidden="true">
                  {initials}
                </span>
                <div>
                  <p className="ip-author-name">
                    {site.founder.name}
                    <span>
                      {site.founder.role}, {site.name}
                    </span>
                  </p>
                  <p className="ip-author-bio">
                    {site.founder.first} started {site.name} in {site.legal.city} in{" "}
                    {site.founded} to help businesses get found, earn trust and win
                    customers, and then give those customers a reason to come back. The
                    team works across {site.disciplines.slice(0, -1).join(", ")} and{" "}
                    {site.disciplines.at(-1)}, in English and Tamil.
                  </p>
                  <Link href="/about" className="ip-author-link">
                    More about {site.name} →
                  </Link>
                </div>
              </section>

              <section className="ip-cta">
                <p className="ip-cta-kicker">Click Again</p>
                <p className="ip-cta-title">
                  Want a second pair of eyes on your business?
                </p>
                <p className="ip-cta-text">
                  Tell us what you sell and who buys it. We&apos;ll call you within a
                  working day, and we&apos;ll start with your business, not a package.
                </p>
                <Link className="btn" href="/contact">
                  Talk to us
                </Link>
              </section>
            </div>
          </div>
        </article>

        {related.length ? (
          <section className="ip-related" aria-labelledby="ip-related-h">
            <h2 id="ip-related-h">Keep reading</h2>
            <InsightCards posts={related.map(cardData)} tabs={false} />
          </section>
        ) : null}
      </div>
    </>
  );
}
