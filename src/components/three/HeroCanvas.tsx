"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import { HeroScene } from "./HeroScene";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Canvas host for the hero scene. This is the only place that mounts a WebGL
 * context on the home page, so it owns camera, controls, and DPR settings.
 *
 * Rendered via `next/dynamic` (ssr: false) by its parent so it never runs on
 * the server and the WebGL bundle stays out of the initial payload.
 */
export default function HeroCanvas() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 6], fov: 45 }}
      // Cap DPR to balance crispness and performance on high-density screens.
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <HeroScene reducedMotion={reducedMotion} />
        <Preload all />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.6}
      />
    </Canvas>
  );
}
