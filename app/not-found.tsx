import type { Metadata } from "next";
import Link from "next/link";

import NotFoundClicky from "@/components/NotFoundClicky";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page isn't here. Head back home, browse what we do, or tell us about your business.",
  robots: { index: false, follow: true },
};

/** Where people actually meant to go. Solutions first, since most dead links
 *  on this site are old service URLs. */
const ELSEWHERE = [
  { href: "/solutions", label: "Solutions", text: "Everything we do, and what each one gets you." },
  { href: "/#how", label: "How we work", text: "Four steps. Then round again." },
  { href: "/insights", label: "Insights", text: "What we've learnt, written plainly." },
  { href: "/about", label: "About", text: `Who ${site.name} is, and why we started.` },
];

/**
 * The 404. This is the root not-found, so it renders the header and footer
 * itself — a wrong URL under /admin lands here too, and it should still look
 * like the site.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className="site-main">
        <div className="shell">
          <section className="page-head nf-head">
            <div className="nf-copy">
              <p className="eyebrow">Error 404</p>
              <h1>
                This page is <span className="nf-red">missing.</span>
              </h1>
              <p className="page-lede">
                We sent our guy looking and he came back with the magnifying
                glass and nothing else. The link is probably old, or the page
                has moved.
              </p>
              <div className="nf-actions">
                <Link className="btn" href="/">
                  Back home →
                </Link>
                <Link className="btn-ghost" href="/contact">
                  Talk to us
                </Link>
              </div>
            </div>

            <NotFoundClicky />
          </section>
        </div>

        <section className="band band-b">
          <div className="shell">
            <h2 className="sec-title">Try one of these</h2>
            <ul className="nf-links">
              {ELSEWHERE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <span className="nf-link-label">{l.label}</span>
                    <span className="nf-link-text">{l.text}</span>
                    <span className="nf-link-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
