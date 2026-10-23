"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Owner = "kansha" | "claude";
type Status = "todo" | "doing" | "on_hold" | "done";
type Priority = "high" | "medium" | "low";
type Group = "build" | "you" | "later" | "regular" | "future";

export type TaskRow = {
  id: string;
  title: string;
  details: string;
  owner: Owner;
  group: Group;
  status: Status;
  priority: Priority;
  due: string;
  createdAt: string;
  updatedAt: string;
};

type Draft = Pick<TaskRow, "title" | "details" | "owner" | "group" | "status" | "priority" | "due">;

const GROUPS: { key: Group; label: string; hint: string }[] = [
  { key: "build", label: "To build", hint: "Code work on the site, some waiting on your OK or an input" },
  { key: "you", label: "Your quick tasks", hint: "Things only you can do, mostly a few minutes each" },
  { key: "later", label: "Later", hint: "You said not now; picked up when you're ready" },
  { key: "regular", label: "Regular", hint: "Repeats weekly or monthly" },
  { key: "future", label: "When it happens", hint: "Triggered by a change in the business" },
];

const STATUS: Record<Status, string> = {
  todo: "To do",
  doing: "In progress",
  on_hold: "On hold",
  done: "Done",
};
const OWNER: Record<Owner, string> = { kansha: "You", claude: "Claude" };
const PRIORITY: Record<Priority, string> = { high: "High", medium: "Medium", low: "Low" };

const priorityClass: Record<Priority, string> = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-slate-200 bg-slate-50 text-slate-600",
};
const statusClass: Record<Status, string> = {
  todo: "border-slate-200 bg-white text-slate-700",
  doing: "border-blue-200 bg-blue-50 text-blue-700",
  on_hold: "border-amber-200 bg-amber-50 text-amber-800",
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const fieldClass =
  "border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

const EMPTY: Draft = {
  title: "",
  details: "",
  owner: "kansha",
  group: "you",
  status: "todo",
  priority: "medium",
  due: "",
};

function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

function formatDue(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

async function call<T>(path: string, method: string, body?: object): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string })?.error ?? "Something went wrong.");
  return data as T;
}

export default function TasksBoard({ initial }: { initial: TaskRow[] }) {
  const [tasks, setTasks] = useState(initial);
  const [view, setView] = useState<"open" | "done" | "all">("open");
  const [owner, setOwner] = useState<"all" | Owner>("all");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      todo: tasks.filter((t) => t.status === "todo").length,
      doing: tasks.filter((t) => t.status === "doing").length,
      on_hold: tasks.filter((t) => t.status === "on_hold").length,
      done: tasks.filter((t) => t.status === "done").length,
    }),
    [tasks]
  );

  const visible = tasks.filter((t) => {
    if (view === "open" && t.status === "done") return false;
    if (view === "done" && t.status !== "done") return false;
    if (owner !== "all" && t.owner !== owner) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.details.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  async function run(id: string, fn: () => Promise<void>) {
    setBusy(id);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const add = (draft: Draft) =>
    run("new", async () => {
      const task = await call<TaskRow>("/api/admin/tasks", "POST", draft);
      setTasks((ts) => [...ts, task]);
      setAdding(false);
    });

  const patch = (id: string, change: Partial<Draft>) =>
    run(id, async () => {
      const task = await call<TaskRow>(`/api/admin/tasks/${id}`, "PATCH", change);
      setTasks((ts) => ts.map((t) => (t.id === id ? task : t)));
      setEditing(null);
    });

  const remove = (id: string) =>
    run(id, async () => {
      await call(`/api/admin/tasks/${id}`, "DELETE");
      setTasks((ts) => ts.filter((t) => t.id !== id));
      setConfirmDelete(null);
    });

  const now = today();

  return (
    <div className="space-y-6">
      {/* the numbers at a glance */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["todo", "doing", "on_hold", "done"] as Status[]).map((s) => (
          <Card key={s} className="gap-1 py-4">
            <CardContent className="px-4">
              <p className="text-muted-foreground text-xs">{STATUS[s]}</p>
              <p className="font-display text-2xl font-bold">{counts[s]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* filters and the add button */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-muted inline-flex rounded-lg p-1">
          {(["open", "done", "all"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition",
                view === v ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v === "open" ? "Open" : v === "done" ? "Done" : "All"}
            </button>
          ))}
        </div>
        <select
          aria-label="Who it's waiting on"
          className={cn(fieldClass, "w-auto")}
          value={owner}
          onChange={(e) => setOwner(e.target.value as "all" | Owner)}
        >
          <option value="all">Everyone</option>
          <option value="kansha">You</option>
          <option value="claude">Claude</option>
        </select>
        <div className="relative min-w-48 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="pl-9"
            placeholder="Search tasks"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setAdding((a) => !a)}>
          {adding ? <X /> : <Plus />}
          {adding ? "Close" : "Add task"}
        </Button>
      </div>

      {error ? (
        <p className="border-destructive/40 text-destructive rounded-md border px-3 py-2 text-sm">{error}</p>
      ) : null}

      {adding ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm initial={EMPTY} busy={busy === "new"} submitLabel="Add task" onSubmit={add} onCancel={() => setAdding(false)} />
          </CardContent>
        </Card>
      ) : null}

      {GROUPS.map((g) => {
        const rows = visible.filter((t) => t.group === g.key);
        if (!rows.length) return null;
        return (
          <section key={g.key}>
            <div className="mb-2 flex items-baseline gap-2">
              <h2 className="font-display text-lg font-bold">{g.label}</h2>
              <span className="text-muted-foreground text-sm">{rows.length}</span>
            </div>
            <p className="text-muted-foreground mb-3 text-sm">{g.hint}</p>

            <Card className="gap-0 py-0">
              <ul className="divide-y">
                {rows.map((t) => {
                  const overdue = t.due && t.due < now && t.status !== "done";
                  return (
                    <li key={t.id} className="px-4 py-3">
                      {editing === t.id ? (
                        <TaskForm
                          initial={t}
                          busy={busy === t.id}
                          submitLabel="Save"
                          onSubmit={(d) => patch(t.id, d)}
                          onCancel={() => setEditing(null)}
                        />
                      ) : (
                        <div className="flex items-start gap-3">
                          <button
                            aria-label={t.status === "done" ? "Mark as not done" : "Mark as done"}
                            onClick={() => patch(t.id, { status: t.status === "done" ? "todo" : "done" })}
                            disabled={busy === t.id}
                            className={cn(
                              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border transition",
                              t.status === "done"
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-slate-300 hover:border-slate-500"
                            )}
                          >
                            {busy === t.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : t.status === "done" ? (
                              <Check className="size-3.5" />
                            ) : null}
                          </button>

                          <div className="min-w-0 flex-1">
                            <p className={cn("font-medium", t.status === "done" && "text-muted-foreground line-through")}>
                              {t.title}
                            </p>
                            {t.details ? (
                              <p className="text-muted-foreground mt-1 text-sm whitespace-pre-line">{t.details}</p>
                            ) : null}
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              <Badge variant="outline">{OWNER[t.owner]}</Badge>
                              <Badge variant="outline" className={priorityClass[t.priority]}>
                                {PRIORITY[t.priority]}
                              </Badge>
                              {t.due ? (
                                <Badge variant="outline" className={overdue ? "border-red-300 text-red-700" : undefined}>
                                  <CalendarDays className="size-3" />
                                  {overdue ? "Overdue · " : ""}
                                  {formatDue(t.due)}
                                </Badge>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1">
                            <select
                              aria-label="Status"
                              className={cn(
                                "h-8 rounded-md border px-2 text-xs font-medium outline-none",
                                statusClass[t.status]
                              )}
                              value={t.status}
                              disabled={busy === t.id}
                              onChange={(e) => patch(t.id, { status: e.target.value as Status })}
                            >
                              {(Object.keys(STATUS) as Status[]).map((s) => (
                                <option key={s} value={s}>
                                  {STATUS[s]}
                                </option>
                              ))}
                            </select>
                            <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => setEditing(t.id)}>
                              <Pencil />
                            </Button>
                            {confirmDelete === t.id ? (
                              <>
                                <Button variant="destructive" size="sm" onClick={() => remove(t.id)} disabled={busy === t.id}>
                                  Delete
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
                                  Keep
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Delete"
                                onClick={() => setConfirmDelete(t.id)}
                              >
                                <Trash2 />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          </section>
        );
      })}

      {!visible.length ? (
        <p className="text-muted-foreground py-10 text-center text-sm">
          {view === "done" ? "Nothing marked done yet." : "Nothing here. Add a task, or change the filters."}
        </p>
      ) : null}
    </div>
  );
}

function TaskForm({
  initial,
  busy,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: Draft;
  busy: boolean;
  submitLabel: string;
  onSubmit: (d: Draft) => void;
  onCancel: () => void;
}) {
  const [d, setD] = useState<Draft>({
    title: initial.title,
    details: initial.details,
    owner: initial.owner,
    group: initial.group,
    status: initial.status,
    priority: initial.priority,
    due: initial.due,
  });
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(d);
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="task-title">Title</Label>
        <Input id="task-title" value={d.title} onChange={(e) => set("title", e.target.value)} required maxLength={200} autoFocus />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="task-details">Details</Label>
        <textarea
          id="task-details"
          rows={3}
          maxLength={4000}
          value={d.details}
          onChange={(e) => set("details", e.target.value)}
          className={cn(fieldClass, "h-auto py-2")}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <div className="grid gap-1.5">
          <Label htmlFor="task-group">Section</Label>
          <select id="task-group" className={fieldClass} value={d.group} onChange={(e) => set("group", e.target.value as Group)}>
            {GROUPS.map((g) => (
              <option key={g.key} value={g.key}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="task-owner">Waiting on</Label>
          <select id="task-owner" className={fieldClass} value={d.owner} onChange={(e) => set("owner", e.target.value as Owner)}>
            <option value="kansha">You</option>
            <option value="claude">Claude</option>
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="task-priority">Priority</Label>
          <select id="task-priority" className={fieldClass} value={d.priority} onChange={(e) => set("priority", e.target.value as Priority)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="task-status">Status</Label>
          <select id="task-status" className={fieldClass} value={d.status} onChange={(e) => set("status", e.target.value as Status)}>
            {(Object.keys(STATUS) as Status[]).map((s) => (
              <option key={s} value={s}>
                {STATUS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="task-due">Due</Label>
          <Input id="task-due" type="date" value={d.due} onChange={(e) => set("due", e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={busy || !d.title.trim()}>
          {busy ? <Loader2 className="animate-spin" /> : null}
          {submitLabel}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
