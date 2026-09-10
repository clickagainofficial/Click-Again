"use client";

import { AlertTriangle, Info } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { money, type CostUnit, type Note, type Verdict } from "@/lib/adMetrics";

/* ------------------------------------------------------------------ inputs */

export function Field({
  id,
  label,
  value,
  onChange,
  suffix,
  hint,
  placeholder,
  unit,
  onUnitChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  hint?: string;
  placeholder?: string;
  unit?: CostUnit;
  onUnitChange?: (u: CostUnit) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium">
        {label}
      </Label>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {suffix === "₹" ? (
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm">
              ₹
            </span>
          ) : null}
          <Input
            id={id}
            type="number"
            inputMode="decimal"
            min={0}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={cn(suffix === "₹" && "pl-7", suffix === "%" && "pr-8")}
          />
          {suffix === "%" ? (
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm">
              %
            </span>
          ) : null}
        </div>

        {unit && onUnitChange ? (
          <div className="border-input flex overflow-hidden rounded-md border">
            {(["rupees", "percent"] as CostUnit[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => onUnitChange(u)}
                className={cn(
                  "h-9 w-9 text-sm transition-colors",
                  unit === u
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
                aria-pressed={unit === u}
                aria-label={u === "rupees" ? "Rupees" : "Percent of value"}
              >
                {u === "rupees" ? "₹" : "%"}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {hint ? <p className="text-muted-foreground text-[11px]">{hint}</p> : null}
    </div>
  );
}

/* ----------------------------------------------------------------- results */

export function Row({
  label,
  value,
  hint,
  strong,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  strong?: boolean;
  tone?: "primary" | "muted";
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span
        className={cn(
          "text-sm",
          strong ? "font-medium" : "text-muted-foreground"
        )}
      >
        {label}
        {hint ? (
          <span className="text-muted-foreground ml-2 text-[11px]">{hint}</span>
        ) : null}
      </span>
      <span
        className={cn(
          "tabular-nums",
          strong ? "text-base font-semibold" : "text-sm",
          tone === "primary" && "text-primary font-semibold",
          tone === "muted" && "text-muted-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function CostRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <span className="text-muted-foreground text-sm">− {label}</span>
      <span className="text-muted-foreground text-sm tabular-nums">
        {money(value, true)}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------- verdict UI */

const verdictCopy: Record<Verdict, { dot: string; label: string; className: string }> = {
  healthy: {
    dot: "🟢",
    label: "HEALTHY — scale pannalam",
    className: "border-emerald-600/30 bg-emerald-50 text-emerald-900",
  },
  thin: {
    dot: "🟡",
    label: "BREAK-EVEN mela — profit iruku, aana konjam. Optimize pannunga",
    className: "border-amber-600/30 bg-amber-50 text-amber-900",
  },
  loss: {
    dot: "🔴",
    label: "NASHTAM — udane paarunga",
    className: "border-destructive/30 bg-red-50 text-red-900",
  },
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const v = verdictCopy[verdict];
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium",
        v.className
      )}
      role="status"
    >
      <span aria-hidden>{v.dot}</span>
      <span>{v.label}</span>
    </div>
  );
}

/* ------------------------------------------------- contribution stacked bar */

/**
 * Part-to-whole: the costs eat the order value, what is left is contribution.
 * Costs step through one neutral ramp so nothing competes with the red, which
 * is reserved for the number that matters. A 2px gap keeps segments readable.
 */
const costRamp = [
  "#4a463d",
  "#635e53",
  "#7c7669",
  "#95907f",
  "#aea896",
  "#c4bfae",
  "#d8d3c4",
];

export function ContributionBar({
  total,
  costs,
  contribution,
}: {
  total: number;
  costs: { label: string; value: number }[];
  contribution: number;
}) {
  if (!(total > 0)) return null;

  const shown = costs.filter((c) => c.value > 0);
  const segments = [
    ...shown.map((c, i) => ({
      label: c.label,
      value: c.value,
      color: costRamp[i % costRamp.length],
    })),
    ...(contribution > 0
      ? [{ label: "Contribution", value: contribution, color: "var(--primary)" }]
      : []),
  ];

  return (
    <div>
      <div className="flex h-7 w-full gap-[2px] overflow-hidden rounded-md">
        {segments.map((s) => (
          <div
            key={s.label}
            title={`${s.label}: ${money(s.value, true)}`}
            style={{
              width: `${(s.value / total) * 100}%`,
              background: s.color,
            }}
            className="h-full first:rounded-l-md last:rounded-r-md"
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((s) => (
          <span
            key={s.label}
            className="text-muted-foreground flex items-center gap-1.5 text-[11px]"
          >
            <span
              aria-hidden
              className="size-2.5 rounded-[3px]"
              style={{ background: s.color }}
            />
            {s.label}
            <span className="text-foreground tabular-nums">
              {((s.value / total) * 100).toFixed(1)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------- ROAS -> profit scale */

/**
 * "₹1 spend panni 4x eduthaa, profit evlo %?" — the ladder answers it without
 * the client having to hold break-even ROAS in their head.
 */
export function RoasLadder({
  rows,
  breakeven,
  target,
}: {
  rows: { roas: number; margin: number }[];
  breakeven: number;
  target: number;
}) {
  if (rows.length === 0) return null;

  return (
    <div>
      <p className="text-muted-foreground mb-2 text-[11px] tracking-wide uppercase">
        ROAS → profit on revenue
      </p>

      <div className="grid gap-1">
        {rows.map((r) => {
          const isTarget =
            Math.abs(r.roas - target) < 0.25 && Number.isFinite(target);

          return (
            <div
              key={r.roas}
              className={cn(
                "flex items-center justify-between gap-3 rounded-md px-2 py-1 text-sm tabular-nums",
                isTarget && "bg-primary/8 font-medium"
              )}
            >
              <span className="text-muted-foreground">
                {r.roas.toFixed(2)}x
              </span>

              <span
                className={cn(
                  "text-right",
                  r.margin <= 0 ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {r.margin <= 0 ? "no profit" : `${r.margin.toFixed(1)}%`}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-muted-foreground mt-2 text-[11px] leading-relaxed">
        Break-even {breakeven.toFixed(2)}x-la profit 0%. Adhukku mela போற
        ovvoru point-um neradiya profit.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------- notes */

export function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) return null;

  return (
    <div className="grid gap-2">
      {notes.map((n, i) => (
        <Alert
          key={i}
          variant={n.severity === "error" ? "destructive" : "default"}
          className={cn(
            n.severity === "warning" && "border-amber-500/40 bg-amber-50/60"
          )}
        >
          {n.severity === "info" ? (
            <Info className="size-4" />
          ) : (
            <AlertTriangle className="size-4" />
          )}
          <AlertDescription className="text-[13px] leading-relaxed">
            {n.text}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

export function FatalNote({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="size-4" />
      <AlertDescription className="text-[13px]">{message}</AlertDescription>
    </Alert>
  );
}
