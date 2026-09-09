import "server-only";

export type Signup = {
  timestamp: string;
  email: string;
  source: string;
  userAgent: string;
};

export type WaitlistResult =
  | { ok: true; rows: Signup[] }
  | { ok: false; error: string };

/**
 * Reads the waitlist straight from the Apps Script webhook.
 *
 * The same endpoint that accepts signups also answers `action: "list"` once
 * the script has been updated — see docs/google-sheet-setup.md. If it has
 * not been, this returns a readable error instead of throwing, so the
 * dashboard can tell you exactly what to fix.
 */
export async function fetchSignups(): Promise<WaitlistResult> {
  const webhook = process.env.SHEET_WEBHOOK_URL;
  if (!webhook) {
    return { ok: false, error: "SHEET_WEBHOOK_URL is not set for this environment." };
  }

  let text: string;
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: process.env.SHEET_WEBHOOK_TOKEN ?? "",
        action: "list",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return { ok: false, error: `The sheet webhook returned ${res.status}.` };
    text = await res.text();
  } catch (err) {
    return { ok: false, error: `Could not reach the sheet: ${String(err)}` };
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: "The sheet webhook did not return JSON. The Apps Script probably threw — check its Executions tab.",
    };
  }

  const body = data as { rows?: unknown; error?: string };

  if (body?.error) return { ok: false, error: String(body.error) };

  if (!Array.isArray(body?.rows)) {
    return {
      ok: false,
      error:
        'The Apps Script does not support listing yet. Paste the updated script from docs/google-sheet-setup.md and deploy a new version.',
    };
  }

  const rows: Signup[] = body.rows
    .map((row) => {
      const r = row as Record<string, unknown>;
      return {
        timestamp: String(r.timestamp ?? ""),
        email: String(r.email ?? ""),
        source: String(r.source ?? ""),
        userAgent: String(r.userAgent ?? ""),
      };
    })
    .filter((r) => r.email)
    // newest first
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

  return { ok: true, rows };
}

/** Counts used by the dashboard tiles. */
export function summarise(rows: Signup[]) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const parsed = rows.map((r) => Date.parse(r.timestamp)).filter((t) => !Number.isNaN(t));

  return {
    total: rows.length,
    today: parsed.filter((t) => t >= startOfToday.getTime()).length,
    week: parsed.filter((t) => now - t <= 7 * day).length,
    latest: rows[0]?.timestamp ?? "",
  };
}

/** Signup counts for the last `days` days, oldest first. */
export function dailyCounts(rows: Signup[], days = 14) {
  const buckets: { label: string; date: string; count: number }[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(start);
    d.setDate(d.getDate() - i);
    buckets.push({
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      date: d.toDateString(),
      count: 0,
    });
  }

  const index = new Map(buckets.map((b, i) => [b.date, i]));
  for (const row of rows) {
    const t = Date.parse(row.timestamp);
    if (Number.isNaN(t)) continue;
    const key = new Date(t).toDateString();
    const i = index.get(key);
    if (i !== undefined) buckets[i].count += 1;
  }

  return buckets;
}
