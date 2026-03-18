"use client";

import { useState, useRef } from "react";
import { usePromptInputAttachments } from "@/components/ai/prompt-input";
import { usePanel } from "@/hooks/usePanel";

interface CanvasDropZoneProps {
  children: React.ReactNode;
  onExternalFile?: (file: File) => void;
}

export function CanvasDropZone({ children, onExternalFile }: CanvasDropZoneProps) {
  const attachments = usePromptInputAttachments();
  const { draggedFile, setDraggedFile } = usePanel();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);

  return (
    <div
      className="relative"
      onDragEnter={(e) => { e.preventDefault(); dragCounter.current++; if (dragCounter.current === 1) setIsDragOver(true); }}
      onDragLeave={() => { dragCounter.current--; if (dragCounter.current === 0) setIsDragOver(false); }}
      onDragOver={(e) => { e.preventDefault(); e.nativeEvent.stopPropagation(); }}
      onDrop={(e) => {
        e.preventDefault();
        e.nativeEvent.stopPropagation();
        dragCounter.current = 0;
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) {
          const file = e.dataTransfer.files[0];
          attachments.clear();
          attachments.add([file]);
          onExternalFile?.(file);
          return;
        }
        if (draggedFile) {
          attachments.clear();
          attachments.add([draggedFile]);
          setDraggedFile(null);
          // internal drag = already uploaded, no callback
        }
      }}
    >
      {isDragOver && (
        <div className="absolute inset-0 rounded-xl border-2 border-dashed border-primary/50 bg-background flex items-center justify-center pointer-events-none z-10">
          <span className="text-sm font-medium text-primary">Drop to attach</span>
        </div>
      )}
      {children}
    </div>
  );
}
