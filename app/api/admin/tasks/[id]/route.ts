import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { deleteTask, parseTask, updateTask } from "@/lib/tasks";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseTask(body, true);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const task = await updateTask(id, parsed.value);
    if (!task) return NextResponse.json({ error: "That task no longer exists." }, { status: 404 });
    return NextResponse.json(task);
  } catch (err) {
    console.error("[clickagain] could not update task:", err);
    return NextResponse.json({ error: "Couldn't save. Try again." }, { status: 502 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { id } = await params;
  try {
    const gone = await deleteTask(id);
    if (!gone) return NextResponse.json({ error: "That task no longer exists." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[clickagain] could not delete task:", err);
    return NextResponse.json({ error: "Couldn't delete. Try again." }, { status: 502 });
  }
}
