import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
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
    alternates: { canonical: `/solutions/${service.slug}` },
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

  return (
    <div className="shell">
      <JsonLd
        data={[
          serviceSchema(service.slug)!,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Solutions", path: "/solutions" },
            { name: service.title, path: `/solutions/${service.slug}` },
          ]),
        ]}
      />

      {/* the head carries the whole lead-in now: the line, then the intro */}
      <section className="page-head is-service">
        <p className="eyebrow">
          <Link href="/solutions">Solutions</Link>
          <span className="eyebrow-sep">/</span>
          {String(index + 1).padStart(2, "0")}
        </p>
        <h1>{service.title}</h1>
        <p className="page-lede">{service.tagline}</p>
        <p className="page-intro">{service.intro}</p>
      </section>

      {/* the work itself — one card per thing we do under this solution */}
      <section className="service-detail">
        <h2 className="sec-title">What we actually do</h2>
        <div className="item-grid">
          {service.items.map((item) => (
            <article className="item-card" key={item.name}>
              <span className="item-rule" aria-hidden="true" />
              <h3 className="item-name">{item.name}</h3>
              <p className="item-text">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="detail-cta">
          <Link className="aside-cta" href={`/contact?service=${service.slug}`}>
            Talk to us about this
          </Link>
          <p className="aside-note">
            Not sure this is the part you need? That&apos;s the conversation —
            we work out what the business needs before we quote anything.
          </p>
        </div>
      </section>
    </div>
  );
}
