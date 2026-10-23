"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

/**
 * Our guy on the 404, one pose per click. He starts out searching for the
 * page, and each click moves him on to the next thing he'd try — which is
 * the joke the name already makes: click again.
 */
const POSES = [
  {
    src: "/How-we-work/web/detective.webp",
    w: 339,
    alt: "Our guy peering through a magnifying glass",
    line: "Looked everywhere. No page.",
  },
  {
    src: "/How-we-work/web/thinky.webp",
    w: 239,
    alt: "Our guy thinking, clipboard in hand",
    line: "Maybe it moved?",
  },
  {
    src: "/How-we-work/web/racer.webp",
    w: 441,
    alt: "Our guy running with a toolbox",
    line: "Right — I'll go build it.",
  },
  {
    src: "/How-we-work/web/growy.webp",
    w: 328,
    alt: "Our guy giving a thumbs up inside a repeat arrow",
    line: "Try a link below instead.",
  },
  {
    src: "/How-we-work/web/clicky.webp",
    w: 194,
    alt: "Clicky, the Click Again mascot, walking",
    line: "Walking you back home.",
  },
];

export default function NotFoundClicky() {
  const [i, setI] = useState(0);
  const pose = POSES[i];

  return (
    <div className="nf-stage">
      <span className="nf-ghost" aria-hidden="true">
        404
      </span>

      <button
        type="button"
        className="nf-guy"
        onClick={() => setI((n) => (n + 1) % POSES.length)}
        aria-label={`${pose.alt}. Click to see what he tries next.`}
      >
        <span className="nf-bubble" aria-hidden="true">
          {pose.line}
        </span>

        {POSES.map((p, n) => (
          <Image
            key={p.src}
            src={p.src}
            alt={p.alt}
            width={p.w}
            height={560}
            priority={n === 0}
            className={n === i ? "is-shown" : undefined}
            draggable={false}
          />
        ))}
      </button>

      <p className="nf-hint" aria-hidden="true">
        <RotateCcw className="loop-ico" />
        {i === 0 ? "Click him" : "Click again"}
      </p>
    </div>
  );
}
