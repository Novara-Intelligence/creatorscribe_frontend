"use client";

import { useState, useCallback, useEffect, useRef, forwardRef } from "react";
import { Cancel01Icon, Settings01Icon } from "hugeicons-react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CaptionStudioPage() {
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      if (isThinking) return;

      const imageUrl = message.files?.[0]?.url;
      const text = message.text?.trim();
      if (!imageUrl && !text) return;

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
    [isThinking],
  );

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
          placeholder="Upload a video and describe what you need…"
          onSubmit={handleSubmit}
          className="px-4 pb-4 shrink-0"
        />
      </div>

      <PropertiesPanel open={propertiesOpen} onClose={() => setPropertiesOpen(false)} />
    </div>
  );
}
