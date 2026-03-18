"use client";

import { useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useClient } from "@/hooks/useClient";

export function ClientSwitcher() {
  const { clients, activeClientId, activeClient, isLoading, fetchClients, setActiveClientId } = useClient();

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-2 py-2 w-full">
        <Skeleton className="size-5 rounded-sm shrink-0" />
        <Skeleton className="h-4 flex-1 group-data-[collapsible=icon]:hidden" />
      </div>
    );
  }

  if (!activeClient) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group-data-[collapsible=icon]:!w-[38px] !w-full mx-auto py-2 px-2 flex w-full items-center justify-between rounded-lg border border-input bg-background text-sm ring-offset-background group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center group-data-[collapsible=icon]:gap-0 gap-3">
          {activeClient.brand_logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeClient.brand_logo} alt={activeClient.client_name} className="size-5 rounded-sm object-cover" />
          ) : (
            <div className="flex size-5 shrink-0 items-center justify-center font-montserrat rounded-sm border bg-muted text-xs uppercase">
              {activeClient.client_name[0]}
            </div>
          )}
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold capitalize font-montserrat leading-tight">{activeClient.client_name}</span>
          </div>
        </div>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="!w-64">
        {clients.map((client, index) => (
          <div key={client.id}>
            <DropdownMenuItem
              className="flex items-center gap-3 rounded-md"
              onClick={() => setActiveClientId(client.id)}
            >
              {client.brand_logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={client.brand_logo} alt={client.client_name} className="size-8 rounded-sm object-cover" />
              ) : (
                <div className="flex size-8 shrink-0 items-center capitalize font-montserrat justify-center rounded-sm border bg-muted text-xs uppercase">
                  {client.client_name[0]}
                </div>
              )}
              <div className="flex flex-col overflow-hidden flex-1">
                <span className="truncate text-sm font-montserrat font-medium capitalize">{client.client_name}</span>
                {client.role && <span className="truncate text-xs text-muted-foreground font-montserrat capitalize">{client.role}</span>}
              </div>
              {activeClientId === client.id && (
                <Check className="size-4 shrink-0 text-primary" />
              )}
            </DropdownMenuItem>
            {index < clients.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
