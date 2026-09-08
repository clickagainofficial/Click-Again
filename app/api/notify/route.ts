import { NextResponse } from "next/server";

/**
 * Waitlist endpoint -> Google Sheet.
 *
 * Set SHEET_WEBHOOK_URL and SHEET_WEBHOOK_TOKEN in .env.local (and in the
 * Vercel project settings). Setup steps: docs/google-sheet-setup.md
 *
 * With no webhook configured the address is only logged, so local development
 * keeps working without secrets.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort throttle. Serverless spins up several instances, so this trims
// obvious hammering rather than acting as a hard guarantee.
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

export async function POST(req: Request) {
  let email = "";
  let honeypot = "";

  try {
    const body = await req.json();
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    honeypot = typeof body?.company === "string" ? body.company : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill every field they find. Humans never see this one.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  const webhook = process.env.SHEET_WEBHOOK_URL;

  if (!webhook) {
    console.warn("[clickagain] SHEET_WEBHOOK_URL not set — signup not stored:", email);
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: process.env.SHEET_WEBHOOK_TOKEN ?? "",
        email,
        source: "coming-soon",
        userAgent: req.headers.get("user-agent") ?? "",
      }),
      // Apps Script is occasionally slow to warm up
      signal: AbortSignal.timeout(9000),
    });

    if (!res.ok) throw new Error(`sheet webhook returned ${res.status}`);

    // Apps Script answers 200 even when the script itself throws, so the
    // status code alone proves nothing — the body has to confirm the write.
    const text = (await res.text()).slice(0, 500);
    let saved = false;
    try {
      saved = JSON.parse(text)?.ok === true;
    } catch {
      saved = false;
    }
    if (!saved) throw new Error(`sheet webhook did not confirm: ${text}`);
  } catch (err) {
    console.error("[clickagain] sheet webhook failed:", err, "| email:", email);
    return NextResponse.json(
      { error: "Couldn't save that right now. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
