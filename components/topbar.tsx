"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutAlignLeftIcon, Folder03Icon, Notification01Icon } from "hugeicons-react";
import { ArrowUpRight, LogOut, Check, Plus } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/routes";
import useClientStore from "@/store/clientStore";
import useUserStore from "@/store/userStore";
import { useEffect } from "react";
import { Badge } from "./ui/badge";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();
  const clients = useClientStore((s) => s.clients);
  const activeClientId = useClientStore((s) => s.activeClientId);
  const setActiveClientId = useClientStore((s) => s.setActiveClientId);
  const activeClient = clients.find((c) => c.id === activeClientId) ?? clients[0];

  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);

  const progress =
    profile?.total_tokens != null && profile.total_tokens > 0
      ? Math.min((profile.total_tokens - (profile.remaining_tokens ?? 0)) / profile.total_tokens, 1)
      : 0;

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "CS";

  const handleLogout = async () => {
    await logout();
    router.push(APP_ROUTES.AUTH.SIGN_IN);
  };

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
              {profile?.profile_pic && <AvatarImage src={profile.profile_pic} />}
              <AvatarFallback className="text-xs font-semibold font-montserrat">{initials}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
              <span className="font-montserrat text-primary text-[9px] font-semibold leading-none">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={14} className="w-56 p-0.5 bg-muted overflow-hidden">
            {/* Profile + Clients row */}
            <DropdownMenuGroup className="bg-background border border-border rounded-lg mb-1 overflow-hidden">
              <DropdownMenuItem className="px-3 py-2.5 flex items-center gap-2.5 rounded-none border-b" onClick={() => router.push(APP_ROUTES.SETTINGS.PROFILE)}>
                <Avatar className="size-7 shrink-0">
                  {profile?.profile_pic && <AvatarImage src={profile.profile_pic} />}
                  <AvatarFallback className="text-xs font-semibold font-montserrat">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-semibold font-montserrat truncate">{profile?.full_name ?? "Profile"}</span>
                  <span className="text-[11px] text-muted-foreground font-montserrat truncate">{profile?.email ?? "Manage your account"}</span>
                </div>
              </DropdownMenuItem>
              <div className="px-2 py-1.5 flex flex-col gap-0.5">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[10px] font-semibold text-muted-foreground font-montserrat uppercase tracking-wide">Clients</span>
                  <DropdownMenuItem onClick={() => router.push(APP_ROUTES.SETTINGS.CLIENTS)} className="h-5 w-5 p-0 flex items-center justify-center rounded-md cursor-pointer">
                    <Plus className="size-3" />
                  </DropdownMenuItem>
                </div>
                {clients.map((client) => (
                  <DropdownMenuItem
                    key={client.id}
                    className="px-2 py-1.5 flex items-center gap-2 rounded-md"
                    onClick={() => setActiveClientId(client.id)}
                  >
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-sm border bg-muted text-[10px] font-montserrat uppercase">
                      {client.client_name[0]}
                    </div>
                    <span className="truncate text-xs font-medium font-montserrat capitalize flex-1">{client.client_name}</span>
                    {activeClient?.id === client.id && <Check className="size-3 shrink-0 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuGroup>
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
                    <span className="font-montserrat text-xs font-semibold capitalize">Balance</span>
                  </div>
                  {
                    profile?.current_plan === "free" && (
                      <Button size="xs" className="font-montserrat text-xs !py-2"> Upgrade</Button>
                    )
                  }
                  {
                    profile?.current_plan !== "free" && (
                      <Badge variant="outline" className="font-montserrat !text-[8px]">{profile?.days_left} days left</Badge>
                    )
                  }
                </div>
                <div className="flex flex-col gap-1">
                  {/* Row 2: Total */}
                  <div className="flex items-center justify-between">
                    <span className="font-montserrat text-xs text-muted-foreground">Total</span>
                    <span className="font-montserrat text-xs font-medium">
                      {profile?.total_tokens != null ? `${profile.total_tokens.toLocaleString()} tokens` : "Unlimited"}
                    </span>
                  </div>
                  {/* Row 3: Remaining */}
                  <div className="flex items-center justify-between">
                    <span className="font-montserrat text-xs text-muted-foreground">Remaining</span>
                    <span className="font-montserrat text-xs font-medium">
                      {profile?.remaining_tokens != null ? profile.remaining_tokens.toLocaleString() : "Unlimited"}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuGroup>
            <DropdownMenuGroup className="bg-background overflow-hidden border-y mt-1 px-0.5 -mx-0.5 py-1">
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
              <DropdownMenuItem
                className="px-2 !py-1.5 rounded-md font-medium text-sm flex items-center gap-2"
                onClick={handleLogout}
              >
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
