"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  confirmWord?: string;
  confirmLabel?: string;
}

export function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action is irreversible. Type the confirmation word to proceed.",
  confirmWord = "delete",
  confirmLabel = "Delete",
}: ConfirmDeleteDialogProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => { setValue(""); onClose(); };

  const handleConfirm = async () => {
    if (value !== confirmWord) return;
    setLoading(true);
    try {
      await onConfirm();
      handleClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error("Action failed", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="!gap-0.5">
          <DialogTitle className="font-bold text-lg">{title}</DialogTitle>
          <DialogDescription className="text-xs font-medium">{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          <label className="text-sm font-medium">
            Type <span className="font-bold font-montserrat text-foreground">{confirmWord}</span> to confirm
          </label>
          <Input
            placeholder={confirmWord}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-10 rounded-xl text-sm font-medium font-montserrat"
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={value !== confirmWord || loading}
            onClick={handleConfirm}
          >
            {loading ? `${confirmLabel}ing...` : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
