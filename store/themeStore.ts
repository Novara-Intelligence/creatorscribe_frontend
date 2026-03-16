"use client";

import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const useThemeStore = create<ThemeState>()((set) => ({
  theme: "system",
  setTheme: (theme) => set({ theme }),
}));

export default useThemeStore;
