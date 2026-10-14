import { AlertTriangle } from "lucide-react";

import EnquiriesTable from "@/components/admin/EnquiriesTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listEnquiries } from "@/lib/enquiries";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const result = await listEnquiries();
  const rows = result.ok ? result.rows : [];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Enquiries</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Everyone who filled in the form on /contact, newest first. Each one
          was promised a call back within a working day.
        </p>
      </div>

      {!result.ok ? (
        <Card className="border-destructive/40 mb-6">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2 text-base">
              <AlertTriangle className="size-4" />
              Can&apos;t read the enquiries
            </CardTitle>
            <CardDescription>{result.error}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card>
        <CardContent>
          <EnquiriesTable rows={rows} />
        </CardContent>
      </Card>

      <p className="text-muted-foreground mt-6 text-center text-xs">
        These are real people&apos;s names and phone numbers. Keep this page to
        yourself.
      </p>
    </div>
  );
}
