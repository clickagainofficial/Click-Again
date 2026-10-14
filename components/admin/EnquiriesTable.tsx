"use client";

import { useMemo, useState } from "react";
import { Mail, MessageCircle, Phone, Search } from "lucide-react";

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

type Enquiry = {
  name: string;
  email: string;
  phone: string;
  business: string;
  service: string;
  description: string;
  createdAt: string;
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

/** 9876543210 → 98765 43210, the way people read numbers aloud here. */
function formatPhone(p: string) {
  return /^\d{10}$/.test(p) ? `${p.slice(0, 5)} ${p.slice(5)}` : p;
}

export default function EnquiriesTable({ rows }: { rows: Enquiry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.phone, r.business, r.service, r.description]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, phone, business…"
          className="pl-9"
          aria-label="Search enquiries"
        />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="px-4">Who</TableHead>
              <TableHead className="px-4">Phone</TableHead>
              <TableHead className="px-4">Wants</TableHead>
              <TableHead className="px-4">Note</TableHead>
              <TableHead className="px-4">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground px-4 py-10 text-center">
                  {rows.length === 0 ? "No enquiries yet." : "Nothing matches that search."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r, i) => (
                <TableRow key={`${r.createdAt}-${i}`} className="align-top">
                  <TableCell className="px-4">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-muted-foreground text-xs">{r.business}</div>
                    {r.email ? (
                      <a
                        href={`mailto:${r.email}`}
                        className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1 text-xs"
                      >
                        <Mail className="size-3" />
                        {r.email}
                      </a>
                    ) : null}
                  </TableCell>
                  <TableCell className="px-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className="tabular-nums">{formatPhone(r.phone)}</span>
                      <a
                        href={`tel:+91${r.phone}`}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={`Call ${r.name}`}
                      >
                        <Phone className="size-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/91${r.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={`WhatsApp ${r.name}`}
                      >
                        <MessageCircle className="size-3.5" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="px-4">
                    <Badge variant="secondary" className="whitespace-nowrap">
                      {r.service}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs px-4 text-sm whitespace-pre-wrap">
                    {r.description || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground px-4 text-sm whitespace-nowrap">
                    {formatWhen(r.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-muted-foreground text-xs">
        {filtered.length} of {rows.length} enquiries
      </p>
    </div>
  );
}
