"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import clientService from "@/services/client.service";
import type { Client } from "@/types/client";

interface ClientState {
  clients: Client[];
  activeClientId: number | null;
  isLoading: boolean;
  error: string | null;
}

interface ClientActions {
  fetchClients: () => Promise<void>;
  setActiveClientId: (id: number) => void;
}

type ClientStore = ClientState & ClientActions;

const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [],
      activeClientId: null,
      isLoading: false,
      error: null,

      fetchClients: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await clientService.getMyClients();
          const clients = res.data;
          const currentId = get().activeClientId;
          const stillValid = clients.some((c) => c.id === currentId);
          set({
            clients,
            isLoading: false,
            activeClientId: stillValid ? currentId : (clients[0]?.id ?? null),
          });
        } catch {
          set({ isLoading: false, error: "Failed to load clients." });
        }
      },

      setActiveClientId: (id) => set({ activeClientId: id }),
    }),
    {
      name: "cs-client-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ activeClientId: state.activeClientId }),
    }
  )
);

export default useClientStore;

// Convenience selector — use this anywhere you need the active client or its role
export const useActiveClient = () =>
  useClientStore((s) => s.clients.find((c) => c.id === s.activeClientId) ?? s.clients[0] ?? null);
