"use client";

import dynamic from "next/dynamic";

/**
 * Client-only mount point for the hero WebGL canvas.
 *
 * `next/dynamic` with `ssr: false` must live in a Client Component in the App
 * Router, so this thin wrapper exists purely to lazy-load `HeroCanvas` on the
 * client with a lightweight gradient fallback while the bundle streams in.
 */
const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_50%_40%,hsl(var(--accent)/0.25),transparent_60%)]"
    />
  ),
});

export function HeroCanvasMount() {
  return <HeroCanvas />;
}
