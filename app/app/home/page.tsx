"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Mic, Headphones, ImagePlay, Bot, Music, Languages } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import usePanelStore from "@/store/panelStore";
import useUserStore from "@/store/userStore";
import { ImagePlay as ImagePlayIcon } from "lucide-react";

const ACTION_ITEMS = [
  { label: "Instant speech", icon: Mic },
  { label: "Audiobook", icon: Headphones },
  { label: "Image & Video", icon: ImagePlay },
  { label: "ElevenAgents", icon: Bot },
  { label: "Music", icon: Music },
  { label: "Dubbed video", icon: Languages },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function FileDropInput() {
  const draggedFile = usePanelStore((s) => s.draggedFile);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (!droppedFile) return;
    const url = URL.createObjectURL(droppedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [droppedFile]);

  const isVideo = droppedFile?.type.startsWith("video/");

  return (
    <div
      className={`relative mt-6 w-full rounded-2xl border-2 border-dashed transition-colors overflow-hidden ${isOver ? "border-primary bg-primary/5" : "border-border bg-muted/30"}`}
      style={{ minHeight: 160 }}
      onDragOver={(e) => { if (draggedFile) { e.preventDefault(); setIsOver(true); } }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        if (draggedFile) setDroppedFile(draggedFile);
      }}
    >
      {droppedFile && previewUrl ? (
        <div className="flex items-start gap-4 p-4">
          <div className="size-20 shrink-0 rounded-xl overflow-hidden bg-muted">
            {isVideo
              ? <video src={previewUrl} className="w-full h-full object-cover" />
              : <img src={previewUrl} alt={droppedFile.name} className="w-full h-full object-cover" />
            }
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0 pt-1">
            <span className="text-sm font-semibold truncate">{droppedFile.name}</span>
            <span className="text-xs text-muted-foreground">{(droppedFile.size / 1024 / 1024).toFixed(1)} MB · {droppedFile.type.split("/")[1]?.toUpperCase()}</span>
            <textarea
              autoFocus
              placeholder="Add a prompt or description..."
              className="mt-2 w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring font-montserrat"
              rows={3}
            />
          </div>
          <button
            onClick={() => { setDroppedFile(null); setPreviewUrl(null); }}
            className="text-muted-foreground hover:text-foreground transition-colors text-xs shrink-0"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-10 select-none pointer-events-none">
          <ImagePlayIcon className={`size-8 transition-colors ${isOver ? "text-primary" : "text-muted-foreground/40"}`} />
          <p className={`text-sm font-medium transition-colors ${isOver ? "text-primary" : "text-muted-foreground"}`}>
            {isOver ? "Release to attach" : "Drag a file here"}
          </p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const draggedFile = usePanelStore((s) => s.draggedFile);
  const profile = useUserStore((s) => s.profile);
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const [droppingOn, setDroppingOn] = useState<string | null>(null);

  const handleDrop = (label: string, file: File) => {
    console.log(`Dropped "${file.name}" on "${label}"`);
  };

  return (
    <div className="flex flex-col flex-1 px-4 py-4 h-full transition-all duration-200 ease-linear">
      <header className="flex items-center justify-between w-full">
        <button className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800">
          <span className="bg-[#24292f] text-white text-xs font-medium px-2 py-1 rounded-full dark:bg-zinc-100 dark:text-zinc-900">
            New
          </span>
          <span className="text-sm font-medium tracking-tight">Caption Generator</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 stroke-[2.5]" />
        </button>
        <ThemeToggle />
      </header>

      <main className="flex flex-col mt-8">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-muted-foreground tracking-wide">My Workspace</span>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {ACTION_ITEMS.map((item) => {
            const isOver = droppingOn === item.label;
            return (
              <button
                key={item.label}
                className="group flex flex-col items-center gap-3"
                onDragOver={(e) => { if (draggedFile) { e.preventDefault(); setDroppingOn(item.label); } }}
                onDragLeave={() => setDroppingOn(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDroppingOn(null);
                  if (draggedFile) handleDrop(item.label, draggedFile);
                }}
              >
                <div className={`w-full aspect-square rounded-3xl flex items-center justify-center cursor-pointer transition-all ${isOver ? "bg-primary/10 ring-2 ring-primary ring-offset-2 scale-105" : "bg-muted"}`}>
                  <item.icon className={`w-10 h-10 transition-colors ${isOver ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <span className="text-[13px] font-semibold text-foreground tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <FileDropInput />
      </main>
    </div>
  );
}
