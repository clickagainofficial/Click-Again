import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import AboutBeliefs from "@/components/AboutBeliefs";

import { site } from "@/site.config";

export const metadata: Metadata = {
  // A bare "About" is generic enough that Google writes its own title
  // instead, so the name and what we are go in the title itself.
  title: { absolute: `About ${site.name} — Marketing Agency in Madurai` },
  description: `${site.name} is a marketing company in Madurai, started in ${site.founded} to get customers for businesses — and keep them coming back.`,
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
              started in {site.founded}.
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
                We started {site.name} in {city} in {site.founded} after seeing how many
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
                We are a team across {site.disciplines.slice(0, -1).join(", ")}{" "}
                and {site.disciplines.at(-1)}. We take the time to understand
                how your business actually works, and we show you plainly what
                our work brought back.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="band band-a ab-note-band">
        <div className="shell">
          {/* A letter left on the desk — two sheets of it, side by side, each
              with a spare sheet showing under it and a tilt of its own. The
              sticky note sits on the first; the signature closes the second. */}
          <article className="ab-notes">
            <div className="ab-paper-stack ab-stack-1">
              <span className="ab-sheet" aria-hidden="true" />
              <div className="ab-paper">
                <h2 className="ab-sticky">A note from the founder</h2>
                <div className="ab-note-body">
                  <p>Hello —</p>
                  <p>
                    I&apos;m {site.founder.first}, {site.founder.role} at{" "}
                    {site.name}.
                  </p>
                  <p>
                    When we started {site.name}, we noticed that many good
                    businesses weren&apos;t getting the attention they
                    deserved—not because they lacked quality, but because the
                    right people weren&apos;t finding them.
                  </p>
                  <p>
                    We believe every business deserves to be seen, trusted, and
                    chosen. That&apos;s why we take the time to understand your
                    business before finding the right ways to help it grow.
                  </p>
                </div>
              </div>
            </div>

            <div className="ab-paper-stack ab-stack-2">
              <span className="ab-sheet" aria-hidden="true" />
              <div className="ab-paper">
                <div className="ab-note-body">
                  <p>
                    By bringing together the right ideas, technology, and
                    strategy, we aim to help businesses reach the right people
                    and build lasting relationships with their customers.
                  </p>
                  <p>
                    We don&apos;t believe in one solution for everyone. We
                    believe in finding what works for your business.
                  </p>
                  <p className="ab-note-close">
                    I&apos;d love to hear your story.
                  </p>
                </div>
                <footer className="ab-sign">
                  <span className="ab-sign-name">{site.founder.name}</span>
                  <span className="ab-sign-role">
                    {site.founder.role}, {site.name}
                  </span>
                </footer>
              </div>
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
