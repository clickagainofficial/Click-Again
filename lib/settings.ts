import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

import { getDb } from "@/lib/mongo";

/**
 * Mail settings, edited from /admin/settings and kept in MongoDB rather than
 * env vars, so changing the mailbox never needs a redeploy.
 *
 * The SMTP password is encrypted before it is stored (AES-256-GCM, keyed off
 * AUTH_SECRET), and it never travels back to the browser — the form only
 * learns whether one is saved.
 */

export type SmtpSettings = {
  host: string;
  port: number;
  /** true for implicit TLS (465); false upgrades with STARTTLS (587) */
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  /** where the "new enquiry" alert goes; blank means no alert */
  notifyTo: string;
  /** send the thank-you mail to the person who filled in the form */
  confirmEnabled: boolean;
  /** send the alert to notifyTo */
  notifyEnabled: boolean;
};

/** What the admin form sees: everything except the password itself. */
export type PublicSmtpSettings = Omit<SmtpSettings, "pass"> & { hasPass: boolean };

const COLLECTION = "settings";
const ID = "smtp";

const defaults: SmtpSettings = {
  host: "",
  port: 465,
  secure: true,
  user: "",
  pass: "",
  fromName: "Click Again",
  fromEmail: "",
  notifyTo: "",
  confirmEnabled: true,
  notifyEnabled: true,
};

type SettingsDoc = Omit<SmtpSettings, "pass"> & {
  _id: string;
  passEnc?: string;
  updatedAt?: Date;
};

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return createHash("sha256").update(`smtp:${secret}`).digest();
}

function encrypt(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString("base64")).join(".");
}

function decrypt(stored: string) {
  const [iv, tag, data] = stored.split(".").map((p) => Buffer.from(p, "base64"));
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

async function collection() {
  const db = await getDb();
  return db.collection<SettingsDoc>(COLLECTION);
}

async function readDoc() {
  const col = await collection();
  return col.findOne({ _id: ID });
}

/** The full settings, password included. Server-side use only. */
export async function getSmtpSettings(): Promise<SmtpSettings> {
  const doc = await readDoc();
  if (!doc) return { ...defaults };

  const { _id, passEnc, updatedAt, ...rest } = doc;
  void _id;
  void updatedAt;

  let pass = "";
  if (passEnc) {
    try {
      pass = decrypt(passEnc);
    } catch {
      // AUTH_SECRET changed since it was saved; it has to be entered again
      pass = "";
    }
  }
  return { ...defaults, ...rest, pass };
}

export async function getPublicSmtpSettings(): Promise<PublicSmtpSettings> {
  const { pass, ...rest } = await getSmtpSettings();
  return { ...rest, hasPass: pass.length > 0 };
}

/**
 * Saves the form. A blank password keeps the one already stored, so the
 * admin can change the host without retyping it.
 */
export async function saveSmtpSettings(input: SmtpSettings) {
  const { pass, ...rest } = input;
  const set: Partial<SettingsDoc> = { ...rest, updatedAt: new Date() };
  if (pass) set.passEnc = encrypt(pass);

  const col = await collection();
  await col.updateOne({ _id: ID }, { $set: set }, { upsert: true });
}

/** True once there is enough to actually open a connection. */
export function smtpReady(s: SmtpSettings) {
  return Boolean(s.host && s.port && s.user && s.pass && s.fromEmail);
}
