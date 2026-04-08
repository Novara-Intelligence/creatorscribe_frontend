"use client";

import { useState, useCallback, useRef } from "react";
import { Settings01Icon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { StudioPromptInput } from "@/components/ai/studio-prompt-input";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai/conversation";
import type { PromptInputMessage } from "@/components/ai/prompt-input";
import { useCaption } from "@/hooks/useCaption";
import useCaptionStore from "@/store/captionStore";
import { UserBubble, AssistantBubble } from "./_components/message-bubbles";
import { PropertiesPanel } from "./_components/properties-panel";
import { REASONING_STEPS } from "./_components/types";
import type { ChatMessage, UserMessage, AssistantMessage } from "./_components/types";

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

      const file = message.files?.[0];
      const imageUrl = file?.url;
      const mediaType = file?.mediaType;
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
        mediaType,
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
