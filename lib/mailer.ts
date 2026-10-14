import "server-only";
import nodemailer from "nodemailer";

import {
  confirmationMail,
  notificationMail,
  type EnquiryMail,
  type Mail,
} from "@/lib/emailTemplates";
import { logoAttachment } from "@/lib/mailLogo";
import { getSmtpSettings, smtpReady, type SmtpSettings } from "@/lib/settings";

/**
 * Sends mail through whatever SMTP account is saved in admin settings. The
 * transport is built per call: settings can change at any time, and an
 * enquiry is rare enough that pooling connections buys nothing.
 */

function transport(s: SmtpSettings) {
  return nodemailer.createTransport({
    host: s.host,
    port: s.port,
    secure: s.secure,
    auth: { user: s.user, pass: s.pass },
    // fail fast rather than holding a serverless function open
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

function from(s: SmtpSettings) {
  return { name: s.fromName || "Click Again", address: s.fromEmail };
}

async function send(s: SmtpSettings, to: string, mail: Mail, replyTo?: string) {
  await transport(s).sendMail({
    from: from(s),
    to,
    replyTo,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    attachments: [logoAttachment],
  });
}

export type MailOutcome = "sent" | "failed" | "off";

/**
 * The thank-you to the customer and the alert to the team. Each is tried on
 * its own, so one failing never stops the other, and neither ever throws —
 * the enquiry is already saved by the time this runs.
 */
export async function sendEnquiryMails(e: EnquiryMail) {
  const result: { confirm: MailOutcome; notify: MailOutcome } = {
    confirm: "off",
    notify: "off",
  };

  let s: SmtpSettings;
  try {
    s = await getSmtpSettings();
  } catch (err) {
    console.error("[clickagain] could not read mail settings:", err);
    return result;
  }
  if (!smtpReady(s)) return result;

  if (s.confirmEnabled && e.email) {
    try {
      // replies land in the team inbox, not the sending mailbox
      await send(s, e.email, confirmationMail(e), s.notifyTo || undefined);
      result.confirm = "sent";
    } catch (err) {
      console.error("[clickagain] confirmation mail failed:", err);
      result.confirm = "failed";
    }
  }

  if (s.notifyEnabled && s.notifyTo) {
    try {
      // replying to the alert answers the customer directly
      await send(s, s.notifyTo, notificationMail(e), e.email || undefined);
      result.notify = "sent";
    } catch (err) {
      console.error("[clickagain] notification mail failed:", err);
      result.notify = "failed";
    }
  }

  return result;
}

/** Used by the settings page: checks the login, then sends a real sample. */
export async function sendTestMail(s: SmtpSettings, to: string, mail: Mail) {
  const t = transport(s);
  await t.verify();
  await t.sendMail({
    from: from(s),
    to,
    subject: `[Test] ${mail.subject}`,
    html: mail.html,
    text: mail.text,
    attachments: [logoAttachment],
  });
}
