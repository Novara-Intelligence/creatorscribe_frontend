"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
    <div className="flex items-center justify-between py-4">
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

export default function ProfilePage() {
  return (
    <div className="flex flex-col">
      <SettingRow label="E-Mail Address" value="—" />
      <Separator />
      <SettingRow label="Given Name" value="—" action={{ label: "Update Given Name" }} />
      <Separator />
      <SettingRow label="Current Plan" value="Free" action={{ label: "Manage Subscription" }} />
      <Separator />
      <SettingRow label="Usage & Credit Ceilings" action={{ label: "See Details" }} />
      <Separator />
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-col gap-0.5 max-w-4xl">
          <span className="text-base font-semibold text-destructive">Delete Entire Account</span>
          <span className="text-sm text-muted-foreground">
            Permanently delete your entire account across all workspaces. You will no longer be able to create a CreatorScribe account with this email. If you only want to leave a client, go to the Clients tab.
          </span>
        </div>
        <Button variant="outline" size="lg" className="font-semibold shrink-0 text-destructive border-destructive hover:bg-destructive/5 hover:text-destructive transition-colors">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
