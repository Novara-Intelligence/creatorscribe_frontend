"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useClientStore from "@/store/clientStore";
import useUserStore from "@/store/userStore";
import { Settings01Icon, UserGroupIcon, Edit01Icon, Delete01Icon, Search01Icon } from "hugeicons-react";
import clientService from "@/services/client.service";
import type { TeamMember, Client } from "@/types/client";

const ROLES = ["admin", "editor", "viewer"] as const;

function ViewTeamsDialog({ client, open, onClose }: { client: Client | null; open: boolean; onClose: () => void }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const profile = useUserStore((s) => s.profile);
  const canEditRoles = client?.role === "owner" || client?.role === "admin";

  const fetchMembers = useCallback(async (q?: string) => {
    if (!client) return;
    setIsLoading(true);
    try {
      const res = await clientService.getMembers(client.id, q);
      setMembers(res.data);
    } catch {
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  const handleRoleChange = async (member: TeamMember, role: string) => {
    if (!client) return;
    setUpdatingId(member.id);
    try {
      const res = await clientService.updateMemberRole(client.id, member.id, role);
      setMembers((prev) => prev.map((m) => m.id === member.id ? res.data : m));
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    if (open) { setSearch(""); fetchMembers(); }
    else setMembers([]);
  }, [open, fetchMembers]);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => fetchMembers(search), 400);
    return () => clearTimeout(id);
  }, [search, open, fetchMembers]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="!gap-0.5">
          <DialogTitle className="font-bold text-lg">Teams</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Members of <span className="capitalize font-semibold text-foreground">{client?.client_name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-1">
          <Search01Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" strokeWidth={1.5} />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm font-montserrat"
          />
        </div>

        <div className="flex flex-col gap-1 min-h-48 max-h-80 overflow-y-auto -mx-1 px-1">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-2 py-2.5">
                <Skeleton className="size-8 rounded-full shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-44" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            ))
          ) : members.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center px-2 py-4">No members found.</p>
          ) : (
            members.map((member) => {
              const isSelf = profile?.email === member.email;
              const showRoleEdit = canEditRoles && !isSelf;
              return (
                <div key={member.id} className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-muted transition-colors">
                  <Avatar className="size-8 shrink-0">
                    {member.profile_pic && <AvatarImage src={member.profile_pic} />}
                    <AvatarFallback className="text-xs font-semibold font-montserrat">
                      {member.full_name ? member.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                    <span className="text-sm font-semibold truncate">{member.full_name || "—"}{isSelf && <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">(you)</span>}</span>
                    <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {showRoleEdit ? (
                      <Select
                        value={member.role}
                        onValueChange={(role) => role && handleRoleChange(member, role)}
                        disabled={updatingId === member.id}
                      >
                        <SelectTrigger className="h-7 text-xs font-montserrat capitalize w-24 px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r} className="text-xs font-montserrat capitalize">{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className="text-[10px] font-montserrat capitalize">{member.role}</Badge>
                    )}
                    <span className={`text-[10px] font-medium capitalize ${member.status === "active" ? "text-green-500" : "text-muted-foreground"}`}>{member.status}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ClientsPage() {
  const clients = useClientStore((s) => s.clients);
  const activeClientId = useClientStore((s) => s.activeClientId);
  const isLoading = useClientStore((s) => s.isLoading);
  const fetchClients = useClientStore((s) => s.fetchClients);
  const setActiveClientId = useClientStore((s) => s.setActiveClientId);

  const [teamsClient, setTeamsClient] = useState<Client | null>(null);

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
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-md" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
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
                <div className="flex items-center gap-3">
                  <div className="size-9 shrink-0 rounded-md border overflow-hidden bg-muted flex items-center justify-center">
                    {client.brand_logo
                      ? <img src={client.brand_logo} alt={client.client_name} className="size-full object-cover" />
                      : <span className="text-sm font-semibold uppercase">{client.client_name[0]}</span>
                    }
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold capitalize">{client.client_name}</span>
                    <span className="text-sm text-muted-foreground capitalize">{client.role}</span>
                  </div>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                      <Settings01Icon className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 p-0.5">
                      <DropdownMenuItem className="font-medium gap-2 py-1.5" onClick={() => setTeamsClient(client)}>
                        <UserGroupIcon className="size-4" />View Teams
                      </DropdownMenuItem>
                      {client.role !== "viewer" && client.role !== "editor" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="font-medium gap-2 py-1.5"><Edit01Icon className="size-4" />Edit Client</DropdownMenuItem>
                        </>
                      )}
                      {client.role === "owner" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" className="font-medium gap-2 py-1.5"><Delete01Icon className="size-4" />Delete Client</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
          <Button size="lg" className="font-semibold">Invite Client</Button>
        </div>
        <div className="rounded-xl border px-4 py-6">
          <p className="text-sm text-muted-foreground">You have no pending client invites.</p>
        </div>
      </div>

      <ViewTeamsDialog
        client={teamsClient}
        open={!!teamsClient}
        onClose={() => setTeamsClient(null)}
      />
    </div>
  );
}
