"use client";

import { create } from "zustand";
import captionService from "@/services/caption.service";
import useClientStore from "@/store/clientStore";
import type { CaptionSession, SessionsMeta } from "@/types/caption";

interface CaptionState {
  activeSession: CaptionSession | null;
  sessions: CaptionSession[];
  sessionsMeta: SessionsMeta | null;
  sessionsLoading: boolean;
  sessionsLoadingMore: boolean;
  sessionsError: string | null;
  isLoading: boolean;
  error: string | null;
}

interface CaptionActions {
  createSession: (title?: string) => Promise<void>;
  fetchSessions: (search?: string) => Promise<void>;
  loadMoreSessions: (search?: string) => Promise<void>;
}

type CaptionStore = CaptionState & CaptionActions;

const useCaptionStore = create<CaptionStore>()((set, get) => ({
  activeSession: null,
  sessions: [],
  sessionsMeta: null,
  sessionsLoading: false,
  sessionsLoadingMore: false,
  sessionsError: null,
  isLoading: false,
  error: null,

  createSession: async (title?: string) => {
    const clientId = useClientStore.getState().activeClientId;
    if (!clientId) return;
    set({ isLoading: true, error: null });
    try {
      const res = await captionService.createSession(clientId, title);
      set({ activeSession: res.data, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Failed to create session." });
    }
  },

  fetchSessions: async (search?: string) => {
    const clientId = useClientStore.getState().activeClientId;
    if (!clientId) return;
    set({ sessionsLoading: true, sessionsError: null, sessions: [] });
    try {
      const res = await captionService.getSessions(clientId, { search, page: 1, limit: 15 });
      set({ sessions: res.data, sessionsMeta: res.meta, sessionsLoading: false });
    } catch {
      set({ sessionsLoading: false, sessionsError: "Failed to load sessions." });
    }
  },

  loadMoreSessions: async (search?: string) => {
    const { sessionsMeta, sessionsLoadingMore } = get();
    if (sessionsLoadingMore || !sessionsMeta?.has_next) return;
    const clientId = useClientStore.getState().activeClientId;
    if (!clientId) return;
    set({ sessionsLoadingMore: true });
    try {
      const res = await captionService.getSessions(clientId, {
        search,
        page: sessionsMeta.page + 1,
        limit: 15,
      });
      set((s) => ({
        sessions: [...s.sessions, ...res.data],
        sessionsMeta: res.meta,
        sessionsLoadingMore: false,
      }));
    } catch {
      set({ sessionsLoadingMore: false });
    }
  },
}));

export default useCaptionStore;
