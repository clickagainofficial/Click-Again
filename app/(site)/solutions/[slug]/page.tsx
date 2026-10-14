import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { site } from "@/site.config";

type Params = { params: Promise<{ slug: string }> };

/** Every service page is built at build time — there are six, all known. */
export function generateStaticParams() {
  return site.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = site.services.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.tagline,
    openGraph: {
      title: `${service.title} — ${site.name}`,
      description: service.tagline,
    },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const index = site.services.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();

  const service = site.services[index];
  const others = site.services.filter((s) => s.slug !== slug);

  return (
    <div className="shell">
      <section className="page-head">
        <p className="eyebrow">
          <Link href="/solutions">Solutions</Link>
          <span className="eyebrow-sep">/</span>
          {String(index + 1).padStart(2, "0")}
        </p>
        <h1>{service.title}</h1>
        <p className="page-lede">{service.tagline}</p>
      </section>

      <section className="service-body">
        <div className="service-main">
          <p className="service-intro">{service.intro}</p>

          <h2 className="service-h2">What changes for you</h2>
          <ul className="outcome-list">
            {service.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>

        <aside className="service-aside">
          <p className="aside-head">What&apos;s included</p>
          <ul className="include-list">
            {service.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <Link className="aside-cta" href={`/contact?service=${service.slug}`}>
            Talk to us about this
          </Link>
          <p className="aside-note">
            Not sure this is the part you need? That&apos;s the conversation —
            we work out what the business needs before we quote anything.
          </p>
        </aside>
      </section>

      <section className="service-next">
        <p className="sec-title">Other solutions</p>
        <div className="next-grid">
          {others.map((s) => (
            <Link key={s.slug} href={`/solutions/${s.slug}`} className="next-card">
              <span className="next-title">{s.title}</span>
              <span className="next-tag">{s.tagline}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
