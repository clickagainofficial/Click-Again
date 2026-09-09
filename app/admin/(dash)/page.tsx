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
import { dailyCounts, listSignups, summarise } from "@/lib/waitlist";
import { site } from "@/site.config";

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
  const result = await listSignups();
  const rows = result.ok ? result.rows : [];
  const stats = summarise(rows);
  const chart = dailyCounts(rows, 14);

  const launch = new Date(site.launchDate).getTime();
  const daysToLaunch = Math.max(
    0,
    Math.ceil((launch - Date.now()) / (24 * 60 * 60 * 1000))
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          How the waitlist is filling up before launch.
        </p>
      </div>

      {!result.ok ? (
        <Card className="border-destructive/40 mb-6">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2 text-base">
              <AlertTriangle className="size-4" />
              Can&apos;t read the waitlist
            </CardTitle>
            <CardDescription>{result.error}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total signups" value={stats.total} />
        <Stat label="Today" value={stats.today} />
        <Stat label="Last 7 days" value={stats.week} />
        <Stat
          label="Days to launch"
          value={daysToLaunch}
          hint={new Date(site.launchDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Signups per day</CardTitle>
            <CardDescription>The last 14 days</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/waitlist">
              Open waitlist
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
