"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutAlignLeftIcon, Folder03Icon, Notification01Icon } from "hugeicons-react";
import { TopbarTitle } from "@/components/topbar-title";
import { Button } from "@chakra-ui/react";

export function Topbar() {
  return (
    <header className="h-14 !border-b !px-4 w-full flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <SidebarTrigger>
          <LayoutAlignLeftIcon />
        </SidebarTrigger>
        <TopbarTitle />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="xs" px={3} py={2} fontSize="xs" fontWeight="bold" borderRadius="lg" className="!hidden lg:!block">Feedback</Button>
        <Button variant="outline" size="xs" px={3} py={2} fontSize="xs" fontWeight="bold" borderRadius="lg" className="!hidden lg:!block">Docs</Button>
        <Button variant="outline" size="xs" px={2} py={2} fontSize="xs" fontWeight="bold" borderRadius="lg" className="!hidden lg:!block"><Folder03Icon strokeWidth={1.8} className="size-4" /></Button>
        <Button variant="outline" size="xs" px={2} py={2} fontSize="xs" fontWeight="bold" borderRadius="lg"><Notification01Icon strokeWidth={1.8} className="size-4" /></Button>
      </div>
    </header>
  );
}
