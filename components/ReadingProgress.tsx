"use client";

import { useEffect, useRef } from "react";

/**
 * A thin red line along the top of a post that fills as you read. It moves
 * by transform only, so it costs nothing per frame, and it measures the
 * article rather than the page, so the footer doesn't count as reading.
 */
export default function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el || !bar.current) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = el.getBoundingClientRect();
      const done = (window.innerHeight * 0.35 - top) / height;
      bar.current!.style.transform = `scaleX(${Math.min(1, Math.max(0, done))})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <div className="ip-progress" aria-hidden="true">
      <div ref={bar} />
    </div>
  );
}
