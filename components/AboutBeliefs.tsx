"use client";

import { Playfair_Display } from "next/font/google";
import { useEffect, useRef, useState } from "react";

import { site } from "@/site.config";

/** The big numbers are set in a serif; only this section loads it. */
const serif = Playfair_Display({ subsets: ["latin"], weight: ["500"], display: "swap" });

/** Clicky's face that shows in each card's circle on hover, in order. */
const faces = [
  "/How-we-work/web/detective-face.webp",
  "/How-we-work/web/thinky-face.webp",
  "/How-we-work/web/clicky-face.webp",
  "/How-we-work/web/growy-face.webp",
  "/How-we-work/web/racer-face.webp",
];

/** Sizes of the box's shape, in px: corner radius, circle, gap, fillet. */
const R = 22;
const D = 52;
const GAP = 7;
const F = 12;

/**
 * The outline of a card's top box: a rounded rectangle with a round notch
 * taken out of its lower-right corner, the notch meeting the right and bottom
 * edges in small smooth fillets — so the circle sits in a bay of the box
 * rather than on top of it. Drawn as one SVG path so the hairline border can
 * follow the curve, which a CSS mask cannot do.
 */
function notchedBox(w: number, h: number) {
  const cx = w - D / 2;
  const cy = h - D / 2;
  const rc = D / 2 + GAP;
  const reach = rc + F;

  // fillet on the right edge: centre F in from the edge, touching the notch
  const dx = w - F - cx;
  const ya = cy - Math.sqrt(reach * reach - dx * dx);
  const ax = cx + (rc * (w - F - cx)) / reach;
  const ay = cy + (rc * (ya - cy)) / reach;

  // fillet on the bottom edge, mirrored
  const dy = h - F - cy;
  const xb = cx - Math.sqrt(reach * reach - dy * dy);
  const bx = cx + (rc * (xb - cx)) / reach;
  const by = cy + (rc * (h - F - cy)) / reach;

  const n = (v: number) => v.toFixed(2);
  return [
    `M ${R} 0.5`,
    `H ${n(w - R)}`,
    `A ${R} ${R} 0 0 1 ${n(w - 0.5)} ${R}`,
    `V ${n(ya)}`,
    `A ${F} ${F} 0 0 1 ${n(ax)} ${n(ay)}`,
    `A ${rc} ${rc} 0 0 0 ${n(bx)} ${n(by)}`,
    `A ${F} ${F} 0 0 1 ${n(xb)} ${n(h - 0.5)}`,
    `H ${R}`,
    `A ${R} ${R} 0 0 1 0.5 ${n(h - R)}`,
    `V ${R}`,
    `A ${R} ${R} 0 0 1 ${R} 0.5`,
    "Z",
  ].join(" ");
}

function rich(text: string) {
  return text.split("**").map((chunk, i) =>
    i % 2 ? <b key={i}>{chunk}</b> : <span key={i}>{chunk}</span>
  );
}

function BeliefCard({
  no,
  label,
  text,
  face,
}: {
  no: string;
  label: string;
  text: string;
  face: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <li className="ab-belief">
      <div className="ab-belief-top" ref={boxRef}>
        {size ? (
          <svg
            className="ab-belief-shape"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            aria-hidden="true"
          >
            <path d={notchedBox(size.w, size.h)} />
          </svg>
        ) : null}
        <span className="ab-belief-tag">{label}</span>
        <span className={`ab-belief-no ${serif.className}`} aria-hidden="true">
          {no}
        </span>
        <span className="ab-belief-go" aria-hidden="true">
          <svg className="ab-belief-arrow" viewBox="0 0 24 24">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ab-belief-face" src={face} alt="" loading="lazy" />
        </span>
      </div>
      <p className="ab-belief-text">{rich(text)}</p>
    </li>
  );
}

/**
 * What we believe: five small cards in one row. Each has a box with a big
 * red serif number and a red circle sitting in a notch in its corner; on
 * hover the circle shows Clicky's face instead of the arrow.
 */
export default function AboutBeliefs() {
  return (
    <ol className="ab-beliefs">
      {site.principles.map((p, i) => (
        <BeliefCard
          key={p.no}
          no={p.no}
          label={p.key}
          text={p.text}
          face={faces[i % faces.length]}
        />
      ))}
    </ol>
  );
}
