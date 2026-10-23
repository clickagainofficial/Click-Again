import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { createTask, listTasks, parseTask, type TaskInput } from "@/lib/tasks";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const result = await listTasks();
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
  return NextResponse.json(result.rows);
}

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

  const parsed = parseTask(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    return NextResponse.json(await createTask(parsed.value as TaskInput), { status: 201 });
  } catch (err) {
    console.error("[clickagain] could not add task:", err);
    return NextResponse.json({ error: "Couldn't save. Try again." }, { status: 502 });
  }
}
