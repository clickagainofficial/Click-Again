import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { getPublicSmtpSettings, saveSmtpSettings } from "@/lib/settings";

import { parseSmtp } from "./parse";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  return NextResponse.json(await getPublicSmtpSettings());
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseSmtp(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    await saveSmtpSettings(parsed.value);
  } catch (err) {
    console.error("[clickagain] could not save mail settings:", err);
    return NextResponse.json({ error: "Couldn't save. Try again." }, { status: 502 });
  }
  return NextResponse.json(await getPublicSmtpSettings());
}
