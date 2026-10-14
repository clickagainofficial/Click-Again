import Link from "next/link";
import { site } from "@/site.config";

/**
 * Shared shell for the Privacy Policy and Terms pages. The site header
 * carries the logo and navigation, so this only sets a readable measure
 * for long-form text.
 */
export default function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      <article className="legal">
        <h1>{title}</h1>
        <p className="updated">Last updated: {site.legal.updated}</p>
        <div className="intro">{intro}</div>
        {children}
        {/* the legal entity is named once, quietly, at the foot of the page */}
        <p className="legal-entity">
          {site.name} is a brand of {site.legal.entity}
          {site.legal.cin ? ` (CIN ${site.legal.cin})` : ""}.
        </p>
      </article>
    </div>
  );
}

/** One numbered section of a policy. */
export function Clause({
  n,
  heading,
  children,
}: {
  n: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2>
        <span className="n">{n}</span>
        <span>{heading}</span>
      </h2>
      {children}
    </section>
  );
}

/**
 * The company block, rendered from whatever details are filled in. It
 * leads with the brand; the legal entity is named only in the line at the
 * foot of the page.
 */
export function CompanyFacts() {
  const { address } = site.legal;

  return (
    <dl className="facts">
      {address ? (
        <>
          <dt>Registered office</dt>
          <dd>{address}</dd>
        </>
      ) : null}

      <dt>Brand</dt>
      <dd>
        {site.name} ({site.domain})
      </dd>

      <dt>Contact</dt>
      <dd>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </dd>
    </dl>
  );
}
