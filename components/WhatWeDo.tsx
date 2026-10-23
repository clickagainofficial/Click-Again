import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { site } from "@/site.config";

/** One illustration per service, in /public/Services, numbered in nav order. */
// Alt text even though the icon sits inside aria-hidden: screen readers
// skip it either way, and search engines (Bing flags empty alts) and image
// search get a description of what each picture shows.
const art: Record<string, { src: string; alt: string }> = {
  "marketing-strategy": { src: "/Services/map 1.png", alt: "Map with a location pin and a compass, for marketing strategy" },
  "content-creative": { src: "/Services/camera 2.png", alt: "Camera with a clapperboard and a paintbrush, for content and creative" },
  "website-digital-presence": { src: "/Services/laptop 3.png", alt: "Laptop and phone showing a website, for website and digital presence" },
  "social-media-management": { src: "/Services/mobile 4.png", alt: "Phone with likes, hearts and comments, for social media management" },
  "performance-marketing": { src: "/Services/graph 5.png", alt: "Rising bar graph with a target, for performance marketing and analytics" },
  "retention-automation": { src: "/Services/bag 6.png", alt: "Shopping bag inside a repeat arrow, for customer retention and automation" },
};

/**
 * The home page names each service in one line and links to its page,
 * where the detail lives. Each row fills red from the left on hover, like
 * a button being pressed.
 */
export default function WhatWeDo() {
  return (
    <div className="shell">
      <h2 className="sec-title">What we do</h2>
      <div className="do-head">
        <p className="hw-head">
          Six things we do.
        </p>
        <Link className="do-all" href="/solutions">
          All solutions <span aria-hidden="true">→</span>
        </Link>
      </div>

      <ul className="do-list">
        {site.services.map((s) => (
          <li key={s.slug}>
            <Link className="do-row" href={`/solutions/${s.slug}`}>
              <span className="do-icon" aria-hidden="true">
                <Image
                  src={art[s.slug].src}
                  alt={art[s.slug].alt}
                  width={96}
                  height={96}
                  sizes="64px"
                />
              </span>
              <span className="do-title">{s.title}</span>
              <span className="do-line">{s.tagline}</span>
              <span className="do-go" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
