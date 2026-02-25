"use client";

import * as React from "react";
import {
  Bell,
  User,
  Settings,
  CreditCard,
  LogOut,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/theme/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import Image from "next/image";

export function Topbar() {
  const [mounted, setMounted] = React.useState(false);
  const { isMobile } = useSidebar();

  // Ensure component is mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="z-50 w-full border-b bg-background">
      <div className="flex h-18 items-center justify-between px-4">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-4">
          {isMobile ? <SidebarTrigger></SidebarTrigger> : null}
          {mounted ? (
            <div className="flex items-center space-x-2 px-2">
              <Image
                src="/images/cs_logo.svg"
                alt="CreatorScribe Logo"
                width={34}
                height={34}
              />
              <h2
                className={`${
                  isMobile ? "hidden" : ""
                } text-lg font-semibold tracking-wide`}
              >
                CreatorScribe
              </h2>
            </div>
          ) : (
            // Show placeholder while theme is loading
            <div className="w-28 h-8 bg-muted animate-pulse rounded" />
          )}
        </div>

        {/* Right side - Icons */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <ModeToggle />

          {/* Announcements/Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-8 w-8" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 p-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal px-3 py-3">
                <div className="flex flex-col space-y-2">
                  <p className="text-base font-medium leading-none">John Doe</p>
                  <p className="text-sm leading-none text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="px-3 py-3">
                <UserCog className="mr-3 h-4 w-4" />
                <span>Client</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-3">
                <Bell className="mr-3 h-4 w-4" />
                <span>Notification Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-3">
                <CreditCard className="mr-3 h-4 w-4" />
                <span>Pricing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-3">
                <Settings className="mr-3 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem
                className="px-3 py-2 focus:bg-transparent"
                asChild
              >
                <Button
                  variant="outline"
                  className="w-full justify-center h-auto"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
