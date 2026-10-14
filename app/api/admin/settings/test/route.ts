import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { confirmationMail, sampleEnquiry } from "@/lib/emailTemplates";
import { sendTestMail } from "@/lib/mailer";
import { getSmtpSettings } from "@/lib/settings";

import { EMAIL_RE, parseSmtp } from "../parse";

/**
 * Sends the customer thank-you mail, with sample details, to an address of
 * your choosing — using the settings currently on the form, saved or not.
 * A blank password on the form falls back to the one already saved.
 */
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const to = typeof body.to === "string" ? body.to.trim() : "";
  if (!EMAIL_RE.test(to)) {
    return NextResponse.json({ error: "Enter an address to send the test to." }, { status: 400 });
  }

  const parsed = parseSmtp(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const s = parsed.value;
  if (!s.pass) s.pass = (await getSmtpSettings()).pass;
  if (!s.pass) {
    return NextResponse.json({ error: "Enter the SMTP password." }, { status: 400 });
  }

  try {
    await sendTestMail(s, to, confirmationMail({ ...sampleEnquiry, email: to }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Mail server said: ${message}` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
