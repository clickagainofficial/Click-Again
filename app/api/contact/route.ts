import { after, NextResponse } from "next/server";
import { addEnquiry } from "@/lib/enquiries";
import { sendEnquiryMails } from "@/lib/mailer";
import { site } from "@/site.config";

/**
 * The /contact form. Enquiries go into MongoDB, next to the waitlist, and
 * show up under Enquiries in the admin dashboard.
 */

// An Indian mobile: 10 digits starting 6-9, with an optional +91 / 91 / 0
// in front. Spaces and dashes are stripped before the check.
const PHONE_RE = /^(?:\+?91|0)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVICES = new Set<string>([
  ...site.services.map((s) => s.title),
  "Not sure yet",
]);

const LIMITS = { name: 80, email: 120, business: 120, description: 2000 };

// Best-effort throttle, as on the waitlist: trims obvious hammering rather
// than acting as a hard guarantee across serverless instances.
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

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill every field they find. Humans never see this one.
  if (text(body.website)) return NextResponse.json({ ok: true });

  const name = text(body.name);
  const email = text(body.email).toLowerCase();
  const phone = text(body.phone).replace(/[\s-]/g, "");
  const business = text(body.business);
  const service = text(body.service);
  const description = text(body.description);

  if (!name || name.length > LIMITS.name) {
    return NextResponse.json({ error: "Tell us your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json(
      { error: "Enter a 10-digit mobile number." },
      { status: 400 }
    );
  }
  if (!business || business.length > LIMITS.business) {
    return NextResponse.json(
      { error: "Tell us the name of your business." },
      { status: 400 }
    );
  }
  if (!SERVICES.has(service)) {
    return NextResponse.json(
      { error: "Pick the service you are interested in." },
      { status: 400 }
    );
  }
  if (description.length > LIMITS.description) {
    return NextResponse.json(
      { error: "That description is a little long — keep it under 2000 characters." },
      { status: 400 }
    );
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

  const enquiry = {
    name,
    email,
    // stored as the last ten digits, so the admin list reads consistently
    phone: phone.slice(-10),
    business,
    service,
    description,
  };

  try {
    await addEnquiry({ ...enquiry, userAgent: req.headers.get("user-agent") ?? "" });
  } catch (err) {
    console.error("[clickagain] could not save enquiry:", err);
    return NextResponse.json(
      { error: "Couldn't send that right now. Please try again." },
      { status: 502 }
    );
  }

  // The thank-you and the team alert go out after the response, so a slow
  // mail server never keeps the visitor waiting — and a failed send never
  // loses an enquiry that is already saved.
  after(() => sendEnquiryMails(enquiry));

  return NextResponse.json({ ok: true });
}
