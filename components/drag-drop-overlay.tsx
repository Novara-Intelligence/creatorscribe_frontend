"use client";

import { useEffect, useState } from "react";
import { Upload01Icon } from "hugeicons-react";
import usePanelStore from "@/store/panelStore";

const ACCEPTED = ["image/", "video/"];

function isFilesDrag(e: DragEvent) {
  return !!e.dataTransfer?.types.includes("Files");
}

export function DragDropOverlay() {
  const [active, setActive] = useState(false);
  const addPendingFiles = usePanelStore((s) => s.addPendingFiles);

  useEffect(() => {
    let counter = 0;

    const onEnter = (e: DragEvent) => {
      if (!isFilesDrag(e)) return;
      e.preventDefault();
      counter++;
      if (counter === 1) setActive(true);
    };

    const onLeave = (e: DragEvent) => {
      if (!isFilesDrag(e)) return;
      counter--;
      if (counter === 0) setActive(false);
    };

    const onOver = (e: DragEvent) => {
      if (!isFilesDrag(e)) return;
      e.preventDefault();
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      counter = 0;
      setActive(false);
      const files = Array.from(e.dataTransfer?.files ?? []).filter((f) =>
        ACCEPTED.some((type) => f.type.startsWith(type))
      );
      if (files.length > 0) addPendingFiles(files);
    };

    window.addEventListener("dragenter", onEnter);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("dragover", onOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onEnter);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [addPendingFiles]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-primary bg-primary/5 w-[480px] h-64 pointer-events-none select-none">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Upload01Icon className="size-7 text-primary" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold">Drop to upload</p>
          <p className="text-sm text-muted-foreground mt-1">Images and videos are supported</p>
        </div>
      </div>
    </div>
  );
}
