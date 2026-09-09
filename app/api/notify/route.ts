import { NextResponse } from "next/server";
import { addSignup } from "@/lib/waitlist";

/**
 * Waitlist endpoint. Signups go straight into MongoDB — the same collection
 * the admin dashboard reads.
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

  try {
    await addSignup({
      email,
      source: "coming-soon",
      userAgent: req.headers.get("user-agent") ?? "",
    });
  } catch (err) {
    console.error("[clickagain] could not save signup:", err, "| email:", email);
    return NextResponse.json(
      { error: "Couldn't save that right now. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
