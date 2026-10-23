import { AlertTriangle } from "lucide-react";

import TasksBoard from "@/components/admin/TasksBoard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listTasks } from "@/lib/tasks";

export const metadata = { title: "Tasks" };
export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const result = await listTasks();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Tasks</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          What&apos;s still pending on the site and its marketing, and who it&apos;s
          waiting on. Started from the SEO plan in docs/seo-plan.md. Add, edit or
          tick things off here.
        </p>
      </div>

      {!result.ok ? (
        <Card className="border-destructive/40 mb-6">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2 text-base">
              <AlertTriangle className="size-4" />
              Can&apos;t read the tasks
            </CardTitle>
            <CardDescription>{result.error}</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <TasksBoard initial={result.rows} />
      )}
    </div>
  );
}
