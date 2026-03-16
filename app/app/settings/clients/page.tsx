"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings2 } from "lucide-react";
import useClientStore from "@/store/clientStore";
import { Settings01Icon } from "hugeicons-react";

export default function ClientsPage() {
  const clients = useClientStore((s) => s.clients);
  const activeClientId = useClientStore((s) => s.activeClientId);
  const isLoading = useClientStore((s) => s.isLoading);
  const fetchClients = useClientStore((s) => s.fetchClients);
  const setActiveClientId = useClientStore((s) => s.setActiveClientId);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return (
    <div className="flex flex-col gap-8">

      {/* Clients */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Clients</h2>
          <Button size="lg" className="font-semibold">Add New Client</Button>
        </div>

        <div className="rounded-xl border overflow-hidden">
          {isLoading && clients.length === 0 ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className={`flex items-center justify-between px-4 py-4 ${i > 0 ? "border-t" : ""}`}>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-28 rounded-md" />
                  <Skeleton className="size-8 rounded-md" />
                </div>
              </div>
            ))
          ) : clients.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">You have no clients yet.</p>
          ) : (
            clients.map((client, index) => (
              <div key={client.id} className={`flex items-center justify-between px-4 py-4 ${index > 0 ? "border-t" : ""}`}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold capitalize">{client.client_name}</span>
                  <span className="text-sm text-muted-foreground capitalize">{client.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  {activeClientId === client.id ? (
                    <Button variant="secondary" className="font-semibold pointer-events-none">
                      Current Client
                    </Button>
                  ) : (
                    <Button variant="outline" className="font-semibold" onClick={() => setActiveClientId(client.id)}>
                      Switch
                    </Button>
                  )}
                  <Button variant="outline" className="size-8 p-0">
                    <Settings01Icon className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Client Invites */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Client Invites</h2>
          <Button size="lg" variant="outline" className="font-semibold">Invite Client</Button>
        </div>
        <div className="rounded-xl border px-4 py-6">
          <p className="text-sm text-muted-foreground">You have no pending client invites.</p>
        </div>
      </div>

    </div>
  );
}
