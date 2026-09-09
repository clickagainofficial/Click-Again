"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Signup = {
  timestamp: string;
  email: string;
  source: string;
  userAgent: string;
};

function formatWhen(value: string) {
  const t = Date.parse(value);
  if (Number.isNaN(t)) return value || "—";
  return new Date(t).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Turns a user-agent string into something readable at a glance. */
function device(ua: string) {
  if (!ua) return "—";
  const mobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  const browser =
    /Edg\//.test(ua) ? "Edge"
    : /OPR\/|Opera/.test(ua) ? "Opera"
    : /Chrome\//.test(ua) ? "Chrome"
    : /Safari\//.test(ua) ? "Safari"
    : /Firefox\//.test(ua) ? "Firefox"
    : /curl/i.test(ua) ? "curl"
    : "Other";
  return `${browser} · ${mobile ? "Mobile" : "Desktop"}`;
}

export default function SignupsTable({ rows }: { rows: Signup[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.email.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        formatWhen(r.timestamp).toLowerCase().includes(q)
    );
  }, [rows, query]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search email, source or date"
            className="pl-9"
            aria-label="Search signups"
          />
        </div>
        <p className="text-muted-foreground text-sm">
          {filtered.length} of {rows.length}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="px-4">Email</TableHead>
              <TableHead className="px-4">When</TableHead>
              <TableHead className="px-4">Source</TableHead>
              <TableHead className="px-4">Device</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground px-4 py-10 text-center"
                >
                  {rows.length === 0
                    ? "No signups yet."
                    : "Nothing matches that search."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r, i) => (
                <TableRow key={`${r.email}-${i}`}>
                  <TableCell className="px-4 font-medium">
                    <a
                      href={`mailto:${r.email}`}
                      className="hover:text-primary underline-offset-4 hover:underline"
                    >
                      {r.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground px-4">
                    {formatWhen(r.timestamp)}
                  </TableCell>
                  <TableCell className="px-4">
                    <Badge variant="secondary">{r.source || "—"}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground px-4">
                    {device(r.userAgent)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
