"use client";

import { useState, useEffect } from "react";
import { Cancel01Icon, Settings01Icon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StudioPromptInput } from "@/components/ai/studio-prompt-input";

function PanelContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full w-100">
      <div className="flex items-center justify-between px-4 py-1.5 border-b shrink-0">
        <span className="font-semibold text-sm">Properties</span>
        <button
          onClick={onClose}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <Cancel01Icon className="size-4" />
        </button>
      </div>
    </div>
  );
}

function PropertiesPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
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

export default function CaptionStudioPage() {
  const [propertiesOpen, setPropertiesOpen] = useState(true);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-1.5 shrink-0">
          <span className="text-sm font-semibold">Caption Studio</span>
          <Button
            variant="outline"
            size="sm"
            className="size-8 p-0"
            onClick={() => setPropertiesOpen((v) => !v)}
          >
            <Settings01Icon className="size-4" strokeWidth={1.8} />
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <span className="text-2xl font-semibold">Caption Studio</span>
        </div>

        <StudioPromptInput
          placeholder="Describe the caption you want to generate…"
          className="px-4 pb-4 shrink-0"
        />
      </div>

      <PropertiesPanel open={propertiesOpen} onClose={() => setPropertiesOpen(false)} />
    </div>
  );
}
