"use client";

import { useTheme } from "next-themes";
import { Moon02Icon, Sun01Icon } from "hugeicons-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun01Icon size={18} /> : <Moon02Icon size={18} />}
    </button>
  );
}
