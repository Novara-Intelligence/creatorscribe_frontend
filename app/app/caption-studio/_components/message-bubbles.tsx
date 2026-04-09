"use client";

import { useState, useCallback, useRef, forwardRef } from "react";
import { Copy, Check, Play, Pause } from "lucide-react";
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
import type { UserMessage, AssistantMessage, TranscriptionSegment as SegmentType } from "./types";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function VideoPreview({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) videoRef.current.currentTime = ratio * duration;
  };

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <div className="relative rounded-2xl overflow-hidden max-w-sm group">
      <video
        ref={videoRef}
        src={src}
        onClick={toggle}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        className="w-full max-h-48 object-cover cursor-pointer block"
      />
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 pt-6 pb-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div
          onClick={handleProgressClick}
          className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-2.5"
        >
          <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="text-white shrink-0">
            {isPlaying
              ? <Pause className="size-3.5" fill="currentColor" strokeWidth={0} />
              : <Play className="size-3.5 ml-px" fill="currentColor" strokeWidth={0} />}
          </button>
          <span className="text-[11px] text-white/80 tabular-nums font-[family-name:var(--font-montserrat)]">
            {fmt(current)} / {fmt(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

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

const AudioCard = forwardRef<HTMLAudioElement, { src: string; onTimeUpdate: (t: number) => void }>(
  ({ src, onTimeUpdate }, ref) => (
    <div className="rounded-xl border bg-background px-3 py-2.5">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
        Audio
      </p>
      <AudioPlayer>
        <AudioPlayerElement
          ref={ref}
          src={src}
          crossOrigin="anonymous"
          preload="auto"
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

function TranscriptionCard({
  segments,
  currentTime,
  onSeek,
}: {
  segments: SegmentType[];
  currentTime: number;
  onSeek: (t: number) => void;
}) {
  return (
    <div className="rounded-xl border bg-background px-3 py-2.5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          Transcription
        </p>
        <CopyButton text={segments.map((s) => s.text).join(" ")} />
      </div>
      <Transcription segments={segments} currentTime={currentTime} onSeek={onSeek}>
        {(segment, index) => (
          <TranscriptionSegment key={index} segment={segment} index={index} />
        )}
      </Transcription>
    </div>
  );
}

function CaptionsCard({
  title,
  description,
  tags,
}: {
  title: string;
  description: string;
  tags: string[];
}) {
  return (
    <div className="rounded-xl border bg-background px-3 py-2.5 space-y-3">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
        Captions
      </p>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Title</span>
          <CopyButton text={title} />
        </div>
        <p className="text-sm">{title}</p>
      </div>
      <div className="border-t" />
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Description</span>
          <CopyButton text={description} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="border-t" />
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Tags</span>
          <CopyButton text={tags.join(" ")} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
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
  const isVideo = msg.mediaType?.startsWith("video/");
  return (
    <div className="flex flex-col items-end gap-2">
      {msg.imageUrl && (
        isVideo ? (
          <VideoPreview src={msg.imageUrl} />
        ) : (
          <img
            src={msg.imageUrl}
            alt="attachment"
            className="rounded-2xl max-w-sm max-h-48 object-cover"
          />
        )
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
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = t;
    audio.play();
  }, []);

  const hasAudio = !!msg.audioUrl;
  const hasTranscription = !!msg.segments?.length;
  const hasCaptions = !!msg.title;

  return (
    <div className="flex justify-start">
      <div className="w-full rounded-2xl bg-muted text-foreground px-4 py-3 text-sm">
        <Reasoning isStreaming={msg.isStreaming} defaultOpen>
          <ReasoningTrigger />
          <ReasoningContent>{msg.reasoningText}</ReasoningContent>
        </Reasoning>
        {msg.errorMessage && (
          <p className="mt-2 text-sm text-destructive">{msg.errorMessage}</p>
        )}
        {(hasAudio || hasTranscription || hasCaptions) && (
          <div className="space-y-3 mt-1">
            {hasAudio && (
              <AudioCard ref={audioRef} src={msg.audioUrl!} onTimeUpdate={setCurrentTime} />
            )}
            {hasTranscription && (
              <TranscriptionCard
                segments={msg.segments!}
                currentTime={currentTime}
                onSeek={handleSeek}
              />
            )}
            {hasCaptions && (
              <CaptionsCard
                title={msg.title!}
                description={msg.description!}
                tags={msg.tags!}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
