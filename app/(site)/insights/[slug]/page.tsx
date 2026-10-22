import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import { insights } from "@/content/insights";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

/** Posts are a fixed list in content/insights.ts, so build them all up front. */
export function generateStaticParams() {
  return insights.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = insights.find((p) => p.slug === slug);
  if (!post) return {};

  return pageMetadata({
    title: post.title,
    shareTitle: post.title,
    description: post.summary,
    path: `/insights/${post.slug}`,
    type: "article",
    publishedTime: post.date,
  });
}

function formatDate(iso: string) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  return new Date(t).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function InsightPost({ params }: Params) {
  const { slug } = await params;
  const post = insights.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="shell">
      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: post.title, path: `/insights/${post.slug}` },
          ]),
        ]}
      />

      <article className="ip">
        <header className="page-head">
          <p className="eyebrow">
            <Link href="/insights">Insights</Link>
            <span className="eyebrow-sep">/</span>
            {post.tag}
          </p>
          <h1>{post.title}</h1>
          <p className="page-lede">{post.summary}</p>
          <p className="ip-date">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
        </header>

        <div className="ip-body">
          {post.body.map((block) =>
            block.startsWith("## ") ? (
              <h2 key={block}>{block.slice(3)}</h2>
            ) : (
              <p key={block}>{block}</p>
            )
          )}
        </div>

        <footer className="ip-foot">
          <Link className="btn" href="/contact">
            Talk to us
          </Link>
          <Link className="btn-ghost" href="/insights">
            ← All insights
          </Link>
        </footer>
      </article>
    </div>
  );
}
