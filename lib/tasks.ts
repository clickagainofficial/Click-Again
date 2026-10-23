import "server-only";
import { ObjectId } from "mongodb";

import { getDb } from "@/lib/mongo";

/**
 * The to-do list on /admin/tasks: the work still pending on the site and
 * its marketing, who it's waiting on, and how it's going.
 *
 * Stored in the `tasks` collection. The very first time the page loads it's
 * filled with the pending list from the SEO plan (docs/seo-plan.md), so the
 * board starts where that plan left off. A marker in `meta` makes that
 * happen once only: clearing the board later doesn't bring the list back,
 * and two first visits at once can't both fill it.
 */

export const OWNERS = ["kansha", "claude"] as const;
export const STATUSES = ["todo", "doing", "on_hold", "done"] as const;
export const PRIORITIES = ["high", "medium", "low"] as const;
export const GROUPS = ["build", "you", "later", "regular", "future"] as const;

export type Owner = (typeof OWNERS)[number];
export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Group = (typeof GROUPS)[number];

export type Task = {
  id: string;
  title: string;
  details: string;
  owner: Owner;
  group: Group;
  status: Status;
  priority: Priority;
  /** ISO "YYYY-MM-DD", or "" for none. */
  due: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;

type TaskDoc = Omit<Task, "id" | "createdAt" | "updatedAt"> & {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const COLLECTION = "tasks";

async function collection() {
  const db = await getDb();
  return db.collection<TaskDoc>(COLLECTION);
}

function toTask(doc: TaskDoc): Task {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    details: doc.details ?? "",
    owner: doc.owner,
    group: doc.group,
    status: doc.status,
    priority: doc.priority,
    due: doc.due ?? "",
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

/** Checks and tidies what the browser sent. Returns an error message or the clean value. */
export function parseTask(
  body: Record<string, unknown>,
  partial = false
): { ok: true; value: Partial<TaskInput> } | { ok: false; error: string } {
  const out: Partial<TaskInput> = {};
  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : undefined);
  const pick = <T extends string>(k: string, allowed: readonly T[]) => {
    const v = str(k);
    if (v === undefined) return undefined;
    return (allowed as readonly string[]).includes(v) ? (v as T) : null;
  };

  const title = str("title");
  if (title !== undefined) {
    if (!title) return { ok: false, error: "Give the task a title." };
    if (title.length > 200) return { ok: false, error: "Keep the title under 200 characters." };
    out.title = title;
  } else if (!partial) return { ok: false, error: "Give the task a title." };

  const details = str("details");
  if (details !== undefined) {
    if (details.length > 4000) return { ok: false, error: "Keep the details under 4,000 characters." };
    out.details = details;
  }

  for (const [key, allowed] of [
    ["owner", OWNERS],
    ["group", GROUPS],
    ["status", STATUSES],
    ["priority", PRIORITIES],
  ] as const) {
    const v = pick(key, allowed);
    if (v === null) return { ok: false, error: `That ${key} isn't one of the options.` };
    if (v !== undefined) (out as Record<string, string>)[key] = v;
  }

  const due = str("due");
  if (due !== undefined) {
    if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) return { ok: false, error: "Due date should be a date." };
    out.due = due;
  }

  if (!partial) {
    out.details ??= "";
    out.owner ??= "kansha";
    out.group ??= "you";
    out.status ??= "todo";
    out.priority ??= "medium";
    out.due ??= "";
  }
  return { ok: true, value: out };
}

export type TasksResult = { ok: true; rows: Task[] } | { ok: false; error: string };

export async function listTasks(): Promise<TasksResult> {
  if (!process.env.MONGODB_URI) {
    return { ok: false, error: "MONGODB_URI is not set for this environment." };
  }
  try {
    await seedOnce();
    const col = await collection();
    const docs = await col.find({}).sort({ createdAt: 1 }).toArray();
    return { ok: true, rows: docs.map(toTask) };
  } catch (err) {
    return { ok: false, error: `Could not reach the database: ${String(err)}` };
  }
}

export async function openTaskCount() {
  if (!process.env.MONGODB_URI) return 0;
  try {
    const col = await collection();
    return await col.countDocuments({ status: { $in: ["todo", "doing"] } });
  } catch {
    return 0;
  }
}

export async function createTask(input: TaskInput) {
  const col = await collection();
  const now = new Date();
  const { insertedId } = await col.insertOne({ ...input, _id: new ObjectId(), createdAt: now, updatedAt: now });
  return toTask((await col.findOne({ _id: insertedId }))!);
}

export async function updateTask(id: string, patch: Partial<TaskInput>) {
  if (!ObjectId.isValid(id)) return null;
  const col = await collection();
  const doc = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  return doc ? toTask(doc) : null;
}

export async function deleteTask(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const col = await collection();
  const { deletedCount } = await col.deleteOne({ _id: new ObjectId(id) });
  return deletedCount === 1;
}

/** The pending list from docs/seo-plan.md as of 23 Oct 2026. */
const STARTING_TASKS: TaskInput[] = [
  // Built in the code; waiting on Kansha's OK or an input
  { title: "Related guide box on solution pages", details: "Solution pages show the matching guide: retention → WhatsApp plan, performance → break-even ROAS, strategy → choosing an agency. Helps the posts get crawled and indexed.", owner: "claude", group: "build", status: "done", priority: "high", due: "" },
  { title: "Madurai section on the home page", details: "For the 'best marketing agency in Madurai' goal. What we do for businesses here, plus a short Madurai FAQ. Needs your design OK.", owner: "claude", group: "build", status: "todo", priority: "high", due: "" },
  { title: "Brand line under the home page heading", details: "A small line under the H1: 'Click Again — marketing agency in Madurai'. Needs your design OK.", owner: "claude", group: "build", status: "todo", priority: "medium", due: "" },
  { title: "Add the GA4 tracking tag", details: "Waiting on the GA4 Measurement ID (G-XXXX) once the property is created.", owner: "claude", group: "build", status: "on_hold", priority: "medium", due: "" },
  { title: "Office location (geo) in the schema", details: "Needs the office's Google Maps coordinates.", owner: "claude", group: "build", status: "on_hold", priority: "low", due: "" },
  { title: "Next blog posts", details: "2–4 posts a month. Honest how-to guides, no invented stats, each linked to its solution page.", owner: "claude", group: "build", status: "todo", priority: "medium", due: "" },
  { title: "Make http://www redirect in one hop", details: "Today it's http://www → https://www → https://clickagain.in. Change it in the Vercel domain settings.", owner: "claude", group: "build", status: "todo", priority: "low", due: "" },
  { title: "Send contact-form mail from Workspace", details: "Optional. Move the admin SMTP settings from Gmail to hello@clickagain.in.", owner: "claude", group: "build", status: "todo", priority: "low", due: "" },

  // Kansha, quick ones
  { title: "Check the 3 guides are indexed", details: "Bing Webmaster and Google Search Console → URL Inspection for all three insight URLs. Request indexing again if they aren't in yet.", owner: "kansha", group: "you", status: "todo", priority: "high", due: "2026-10-26" },
  { title: "Confirm the Facebook page details", details: "Bio, hello@clickagain.in, +91 95664 02201, website, hours Mon–Fri 9:30–7:30.", owner: "kansha", group: "you", status: "todo", priority: "medium", due: "" },
  { title: "Create the GA4 property", details: "analytics.google.com with kansha@clickagain.in. Send the Measurement ID so the tag can go on the site.", owner: "kansha", group: "you", status: "todo", priority: "medium", due: "" },
  { title: "Trademark check for 'Click Again'", details: "IP India, class 35. Another page used 'ClickAgain' for digital marketing. Talk to a trademark attorney.", owner: "kansha", group: "you", status: "todo", priority: "high", due: "" },
  { title: "Upload the SEO skill to claude.ai", details: "D:\\ClickAgain\\skills\\kansha-seo-skill.zip → Settings → Capabilities → Skills. Turn off seo-master and seo-aeo-strategist.", owner: "kansha", group: "you", status: "todo", priority: "low", due: "" },

  // Deferred by Kansha
  { title: "Office name board, then Google Business Profile", details: "Needs a board outside for video verification. Then: name exactly 'Click Again', category Marketing agency, address, phone, hours, photos, services, weekly posts. The biggest win for brand searches and Maps.", owner: "kansha", group: "later", status: "on_hold", priority: "high", due: "" },
  { title: "LinkedIn company page", details: "Same name, logo and bio, link to clickagain.in. Link Kansha's profile to it. Add to the schema sameAs.", owner: "kansha", group: "later", status: "on_hold", priority: "high", due: "" },
  { title: "YouTube channel and one video", details: "A 30–60 second 'Click Again — marketing agency in Madurai' video, to push the old 'Click Again' song down the brand search.", owner: "kansha", group: "later", status: "on_hold", priority: "medium", due: "" },
  { title: "X (Twitter) profile", details: "Optional. Same name, bio and link.", owner: "kansha", group: "later", status: "on_hold", priority: "low", due: "" },
  { title: "Directory listings", details: "Bing Places, Apple Business Connect, Justdial, Sulekha, Clutch, GoodFirms, DesignRush, Crunchbase. Same NAP everywhere; do it once the address is final.", owner: "kansha", group: "later", status: "on_hold", priority: "medium", due: "" },
  { title: "Founder LinkedIn in the schema", details: "On hold: Kansha said not now.", owner: "claude", group: "later", status: "on_hold", priority: "low", due: "" },

  // Regular
  { title: "Compare Google results", details: "Search site:clickagain.in and 'click again', take screenshots and compare with 22 Oct.", owner: "kansha", group: "regular", status: "todo", priority: "medium", due: "2026-10-29" },
  { title: "Search Console Pages report", details: "Weekly: look for excluded or not-indexed pages.", owner: "kansha", group: "regular", status: "todo", priority: "medium", due: "" },
  { title: "Instagram and Facebook posts", details: "2–3 a week.", owner: "kansha", group: "regular", status: "todo", priority: "medium", due: "" },
  { title: "Ask ChatGPT about Click Again", details: "Monthly, with web search on: 'What is Click Again, the marketing agency in Madurai?' Note the answer in docs/seo-plan.md.", owner: "kansha", group: "regular", status: "todo", priority: "low", due: "2026-11-23" },
  { title: "Backlinks and mentions", details: "Madurai business associations, local news, guest posts, Kansha's LinkedIn posts linking the site.", owner: "kansha", group: "regular", status: "todo", priority: "medium", due: "" },
  { title: "Google reviews from real clients", details: "Once there are clients. Ask every one, reply to every review, never buy or swap.", owner: "kansha", group: "regular", status: "on_hold", priority: "medium", due: "" },

  // When something happens
  { title: "When Branding launches: add '& Branding'", details: "Title becomes 'Click Again — Marketing & Branding Agency in Madurai'. Update schema alternateName, social bios and listings, and add /solutions/branding.", owner: "claude", group: "future", status: "on_hold", priority: "low", due: "" },
  { title: "When the office moves: update the address everywhere", details: "site.config.ts (one line), Business Profile, every directory and the NAP table in docs/seo-plan.md. Put the full street address in the footer.", owner: "claude", group: "future", status: "on_hold", priority: "low", due: "" },
];

async function seedOnce() {
  const db = await getDb();
  try {
    // a duplicate key here means the list was already seeded
    await db.collection<{ _id: string; at: Date }>("meta").insertOne({ _id: "tasks-seeded", at: new Date() });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) return;
    throw err;
  }
  const col = await collection();
  const start = Date.now();
  await col.insertMany(
    STARTING_TASKS.map((t, i) => {
      // a millisecond apart, so the board keeps this order
      const at = new Date(start + i);
      return { ...t, _id: new ObjectId(), createdAt: at, updatedAt: at };
    })
  );
}
