"use client";

import { create } from "zustand";
import captionService from "@/services/caption.service";
import useClientStore from "@/store/clientStore";
import type { CaptionSession } from "@/types/caption";

interface CaptionState {
  activeSession: CaptionSession | null;
  isLoading: boolean;
  error: string | null;
}

interface CaptionActions {
  createSession: (title?: string) => Promise<void>;
}

type CaptionStore = CaptionState & CaptionActions;

const useCaptionStore = create<CaptionStore>()((set) => ({
  activeSession: null,
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
}));

export default useCaptionStore;
