"use client";

import useCaptionStore from "@/store/captionStore";

export function useCaption() {
  const activeSession = useCaptionStore((s) => s.activeSession);
  const isLoading = useCaptionStore((s) => s.isLoading);
  const error = useCaptionStore((s) => s.error);
  const createSession = useCaptionStore((s) => s.createSession);

  return { activeSession, isLoading, error, createSession };
}
