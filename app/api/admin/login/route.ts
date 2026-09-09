import { NextResponse } from "next/server";
import { SESSION_COOKIE, createSession, safeEqual } from "@/lib/session";

/**
 * Single-user login. The credentials live in environment variables — never
 * in the repository, which is public.
 */

// Slow down guessing. Per instance, so it is a speed bump rather than a wall,
// but it turns an online brute force into something impractical.
const MAX_ATTEMPTS = 6;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, number[]>();

function tooManyAttempts(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 2000) attempts.clear();
  return recent.length > MAX_ATTEMPTS;
}

export async function POST(req: Request) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword || !process.env.AUTH_SECRET) {
    console.error("[clickagain] admin login is not configured");
    return NextResponse.json(
      { error: "Admin login is not configured on the server." },
      { status: 500 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (tooManyAttempts(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Wait 15 minutes and try again." },
      { status: 429 }
    );
  }

  let email = "";
  let password = "";
  try {
    const body = await req.json();
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const emailOk = safeEqual(email, adminEmail.trim().toLowerCase());
  const passwordOk = safeEqual(password, adminPassword);

  // one message for both, so a wrong email cannot be told from a wrong password
  if (!emailOk || !passwordOk) {
    return NextResponse.json(
      { error: "Those details don't match." },
      { status: 401 }
    );
  }

  const { token, maxAge } = await createSession(adminEmail);
  const res = NextResponse.json({ ok: true });

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });

  return res;
}
