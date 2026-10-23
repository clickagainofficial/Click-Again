import type { Metadata } from "next";
import Link from "next/link";

import BrandStamp from "@/components/BrandStamp";
import HowWeWork from "@/components/HowWeWork";
import Manifesto from "@/components/Manifesto";
import Marquee from "@/components/Marquee";
import PageFaq from "@/components/PageFaq";
import WhatWeDo from "@/components/WhatWeDo";
import { site } from "@/site.config";

/** Title and description come from the root layout; this is here for the
 *  canonical, which the most-linked URL on the site should not go without. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Sections alternate between two full-bleed bands. Each band owns the colour
 * and the vertical padding; the .shell inside it keeps the content on the
 * same measure as everywhere else.
 */
export default function Home() {
  return (
    <>
      <section className="band band-a hero-band">
        <BrandStamp />

        <div className="shell hero">
          <h1 className="hero-title">
            <span className="slide-l">WE GET YOU CUSTOMERS.</span>
            <span className="accent slide-r d1">AND KEEP THEM COMING BACK.</span>
          </h1>

          {/* the first sentence a reader, a crawler or an answer engine meets:
              the name, what it is and where, in the title's own words */}
          <p className="hero-sub slide-l d2">
            Click Again is a marketing agency in Madurai. Strategy, creative,
            websites, social, ads and retention — for businesses across Tamil
            Nadu.
          </p>

          <div className="hero-actions slide-r d3">
            <Link className="btn" href="/solutions">
              See what we do
            </Link>
            <Link className="btn-ghost" href="/contact">
              Talk to us
            </Link>
          </div>
        </div>

        <Marquee />
      </section>

      <section className="band band-b">
        <Manifesto />
      </section>

      <section className="band band-a" id="how">
        <HowWeWork />
      </section>

      <section className="band band-b" id="what">
        <WhatWeDo />
        {/* the questions sit under the services, on the same band, rather
            than as a section of their own */}
        <div className="shell">
          <PageFaq items={site.homeFaqs} />
        </div>
      </section>

      <section className="band band-a">
        <div className="shell">
          <div className="closer">
            <span className="closer-water" aria-hidden="true">
              CLICK
            </span>
            <p className="small">Don&apos;t just make them buy once.</p>
            <p className="big">
              Make them{" "}
              <span className="mark">
                click again
                {/* a cursor double-clicking the words, on a loop */}
                <span className="closer-cursor" aria-hidden="true">
                  <span className="ring" />
                  <span className="ring r2" />
                  <svg viewBox="0 0 24 24">
                    <path d="M4 2.5 19.5 11l-6.6 1.9-3 6.6z" />
                  </svg>
                </span>
              </span>
              .
            </p>
            <p className="closer-sub">
              A sale gets you a customer once. The reason they come back is
              what builds the business — and that is the part we work on.
            </p>
            <ul className="closer-facts">
              <li>Strategy to retention, under one roof</li>
              <li>Creative in Tamil &amp; English</li>
              <li>Based in Madurai, working across Tamil Nadu</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
