"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon02Icon } from "hugeicons-react";
import { Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {mounted && (resolvedTheme === "dark" ? <Sun size={18} /> : <Moon02Icon size={18} />)}
    </button>
  );
}
