import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Download, ExternalLink } from "lucide-react";

import LogoutButton from "./LogoutButton";
import SignupsChart from "./SignupsChart";
import SignupsTable from "./SignupsTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dailyCounts, fetchSignups, summarise } from "@/lib/waitlist";
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

export default async function AdminDashboard() {
  const result = await fetchSignups();
  const rows = result.ok ? result.rows : [];
  const stats = summarise(rows);
  const chart = dailyCounts(rows, 14);

  const launch = new Date(site.launchDate).getTime();
  const daysToLaunch = Math.max(
    0,
    Math.ceil((launch - Date.now()) / (24 * 60 * 60 * 1000))
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src="/clickagain-logo.png"
            alt="Click Again"
            width={1128}
            height={310}
            className="w-32"
            priority
          />
          <span className="text-muted-foreground border-border border-l pl-4 text-sm">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/" target="_blank">
              <ExternalLink />
              View site
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/api/admin/export">
              <Download />
              Export CSV
            </a>
          </Button>
          <LogoutButton />
        </div>
      </header>

      {!result.ok ? (
        <Card className="border-destructive/40 mb-8">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2 text-base">
              <AlertTriangle className="size-4" />
              Can&apos;t read the waitlist
            </CardTitle>
            <CardDescription>{result.error}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Signups are still being saved — this only affects reading them
              back here. The fix is in{" "}
              <code className="bg-muted rounded px-1 py-0.5 text-xs">
                docs/google-sheet-setup.md
              </code>
              .
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Signups per day</CardTitle>
          <CardDescription>The last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupsChart data={chart} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Waitlist</CardTitle>
          <CardDescription>
            Everyone who has asked to hear from you, newest first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupsTable rows={rows} />
        </CardContent>
      </Card>

      <p className="text-muted-foreground mt-8 text-center text-xs">
        These are real people&apos;s email addresses. Keep this tab to yourself.
      </p>
    </div>
  );
}
