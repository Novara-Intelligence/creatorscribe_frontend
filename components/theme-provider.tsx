"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";

function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => {
    const c = createCache({ key: "css" });
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) return null;
    const styles = names.map((name) => cache.inserted[name]).join("");
    return (
      <style
        key="emotion-css"
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCacheProvider>
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    </EmotionCacheProvider>
  );
}
