"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { site } from "@/site.config";

type Word = { text: string; red: boolean };

/** Splits a line into words, marking the ones inside *asterisks* as red. */
function words(line: string): Word[] {
  return line.split("*").flatMap((chunk, i) =>
    chunk
      .split(" ")
      .filter(Boolean)
      .map((text) => ({ text, red: i % 2 === 1 }))
  );
}

/**
 * The brand statement, lit one word at a time as it scrolls through the
 * screen. The point is pace: a visitor who would skim a paragraph ends up
 * reading it at the speed they scroll.
 *
 * Every word renders lit on the server, and only dims once the script is
 * running — so without JS, or with reduced motion, it is simply text.
 */
export default function Manifesto() {
  const { lead, body } = site.manifesto;
  const leadLines = lead.map(words);
  const bodyWords = words(body);
  const total = leadLines.flat().length + bodyWords.length;

  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(total);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);

    let frame = 0;
    function update() {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const vh = window.innerHeight;
      const { top, height } = el.getBoundingClientRect();
      // starts as the block's top enters the lower part of the screen, and
      // is fully lit by the time its bottom reaches just past the middle
      const p = (vh * 0.85 - top) / (vh * 0.3 + height);
      setLit(Math.round(Math.min(1, Math.max(0, p)) * total));
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [total]);

  let n = 0;
  const word = (w: Word, i: number) => {
    const on = !armed || n++ < lit;
    return (
      <span
        key={i}
        className={`mf-word${on ? " is-lit" : ""}${w.red ? " is-red" : ""}`}
      >
        {w.text}{" "}
      </span>
    );
  };

  return (
    <div className="shell manifesto">
      {/* the scroll progress is measured on the text alone, so the poster
          beside it doesn't stretch how far you have to scroll to light it */}
      <div className="mf-text" ref={ref}>
        <h2 className="mf-lead">
          {leadLines.map((line, i) => (
            <span className="mf-line" key={i}>
              {line.map(word)}
            </span>
          ))}
        </h2>
        <p className="mf-body">{bodyWords.map(word)}</p>
      </div>

      <figure className="mf-art">
        <Image
          src="/Brand-Manifesto/Click Ripple Typography Poster.png"
          alt="CLICK, then CLICK again with a cursor mid-click: 1× = sale, 2× = business"
          width={1122}
          height={1402}
          sizes="(min-width: 1024px) 480px, 420px"
        />
      </figure>
    </div>
  );
}
