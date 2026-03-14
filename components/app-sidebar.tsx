"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Analytics01Icon, Calendar03Icon, HelpSquareIcon, Home04Icon, PuzzleIcon, Tag01Icon } from "hugeicons-react";
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

const navItems = [
  { label: "Home", icon: Home04Icon, href: "/app/home" },
  { label: "Analytics", icon: Analytics01Icon, href: "/app/home/analytics" },
  { label: "Content Calendar", icon: Calendar03Icon, href: "/app/home/content-calendar" },
  { label: "Addons", icon: PuzzleIcon, href: "/app/home/addons" },
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
    <Sidebar collapsible="icon" className="!border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2 !px-6 group-data-[collapsible=icon]:!px-4 !py-3">
          <Image src="/cs_icon.svg" alt="CreatorScribe" width={24} height={24} className="group-data-[collapsible=icon]:size-8" />
          <span className="!font-raleway !text-lg !font-bold truncate group-data-[collapsible=icon]:hidden">
            CreatorScribe
          </span>
        </div>
        <ClientSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="!px-3.5 gap-1.5">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton render={<a href={item.href} />} isActive={pathname === item.href} className="!px-2 !py-4.5 rounded-lg group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:!justify-center data-[active]:!bg-gray-200 !text-gray-600 data-[active]:!text-gray-900">
                <item.icon className="shrink-0 !size-5" />
                <span className="!font-raleway !mt-0.5 !text-sm !font-semibold leading-none group-data-[collapsible=icon]:hidden">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="!px-3 !py-6 !gap-1.5">
        <SidebarMenu className="gap-1.5">
          {navFooterItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton render={<a href={item.href} />} isActive={pathname === item.href} className="!px-2 !py-4.5 rounded-lg group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:!justify-center data-[active]:!bg-gray-200 !text-gray-600 data-[active]:!text-gray-900">
                {item.icon && <item.icon className="shrink-0 !size-5" />}
                <span className="!font-raleway !mt-0.5 !text-sm !font-semibold leading-none group-data-[collapsible=icon]:hidden">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {/* Upgrade button — full version when expanded */}
        <div className="!rounded-lg !border !py-1 flex items-center justify-between gap-2 bg-[image:repeating-linear-gradient(135deg,white,white_4px,rgba(0,0,0,0.06)_4px,rgba(0,0,0,0.06)_8px)] group-data-[collapsible=icon]:hidden">
          <button className="flex-1 flex items-center justify-center gap-2 !text-sm !font-semibold">
            <Image src="/icons/ic_zap.svg" alt="Zap" width={18} height={18} />
            Upgrade
          </button>
        </div>
        {/* Upgrade button — icon only when collapsed */}
        <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
          <SidebarMenuItem>
            <SidebarMenuButton render={<a href="/app/home/upgrade" />} className="!p-2 !justify-center !text-gray-600">
              <Image src="/icons/ic_zap.svg" alt="Upgrade" width={18} height={18} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
