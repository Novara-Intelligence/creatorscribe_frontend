"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Film, MoreHorizontal, Pencil, Trash2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCaption } from "@/hooks/useCaption";
import { useDebounce } from "@/hooks/useDebounce";
import useClientStore from "@/store/clientStore";

function SessionThumbnail({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="size-10 rounded-md shrink-0 bg-muted flex items-center justify-center">
        <Film className="size-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="size-10 rounded-md object-cover shrink-0"
      onError={() => setError(true)}
    />
  );
}

function SessionShimmer() {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <Skeleton className="size-10 rounded-md shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-3/4 rounded" />
        <Skeleton className="h-2.5 w-1/2 rounded" />
      </div>
    </div>
  );
}

function formatGroupDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function HistoryTab() {
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    sessions, sessionsMeta, sessionsLoading, sessionsLoadingMore,
    fetchSessions, loadMoreSessions, setActiveSession, renameSession, activeSession,
  } = useCaption();

  const activeClientId = useClientStore((s) => s.activeClientId);
  const prevClientIdRef = useRef<number | null>(null);

  useEffect(() => {
    const isMount = prevClientIdRef.current === null;
    const clientChanged = !isMount && prevClientIdRef.current !== activeClientId;
    prevClientIdRef.current = activeClientId;

    if (clientChanged) {
      // User switched client — clear the previous session
      setActiveSession(null);
    } else if (isMount) {
      // On mount — clear only if the persisted session belongs to a different client
      const current = activeSession;
      if (current && current.client_id !== activeClientId) {
        setActiveSession(null);
      }
    }

    fetchSessions(debouncedSearch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClientId]);

  useEffect(() => {
    fetchSessions(debouncedSearch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMoreSessions(debouncedSearch); },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [debouncedSearch, loadMoreSessions]);

  const groups = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
    const group = formatGroupDate(s.created_at);
    (acc[group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sessions…"
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
        {sessionsLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 6 }).map((_, i) => <SessionShimmer key={i} />)}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex items-center justify-center pt-12 text-sm text-muted-foreground">
            No sessions found.
          </div>
        ) : (
          <>
            {Object.entries(groups).map(([group, items]) => (
              <div key={group}>
                <div className="flex justify-center mb-2">
                  <Badge variant="secondary" className="text-[11px] text-muted-foreground font-normal">
                    {group}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {items.map((session) => {
                    const isRenaming = renamingId === session.id;
                    const displayTitle = session.last_caption?.title || session.title;

                    const handleSaveRename = async () => {
                      const trimmed = renameValue.trim();
                      if (trimmed && trimmed !== displayTitle) {
                        await renameSession(session.id, trimmed);
                      }
                      setRenamingId(null);
                    };

                    return (
                      <div
                        key={session.id}
                        onMouseEnter={() => !isRenaming && setHoveredId(session.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`relative flex items-center gap-3 rounded-lg px-2 py-2 transition-colors cursor-pointer ${activeSession?.id === session.id ? "bg-muted/40" : "hover:bg-muted/60"}`}
                        onClick={() => !isRenaming && setActiveSession(session)}
                      >
                        <SessionThumbnail src={session.thumbnail} alt={session.title} />

                        {isRenaming ? (
                          <div className="flex flex-1 items-center gap-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                            <Input
                              autoFocus
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveRename();
                                if (e.key === "Escape") setRenamingId(null);
                              }}
                              className="h-6 text-xs px-1.5 flex-1"
                            />
                            <button
                              onClick={handleSaveRename}
                              className="flex size-5 items-center justify-center rounded text-muted-foreground hover:text-foreground shrink-0"
                            >
                              <Check className="size-3" />
                            </button>
                            <button
                              onClick={() => setRenamingId(null)}
                              className="flex size-5 items-center justify-center rounded text-muted-foreground hover:text-foreground shrink-0"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{displayTitle}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {formatGroupDate(session.created_at)}
                              </p>
                            </div>
                            {hoveredId === session.id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger className="flex size-6 items-center justify-center rounded-md hover:bg-muted text-muted-foreground shrink-0">
                                  <MoreHorizontal className="size-3.5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-24 min-w-0">
                                  <DropdownMenuItem
                                    className="text-xs py-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRenamingId(session.id);
                                      setRenameValue(displayTitle);
                                    }}
                                  >
                                    <Pencil className="size-3" />
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuItem variant="destructive" className="text-xs py-1">
                                    <Trash2 className="size-3" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {sessionsMeta?.has_next && (
              <div ref={sentinelRef} className="space-y-1">
                {sessionsLoadingMore && (
                  <>
                    <SessionShimmer />
                    <SessionShimmer />
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
