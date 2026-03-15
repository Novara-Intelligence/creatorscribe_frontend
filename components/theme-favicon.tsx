"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeFavicon() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const href = resolvedTheme === "dark" ? "/cs_icon_dark.svg" : "/cs_icon.svg";
    document
      .querySelectorAll<HTMLLinkElement>("link[rel='icon'], link[rel='apple-touch-icon']")
      .forEach((el) => {
        el.href = href;
      });
  }, [resolvedTheme]);

  return null;
}
