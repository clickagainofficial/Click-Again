import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Marketing Solutions: Strategy, Creative, Ads",
  description:
    "Strategy, creative, website, social, performance and retention — picked for what your business actually needs.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsIndex() {
  return (
    <div className="shell">
      <section className="page-head">
        <p className="eyebrow">Solutions</p>
        <h1>What we do</h1>
        <p className="page-lede">
          We look at your business, your goal and your audience first, then
          pick the work that moves the number you actually care about.
        </p>
      </section>

      <div className="svc-grid">
        {site.services.map((s, i) => (
          <Link
            className="svc-card is-link"
            key={s.slug}
            href={`/solutions/${s.slug}`}
          >
            <span className="svc-num">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="svc-title">{s.title}</h2>
            <p className="svc-tagline">{s.tagline}</p>
            <p className="svc-items">
              {s.items.map((item, j) => (
                <span key={item.name}>
                  {j > 0 && <span className="svc-dot">·</span>}
                  {item.name}
                </span>
              ))}
            </p>
            <span className="svc-go">
              Read more
              <span className="svc-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}
