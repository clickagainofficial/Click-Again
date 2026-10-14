import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { site } from "@/site.config";

/** One illustration per service, in /public/Services, numbered in nav order. */
const art: Record<string, string> = {
  "marketing-strategy": "/Services/map 1.png",
  "content-creative": "/Services/camera 2.png",
  "website-digital-presence": "/Services/laptop 3.png",
  "social-media-management": "/Services/mobile 4.png",
  "performance-marketing": "/Services/graph 5.png",
  "retention-automation": "/Services/bag 6.png",
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
                <Image src={art[s.slug]} alt="" width={96} height={96} />
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
