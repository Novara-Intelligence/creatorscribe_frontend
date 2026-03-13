"use client";

import Image from "next/image";
import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { ClientSwitcher } from "@/components/client-switcher";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="!border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2 !px-4 !py-3">
          <Image src="/cs_icon.svg" alt="CreatorScribe" width={24} height={24} className="group-data-[collapsible=icon]:size-8" />
          <span className="font-poppins !text-lg !font-bold truncate group-data-[collapsible=icon]:hidden">
            CreatorScribe
          </span>
        </div>
        <ClientSwitcher />
      </SidebarHeader>
    </Sidebar>
  );
}
