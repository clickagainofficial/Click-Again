import { fetchSignups } from "@/lib/waitlist";

/** CSV of the whole waitlist. Behind the same session check as the dashboard. */
export async function GET() {
  const result = await fetchSignups();

  if (!result.ok) {
    return new Response(result.error, { status: 502 });
  }

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const lines = [
    ["Timestamp", "Email", "Source", "User agent"].join(","),
    ...result.rows.map((r) =>
      [r.timestamp, r.email, r.source, r.userAgent].map(escape).join(",")
    ),
  ];

  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clickagain-waitlist-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
