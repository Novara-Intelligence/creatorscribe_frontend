"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import usePanelStore from "@/store/panelStore";
import { Cancel01Icon, Upload01Icon, Search01Icon } from "hugeicons-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const GAP = 4;
const TARGET_HEIGHT = 110;

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

    if (rowHeight < TARGET_HEIGHT && rowIndices.length > 1) {
      rowIndices.pop();
      arSum -= ar;
      const prevGaps = (rowIndices.length - 1) * GAP;
      rows.push({ indices: [...rowIndices], height: (containerWidth - prevGaps) / arSum });
      rowIndices = [i];
      arSum = ar;
    }
  }

  if (rowIndices.length > 0) {
    const gaps = (rowIndices.length - 1) * GAP;
    const height = Math.min((containerWidth - gaps) / arSum, TARGET_HEIGHT);
    rows.push({ indices: rowIndices, height });
  }

  return rows;
}

function FileThumb({
  file,
  height,
  aspectRatio,
  onAspectRatio,
  onRemove,
}: {
  file: File;
  height: number;
  aspectRatio: number;
  onAspectRatio: (r: number) => void;
  onRemove: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [checked, setChecked] = useState(false);
  const isVideo = file.type.startsWith("video/");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div
      style={{ flex: aspectRatio, height, minWidth: 0 }}
      className="relative overflow-hidden rounded-md bg-muted cursor-pointer shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
          alt={file.name}
          className="w-full h-full object-cover"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) onAspectRatio(img.naturalWidth / img.naturalHeight);
          }}
        />
      ))}

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
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({});
  const [containerWidth, setContainerWidth] = useState(240);
  const dragCounter = useRef(0);

  useEffect(() => {
    if (!gridRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [open]); // re-attach when panel opens

  const handleAspectRatio = useCallback((key: string, ratio: number) => {
    setAspectRatios((prev) => ({ ...prev, [key]: ratio }));
  }, []);

  const handleFiles = (files: File[]) => {
    const filtered = files.filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (filtered.length > 0) addPendingFiles(filtered);
  };

  const removeFile = (index: number) => {
    const updated = pendingFiles.filter((_, i) => i !== index);
    clearPendingFiles();
    if (updated.length > 0) addPendingFiles(updated);
  };

  const filteredFiles = pendingFiles.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const fileKey = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

  const items = filteredFiles.map((f) => ({
    file: f,
    key: fileKey(f),
    aspectRatio: aspectRatios[fileKey(f)] ?? 1,
  }));

  const rows = computeRows(items, containerWidth);

  return (
    <aside
      className={`relative flex flex-col border-r bg-background transition-all duration-300 ease-in-out overflow-hidden shrink-0 h-full ${open ? "w-72 opacity-100" : "w-0 opacity-0"}`}
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
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <span className="font-semibold text-sm">Uploads</span>
          <button onClick={closePanel} className="text-muted-foreground hover:text-foreground transition-colors">
            <Cancel01Icon className="size-4" />
          </button>
        </div>

        {/* Search + Upload button — fixed */}
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
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full h-8 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/40 transition-colors text-xs font-medium text-muted-foreground"
          >
            <Upload01Icon className="size-3.5" strokeWidth={1.5} />
            Upload files
          </button>
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

        {/* Scrollable file grid only */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-3 flex flex-col gap-1.5">
          {pendingFiles.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No uploads yet.</p>
          ) : filteredFiles.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No files match your search.</p>
          ) : (
            <>
              <div className="shrink-0 py-0.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div ref={gridRef} className="flex flex-col gap-1">
                {rows.map((row, ri) => (
                  <div key={ri} className="flex gap-1">
                    {row.indices.map((idx) => {
                      const item = items[idx];
                      return (
                        <FileThumb
                          key={item.key}
                          file={item.file}
                          height={row.height}
                          aspectRatio={item.aspectRatio}
                          onAspectRatio={(r) => handleAspectRatio(item.key, r)}
                          onRemove={() => removeFile(pendingFiles.indexOf(item.file))}
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
