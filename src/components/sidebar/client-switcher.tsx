"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Building2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import ClientDialog from "@/components/client_dialog";
import { useClients } from "@/contexts/client-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/api-services";

export function ClientSwitcher() {
  const { isMobile } = useSidebar();
  const { clients, activeClient, setActiveClient, isLoading } = useClients();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  if (isLoading) {
    return (
      <SidebarMenu className="bg-accent rounded-lg mb-2">
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="bg-muted animate-pulse flex aspect-square size-8 items-center justify-center rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight gap-1">
              <div className="h-4 bg-muted animate-pulse rounded w-24" />
              <div className="h-3 bg-muted animate-pulse rounded w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeClient || clients.length === 0) {
    return (
      <>
        <ClientDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        <SidebarMenu className="bg-accent rounded-lg mb-2">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={() => setIsDialogOpen(true)}>
              <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Plus className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Add Client</span>
                <span className="truncate text-xs">Get started</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </>
    );
  }

  return (
    <>
      <ClientDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <SidebarMenu className="bg-accent rounded-lg mb-2">
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!w-12 group-data-[collapsible=icon]:!p-3"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={getImageUrl(activeClient.brand_logo)}
                    alt={activeClient.client_name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-semibold">
                    {activeClient.client_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium capitalize">
                    {activeClient.client_name}
                  </span>
                  <span className="truncate text-xs capitalize">
                    {activeClient.industry_type}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Clients
              </DropdownMenuLabel>
              {clients.map((client, index) => (
                <DropdownMenuItem
                  key={client.id}
                  onClick={() => setActiveClient(client)}
                  className="gap-2 p-2"
                >
                  <Avatar className="h-6 w-6 rounded-md">
                    <AvatarImage
                      src={getImageUrl(client.brand_logo)}
                      alt={client.client_name}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-md text-xs bg-primary text-primary-foreground font-semibold">
                      {client.client_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {client.client_name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => setIsDialogOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add Client
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
