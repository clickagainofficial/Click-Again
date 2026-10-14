import "server-only";
import { getDb } from "@/lib/mongo";

/** One submission of the form on /contact. */
export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  business: string;
  service: string;
  description: string;
  userAgent: string;
  createdAt: string; // ISO
};

export type EnquiriesResult =
  | { ok: true; rows: Enquiry[] }
  | { ok: false; error: string };

const COLLECTION = "enquiries";

type EnquiryDoc = Omit<Enquiry, "createdAt"> & { createdAt?: Date | string };

async function collection() {
  const db = await getDb();
  const col = db.collection<EnquiryDoc>(COLLECTION);
  await col.createIndex({ createdAt: -1 });
  return col;
}

function toEnquiry(doc: EnquiryDoc): Enquiry {
  const created = doc.createdAt;
  return {
    name: doc.name ?? "",
    email: doc.email ?? "",
    phone: doc.phone ?? "",
    business: doc.business ?? "",
    service: doc.service ?? "",
    description: doc.description ?? "",
    userAgent: doc.userAgent ?? "",
    createdAt:
      created instanceof Date
        ? created.toISOString()
        : typeof created === "string"
          ? created
          : "",
  };
}

/** Stores one enquiry. Unlike the waitlist, every submission is kept — the
 *  same person writing twice usually has something new to say. */
export async function addEnquiry(input: Omit<Enquiry, "createdAt">) {
  const col = await collection();
  await col.insertOne({ ...input, createdAt: new Date() });
}

export async function listEnquiries(): Promise<EnquiriesResult> {
  if (!process.env.MONGODB_URI) {
    return { ok: false, error: "MONGODB_URI is not set for this environment." };
  }

  try {
    const col = await collection();
    const docs = await col.find({}).sort({ createdAt: -1 }).limit(5000).toArray();
    return { ok: true, rows: docs.map(toEnquiry) };
  } catch (err) {
    return { ok: false, error: `Could not reach the database: ${String(err)}` };
  }
}
