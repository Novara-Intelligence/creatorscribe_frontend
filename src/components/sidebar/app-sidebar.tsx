"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bot,
  ChevronLeft,
  ChevronRight,
  Command,
  GalleryVerticalEnd,
  Home,
  LayoutTemplate,
  Link,
  Rss,
  Settings,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { IconCreditCard, IconHelp } from "@tabler/icons-react";
import { NavSecondary } from "./nav-secondary";

// Navigation data - active states are now automatically determined based on current pathname
const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      items: [],
    },
    {
      title: "Posts",
      url: "#",
      icon: Rss,
      items: [
        {
          title: "Create Post",
          url: "#",
        },
        {
          title: "All Posts",
          url: "#",
        },
        {
          title: "Drafts",
          url: "#",
        },
      ],
    },
    {
      title: "Connections",
      url: "#",
      icon: Link,
      items: [],
    },
    {
      title: "Transcribe",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "SRT Generator",
          url: "#",
        },
        {
          title: "Caption Generator",
          url: "/content-gen",
        },
      ],
    },
    {
      title: "Templates",
      url: "#",
      icon: LayoutTemplate,
      items: [],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [],
    },
  ],
  navSecondary: [
    {
      title: "Pricing",
      url: "#",
      icon: IconCreditCard,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, setOpen, isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      {!isMobile ? (
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
          size="icon"
          className="w-8! h-8! absolute top-8 -right-4 z-50 rounded-full bg-background!"
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      ) : null}
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary
          items={data.navSecondary}
          className="mt-auto group-data-[collapsible=icon]:hidden"
        />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border ">
        <p className="text-xs text-muted-foreground text-center group-data-[collapsible=icon]:hidden">
          CreatorScribe &copy; {new Date().getFullYear()}
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
