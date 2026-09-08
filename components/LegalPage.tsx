import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";

/**
 * Shared shell for the Privacy Policy and Terms pages: small logo, a way
 * back home, and a readable measure for long-form text.
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
    <main className="shell">
      <nav className="legal-nav">
        <Link href="/" aria-label={`${site.name} home`}>
          <Image
            className="logo-sm"
            src="/clickagain-logo.png"
            alt={site.name}
            width={1128}
            height={310}
          />
        </Link>
        <Link className="legal-back" href="/">
          ← Back to home
        </Link>
      </nav>

      <article className="legal">
        <h1>{title}</h1>
        <p className="updated">Last updated: {site.legal.updated}</p>
        <div className="intro">{intro}</div>
        {children}
      </article>
    </main>
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

/** The company block, rendered from whatever details are filled in. */
export function CompanyFacts() {
  const { entity, cin, address } = site.legal;

  return (
    <dl className="facts">
      <dt>Company</dt>
      <dd>{entity}</dd>

      {cin ? (
        <>
          <dt>CIN</dt>
          <dd>{cin}</dd>
        </>
      ) : null}

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
