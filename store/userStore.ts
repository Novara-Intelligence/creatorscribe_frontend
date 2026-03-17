"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import userService from "@/services/user.service";
import type { UserProfile } from "@/types/user";

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
}

type UserStore = UserState & UserActions;

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      fetchProfile: async () => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });
        try {
          const res = await userService.getProfile();
          set({ profile: res.data, isLoading: false });
        } catch {
          set({ isLoading: false, error: "Failed to load profile." });
        }
      },

      clearProfile: () => set({ profile: null }),
    }),
    {
      name: "cs-user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);

export default useUserStore;
