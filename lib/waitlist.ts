import "server-only";
import { getDb } from "@/lib/mongo";

export type Signup = {
  email: string;
  source: string;
  userAgent: string;
  createdAt: string; // ISO
};

export type WaitlistResult =
  | { ok: true; rows: Signup[] }
  | { ok: false; error: string };

const COLLECTION = "waitlist";

type SignupDoc = {
  email: string;
  source?: string;
  userAgent?: string;
  createdAt?: Date | string;
};

async function collection() {
  const db = await getDb();
  const col = db.collection<SignupDoc>(COLLECTION);
  // idempotent: one row per address, however many times the form is submitted
  await col.createIndex({ email: 1 }, { unique: true });
  await col.createIndex({ createdAt: -1 });
  return col;
}

function toSignup(doc: SignupDoc): Signup {
  const created = doc.createdAt;
  return {
    email: doc.email,
    source: doc.source ?? "",
    userAgent: doc.userAgent ?? "",
    createdAt:
      created instanceof Date
        ? created.toISOString()
        : typeof created === "string"
          ? created
          : "",
  };
}

/** Adds one signup. Returns `duplicate` when the address is already on the list. */
export async function addSignup(input: {
  email: string;
  source: string;
  userAgent: string;
}): Promise<{ ok: true; duplicate: boolean }> {
  const col = await collection();

  const result = await col.updateOne(
    { email: input.email },
    {
      $setOnInsert: {
        email: input.email,
        source: input.source,
        userAgent: input.userAgent,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  return { ok: true, duplicate: result.upsertedCount === 0 };
}

export async function listSignups(): Promise<WaitlistResult> {
  if (!process.env.MONGODB_URI) {
    return { ok: false, error: "MONGODB_URI is not set for this environment." };
  }

  try {
    const col = await collection();
    const docs = await col.find({}).sort({ createdAt: -1 }).limit(5000).toArray();
    return { ok: true, rows: docs.map(toSignup) };
  } catch (err) {
    return { ok: false, error: `Could not reach the database: ${String(err)}` };
  }
}

/** Counts used by the dashboard tiles. */
export function summarise(rows: Signup[]) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const parsed = rows
    .map((r) => Date.parse(r.createdAt))
    .filter((t) => !Number.isNaN(t));

  return {
    total: rows.length,
    today: parsed.filter((t) => t >= startOfToday.getTime()).length,
    week: parsed.filter((t) => now - t <= 7 * day).length,
    latest: rows[0]?.createdAt ?? "",
  };
}

/** Signup counts for the last `days` days, oldest first. */
export function dailyCounts(rows: Signup[], days = 14) {
  const buckets: { label: string; date: string; count: number }[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(start);
    d.setDate(d.getDate() - i);
    buckets.push({
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      date: d.toDateString(),
      count: 0,
    });
  }

  const index = new Map(buckets.map((b, i) => [b.date, i]));
  for (const row of rows) {
    const t = Date.parse(row.createdAt);
    if (Number.isNaN(t)) continue;
    const i = index.get(new Date(t).toDateString());
    if (i !== undefined) buckets[i].count += 1;
  }

  return buckets;
}
