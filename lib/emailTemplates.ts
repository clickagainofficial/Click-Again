import "server-only";

import { LOGO_CID } from "@/lib/mailLogo";
import { site } from "@/site.config";

/**
 * The two mails an enquiry sends, drawn in the site's colours.
 *
 * Email clients ignore stylesheets and half of CSS, so this is the old way:
 * nested tables, inline styles, web-safe font fallbacks, and the logo sent
 * along as an inline attachment. Every value that came from the form is
 * escaped before it goes anywhere near the HTML.
 */

const c = {
  peach: "#fff6f0",
  line: "#f7e0d1",
  ink: "#1e1411",
  ink70: "#4d382f",
  ink50: "#866a5c",
  red: "#be0919",
  white: "#ffffff",
};

const font = "Poppins, 'Segoe UI', Helvetica, Arial, sans-serif";

export type EnquiryMail = {
  name: string;
  email: string;
  phone: string;
  business: string;
  service: string;
  description: string;
};

export type Mail = { subject: string; html: string; text: string };

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** 9876543210 → 98765 43210 */
function phone(p: string) {
  return /^\d{10}$/.test(p) ? `${p.slice(0, 5)} ${p.slice(5)}` : p;
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? "";
}

/** The frame both mails share: peach ground, logo, white card, footer. */
function frame({ preheader, body }: { preheader: string; body: string }) {
  // attached to the mail itself (see lib/mailLogo.ts), not linked
  const logo = `cid:${LOGO_CID}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(site.name)}</title>
</head>
<body style="margin:0;padding:0;background:${c.peach};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;color:${c.peach};">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.peach};">
  <tr>
    <td align="center" style="padding:36px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
        <tr>
          <td style="padding:0 4px 22px;">
            <a href="${site.url}" style="text-decoration:none;">
              <img src="${logo}" width="150" height="28" alt="${esc(site.name)}" style="display:block;width:150px;height:auto;border:0;">
            </a>
          </td>
        </tr>
        <tr>
          <td style="background:${c.white};border:1px solid ${c.line};border-radius:18px;padding:34px 32px;font-family:${font};color:${c.ink};">
            ${body}
          </td>
        </tr>
        <tr>
          <td style="padding:22px 6px 0;font-family:${font};font-size:12px;line-height:1.6;color:${c.ink50};">
            ${esc(site.legal.entity)}<br>
            ${esc(site.legal.address)}<br>
            <a href="${site.url}" style="color:${c.ink50};">${esc(site.domain)}</a>
            &nbsp;·&nbsp;
            <a href="mailto:${site.email}" style="color:${c.ink50};">${esc(site.email)}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** Label / value rows, in a peach panel. */
function details(rows: [string, string][]) {
  const cells = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) => `<tr>
        <td valign="top" style="padding:8px 0;width:118px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${c.ink50};">${esc(k)}</td>
        <td valign="top" style="padding:8px 0;font-size:15px;line-height:1.5;color:${c.ink};white-space:pre-wrap;">${esc(v)}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.peach};border-radius:12px;">
    <tr><td style="padding:12px 18px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${cells}</table>
    </td></tr>
  </table>`;
}

function button(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="background:${c.red};border-radius:999px;">
      <a href="${href}" style="display:inline-block;padding:13px 26px;font-family:${font};font-size:15px;font-weight:700;color:${c.white};text-decoration:none;">${esc(label)}</a>
    </td>
  </tr></table>`;
}

/** To the person who filled in the form. */
export function confirmationMail(e: EnquiryMail): Mail {
  const first = firstName(e.name);
  const subject = `We've got your enquiry, ${first}`;

  const body = `
    <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${c.red};">Enquiry received</p>
    <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:800;letter-spacing:-0.02em;color:${c.ink};">Thanks, ${esc(first)}.</h1>
    <p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:${c.ink70};">
      We have your details for <b style="color:${c.ink};">${esc(e.business)}</b>. Someone from our team will call you on
      <b style="color:${c.ink};white-space:nowrap;">${esc(phone(e.phone))}</b> within a working day.
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:${c.ink70};">
      On that call we'll ask what you sell, who buys it, and what you want more of — so we can tell you honestly what would help.
    </p>
    ${details([
      ["Service", e.service],
      ["Business", e.business],
      ["Phone", phone(e.phone)],
      ["Your note", e.description],
    ])}
    <p style="margin:24px 0 22px;font-size:15px;line-height:1.65;color:${c.ink70};">
      Something to add, or a detail that's wrong? Just reply to this mail.
    </p>
    ${button(`${site.url}/solutions`, "See what we do")}
    <p style="margin:30px 0 0;font-size:15px;line-height:1.6;color:${c.ink};">
      — Team ${esc(site.name)}<br>
      <span style="color:${c.ink50};">Don't just make them buy once. Make them <b style="color:${c.red};">click again</b>.</span>
    </p>`;

  const text = [
    `Thanks, ${first}.`,
    "",
    `We have your details for ${e.business}. Someone from our team will call you on ${phone(e.phone)} within a working day.`,
    "",
    `Service: ${e.service}`,
    e.description ? `Your note: ${e.description}` : "",
    "",
    "Something to add? Just reply to this mail.",
    "",
    `— Team ${site.name}`,
    site.url,
  ]
    .filter((l, i, a) => l || a[i - 1])
    .join("\n");

  return {
    subject,
    html: frame({ preheader: `We'll call you within a working day.`, body }),
    text,
  };
}

/** To the team, so nobody has to keep refreshing the admin page. */
export function notificationMail(e: EnquiryMail): Mail {
  const subject = `New enquiry: ${e.name} — ${e.business}`;
  const admin = `${site.url}/admin/enquiries`;

  const body = `
    <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${c.red};">New enquiry</p>
    <h1 style="margin:0 0 20px;font-size:26px;line-height:1.2;font-weight:800;letter-spacing:-0.02em;color:${c.ink};">${esc(e.name)} wants ${esc(e.service)}</h1>
    ${details([
      ["Name", e.name],
      ["Business", e.business],
      ["Phone", phone(e.phone)],
      ["Email", e.email],
      ["Service", e.service],
      ["Note", e.description],
    ])}
    <p style="margin:24px 0 18px;font-size:15px;line-height:1.6;color:${c.ink70};">
      They were promised a call back within a working day.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td>${button(`tel:+91${e.phone}`, "Call now")}</td>
      <td style="padding-left:10px;">
        <a href="https://wa.me/91${e.phone}" style="display:inline-block;padding:12px 22px;border:1px solid ${c.line};border-radius:999px;font-family:${font};font-size:15px;font-weight:700;color:${c.ink};text-decoration:none;">WhatsApp</a>
      </td>
    </tr></table>
    <p style="margin:22px 0 0;font-size:13px;color:${c.ink50};">
      All enquiries: <a href="${admin}" style="color:${c.red};">${esc(admin)}</a>
    </p>`;

  const text = [
    `New enquiry from ${e.name} (${e.business})`,
    "",
    `Phone: ${phone(e.phone)}`,
    `Email: ${e.email}`,
    `Service: ${e.service}`,
    e.description ? `Note: ${e.description}` : "",
    "",
    admin,
  ].join("\n");

  return {
    subject,
    html: frame({ preheader: `${e.business} · ${phone(e.phone)}`, body }),
    text,
  };
}

/** A sample of the customer mail, for the "send test" button in settings. */
export const sampleEnquiry: EnquiryMail = {
  name: "Test Customer",
  email: "",
  phone: "9876543210",
  business: "Sample Business",
  service: site.services[0]?.title ?? "Marketing Strategy",
  description: "This is a test mail from the Click Again admin settings.",
};
