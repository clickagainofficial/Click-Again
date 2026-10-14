import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

import SignupsChart from "@/components/admin/SignupsChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listEnquiries } from "@/lib/enquiries";
import { dailyCounts, listSignups, summarise } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="gap-2 py-5">
      <CardContent className="px-5">
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          {label}
        </p>
        <p className="font-display mt-2 text-3xl leading-none font-bold tabular-nums">
          {value}
        </p>
        {hint ? (
          <p className="text-muted-foreground mt-2 text-xs">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default async function Overview() {
  const [result, enquiries] = await Promise.all([listSignups(), listEnquiries()]);
  const rows = result.ok ? result.rows : [];
  const stats = summarise(rows);
  const chart = dailyCounts(rows, 14);
  const enquiryCount = enquiries.ok ? enquiries.rows.length : 0;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Enquiries and email sign-ups at a glance.
        </p>
      </div>

      {!result.ok ? (
        <Card className="border-destructive/40 mb-6">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2 text-base">
              <AlertTriangle className="size-4" />
              Can&apos;t read the email list
            </CardTitle>
            <CardDescription>{result.error}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Enquiries" value={enquiryCount} hint="From the contact form" />
        <Stat label="Email sign-ups" value={stats.total} />
        <Stat label="Sign-ups today" value={stats.today} />
        <Stat label="Sign-ups, last 7 days" value={stats.week} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Email sign-ups per day</CardTitle>
            <CardDescription>The last 14 days</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/waitlist">
              Open email list
              <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <SignupsChart data={chart} />
        </CardContent>
      </Card>
    </div>
  );
}
