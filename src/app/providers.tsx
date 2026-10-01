"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * App-wide client providers. Currently wires `next-themes` for class-based
 * light/dark theming with system preference support.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
