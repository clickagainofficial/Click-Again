import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import AboutBeliefs from "@/components/AboutBeliefs";

import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a marketing company in Madurai, started in 2026 to get customers for businesses — and keep them coming back.`,
  alternates: { canonical: "/about" },
};

export default function About() {
  const { city, state } = site.legal;

  return (
    <>
      <div className="shell">
        <section className="page-head ab-head">
          <div>
            <p className="eyebrow">About</p>
            <h1>
              We get customers for businesses —{" "}
              <span className="ab-red">and bring them back.</span>
            </h1>
            <p className="page-lede">
              {site.name} is a marketing company from {city}, {state}. We
              started in 2026.
            </p>
          </div>
          <Image
            className="ab-head-clicky"
            src="/How-we-work/web/clicky.webp"
            alt="Clicky, the Click Again mascot, walking"
            width={194}
            height={560}
            priority
          />
        </section>
      </div>

      <section className="band band-b">
        <div className="shell ab-story">
          <h2 className="sec-title">Our story</h2>
          <div className="ab-story-grid">
            <p className="ab-quote">
              Make the business strong first.{" "}
              <span className="ab-red">Then bring the customers.</span>
            </p>
            <div className="ab-story-text">
              <p>
                We started {site.name} in {city} in 2026 after seeing how many
                good businesses were hard to find, hard to trust or hard to
                reach — not because the business was weak, but because of how
                it showed up to the people looking for it.
              </p>
              <p>
                So we start with the base. Before anything else, we make the
                business strong wherever customers look for it, find what
                isn&apos;t working, and fix it first.
              </p>
              <p>
                Then we help the right people find you, and turn them into
                customers who keep coming back. That is
                what takes a business to its next stage, and it&apos;s where our
                name comes from: one click is a sale, click again is a
                business.
              </p>
              <p>
                We are a team across marketing, design, technology and business.
                We take the time to understand how your business actually
                works, and we show you plainly what our work brought back.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="band band-a">
        <div className="shell">
          <article className="ab-note">
            <header className="ab-note-side">
              <span className="ab-note-mark" aria-hidden="true">
                &ldquo;
              </span>
              <h2 className="ab-note-label">A note from the founder</h2>
              <p className="ab-note-sign">
                <span className="ab-note-name">Kansha M</span>
                <span className="ab-note-role">Founder &amp; CEO, {site.name}</span>
              </p>
            </header>
            <div className="ab-note-body">
              <p>
                When we started {site.name}, we noticed that many good
                businesses weren&apos;t getting the attention they deserved—not
                because they lacked quality, but because the right people
                weren&apos;t finding them.
              </p>
              <p>
                We believe every business deserves to be seen, trusted, and
                chosen. That&apos;s why we take the time to understand your
                business before finding the right ways to help it grow.
              </p>
              <p>
                By bringing together the right ideas, technology, and strategy,
                we aim to help businesses reach the right people and build
                lasting relationships with their customers.
              </p>
              <p>
                We don&apos;t believe in one solution for everyone. We believe in
                finding what works for your business.
              </p>
              <p className="ab-note-close">I&apos;d love to hear your story.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="band band-b">
        <div className="shell">
          <h2 className="sec-title">What we believe</h2>
          <AboutBeliefs />
        </div>
      </section>

      <section className="band band-a">
        <div className="shell">
          <div className="ab-close">
            <p className="ab-close-head">Tell us about your business.</p>
            <p className="ab-close-text">
              We&apos;ll ask what you sell, who buys it, and what you want more
              of — then tell you honestly what we&apos;d do.
            </p>
            <Link className="btn" href="/contact">
              Talk to us →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
