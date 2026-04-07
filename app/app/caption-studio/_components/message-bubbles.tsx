"use client";

import { useState, useCallback, useRef, forwardRef } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai/reasoning";
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
import {
  SAMPLE_AUDIO_SRC,
  SAMPLE_SEGMENTS,
  SAMPLE_TITLE,
  SAMPLE_DESCRIPTION,
  SAMPLE_TAGS,
} from "./types";
import type { UserMessage, AssistantMessage } from "./types";

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

function TranscriptionCard({ currentTime, onSeek }: { currentTime: number; onSeek: (t: number) => void }) {
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

function CaptionsCard() {
  return (
    <div className="rounded-xl border bg-background px-3 py-2.5 space-y-3">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
        Captions
      </p>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Title</span>
          <CopyButton text={SAMPLE_TITLE} />
        </div>
        <p className="text-sm">{SAMPLE_TITLE}</p>
      </div>
      <div className="border-t" />
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Description</span>
          <CopyButton text={SAMPLE_DESCRIPTION} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{SAMPLE_DESCRIPTION}</p>
      </div>
      <div className="border-t" />
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

export function UserBubble({ msg }: { msg: UserMessage }) {
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

export function AssistantBubble({ msg }: { msg: AssistantMessage }) {
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
            {msg.showAudio && <AudioCard ref={audioRef} onTimeUpdate={setCurrentTime} />}
            {msg.showTranscription && <TranscriptionCard currentTime={currentTime} onSeek={handleSeek} />}
            {msg.showCaptions && <CaptionsCard />}
          </div>
        )}
      </div>
    </div>
  );
}
