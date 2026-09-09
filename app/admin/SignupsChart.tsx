"use client";

import { useState } from "react";

type Bucket = { label: string; date: string; count: number };

/**
 * One series, so no legend — the heading names it. Single brand hue for
 * magnitude, recessive axis, and a tooltip per bar. The table below the
 * chart is the accessible view of the same numbers.
 */
export default function SignupsChart({ data }: { data: Bucket[] }) {
  const [active, setActive] = useState<number | null>(null);

  const peak = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <p className="text-muted-foreground text-xs">
          Peak {peak} in a day · {total} in this window
        </p>
      </div>

      <div className="relative">
        {/* recessive baseline */}
        <div className="bg-border absolute right-0 bottom-6 left-0 h-px" />

        <div className="flex h-40 items-end gap-[2px]">
          {data.map((d, i) => {
            const height = d.count === 0 ? 2 : Math.max(6, (d.count / peak) * 128);

            return (
              <div
                key={d.date}
                className="relative flex flex-1 flex-col items-center justify-end"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                aria-label={`${d.label}: ${d.count} signup${d.count === 1 ? "" : "s"}`}
              >
                {active === i ? (
                  <div className="bg-foreground text-background pointer-events-none absolute bottom-full z-10 mb-2 rounded-md px-2 py-1 text-xs whitespace-nowrap shadow-sm">
                    {d.label} · {d.count} signup{d.count === 1 ? "" : "s"}
                  </div>
                ) : null}

                <div
                  className="w-full rounded-t-[4px] transition-opacity"
                  style={{
                    height,
                    background: d.count === 0 ? "var(--border)" : "var(--primary)",
                    opacity: active === null || active === i ? 1 : 0.45,
                  }}
                />

                <span className="text-muted-foreground mt-2 h-4 text-[10px] leading-4">
                  {i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2)
                    ? d.label
                    : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
