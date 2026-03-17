"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import usePanelStore from "@/store/panelStore";
import { Cancel01Icon, Upload01Icon, Search01Icon } from "hugeicons-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const GAP = 4;
const TARGET_HEIGHT = 110; // minimum row height

// Justified row layout: groups items into rows where each row fills container width exactly.
// Row height = (containerWidth - gaps) / sum(aspectRatios in row)
function computeRows(
  items: { aspectRatio: number }[],
  containerWidth: number
): Array<{ indices: number[]; height: number }> {
  if (!containerWidth || items.length === 0) return [];
  const rows: Array<{ indices: number[]; height: number }> = [];
  let rowIndices: number[] = [];
  let arSum = 0;

  for (let i = 0; i < items.length; i++) {
    const ar = items[i].aspectRatio;
    rowIndices.push(i);
    arSum += ar;
    const gaps = (rowIndices.length - 1) * GAP;
    const rowHeight = (containerWidth - gaps) / arSum;

    // If adding this item makes the row shorter than TARGET_HEIGHT, close the previous row
    if (rowHeight < TARGET_HEIGHT && rowIndices.length > 1) {
      // Remove last item, close row without it
      rowIndices.pop();
      arSum -= ar;
      const prevGaps = (rowIndices.length - 1) * GAP;
      rows.push({ indices: [...rowIndices], height: (containerWidth - prevGaps) / arSum });
      // Start new row with current item
      rowIndices = [i];
      arSum = ar;
    }
  }

  // Last row — don't stretch, cap at TARGET_HEIGHT
  if (rowIndices.length > 0) {
    const gaps = (rowIndices.length - 1) * GAP;
    const height = Math.min((containerWidth - gaps) / arSum, TARGET_HEIGHT);
    rows.push({ indices: rowIndices, height });
  }

  return rows;
}

function FileThumb({
  file,
  url,
  height,
  aspectRatio,
  onAspectRatio,
  onRemove,
}: {
  file: File;
  url: string;
  height: number;
  aspectRatio: number;
  onAspectRatio: (r: number) => void;
  onRemove: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [checked, setChecked] = useState(false);
  const isVideo = file.type.startsWith("video/");

  return (
    <div
      style={{ flex: aspectRatio, height, minWidth: 0 }}
      className="relative overflow-hidden rounded-md bg-muted cursor-pointer shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isVideo ? (
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
          alt={file.name}
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
              <DropdownMenuItem className="text-xs font-medium">Download</DropdownMenuItem>
              <DropdownMenuItem className="text-xs font-medium">Copy link</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" className="text-xs font-medium" onClick={onRemove}>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

export function UploadPanel() {
  const activePanel = usePanelStore((s) => s.activePanel);
  const closePanel = usePanelStore((s) => s.closePanel);
  const pendingFiles = usePanelStore((s) => s.pendingFiles);
  const clearPendingFiles = usePanelStore((s) => s.clearPendingFiles);
  const addPendingFiles = usePanelStore((s) => s.addPendingFiles);
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const open = activePanel === "uploads";
  const [draggingOver, setDraggingOver] = useState(false);
  const [search, setSearch] = useState("");
  const dragCounter = useRef(0);

  // Per-file state: url + aspect ratio, keyed by file identity
  const [fileData, setFileData] = useState<Record<string, { url: string; aspectRatio: number }>>({});
  const [containerWidth, setContainerWidth] = useState(240);

  // Track container width
  useEffect(() => {
    if (!gridRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  // Create/revoke blob URLs as pendingFiles changes
  useEffect(() => {
    const keys = new Set(pendingFiles.map((f) => `${f.name}-${f.size}-${f.lastModified}`));
    setFileData((prev) => {
      const next: typeof prev = {};
      for (const f of pendingFiles) {
        const key = `${f.name}-${f.size}-${f.lastModified}`;
        if (prev[key]) {
          next[key] = prev[key];
        } else {
          next[key] = { url: URL.createObjectURL(f), aspectRatio: 1 };
        }
      }
      // Revoke removed
      for (const [k, v] of Object.entries(prev)) {
        if (!keys.has(k)) URL.revokeObjectURL(v.url);
      }
      return next;
    });
  }, [pendingFiles]);

  // Cleanup on unmount
  useEffect(() => () => {
    Object.values(fileData).forEach((d) => URL.revokeObjectURL(d.url));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFiles = (files: File[]) => {
    const filtered = files.filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (filtered.length > 0) addPendingFiles(filtered);
  };

  const removeFile = (index: number) => {
    const updated = pendingFiles.filter((_, i) => i !== index);
    clearPendingFiles();
    if (updated.length > 0) addPendingFiles(updated);
  };

  const setAspectRatio = useCallback((key: string, ratio: number) => {
    setFileData((prev) => prev[key] ? { ...prev, [key]: { ...prev[key], aspectRatio: ratio } } : prev);
  }, []);

  const filteredFiles = pendingFiles.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const items = filteredFiles.map((f) => {
    const key = `${f.name}-${f.size}-${f.lastModified}`;
    return { file: f, key, ...(fileData[key] ?? { url: "", aspectRatio: 1 }) };
  });

  const rows = computeRows(items, containerWidth);

  return (
    <aside
      className={`relative flex flex-col border-r bg-background transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${open ? "w-72 opacity-100" : "w-0 opacity-0"}`}
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

      <div className="flex flex-col h-full w-72">
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <span className="font-semibold text-sm">Uploads</span>
          <button onClick={closePanel} className="text-muted-foreground hover:text-foreground transition-colors">
            <Cancel01Icon className="size-4" />
          </button>
        </div>

        <div className="px-3 pt-3 shrink-0">
          <div className="relative">
            <Search01Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" strokeWidth={1.5} />
            <Input
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs font-montserrat"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {/* Drop zone */}
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/40 transition-colors cursor-pointer py-6 px-4 shrink-0"
            onClick={() => inputRef.current?.click()}
          >
            <Upload01Icon className="size-5 text-muted-foreground" strokeWidth={1.5} />
            <div className="text-center">
              <p className="text-xs font-semibold">Click or drag to upload</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Images & videos</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length > 0) addPendingFiles(files);
                e.target.value = "";
              }}
            />
          </div>

          {/* File grid */}
          {pendingFiles.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
                </span>
                <button onClick={clearPendingFiles} className="text-[11px] text-muted-foreground hover:text-destructive transition-colors">
                  Clear all
                </button>
              </div>
              {filteredFiles.length === 0
                ? <p className="text-xs text-muted-foreground text-center py-4">No files match your search.</p>
                : (
                  <div ref={gridRef} className="flex flex-col gap-1">
                    {rows.map((row, ri) => (
                      <div key={ri} className="flex gap-1">
                        {row.indices.map((idx) => {
                          const item = items[idx];
                          if (!item?.url) return null;
                          return (
                            <FileThumb
                              key={item.key}
                              file={item.file}
                              url={item.url}
                              height={row.height}
                              aspectRatio={item.aspectRatio}
                              onAspectRatio={(r) => setAspectRatio(item.key, r)}
                              onRemove={() => removeFile(pendingFiles.indexOf(item.file))}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
