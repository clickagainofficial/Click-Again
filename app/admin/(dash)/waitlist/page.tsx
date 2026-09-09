import { AlertTriangle, Download } from "lucide-react";

import SignupsTable from "@/components/admin/SignupsTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listSignups } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export default async function WaitlistPage() {
  const result = await listSignups();
  const rows = result.ok ? result.rows : [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Waitlist</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Everyone who asked to hear from you, newest first.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href="/api/admin/export">
            <Download />
            Export CSV
          </a>
        </Button>
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

      <Card>
        <CardContent>
          <SignupsTable rows={rows} />
        </CardContent>
      </Card>

      <p className="text-muted-foreground mt-6 text-center text-xs">
        These are real people&apos;s email addresses. Keep this page to yourself.
      </p>
    </div>
  );
}
