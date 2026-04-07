"use client";

import { useState, useCallback, useEffect, useRef, forwardRef } from "react";
import { Cancel01Icon, Settings01Icon } from "hugeicons-react";
import { Copy, Check, MoreHorizontal, Trash2, Search, Pencil, Film, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StudioPromptInput } from "@/components/ai/studio-prompt-input";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai/reasoning";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai/conversation";
import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerDurationDisplay,
  AudioPlayerElement,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
  AudioPlayerVolumeRange,
} from "@/components/ai/audio-player";
import { Transcription, TranscriptionSegment } from "@/components/ai/transcription";
import type { PromptInputMessage } from "@/components/ai/prompt-input";
import { useCaption } from "@/hooks/useCaption";
import { useDebounce } from "@/hooks/useDebounce";
import useClientStore from "@/store/clientStore";
import useCaptionStore from "@/store/captionStore";

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_AUDIO_SRC =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

const SAMPLE_SEGMENTS = [
  { text: "Capturing", startSecond: 0, endSecond: 0.6 },
  { text: "the", startSecond: 0.6, endSecond: 0.8 },
  { text: "moment", startSecond: 0.8, endSecond: 1.3 },
  { text: "when", startSecond: 1.3, endSecond: 1.6 },
  { text: "light", startSecond: 1.6, endSecond: 2.0 },
  { text: "meets", startSecond: 2.0, endSecond: 2.4 },
  { text: "shadow,", startSecond: 2.4, endSecond: 3.0 },
  { text: "the", startSecond: 3.0, endSecond: 3.2 },
  { text: "world", startSecond: 3.2, endSecond: 3.6 },
  { text: "holds", startSecond: 3.6, endSecond: 4.0 },
  { text: "its", startSecond: 4.0, endSecond: 4.2 },
  { text: "breath.", startSecond: 4.2, endSecond: 5.0 },
];

const SAMPLE_TITLE = "Golden Hour — When Light Meets Shadow";
const SAMPLE_DESCRIPTION =
  "A cinematic moment captured at dusk, where the interplay of light and shadow tells a story beyond words. Perfect for travel, lifestyle, and nature content.";
const SAMPLE_TAGS =
  "#GoldenHour #CinematicVibes #NaturePhotography #SunsetMoment #VisualStorytelling";

const REASONING_STEPS = [
  "Converting video to audio...",
  "Converting video to audio... ✓\n\nTranscribing audio in original language...",
  "Converting video to audio... ✓\n\nTranscribing audio... ✓\n\nGenerating title, description and tags...",
  "Converting video to audio... ✓\n\nTranscribing audio... ✓\n\nGenerating title, description and tags... ✓",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserMessage {
  id: string;
  role: "user";
  text: string;
  imageUrl?: string;
}

interface AssistantMessage {
  id: string;
  role: "assistant";
  isStreaming: boolean;
  reasoningText: string;
  showAudio: boolean;
  showTranscription: boolean;
  showCaptions: boolean;
}

type ChatMessage = UserMessage | AssistantMessage;

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={handleCopy}
      className="shrink-0 text-muted-foreground hover:text-foreground"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </Button>
  );
}

// ─── Audio card (with forwardRef for sync) ────────────────────────────────────

const AudioCard = forwardRef<HTMLAudioElement, { onTimeUpdate: (t: number) => void }>(
  ({ onTimeUpdate }, ref) => (
    <div className="rounded-xl border bg-background px-3 py-2.5">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
        Audio
      </p>
      <AudioPlayer>
        <AudioPlayerElement
          ref={ref}
          src={SAMPLE_AUDIO_SRC}
          onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
        />
        <AudioPlayerControlBar>
          <AudioPlayerPlayButton />
          <AudioPlayerTimeDisplay />
          <AudioPlayerTimeRange />
          <AudioPlayerDurationDisplay />
          <AudioPlayerMuteButton />
          <AudioPlayerVolumeRange />
        </AudioPlayerControlBar>
      </AudioPlayer>
    </div>
  ),
);
AudioCard.displayName = "AudioCard";

// ─── Transcription card ───────────────────────────────────────────────────────

function TranscriptionCard({
  currentTime,
  onSeek,
}: {
  currentTime: number;
  onSeek: (t: number) => void;
}) {
  return (
    <div className="rounded-xl border bg-background px-3 py-2.5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          Transcription
        </p>
        <CopyButton text={SAMPLE_SEGMENTS.map((s) => s.text).join(" ")} />
      </div>
      <Transcription segments={SAMPLE_SEGMENTS} currentTime={currentTime} onSeek={onSeek}>
        {(segment, index) => (
          <TranscriptionSegment key={index} segment={segment} index={index} />
        )}
      </Transcription>
    </div>
  );
}

// ─── Captions card ────────────────────────────────────────────────────────────

function CaptionsCard() {
  return (
    <div className="rounded-xl border bg-background px-3 py-2.5 space-y-3">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
        Captions
      </p>

      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Title</span>
          <CopyButton text={SAMPLE_TITLE} />
        </div>
        <p className="text-sm">{SAMPLE_TITLE}</p>
      </div>

      <div className="border-t" />

      {/* Description */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Description</span>
          <CopyButton text={SAMPLE_DESCRIPTION} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{SAMPLE_DESCRIPTION}</p>
      </div>

      <div className="border-t" />

      {/* Tags */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Tags</span>
          <CopyButton text={SAMPLE_TAGS} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_TAGS.split(" ").map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Message bubbles ──────────────────────────────────────────────────────────

function UserBubble({ msg }: { msg: UserMessage }) {
  return (
    <div className="flex flex-col items-end gap-2">
      {msg.imageUrl && (
        <img
          src={msg.imageUrl}
          alt="attachment"
          className="rounded-2xl max-w-sm max-h-48 object-cover"
        />
      )}
      {msg.text && (
        <div className="max-w-sm rounded-2xl bg-primary text-primary-foreground px-4 py-2.5 text-sm">
          <p>{msg.text}</p>
        </div>
      )}
    </div>
  );
}

function AssistantBubble({ msg }: { msg: AssistantMessage }) {
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSeek = useCallback((t: number) => {
    if (audioRef.current) audioRef.current.currentTime = t;
  }, []);

  return (
    <div className="flex justify-start">
      <div className="w-full rounded-2xl bg-muted text-foreground px-4 py-3 text-sm">
        <Reasoning isStreaming={msg.isStreaming} defaultOpen>
          <ReasoningTrigger />
          <ReasoningContent>{msg.reasoningText}</ReasoningContent>
        </Reasoning>

        {(msg.showAudio || msg.showTranscription || msg.showCaptions) && (
          <div className="space-y-3 mt-1">
            {msg.showAudio && (
              <AudioCard ref={audioRef} onTimeUpdate={setCurrentTime} />
            )}

            {msg.showTranscription && (
              <TranscriptionCard currentTime={currentTime} onSeek={handleSeek} />
            )}

            {msg.showCaptions && <CaptionsCard />}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Properties panel ─────────────────────────────────────────────────────────

// ─── History tab ──────────────────────────────────────────────────────────────

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

function HistoryTab() {
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    sessions, sessionsMeta, sessionsLoading, sessionsLoadingMore,
    fetchSessions, loadMoreSessions, setActiveSession, renameSession,
  } = useCaption();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const activeClientId = useClientStore((s) => s.activeClientId);

  useEffect(() => {
    setActiveSession(null);
    fetchSessions(debouncedSearch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClientId]);

  useEffect(() => {
    fetchSessions(debouncedSearch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Infinite scroll via IntersectionObserver
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

  // Group sessions by date
  const groups = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
    const group = formatGroupDate(s.created_at);
    (acc[group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
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

      {/* List */}
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
                        className="relative flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/60 transition-colors cursor-pointer"
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

            {/* Sentinel + load-more shimmer */}
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

// ─── Panel ────────────────────────────────────────────────────────────────────

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

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CaptionStudioPage() {
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { activeSession, createSession, fetchSessions } = useCaption();

  const handleNewGeneration = useCallback(async () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setMessages([]);
    setIsThinking(false);
    await createSession();
    fetchSessions();
  }, [createSession, fetchSessions]);

  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      if (isThinking) return;

      const imageUrl = message.files?.[0]?.url;
      const text = message.text?.trim();
      if (!imageUrl && !text) return;

      if (!useCaptionStore.getState().activeSession) {
        await createSession();
        fetchSessions();
      }

      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];

      const userMsg: UserMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text: text ?? "",
        imageUrl,
      };

      const assistantId = crypto.randomUUID();
      const assistantMsg: AssistantMessage = {
        id: assistantId,
        role: "assistant",
        isStreaming: true,
        reasoningText: REASONING_STEPS[0],
        showAudio: false,
        showTranscription: false,
        showCaptions: false,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsThinking(true);

      const patch = (update: Partial<AssistantMessage>) =>
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId && m.role === "assistant" ? { ...m, ...update } : m,
          ),
        );

      timersRef.current.push(
        setTimeout(() => patch({ reasoningText: REASONING_STEPS[1], showAudio: true }), 1000),
      );
      timersRef.current.push(
        setTimeout(() => patch({ reasoningText: REASONING_STEPS[2], showTranscription: true }), 2000),
      );
      timersRef.current.push(
        setTimeout(() => {
          patch({ isStreaming: false, reasoningText: REASONING_STEPS[3], showCaptions: true });
          setIsThinking(false);
        }, 3000),
      );
    },
    [isThinking, createSession, fetchSessions],
  );

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-1.5 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold shrink-0">Caption Studio</span>
            {activeSession && (
              <>
                <span className="text-muted-foreground text-sm">/</span>
                <span className="text-sm text-muted-foreground truncate max-w-40">
                  {activeSession.last_caption?.title || activeSession.title}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(messages.length > 0 || !!activeSession) && (
              <Button variant="outline" size="sm" onClick={handleNewGeneration}>
                New generation
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="size-8 p-0"
              onClick={() => setPropertiesOpen((v) => !v)}
            >
              <Settings01Icon className="size-4" strokeWidth={1.8} />
            </Button>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
            Upload a video and describe the captions you want.
          </div>
        ) : (
          <Conversation className="flex-1">
            <ConversationContent>
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <UserBubble key={msg.id} msg={msg} />
                ) : (
                  <AssistantBubble key={msg.id} msg={msg} />
                ),
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        )}

        <StudioPromptInput
          placeholder={
            messages.some((m) => m.role === "user" && (m as UserMessage).imageUrl)
              ? "Add a follow-up prompt…"
              : "Upload a video and describe what you need…"
          }
          onSubmit={handleSubmit}
          requireFile={!messages.some((m) => m.role === "user" && (m as UserMessage).imageUrl)}
          className="px-4 pb-4 shrink-0"
        />
      </div>

      <PropertiesPanel open={propertiesOpen} onClose={() => setPropertiesOpen(false)} />
    </div>
  );
}
