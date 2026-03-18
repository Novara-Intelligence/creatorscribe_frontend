"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Analytics01Icon, Calendar03Icon, HelpSquareIcon, Home04Icon, PuzzleIcon, Tag01Icon, Upload01Icon, TextSquareIcon } from "hugeicons-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ClientSwitcher } from "@/components/client-switcher";
import { usePanel } from "@/hooks/usePanel";

function UploadsPanelButton() {
  const { activePanel, togglePanel } = usePanel();

  return (
    <SidebarMenuButton
      onClick={() => togglePanel("uploads")}
      isActive={activePanel === "uploads"}
      className="px-2 !py-4 rounded-lg group-data-[collapsible=icon]:justify-center data-[active]:bg-gray-200 dark:data-[active]:bg-secondary text-muted-foreground data-[active]:text-primary cursor-pointer"
    >
      <Upload01Icon className="shrink-0 !size-4.5" strokeWidth={1.9} />
      <span className="font-raleway mt-0.5 text-sm font-semibold leading-none group-data-[collapsible=icon]:hidden">Uploads</span>
    </SidebarMenuButton>
  );
}

const navItems = [
  { label: "Home", icon: Home04Icon, href: "/app/home" },
  { label: "Analytics", icon: Analytics01Icon, href: "/app/home/analytics" },
  { label: "Content Calendar", icon: Calendar03Icon, href: "/app/home/content-calendar" },
  { label: "Addons", icon: PuzzleIcon, href: "/app/home/addons" },
  { label: "Caption Studio", icon: TextSquareIcon, href: "/app/caption-studio" },
];

const navFooterItems = [{
  label: "Pricing",
  icon: Tag01Icon,
  href: "/app/home/faq",
}, {
  label: "FAQ",
  icon: HelpSquareIcon,
  href: "/app/home/faq",
}];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="px-3">
        <div className="px-1.5 pt-2 pb-2 flex items-center group-data-[collapsible=icon]:justify-center gap-2">
          <Image src="/cs_icon.svg" alt="CreatorScribe" width={24} height={24} />
          <span className="font-raleway text-lg font-bold truncate group-data-[collapsible=icon]:hidden">
            CreatorScribe
          </span>
        </div>
        <ClientSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-3">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label} className="py-1 flex items-center justify-center">
              <SidebarMenuButton render={<Link href={item.href} />} isActive={pathname === item.href} className="px-2 !py-4 rounded-lg group-data-[collapsible=icon]:justify-center data-[active]:bg-gray-200 dark:data-[active]:bg-secondary text-muted-foreground data-[active]:text-primary">
                <item.icon className="shrink-0 !size-4.5" strokeWidth={1.9} />
                <span className="font-raleway mt-0.5 text-sm font-semibold leading-none group-data-[collapsible=icon]:hidden">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem className="py-1 flex items-center justify-center">
            <UploadsPanelButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="pb-4 px-3">
        <SidebarMenu>
          {navFooterItems.map((item) => (
            <SidebarMenuItem key={item.label} className="py-1 flex items-center justify-center">
              <SidebarMenuButton render={<Link href={item.href} />} isActive={pathname === item.href} className="px-2 !py-4 rounded-lg group-data-[collapsible=icon]:justify-center data-[active]:bg-gray-200 dark:data-[active]:bg-secondary text-muted-foreground data-[active]:text-primary">
                <item.icon className="shrink-0 !size-4.5" strokeWidth={1.9} />
                <span className="font-raleway mt-0.5 text-sm font-semibold leading-none group-data-[collapsible=icon]:hidden">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {/* Upgrade button — full version when expanded */}
        <div className="rounded-lg border flex items-center justify-center gap-2 bg-[image:repeating-linear-gradient(135deg,var(--background),var(--background)_4px,rgba(0,0,0,0.06)_4px,rgba(0,0,0,0.06)_8px)] dark:bg-[image:repeating-linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04)_4px,transparent_4px,transparent_8px)] dark:bg-card">
          <button className="flex-1 rounded-lg  flex items-center justify-center gap-2 text-sm py-2 font-semibold text-foreground bg-gradient-to-r from-background to-background/0">
            <Image src="/icons/ic_zap.svg" alt="Zap" width={18} height={18} className="dark:invert" />
            <span className="group-data-[collapsible=icon]:hidden">Upgrade</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
