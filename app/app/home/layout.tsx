import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Topbar />
      <main className="flex flex-1 flex-col min-h-screen">
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
