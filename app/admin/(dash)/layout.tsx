import AppSidebar from "@/components/admin/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { listSignups } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // drives the count badge next to the Waitlist module
  const result = await listSignups();
  const count = result.ok ? result.rows.length : 0;

  return (
    <SidebarProvider>
      <AppSidebar waitlistCount={count} />
      <SidebarInset>
        <header className="bg-background/80 sticky top-0 z-10 flex h-14 items-center gap-3 border-b px-4 backdrop-blur">
          <SidebarTrigger />
          <span className="text-muted-foreground text-sm">Click Again admin</span>
        </header>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
