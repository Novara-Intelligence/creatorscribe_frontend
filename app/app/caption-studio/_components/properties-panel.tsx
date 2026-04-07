"use client";

import { useState, useEffect } from "react";
import { Cancel01Icon } from "hugeicons-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HistoryTab } from "./history-tab";

type PanelTab = "settings" | "history";

function PanelContent({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<PanelTab>("settings");

  return (
    <div className="flex flex-col h-full w-100">
      <div className="relative flex items-center justify-start px-4 pt-4 shrink-0">
        <div className="flex items-end gap-4">
          {(["settings", "history"] as PanelTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-semibold border-b-2 transition-all duration-200 ${
                activeTab === tab
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "settings" ? "Settings" : "History"}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="absolute right-2 flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors mb-1"
        >
          <Cancel01Icon className="size-4" />
        </button>
      </div>
      <div className="border-b mx-4" />

      <div className="flex-1 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: activeTab === "settings" ? "translateX(0%)" : "translateX(-100%)" }}
        >
          <div className="w-full shrink-0 flex items-center justify-center text-sm text-muted-foreground">
            No settings yet.
          </div>
          <div className="w-full shrink-0 h-full">
            <HistoryTab />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertiesPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent side="right" className="w-100 p-0 [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Properties</SheetTitle>
          </SheetHeader>
          <PanelContent onClose={onClose} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={`relative flex flex-col border-l bg-background transition-all duration-200 ease-in-out overflow-hidden shrink-0 h-full ${open ? "w-100 opacity-100" : "w-0 opacity-0"}`}
    >
      <PanelContent onClose={onClose} />
    </aside>
  );
}
