"use client";

import useCaptionStore from "@/store/captionStore";

export function useCaption() {
  const activeSession = useCaptionStore((s) => s.activeSession);
  const isLoading = useCaptionStore((s) => s.isLoading);
  const error = useCaptionStore((s) => s.error);
  const createSession = useCaptionStore((s) => s.createSession);

  const sessions = useCaptionStore((s) => s.sessions);
  const sessionsMeta = useCaptionStore((s) => s.sessionsMeta);
  const sessionsLoading = useCaptionStore((s) => s.sessionsLoading);
  const sessionsLoadingMore = useCaptionStore((s) => s.sessionsLoadingMore);
  const sessionsError = useCaptionStore((s) => s.sessionsError);
  const fetchSessions = useCaptionStore((s) => s.fetchSessions);
  const loadMoreSessions = useCaptionStore((s) => s.loadMoreSessions);

  return {
    activeSession, isLoading, error, createSession,
    sessions, sessionsMeta, sessionsLoading, sessionsLoadingMore, sessionsError,
    fetchSessions, loadMoreSessions,
  };
}
