"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calculator,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
} from "lucide-react";

import LogoutButton from "@/components/admin/LogoutButton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const modules = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Enquiries", href: "/admin/enquiries", icon: Inbox },
  { title: "Tasks", href: "/admin/tasks", icon: ListTodo },
  { title: "Email list", href: "/admin/waitlist", icon: Users },
  { title: "Calculator", href: "/admin/calculator", icon: Calculator },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AppSidebar({
  waitlistCount,
  enquiryCount,
  taskCount,
}: {
  waitlistCount: number;
  enquiryCount: number;
  /** tasks still to do or in progress */
  taskCount: number;
}) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center">
          <Image
            src="/logo/clickagain-logo.png"
            alt="Click Again"
            width={1826}
            height={338}
            className="w-28 group-data-[collapsible=icon]:hidden"
            priority
          />
          <span className="hidden text-lg font-bold group-data-[collapsible=icon]:block">
            C
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.href === "/admin/waitlist" && waitlistCount > 0 ? (
                    <SidebarMenuBadge>{waitlistCount}</SidebarMenuBadge>
                  ) : null}
                  {item.href === "/admin/enquiries" && enquiryCount > 0 ? (
                    <SidebarMenuBadge>{enquiryCount}</SidebarMenuBadge>
                  ) : null}
                  {item.href === "/admin/tasks" && taskCount > 0 ? (
                    <SidebarMenuBadge>{taskCount}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="View site">
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink />
                <span>View site</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
