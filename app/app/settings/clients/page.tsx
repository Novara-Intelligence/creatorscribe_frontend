"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClient } from "@/hooks/useClient";
import { useUser } from "@/hooks/useUser";
import { Settings01Icon, UserGroupIcon, Edit01Icon, Delete01Icon, Search01Icon, UserAdd01Icon } from "hugeicons-react";
import clientService from "@/services/client.service";
import userService from "@/services/user.service";
import type { TeamMember, Client, ClientInvite } from "@/types/client";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ImageUpload01Icon } from "hugeicons-react";

const ROLES = ["admin", "editor", "viewer"] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CheckedUser = { found: boolean; email?: string; full_name?: string; profile_pic?: string; already_in_client?: boolean | null; message?: string };

function InviteClientDialog({ open, onClose, clientId }: { open: boolean; onClose: () => void; clientId?: number }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const debouncedEmail = useDebounce(inviteEmail, 500);
  const [checking, setChecking] = useState(false);
  const [checkedUser, setCheckedUser] = useState<CheckedUser | null>(null);
  const [invitees, setInvitees] = useState<NonNullable<CheckedUser & { found: true }>[]>([]);
  const [role, setRole] = useState<string>("viewer");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setInviteEmail(""); setCheckedUser(null); setInvitees([]); setRole("viewer"); setSubmitting(false); onClose();
  };

  const handleSubmit = async () => {
    if (!clientId || invitees.length === 0) return;
    setSubmitting(true);
    try {
      const res = await clientService.inviteMembers(clientId, invitees.map((u) => u.email!), role);
      toast.success("Invites sent", { description: res.message });
      handleClose();
    } catch {
      toast.error("Failed to send invites", { description: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setCheckedUser(null);
    if (!EMAIL_REGEX.test(debouncedEmail)) return;
    setChecking(true);
    userService.checkUser(debouncedEmail, clientId)
      .then((res) => setCheckedUser(res))
      .finally(() => setChecking(false));
  }, [debouncedEmail, clientId]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg min-h-[350px] flex flex-col justify-start">
        <DialogHeader className="!gap-0.5">
          <DialogTitle className="font-bold text-lg">Invite to Client</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Search and invite people to join your client workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invite People</span>
          <div className="relative">
            <Search01Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" strokeWidth={1.5} />
            <Input
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => { setInviteEmail(e.target.value); setCheckedUser(null); }}
              className="pl-9 h-9 text-sm font-montserrat"
            />
          </div>

          {checking && (
            <div className="flex items-center gap-2 px-1">
              <Skeleton className="size-7 rounded-full" />
              <div className="flex flex-col gap-1"><Skeleton className="h-3 w-28" /><Skeleton className="h-2.5 w-36" /></div>
            </div>
          )}

          {!checking && checkedUser && (
            checkedUser.found ? (
              <div
                className={`flex items-center gap-3 px-2 py-2 rounded-lg bg-muted transition-colors ${checkedUser.already_in_client ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-muted/70"}`}
                onClick={() => {
                  if (checkedUser.already_in_client) return;
                  if (invitees.some((u) => u.email === checkedUser.email)) return;
                  setInvitees((prev) => [...prev, checkedUser as CheckedUser & { found: true }]);
                  setInviteEmail(""); setCheckedUser(null);
                }}
              >
                <Avatar className="size-7 shrink-0">
                  {checkedUser.profile_pic && <AvatarImage src={checkedUser.profile_pic} />}
                  <AvatarFallback className="text-xs font-semibold font-montserrat">
                    {checkedUser.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 overflow-hidden flex-1">
                  <span className="text-xs font-semibold truncate">{checkedUser.full_name}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{checkedUser.email}</span>
                </div>
                {checkedUser.already_in_client
                  ? <Badge variant="outline" className="text-[10px] font-montserrat shrink-0">Already a member</Badge>
                  : <span className="text-[10px] text-muted-foreground font-medium shrink-0">Click to add</span>
                }
              </div>
            ) : (
              <p className="text-xs text-muted-foreground px-1">{checkedUser.message ?? "No user found."}</p>
            )
          )}

          {invitees.length > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              {invitees.map((u) => (
                <div key={u.email} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg border bg-background">
                  <Avatar className="size-6 shrink-0">
                    {u.profile_pic && <AvatarImage src={u.profile_pic} />}
                    <AvatarFallback className="text-[10px] font-semibold font-montserrat">
                      {u.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-xs font-semibold truncate">{u.full_name}</span>
                    <span className="text-[11px] text-muted-foreground truncate">{u.email}</span>
                  </div>
                  <button
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    onClick={() => setInvitees((prev) => prev.filter((i) => i.email !== u.email))}
                  >
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Invite as</span>
            <Select value={role} onValueChange={(v) => v && setRole(v)}>
              <SelectTrigger className="h-8 text-xs font-montserrat capitalize w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r} className="text-xs font-montserrat capitalize">{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button disabled={invitees.length === 0 || !clientId || submitting} onClick={handleSubmit}>
              {submitting ? "Sending..." : `Invite${invitees.length > 0 ? ` (${invitees.length})` : ""}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditClientDialog({ open, onClose, client }: { open: boolean; onClose: () => void; client: Client | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [clientName, setClientName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { fetchClients } = useClient();

  useEffect(() => {
    if (open && client) {
      setClientName(client.client_name);
      setLogoPreview(client.brand_logo ?? null);
      setLogoFile(null);
    }
  }, [open, client]);

  const handleClose = () => {
    setLogoFile(null); setLogoPreview(null); setClientName(""); setSubmitting(false); onClose();
  };

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!client) return;
    setSubmitting(true);
    try {
      await clientService.editClient(client.id, {
        client_name: clientName.trim() !== client.client_name ? clientName.trim() : undefined,
        brand_logo: logoFile,
      });
      toast.success("Client updated", { description: `${clientName.trim()} has been updated.` });
      await fetchClients();
      handleClose();
    } catch {
      toast.error("Failed to update client", { description: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg flex flex-col">
        <DialogHeader className="!gap-0.5">
          <DialogTitle className="font-bold text-lg">Edit Client</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Update the client name or brand logo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 mt-1">
          <div
            className={`relative flex size-16 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-colors overflow-hidden ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleLogoFile(f); }}
          >
            {logoPreview
              ? <img src={logoPreview} alt="logo" className="size-full object-cover" />
              : <ImageUpload01Icon className="size-5 text-muted-foreground" strokeWidth={1.5} />
            }
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); }} />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium">Client Name</label>
            <Input
              placeholder="e.g. Acme Corp"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="h-10 rounded-xl text-sm font-medium font-montserrat"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button disabled={!clientName.trim() || submitting} onClick={handleSubmit}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddClientDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [clientName, setClientName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const debouncedEmail = useDebounce(inviteEmail, 500);
  const [checking, setChecking] = useState(false);
  const [checkedUser, setCheckedUser] = useState<CheckedUser | null>(null);
  const [invitees, setInvitees] = useState<NonNullable<CheckedUser & { found: true }>[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { fetchClients } = useClient();

  const handleClose = () => {
    setLogoFile(null); setLogoPreview(null); setClientName("");
    setInviteEmail(""); setCheckedUser(null); setInvitees([]); setSubmitting(false); onClose();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await clientService.addClient({
        client_name: clientName.trim(),
        brand_logo: logoFile,
        invite_emails: invitees.map((u) => u.email!),
      });
      toast.success("Client created", { description: `${clientName.trim()} has been added successfully.` });
      await fetchClients();
      handleClose();
    } catch {
      toast.error("Failed to create client", { description: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    setCheckedUser(null);
    if (!EMAIL_REGEX.test(debouncedEmail)) return;
    setChecking(true);
    userService.checkUser(debouncedEmail)
      .then((res) => setCheckedUser(res))
      .finally(() => setChecking(false));
  }, [debouncedEmail]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg min-h-[350px] flex flex-col">
        <DialogHeader className="!gap-0.5">
          <DialogTitle className="font-bold text-lg">Add Client</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Create a new client workspace and optionally invite team members.
          </DialogDescription>
        </DialogHeader>

        {/* Brand logo picker */}
        <div className="flex items-center gap-4 mt-1">
          <div
            className={`relative flex size-16 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-colors overflow-hidden ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleLogoFile(f); }}
          >
            {logoPreview
              ? <img src={logoPreview} alt="logo" className="size-full object-cover" />
              : <ImageUpload01Icon className="size-5 text-muted-foreground" strokeWidth={1.5} />
            }
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); }} />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium">Client Name</label>
            <Input
              placeholder="e.g. Acme Corp"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="h-10 rounded-xl text-sm font-medium font-montserrat"
            />
          </div>
        </div>

        <Separator />

        {/* Invite people */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invite People</span>
          <div className="relative">
            <Search01Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" strokeWidth={1.5} />
            <Input
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => { setInviteEmail(e.target.value); setCheckedUser(null); }}
              className="pl-9 h-9 text-sm font-montserrat"
            />
          </div>

          {checking && (
            <div className="flex items-center gap-2 px-1">
              <Skeleton className="size-7 rounded-full" />
              <div className="flex flex-col gap-1"><Skeleton className="h-3 w-28" /><Skeleton className="h-2.5 w-36" /></div>
            </div>
          )}

          {!checking && checkedUser && (
            checkedUser.found ? (
              <div
                className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => {
                  if (invitees.some((u) => u.email === checkedUser.email)) return;
                  setInvitees((prev) => [...prev, checkedUser as CheckedUser & { found: true }]);
                  setInviteEmail("");
                  setCheckedUser(null);
                }}
              >
                <Avatar className="size-7 shrink-0">
                  {checkedUser.profile_pic && <AvatarImage src={checkedUser.profile_pic} />}
                  <AvatarFallback className="text-xs font-semibold font-montserrat">
                    {checkedUser.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 overflow-hidden flex-1">
                  <span className="text-xs font-semibold truncate">{checkedUser.full_name}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{checkedUser.email}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium shrink-0">Click to add</span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground px-1">{checkedUser.message ?? "No user found."}</p>
            )
          )}

          {invitees.length > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              {invitees.map((u) => (
                <div key={u.email} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg border bg-background">
                  <Avatar className="size-6 shrink-0">
                    {u.profile_pic && <AvatarImage src={u.profile_pic} />}
                    <AvatarFallback className="text-[10px] font-semibold font-montserrat">
                      {u.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-xs font-semibold truncate">{u.full_name}</span>
                    <span className="text-[11px] text-muted-foreground truncate">{u.email}</span>
                  </div>
                  <button
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    onClick={() => setInvitees((prev) => prev.filter((i) => i.email !== u.email))}
                  >
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-auto pt-4">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button disabled={!clientName.trim() || submitting} onClick={handleSubmit}>
            {submitting ? "Creating..." : "Create Client"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ViewTeamsDialog({ client, open, onClose }: { client: Client | null; open: boolean; onClose: () => void }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [removingMember, setRemovingMember] = useState<TeamMember | null>(null);
  const { profile } = useUser();
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

  const handleRemoveMember = async (member: TeamMember) => {
    if (!client) return;
    try {
      const res = await clientService.removeMember(client.id, member.id);
      if (!res.success) throw new Error(res.message);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      toast.success("Member removed", { description: `${member.full_name || member.email} has been removed.` });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error("Failed to remove member", { description: message });
    }
  };

  const handleRoleChange = async (member: TeamMember, role: string) => {
    if (!client) return;
    setUpdatingId(member.id);
    try {
      const res = await clientService.updateMemberRole(client.id, member.id, role);
      setMembers((prev) => prev.map((m) => m.id === member.id ? res.data : m));
      toast.success("Role updated", {
        description: `${member.full_name || member.email} is now ${role}.`,
      });
    } catch {
      toast.error("Failed to update role", {
        description: "Something went wrong. Please try again.",
      });
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

        <div className="flex flex-col gap-1 min-h-[12rem] max-h-80 overflow-y-auto -mx-1 px-1">
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
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold truncate">{member.full_name || "—"}{isSelf && <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">(you)</span>}</span>
                      <span className={`text-[10px] font-semibold capitalize px-1.5 py-0.5 rounded-full shrink-0 ${member.status === "active" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>{member.status}</span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-end gap-1">
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
                    </div>
                    {canEditRoles && !isSelf && (
                      <button
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        onClick={() => setRemovingMember(member)}
                        title="Remove member"
                      >
                        <Delete01Icon className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
      <ConfirmDeleteDialog
        open={!!removingMember}
        onClose={() => setRemovingMember(null)}
        onConfirm={() => handleRemoveMember(removingMember!)}
        title={`Remove ${removingMember?.full_name || removingMember?.email}?`}
        description="This will remove the member from this client workspace. They will lose access immediately."
        confirmWord="remove"
        confirmLabel="Remove"
      />
    </Dialog>
  );
}

export default function ClientsPage() {
  const { clients, activeClientId, isLoading, fetchClients, setActiveClientId } = useClient();

  const [teamsClient, setTeamsClient] = useState<Client | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteClientId, setInviteClientId] = useState<number | undefined>(undefined);
  const [invites, setInvites] = useState<ClientInvite[]>([]);
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [confirmClient, setConfirmClient] = useState<Client | null>(null);
  const [confirmAction, setConfirmAction] = useState<"delete" | "leave" | null>(null);

  const loadInvites = useCallback(() => {
    setInvitesLoading(true);
    clientService.getMyInvites()
      .then((res) => setInvites(res.data))
      .finally(() => setInvitesLoading(false));
  }, []);

  const handleReject = async (invite: ClientInvite) => {
    setRejectingId(invite.id);
    try {
      const res = await clientService.rejectInvite(invite.client_id);
      if (res.success) {
        toast.success("Invite declined", { description: `You've declined the invite from ${invite.client_name}.` });
        setInvites((prev) => prev.filter((i) => i.id !== invite.id));
      } else {
        toast.error("Failed to decline", { description: res.message });
      }
    } catch {
      toast.error("Failed to decline invite");
    } finally {
      setRejectingId(null);
    }
  };

  const handleAccept = async (invite: ClientInvite) => {
    setAcceptingId(invite.id);
    try {
      const res = await clientService.acceptInvite(invite.client_id);
      if (res.success) {
        toast.success("Invite accepted", { description: `You've joined ${invite.client_name}.` });
        setInvites((prev) => prev.filter((i) => i.id !== invite.id));
        fetchClients();
      } else {
        toast.error("Failed to accept", { description: res.message });
      }
    } catch {
      toast.error("Failed to accept invite");
    } finally {
      setAcceptingId(null);
    }
  };

  useEffect(() => {
    fetchClients();
    loadInvites();
  }, [fetchClients, loadInvites]);

  return (
    <div className="flex flex-col gap-8">

      {/* Clients */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Clients</h2>
          <Button size="lg" className="font-semibold" onClick={() => setAddClientOpen(true)}>Add New Client</Button>
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
                  {(client.role === "owner" || client.role === "admin") && (
                    <Button variant="outline" className="size-8 p-0" onClick={() => { setInviteClientId(client.id); setInviteOpen(true); }}>
                      <UserAdd01Icon className="size-4" />
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
                          <DropdownMenuItem className="font-medium gap-2 py-1.5" onClick={() => setEditClient(client)}><Edit01Icon className="size-4" />Edit Client</DropdownMenuItem>
                        </>
                      )}
                      <>
                        <DropdownMenuSeparator />
                        {client.role === "owner"
                          ? <DropdownMenuItem variant="destructive" className="font-medium gap-2 py-1.5" onClick={() => { setConfirmClient(client); setConfirmAction("delete"); }}><Delete01Icon className="size-4" />Delete Client</DropdownMenuItem>
                          : <DropdownMenuItem variant="destructive" className="font-medium gap-2 py-1.5" onClick={() => { setConfirmClient(client); setConfirmAction("leave"); }}><Delete01Icon className="size-4" />Leave Client</DropdownMenuItem>
                        }
                      </>
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
        </div>
        <div className="rounded-xl border overflow-hidden">
          {invitesLoading ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className={`flex items-center justify-between px-4 py-4 ${i > 0 ? "border-t" : ""}`}>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-md" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            ))
          ) : invites.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">You have no pending client invites.</p>
          ) : (
            invites.map((invite, index) => (
              <div key={invite.id} className={`flex items-center justify-between px-4 py-4 ${index > 0 ? "border-t" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="size-9 shrink-0 rounded-md border overflow-hidden bg-muted flex items-center justify-center">
                    {invite.client_logo
                      ? <img src={invite.client_logo} alt={invite.client_name} className="size-full object-cover" />
                      : <span className="text-sm font-semibold uppercase">{invite.client_name[0]}</span>
                    }
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold capitalize">{invite.client_name}</span>
                    <span className="text-xs text-muted-foreground">
                      Invited by <span className="font-medium">{invite.invited_by_email}</span> · <span className="capitalize">{invite.role}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="font-semibold" disabled={rejectingId === invite.id} onClick={() => handleReject(invite)}>
                    {rejectingId === invite.id ? "Declining..." : "Decline"}
                  </Button>
                  <Button size="sm" className="font-semibold" disabled={acceptingId === invite.id} onClick={() => handleAccept(invite)}>
                    {acceptingId === invite.id ? "Accepting..." : "Accept"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={!!confirmClient && !!confirmAction}
        onClose={() => { setConfirmClient(null); setConfirmAction(null); }}
        onConfirm={async () => {
          if (!confirmClient) return;
          if (confirmAction === "leave") {
            const res = await clientService.leaveClient(confirmClient.id);
            if (!res.success) throw new Error(res.message);
            toast.success("Left client", { description: `You've left ${confirmClient.client_name}.` });
          } else {
            const res = await clientService.deleteClient(confirmClient.id);
            if (!res.success) throw new Error(res.message);
            toast.success("Client deleted", { description: `${confirmClient.client_name} has been deleted.` });
          }
          fetchClients();
        }}
        title={confirmAction === "delete" ? `Delete "${confirmClient?.client_name}"` : `Leave "${confirmClient?.client_name}"`}
        description={
          confirmAction === "delete"
            ? "This will permanently delete the client and all associated data. This cannot be undone."
            : "You will lose access to this client workspace. This cannot be undone."
        }
        confirmWord={confirmAction === "delete" ? "delete" : "leave"}
        confirmLabel={confirmAction === "delete" ? "Delete" : "Leave"}
      />
      <EditClientDialog open={!!editClient} onClose={() => setEditClient(null)} client={editClient} />
      <AddClientDialog open={addClientOpen} onClose={() => setAddClientOpen(false)} />
      <InviteClientDialog open={inviteOpen} onClose={() => setInviteOpen(false)} clientId={inviteClientId} />
      <ViewTeamsDialog
        client={teamsClient}
        open={!!teamsClient}
        onClose={() => setTeamsClient(null)}
      />
    </div>
  );
}
