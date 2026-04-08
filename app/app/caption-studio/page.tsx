"use client";

import { useState, useCallback, useRef } from "react";
import { Settings01Icon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { StudioPromptInput } from "@/components/ai/studio-prompt-input";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai/conversation";
import type { PromptInputMessage } from "@/components/ai/prompt-input";
import { useCaption } from "@/hooks/useCaption";
import useCaptionStore from "@/store/captionStore";
import useClientStore from "@/store/clientStore";
import uploadService from "@/services/upload.service";
import captionJobService from "@/services/captionJob.service";
import { API_BASE_URL } from "@/constants/config";
import { UserBubble, AssistantBubble } from "./_components/message-bubbles";
import { PropertiesPanel } from "./_components/properties-panel";
import { REASONING } from "./_components/types";
import type { ChatMessage, UserMessage, AssistantMessage } from "./_components/types";

export default function CaptionStudioPage() {
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const streamCleanupRef = useRef<(() => void) | null>(null);
  const { activeSession, createSession, fetchSessions } = useCaption();

  const handleNewGeneration = useCallback(async () => {
    streamCleanupRef.current?.();
    streamCleanupRef.current = null;
    setMessages([]);
    setIsThinking(false);
    await createSession();
    fetchSessions();
  }, [createSession, fetchSessions]);

  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      if (isThinking) return;

      const file = message.files?.[0];
      const text = message.text?.trim();
      if (!file?.url && !text) return;

      if (!useCaptionStore.getState().activeSession) {
        await createSession();
        fetchSessions();
      }

      const session = useCaptionStore.getState().activeSession;
      if (!session) return;

      streamCleanupRef.current?.();
      streamCleanupRef.current = null;

      const isVideo = file?.mediaType?.startsWith("video/");

      const userMsg: UserMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text: text ?? "",
        imageUrl: file?.url,
        mediaType: file?.mediaType,
      };

      const assistantId = crypto.randomUUID();
      const assistantMsg: AssistantMessage = {
        id: assistantId,
        role: "assistant",
        isStreaming: true,
        reasoningText: isVideo ? REASONING.video.start : REASONING.image.start,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsThinking(true);

      const patch = (update: Partial<AssistantMessage>) =>
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId && m.role === "assistant" ? { ...m, ...update } : m,
          ),
        );

      try {
        // Upload file if provided
        let file_id: number | undefined;
        if (file?.url) {
          const clientId = useClientStore.getState().activeClientId;
          if (clientId) {
            const blob = await fetch(file.url).then((r) => r.blob());
            const fileObj = new File([blob], file.filename ?? "upload", { type: file.mediaType });
            const uploaded = await uploadService.uploadFile(fileObj, clientId);
            file_id = uploaded.data.id;
          }
        }

        // Submit job
        const job = await captionJobService.submitJob({
          session_id: session.id,
          file_id,
          prompt: text || undefined,
        });

        // Open SSE stream
        const cleanup = captionJobService.streamJob(job.job_id, {
          onAudioReady: (data) => {
            const origin = new URL(API_BASE_URL).origin;
            const audioUrl = data.audio_url.startsWith("http")
              ? data.audio_url
              : `${origin}${data.audio_url}`;
            patch({
              reasoningText: REASONING.video.audio,
              audioUrl,
              audioDuration: data.duration,
            });
          },
          onTranscriptionReady: (data) => {
            patch({
              reasoningText: REASONING.video.transcription,
              segments: data.segments,
            });
          },
          onCaptionReady: (data) => {
            patch({
              isStreaming: false,
              reasoningText: isVideo ? REASONING.video.done : REASONING.image.done,
              title: data.title,
              description: data.description,
              tags: data.tags,
            });
            setIsThinking(false);
            fetchSessions();
          },
          onError: (errorMessage) => {
            patch({ isStreaming: false, errorMessage });
            setIsThinking(false);
          },
        });

        streamCleanupRef.current = cleanup;
      } catch {
        patch({ isStreaming: false, errorMessage: "Failed to submit job. Please try again." });
        setIsThinking(false);
      }
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
