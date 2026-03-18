"use client";

import { useState, useCallback, useRef } from "react";
import { Paperclip, X } from "lucide-react";
import {
  PromptInput,
  PromptInputProvider,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
  PromptInputButton,
  usePromptInputAttachments,
  type PromptInputMessage,
} from "@/components/ai/prompt-input";
import { CanvasDropZone } from "@/components/canvas-drop-zone";
import { useUpload } from "@/hooks/useUpload";
import { usePanel } from "@/hooks/usePanel";

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;

function AttachmentsDisplay() {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;

  return (
    <div className="flex flex-col self-start w-full gap-1 px-3 pt-3">
      {attachments.files.map((file) => {
        const isImage = file.mediaType?.startsWith("image/");
        const isVideo = file.mediaType?.startsWith("video/");
        return (
          <div key={file.id} className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-2 py-2 group w-full min-w-0">
            <div className="size-10 rounded-md overflow-hidden border border-border bg-muted shrink-0">
              {isImage && (
                <img src={file.url} alt={file.filename ?? ""} className="w-full h-full object-cover" />
              )}
              {isVideo && (
                <video src={file.url} className="w-full h-full object-cover" />
              )}
              {!isImage && !isVideo && (
                <div className="w-full h-full flex items-center justify-center">
                  <Paperclip className="size-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1 gap-0.5">
              <span className="text-xs font-medium truncate">{file.filename ?? "Untitled"}</span>
              <span className="text-[11px] text-muted-foreground font-mono truncate">{file.mediaType ?? "unknown"}</span>
            </div>
            <button
              type="button"
              onClick={() => attachments.remove(file.id)}
              className="size-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0 opacity-0 group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function SubmitButton({ status }: { status: "submitted" | "streaming" | "ready" | "error" }) {
  const attachments = usePromptInputAttachments();
  return (
    <PromptInputSubmit status={status} disabled={attachments.files.length === 0} />
  );
}

function AttachButton({ onFile }: { onFile: (file: File) => void }) {
  const attachments = usePromptInputAttachments();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) {
            attachments.clear();
            attachments.add([files[0]]);
            onFile(files[0]);
          }
          e.target.value = "";
        }}
      />
      <PromptInputButton onClick={() => inputRef.current?.click()}>
        <Paperclip className="size-4" />
      </PromptInputButton>
    </>
  );
}

interface StudioPromptInputProps {
  placeholder?: string;
  onSubmit?: (message: PromptInputMessage) => void;
  className?: string;
}

function StudioPromptInputInner({ placeholder, onSubmit, className }: StudioPromptInputProps) {
  const [status, setStatus] = useState<"submitted" | "streaming" | "ready" | "error">("ready");
  const { uploadFile } = useUpload();
  const { triggerUploadRefresh } = usePanel();

  const handleNewFile = useCallback((file: File) => {
    uploadFile(file).then((result) => {
      if (result) triggerUploadRefresh();
    });
  }, [uploadFile, triggerUploadRefresh]);

  const handleSubmit = useCallback((message: PromptInputMessage) => {
    if (!message.text && !message.files?.length) return;
    setStatus("submitted");
    setTimeout(() => setStatus("streaming"), SUBMITTING_TIMEOUT);
    setTimeout(() => setStatus("ready"), STREAMING_TIMEOUT);
    onSubmit?.(message);
  }, [onSubmit]);

  return (
    <div className={className}>
      <CanvasDropZone onExternalFile={handleNewFile}>
        <PromptInput maxFiles={1} onSubmit={handleSubmit}>
          <AttachmentsDisplay />
          <PromptInputBody>
            <PromptInputTextarea placeholder={placeholder ?? "Type a message…"} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <AttachButton onFile={handleNewFile} />
            </PromptInputTools>
            <SubmitButton status={status} />
          </PromptInputFooter>
        </PromptInput>
      </CanvasDropZone>
    </div>
  );
}

export function StudioPromptInput(props: StudioPromptInputProps) {
  return (
    <PromptInputProvider>
      <StudioPromptInputInner {...props} />
    </PromptInputProvider>
  );
}
