import { SettingsNav } from "@/components/settings-nav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 px-4 py-4 group-data-[collapsible=icon]:px-26 group-data-[collapsible=icon]:py-20 h-full transition-all duration-200 ease-linear">
      <div className="mb-4">
        <h1 className="text-2xl tracking-tight font-bold font-raleway">Settings</h1>
        <p className="text-sm text-muted-foreground font-medium mt-1">Manage your profile and Clients & Settings</p>
      </div>
      <SettingsNav />
      <div className="mt-5">
        {children}
      </div>
    </div>
  );
}
