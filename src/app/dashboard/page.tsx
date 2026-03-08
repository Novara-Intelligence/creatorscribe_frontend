"use client";

import { AppLayout } from "@/components/layout/app-layout";

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4 text-muted-foreground">
          Welcome to your dashboard! Here you can manage your projects, view
          analytics, and customize your settings.
        </p>
      </div>
    </AppLayout>
  );
}
