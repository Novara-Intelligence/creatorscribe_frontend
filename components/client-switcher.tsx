"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const clients = [
  { id: 1, name: "Acme Corp", email: "acme@example.com" },
  { id: 2, name: "Globex Inc", email: "globex@example.com" },
  { id: 3, name: "Initech LLC", email: "initech@example.com" },
];

export function ClientSwitcher() {
  const [selected, setSelected] = useState(clients[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group-data-[collapsible=icon]:!w-[38px] !w-full mx-auto py-2 px-2 flex w-full items-center justify-between rounded-lg border border-input bg-background text-sm ring-offset-background group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center group-data-[collapsible=icon]:gap-0 gap-3 ">
          <div className="flex size-5 shrink-0 items-center justify-center rounded-sm border bg-muted text-xsuppercase">
            {selected.name[0]}
          </div>
          <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">{selected.name}</span>
        </div>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="!w-64">
        {clients.map((client, index) => (
          <div key={client.id}>
            <DropdownMenuItem
              className="flex items-center gap-3 rounded-md"
              onClick={() => setSelected(client)}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border bg-muted text-xsuppercase">
                {client.name[0]}
              </div>
              <div className="flex flex-col overflow-hidden flex-1">
                <span className="truncate text-sm font-medium">{client.name}</span>
                <span className="truncate text-xs text-muted-foreground">{client.email}</span>
              </div>
              {selected.id === client.id && (
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
