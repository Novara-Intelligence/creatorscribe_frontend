"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import authService from "@/services/auth.service";
import { AppError } from "@/types/api";
import type { RegisterPayload } from "@/types/user";

interface AuthState {
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
}

interface AuthActions {
  register: (payload: RegisterPayload) => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoading: false,
      isInitializing: false,
      error: null,

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register(payload);
          set({ isLoading: false });
        } catch (err) {
          const message = err instanceof AppError ? err.message : "Registration failed.";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "cs-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
