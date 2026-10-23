"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { site } from "@/site.config";

/** How long he stays at a step, how long a walk to the next one takes, and
 *  how long the walk from 04 back to 01 takes. The line between two steps
 *  draws over the same time as the walk. */
const HOLD_MS = 1900;
const WALK_MS = 800;
const BACK_MS = 1400;

/** Between steps he is shown walking. */
const WALKER = "/How-we-work/web/clicky.webp";

/**
 * The four steps as a loop, with the mascot doing each one. While the
 * section is on screen it plays on its own: he stops at a step in that
 * step's pose, walks to the next one while the line behind him turns red,
 * and after 04 turns round and walks back to 01 — round again.
 *
 * On the server, and with reduced motion, every step is lit and he simply
 * stands at 01. Each step also carries his pose as a round avatar beside its
 * number; on phones, with no track to walk, that is all there is of him.
 */
export default function HowWeWork() {
  const steps = site.process;
  const last = steps.length - 1;
  const ref = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [walking, setWalking] = useState(false);
  const [back, setBack] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    setPlaying(true);
    setPos(0);
    setWalking(false);
    setBack(false);

    let p = 0;
    let timer = 0;
    const hold = () => {
      timer = window.setTimeout(next, HOLD_MS);
    };
    const next = () => {
      setWalking(true);
      if (p < last) {
        p += 1;
        setPos(p);
        timer = window.setTimeout(() => {
          setWalking(false);
          hold();
        }, WALK_MS);
      } else {
        p = 0;
        setBack(true);
        setPos(0);
        timer = window.setTimeout(() => {
          setWalking(false);
          setBack(false);
          hold();
        }, BACK_MS);
      }
    };
    hold();
    return () => window.clearTimeout(timer);
  }, [inView, last]);

  const still = !playing;
  const showing = walking ? WALKER : steps[pos].pose;

  return (
    <div className="shell">
      <h2 className="sec-title">How we work</h2>
      <p className="hw-head">
        Four steps. Then <span className="hw-red">round again.</span>
      </p>
      <p className="svc-intro">
        Every job runs in this order. And when step four is done, it
        doesn&apos;t end there — it starts again, a little sharper.
      </p>

      <div
        className={`hw-loop${back ? " is-returning" : ""}`}
        ref={ref}
        style={
          {
            "--i": pos,
            "--move": `${back ? BACK_MS : WALK_MS}ms`,
          } as React.CSSProperties
        }
      >
        <div className={`hw-runner${back ? " is-back" : ""}`} aria-hidden="true">
          <span className="hw-bubble">
            <RotateCcw className="loop-ico" />
            Round again
          </span>
          {[
            ...steps.map((s) => ({ src: s.pose, alt: s.poseAlt })),
            { src: WALKER, alt: "Our guy walking with a shoulder bag, back to the first step" },
          ].map(({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={alt}
              className={src === showing ? "is-shown" : undefined}
              draggable={false}
              // the runner only exists on wide screens (display:none on
              // phones); lazy means phones never download the five poses
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>

        <ol className="hw-steps">
          {steps.map((s, i) => (
            <li
              key={s.no}
              className={[
                "hw-step",
                still || back || i <= pos ? "is-on" : "",
                still || back || i < pos ? "is-past" : "",
                playing && !walking && !back && i === pos ? "is-now" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="hw-dot" aria-hidden="true" />
              <div className="hw-badge">
                <span className="hw-num">{s.no}</span>
                <span className="hw-avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.face} alt={s.poseAlt} loading="lazy" />
                </span>
              </div>
              <h3 className="hw-title">{s.title}</h3>
              <p className="hw-text">{s.text}</p>
              <p className="hw-get">
                <span>You get</span>
                {s.get}
              </p>
            </li>
          ))}
        </ol>

        <p className="hw-again" aria-hidden="true">
          <RotateCcw className="loop-ico" />
          Then round again
        </p>
      </div>
    </div>
  );
}
