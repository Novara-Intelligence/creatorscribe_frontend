"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePanel } from "@/hooks/usePanel";
import { useUpload } from "@/hooks/useUpload";
import type { Upload } from "@/types/upload";
import { Cancel01Icon, Upload01Icon, Search01Icon } from "hugeicons-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const GAP = 4;
const TARGET_HEIGHT = 80;

function computeRows(
  items: { aspectRatio: number }[],
  containerWidth: number
): Array<{ indices: number[]; height: number; filled: boolean }> {
  if (!containerWidth || items.length === 0) return [];
  const rows: Array<{ indices: number[]; height: number; filled: boolean }> = [];
  let rowIndices: number[] = [];
  let arSum = 0;

  for (let i = 0; i < items.length; i++) {
    const ar = items[i].aspectRatio;
    rowIndices.push(i);
    arSum += ar;
    const gaps = (rowIndices.length - 1) * GAP;
    const rowHeight = (containerWidth - gaps) / arSum;

    if (rowHeight < TARGET_HEIGHT && rowIndices.length > 1) {
      rowIndices.pop();
      arSum -= ar;
      const prevGaps = (rowIndices.length - 1) * GAP;
      rows.push({ indices: [...rowIndices], height: (containerWidth - prevGaps) / arSum, filled: true });
      rowIndices = [i];
      arSum = ar;
    }
  }

  if (rowIndices.length > 0) {
    const gaps = (rowIndices.length - 1) * GAP;
    const naturalHeight = (containerWidth - gaps) / arSum;
    const filled = naturalHeight <= TARGET_HEIGHT;
    const height = filled ? naturalHeight : TARGET_HEIGHT;
    rows.push({ indices: rowIndices, height, filled });
  }

  return rows;
}

function UploadedThumb({
  upload,
  height,
  aspectRatio,
  style,
  onAspectRatio,
}: {
  upload: Upload;
  height: number;
  aspectRatio: number;
  style: React.CSSProperties;
  onAspectRatio: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [checked, setChecked] = useState(false);
  const isVideo = upload.file_type.startsWith("video/");
  const { setDraggedFile } = usePanel();

  const handleDragStart = (e: React.DragEvent) => {
    // Set a small ghost image synchronously so the drag preview isn't the full tile
    const ghost = document.createElement("div");
    ghost.style.cssText = "position:fixed;top:-1000px;width:80px;height:60px;overflow:hidden;border-radius:6px;";
    const el = document.createElement(isVideo ? "video" : "img");
    (el as HTMLImageElement).src = upload.file_url;
    el.style.cssText = "width:100%;height:100%;object-fit:cover;";
    ghost.appendChild(el);
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 40, 30);
    setTimeout(() => document.body.removeChild(ghost), 0);

    // Fetch blob in background so setDraggedFile is ready before drop
    fetch(upload.file_url)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], upload.original_name, { type: upload.file_type });
        setDraggedFile(file);
      })
      .catch(() => { });
  };

  return (
    <div
      style={style}
      className="relative overflow-hidden rounded-md bg-muted cursor-grab active:cursor-grabbing shrink-0 animate-in fade-in duration-200"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setDraggedFile(null)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isVideo ? (
        <video
          src={upload.file_url}
          className="w-full h-full object-cover"
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth && v.videoHeight) onAspectRatio(v.videoWidth / v.videoHeight);
          }}
        />
      ) : (
        <img
          src={upload.file_url}
          alt={upload.original_name}
          className="w-full h-full object-cover"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) onAspectRatio(img.naturalWidth / img.naturalHeight);
          }}
        />
      )}

      {(hovered || checked) && <div className="absolute inset-0 bg-black/20" />}

      {(hovered || checked) && (
        <div className="absolute top-1.5 left-1.5 z-10">
          <Checkbox
            checked={checked}
            onCheckedChange={(v) => setChecked(!!v)}
            className="size-4 border-white bg-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      )}

      {hovered && (
        <div className="absolute top-1 right-1 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex size-6 items-center justify-center rounded-md bg-black/40 text-white hover:bg-black/60 transition-colors">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 p-0.5">
              <DropdownMenuItem className="text-xs font-medium" onClick={() => window.open(upload.file_url, "_blank")}>Download</DropdownMenuItem>
              <DropdownMenuItem className="text-xs font-medium" onClick={() => navigator.clipboard.writeText(upload.file_url)}>Copy link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

interface PendingFile {
  id: string;
  file: File;
  progress: number;
  aspectRatio: number;
}

function PendingUploadThumb({
  pending,
  height,
  aspectRatio,
  style,
  onAspectRatio,
}: {
  pending: PendingFile;
  height: number;
  aspectRatio: number;
  style: React.CSSProperties;
  onAspectRatio: (r: number) => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const isVideo = pending.file.type.startsWith("video/");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(pending.file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [pending.file]);

  return (
    <div
      style={style}
      className="relative overflow-hidden rounded-md bg-muted shrink-0 animate-in fade-in duration-200"
    >
      {url && (isVideo ? (
        <video
          src={url}
          className="w-full h-full object-cover"
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth && v.videoHeight) onAspectRatio(v.videoWidth / v.videoHeight);
          }}
        />
      ) : (
        <img
          src={url}
          alt={pending.file.name}
          className="w-full h-full object-cover"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) onAspectRatio(img.naturalWidth / img.naturalHeight);
          }}
        />
      ))}

      {/* dim overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
        <div
          className="h-full bg-white transition-[width] duration-150 ease-out"
          style={{ width: `${pending.progress}%` }}
        />
      </div>

      {/* percentage label */}
      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
        <span className="text-[10px] font-semibold text-white tabular-nums">
          {pending.progress < 100 ? `${pending.progress}%` : "Processing…"}
        </span>
      </div>
    </div>
  );
}

export function UploadPanel() {
  const { activePanel, closePanel, addPendingFiles } = usePanel();
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const open = activePanel === "uploads";
  const [draggingOver, setDraggingOver] = useState(false);
  const [search, setSearch] = useState("");
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({});
  const [containerWidth, setContainerWidth] = useState(240);
  const dragCounter = useRef(0);

  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const { uploads, isUploading, isFetching, uploadFile, fetchUploads } = useUpload();

  useEffect(() => {
    if (open) fetchUploads();
  }, [open, fetchUploads]);

  useEffect(() => {
    if (!gridRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [open]);

  const handleAspectRatio = useCallback((key: string, ratio: number) => {
    setAspectRatios((prev) => ({ ...prev, [key]: ratio }));
  }, []);

  const handleFiles = async (files: File[]) => {
    const filtered = files.filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (filtered.length === 0) return;
    addPendingFiles(filtered);

    const entries: PendingFile[] = filtered.map((f) => ({
      id: `${f.name}-${f.size}-${f.lastModified}`,
      file: f,
      progress: 0,
      aspectRatio: aspectRatios[`${f.name}-${f.size}-${f.lastModified}`] ?? 1,
    }));
    setPendingFiles((prev) => [...prev, ...entries]);

    await Promise.all(
      filtered.map(async (f) => {
        const id = `${f.name}-${f.size}-${f.lastModified}`;
        await uploadFile(f, (pct) => {
          setPendingFiles((prev) =>
            prev.map((e) => (e.id === id ? { ...e, progress: pct } : e))
          );
        });
        setPendingFiles((prev) => prev.filter((e) => e.id !== id));
      })
    );

    await fetchUploads();
  };

  const filteredUploads = uploads.filter((u) =>
    u.original_name.toLowerCase().includes(search.toLowerCase())
  );

  const uploadKey = (u: Upload) => String(u.id);

  type GridItem =
    | { kind: "pending"; pending: PendingFile; key: string; aspectRatio: number }
    | { kind: "uploaded"; upload: Upload; key: string; aspectRatio: number };

  const items: GridItem[] = [
    ...pendingFiles.map((p) => ({
      kind: "pending" as const,
      pending: p,
      key: p.id,
      aspectRatio: aspectRatios[p.id] ?? 1,
    })),
    ...filteredUploads.map((u) => ({
      kind: "uploaded" as const,
      upload: u,
      key: uploadKey(u),
      aspectRatio: aspectRatios[uploadKey(u)] ?? 1,
    })),
  ];

  const rows = computeRows(items, containerWidth);

  return (
    <aside
      className={`relative flex flex-col border-r bg-background transition-all duration-200 ease-in-out overflow-hidden shrink-0 h-full ${open ? "w-80 opacity-100" : "w-0 opacity-0"}`}
      onDragEnter={(e) => { e.preventDefault(); dragCounter.current++; if (dragCounter.current === 1) setDraggingOver(true); }}
      onDragLeave={() => { dragCounter.current--; if (dragCounter.current === 0) setDraggingOver(false); }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); dragCounter.current = 0; setDraggingOver(false); handleFiles(Array.from(e.dataTransfer.files)); }}
    >
      {draggingOver && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/90 backdrop-blur-sm border-1 m-2 rounded-lg border-dashed border-primary pointer-events-none">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Upload01Icon className="size-6 text-primary" strokeWidth={1.5} />
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-semibold">Drop files here</p>
            <p className="text-xs text-muted-foreground mt-0.5">Images & videos</p>
          </div>
        </div>
      )}

      <div className="flex flex-col h-full w-80">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <span className="font-semibold text-sm">Uploads</span>
          <button onClick={closePanel} className="text-muted-foreground hover:text-foreground transition-colors">
            <Cancel01Icon className="size-4" />
          </button>
        </div>

        {/* Search + Upload button */}
        <div className="px-3 pt-3 pb-2 flex flex-col gap-2 shrink-0">
          <div className="relative">
            <Search01Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" strokeWidth={1.5} />
            <Input
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs font-montserrat"
            />
          </div>
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            variant="default"
            className="h-8 text-xs font-montserrat bg-[#1869db] dark:text-foreground"
          >
            <Upload01Icon className="size-3.5" strokeWidth={1.5} />
            {isUploading ? "Uploading..." : "Upload files"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length > 0) handleFiles(files);
              e.target.value = "";
            }}
          />
        </div>

        {/* Scrollable file grid */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-3 flex flex-col gap-1.5">
          {isFetching && uploads.length === 0 && pendingFiles.length === 0 ? (
            <div className="flex flex-col gap-1 pt-1">
              <div className="flex gap-1">
                <Skeleton className="h-[110px] flex-[1.4] rounded-md" />
                <Skeleton className="h-[110px] flex-[1] rounded-md" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-[110px] flex-[1] rounded-md" />
                <Skeleton className="h-[110px] flex-[1.6] rounded-md" />
                <Skeleton className="h-[110px] flex-[0.8] rounded-md" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-[110px] flex-[1.2] rounded-md" />
                <Skeleton className="h-[110px] flex-[1] rounded-md" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-[110px] flex-[0.9] rounded-md" />
                <Skeleton className="h-[110px] flex-[1.3] rounded-md" />
                <Skeleton className="h-[110px] flex-[1] rounded-md" />
              </div>
            </div>
          ) : items.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No uploads yet.</p>
          ) : filteredUploads.length === 0 && pendingFiles.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No files match your search.</p>
          ) : (
            <>
              <div className="shrink-0 py-0.5">
                <span className="text-[11px] font-montserrat font-semibold text-muted-foreground uppercase tracking-wide">
                  {filteredUploads.length + pendingFiles.length} file{filteredUploads.length + pendingFiles.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div ref={gridRef} className="flex flex-col gap-1">
                {rows.map((row, ri) => (
                  <div key={ri} className="flex gap-1">
                    {row.indices.map((idx) => {
                      const item = items[idx];
                      const style = row.filled
                        ? { flex: item.aspectRatio, height: row.height, minWidth: 0 }
                        : { width: item.aspectRatio * row.height, height: row.height, flexShrink: 0 };
                      return item.kind === "pending" ? (
                        <PendingUploadThumb
                          key={item.key}
                          pending={item.pending}
                          height={row.height}
                          aspectRatio={item.aspectRatio}
                          style={style}
                          onAspectRatio={(r) => handleAspectRatio(item.key, r)}
                        />
                      ) : (
                        <UploadedThumb
                          key={item.key}
                          upload={item.upload}
                          height={row.height}
                          aspectRatio={item.aspectRatio}
                          style={style}
                          onAspectRatio={(r) => handleAspectRatio(item.key, r)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
