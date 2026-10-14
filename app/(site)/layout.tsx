import ClickyChat from "@/components/ClickyChat";
import ServicePrompt from "@/components/ServicePrompt";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="site-main">{children}</main>
      <SiteFooter />
      <ServicePrompt />
      {/* public pages only — the admin dashboard has its own layout */}
      <ClickyChat />
    </>
  );
}
