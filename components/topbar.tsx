"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutAlignLeftIcon, Folder03Icon, Notification01Icon } from "hugeicons-react";
import { ArrowUpRight, LogOut, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { TopbarTitle } from "@/components/topbar-title";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar({ progress = 0 }: { progress?: number }) {
  const { theme, setTheme } = useTheme();
  return (
    <header className="h-13 !border-b px-3 w-full flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <SidebarTrigger>
          <LayoutAlignLeftIcon />
        </SidebarTrigger>
        <TopbarTitle />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="hidden lg:flex font-semibold">Feedback</Button>
        <Button variant="outline" className="hidden lg:flex font-semibold">Docs</Button>
        <Button variant="outline" className="hidden lg:flex size-8"><Folder03Icon strokeWidth={1.8} className="size-4" /></Button>
        <Button variant="outline" className="size-8"><Notification01Icon strokeWidth={1.8} className="size-4" /></Button>
        {/* Avatar with progress ring + dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="group/avatar relative size-9 cursor-pointer shrink-0 outline-none">
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 36 36"
              fill="none"
            >
              <circle cx="18" cy="18" r="16" strokeWidth="2" className="stroke-zinc-200 dark:stroke-zinc-800" />
              <circle
                cx="18" cy="18" r="16" strokeWidth="2"
                strokeDasharray="100.53"
                strokeDashoffset={100.53 * (1 - progress)}
                strokeLinecap="round"
                className="stroke-zinc-900 dark:stroke-zinc-200"
              />
            </svg>
            <Avatar className="absolute inset-[3px] size-auto after:hidden m-0.5 group-hover/avatar:opacity-0 transition-opacity">
              <AvatarImage
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face"
                alt="Profile"
              />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
              <span className="font-montserrat text-primary text-[9px] font-semibold leading-none">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={14} className="w-56 p-0.5 bg-muted overflow-hidden">
            <DropdownMenuGroup>
              <div className="bg-background border border-border rounded-lg p-3 flex flex-col gap-4">
                {/* Row 1: progress + balance | upgrade */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Mini progress ring */}
                    <div className="relative size-5 shrink-0">
                      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36" fill="none">
                        <circle cx="18" cy="18" r="16" strokeWidth="3" className="stroke-zinc-300 dark:stroke-zinc-800" />
                        <circle
                          cx="18" cy="18" r="16" strokeWidth="3"
                          strokeDasharray="100.53"
                          strokeDashoffset={100.53 * (1 - progress)}
                          strokeLinecap="round"
                          className="stroke-zinc-900 dark:stroke-zinc-200"
                        />
                      </svg>
                    </div>
                    <span className="font-montserrat text-xs font-semibold">Balance</span>
                  </div>
                  <Button size="xs" className="font-montserrat text-xs !py-2">Upgrade</Button>
                </div>
                <div className="flex flex-col gap-1">
                  {/* Row 2: Total */}
                  <div className="flex items-center justify-between">
                    <span className="font-montserrat text-xs text-muted-foreground">Total</span>
                    <span className="font-montserrat text-xs font-medium">10,000 credits</span>
                  </div>
                  {/* Row 3: Remaining */}
                  <div className="flex items-center justify-between">
                    <span className="font-montserrat text-xs text-muted-foreground">Remaining</span>
                    <span className="font-montserrat text-xs font-medium">8,147</span>
                  </div>
                </div>
              </div>
            </DropdownMenuGroup>
            <DropdownMenuGroup className="bg-background overflow-hidden border-y mt-1 px-0.5 -mx-0.5 py-1">
              <DropdownMenuItem className="px-2 !py-1.5 rounded-md font-medium text-sm">Settings</DropdownMenuItem>
              <DropdownMenuItem className="px-2 !py-1.5 rounded-md font-medium text-sm">Subscription</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="px-2 !py-1.5 rounded-md font-medium text-sm">
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48" sideOffset={8}>
                  <DropdownMenuItem className="px-2 !py-1.5 rounded-md font-medium text-sm" onClick={() => setTheme("system")}>
                    System {theme === "system" && <Check className="size-3.5 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-2 !py-1.5 rounded-md font-medium text-sm" onClick={() => setTheme("light")}>
                    Light {theme === "light" && <Check className="size-3.5 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-2 !py-1.5 rounded-md font-medium text-sm" onClick={() => setTheme("dark")}>
                    Dark {theme === "dark" && <Check className="size-3.5 ml-auto" />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuGroup className="bg-background overflow-hidden border-b px-0.5 -mx-0.5 py-1">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="px-2 !py-1.5 rounded-md font-medium text-sm">
                  Docs and resources
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48" sideOffset={8}>
                  <DropdownMenuItem className="px-2 !py-1.5 rounded-md font-medium text-sm flex items-center justify-between">
                    Documentation
                    <ArrowUpRight className="size-3.5 text-muted-foreground" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-2 !py-1.5 rounded-md font-medium text-sm flex items-center justify-between">
                    Change log
                    <ArrowUpRight className="size-3.5 text-muted-foreground" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-2 !py-1.5 rounded-md font-medium text-sm flex items-center justify-between">
                    Help center
                    <ArrowUpRight className="size-3.5 text-muted-foreground" />
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="px-2 !py-1.5 rounded-md font-medium text-sm">
                  Terms and policy
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48" sideOffset={8}>
                  <DropdownMenuItem className="px-2 !py-1.5 rounded-md font-medium text-sm flex items-center justify-between">
                    Privacy Policy
                    <ArrowUpRight className="size-3.5 text-muted-foreground" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-2 !py-1.5 rounded-md font-medium text-sm flex items-center justify-between">
                    Terms
                    <ArrowUpRight className="size-3.5 text-muted-foreground" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-2 !py-1.5 rounded-md font-medium text-sm">
                    Product Terms
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuGroup className="bg-background overflow-hidden px-0.5 -mx-0.5 py-1">
              <DropdownMenuItem className="px-2 !py-1.5 rounded-md font-medium text-sm flex items-center gap-2">
                <LogOut className="size-3.5" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
