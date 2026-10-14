import AppSidebar from "@/components/admin/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { listEnquiries } from "@/lib/enquiries";
import { listSignups } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // drive the count badges next to the Waitlist and Enquiries modules
  const [signups, enquiries] = await Promise.all([listSignups(), listEnquiries()]);
  const count = signups.ok ? signups.rows.length : 0;
  const enquiryCount = enquiries.ok ? enquiries.rows.length : 0;

  return (
    <SidebarProvider>
      <AppSidebar waitlistCount={count} enquiryCount={enquiryCount} />
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
