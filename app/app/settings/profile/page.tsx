"use client";

import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUpload01Icon, Camera01Icon, UserIcon } from "hugeicons-react";
import { Input } from "@/components/ui/input";
import { DialogDescription } from "@/components/ui/dialog";
import useUserStore from "@/store/userStore";
import { Badge } from "@/components/ui/badge";

function SettingRow({
  label,
  value,
  action,
}: {
  label: string;
  value?: string;
  action?: { label: string; onClick?: () => void };
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-semibold">{label}</span>
        {value && <span className="text-sm text-muted-foreground">{value}</span>}
      </div>
      {action && (
        <Button variant="outline" size="lg" className="font-semibold" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

function AvatarPickerDialog({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    onSelect(file);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
        </DialogHeader>
        <div
          className={`mt-2 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-colors ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <ImageUpload01Icon className="size-5 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">Drag & drop or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UpdateNameDialog({ open, onClose, onUpdate }: { open: boolean; onClose: () => void; onUpdate: (name: string) => void }) {
  const [name, setName] = useState("");

  const handleClose = () => { setName(""); onClose(); };
  const handleUpdate = () => { if (name.trim()) { onUpdate(name.trim()); handleClose(); } };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="!gap-0.5">
          <DialogTitle className="font-bold text-lg">Update Given Name</DialogTitle>
          <DialogDescription className="text-xs font-medium">Update your given name by entering a new one.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-3">
          <label htmlFor="given-name" className="text-sm font-medium">New given name</label>
          <Input
            id="given-name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 rounded-xl text-sm font-medium font-montserrat"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button disabled={!name.trim()} onClick={handleUpdate}>Update</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const updateProfile = useUserStore((s) => s.updateProfile);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarSelect = async (file: File) => {
    setAvatarUrl(URL.createObjectURL(file));
    try {
      await updateProfile({ profile_pic: file });
      toast.success("Profile picture updated");
    } catch {
      toast.error("Failed to update profile picture");
    }
  };

  const handleNameUpdate = async (name: string) => {
    try {
      await updateProfile({ full_name: name });
      toast.success("Name updated", { description: `Your name has been changed to ${name}.` });
    } catch {
      toast.error("Failed to update name");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Profile Picture */}
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-semibold">Profile Picture</span>
          <span className="text-sm text-muted-foreground">Click to change your avatar</span>
        </div>
        <button onClick={() => setPickerOpen(true)} className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="size-16 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={avatarUrl ?? profile?.profile_pic ?? ""} />
            <AvatarFallback className="text-sm font-semibold font-montserrat">
              {profile?.full_name ? profile.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : <UserIcon className="size-6" />}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 flex size-5 items-center justify-center rounded-full bg-background text-foreground ring-1 ring-border">
            <Camera01Icon className="size-3" strokeWidth={2} />
          </span>
        </button>
      </div >
      <Separator className="bg-muted" />
      <SettingRow label="E-Mail Address" value={profile?.email ?? "—"} />
      <Separator className="bg-muted" />
      <SettingRow label="Given Name" value={profile?.full_name ?? "—"} action={{ label: "Update Given Name", onClick: () => setNameDialogOpen(true) }} />
      <Separator className="bg-muted" />
      <SettingRow
        label="Current Plan"
        value={profile?.current_plan
          ? profile.current_plan.charAt(0).toUpperCase() + profile.current_plan.slice(1) + " Plan" + (profile.current_plan !== "free" && profile.days_left != null ? ` · ${profile.days_left} days left` : "")
          : "—"}
        action={{ label: "Manage Subscription" }}
      />
      <Separator className="bg-muted" />
      <SettingRow label="Usage & Credit Ceilings" action={{ label: "See Details" }} />
      <Separator className="bg-muted" />
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-col gap-0.5 max-w-4xl">
          <span className="text-base font-semibold text-destructive">Delete Entire Account</span>
          <span className="text-sm text-muted-foreground">
            Permanently delete your entire account across all workspaces. You will no longer be able to create a CreatorScribe account with this email. If you only want to leave a client, go to the Clients tab.
          </span>
        </div>
        <Button variant="outline" size="lg" className="font-semibold shrink-0 text-destructive border-destructive hover:bg-destructive/5 hover:text-destructive transition-colors" onClick={() => setDeleteOpen(true)}>
          Delete Account
        </Button>
      </div>

      <AvatarPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAvatarSelect}
      />
      <UpdateNameDialog
        open={nameDialogOpen}
        onClose={() => setNameDialogOpen(false)}
        onUpdate={handleNameUpdate}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          toast.success("Account deleted");
        }}
        title="Delete Entire Account"
        description="Permanently delete your account across all workspaces. This cannot be undone."
        confirmWord="delete"
        confirmLabel="Delete"
      />
    </div >
  );
}
