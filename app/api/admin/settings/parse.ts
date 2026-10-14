import type { SmtpSettings } from "@/lib/settings";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (v: unknown, max = 200) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** Turns the posted form into settings, or says what is wrong with it. */
export function parseSmtp(
  body: Record<string, unknown>
): { ok: true; value: SmtpSettings } | { ok: false; error: string } {
  const port = Number(body.port);
  const value: SmtpSettings = {
    host: text(body.host),
    port,
    secure: body.secure === true,
    user: text(body.user),
    // passwords are taken as typed; app passwords can carry spaces
    pass: typeof body.pass === "string" ? body.pass.slice(0, 500) : "",
    fromName: text(body.fromName, 80),
    fromEmail: text(body.fromEmail),
    notifyTo: text(body.notifyTo),
    confirmEnabled: body.confirmEnabled === true,
    notifyEnabled: body.notifyEnabled === true,
  };

  if (!value.host) return { ok: false, error: "Enter the SMTP host." };
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return { ok: false, error: "Port must be a number between 1 and 65535." };
  }
  if (!value.user) return { ok: false, error: "Enter the SMTP username." };
  if (!EMAIL_RE.test(value.fromEmail)) {
    return { ok: false, error: "Enter a valid From email address." };
  }
  if (value.notifyTo && !EMAIL_RE.test(value.notifyTo)) {
    return { ok: false, error: "The alert address isn't a valid email." };
  }
  return { ok: true, value };
}

export { EMAIL_RE };
