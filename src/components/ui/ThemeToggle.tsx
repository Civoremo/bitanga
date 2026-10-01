/** @format */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Theme control styled as a dangling lamp pull-chain.
 *
 * The chain is a real multi-segment rope simulation (Verlet integration with
 * distance constraints), pinned under the navbar and falling under gravity:
 *
 * - When the pointer crosses the chain it grabs the nearest link at that point
 *   and tugs it along; the motion then propagates down the links and the whole
 *   chain sways and slowly settles.
 * - The handle (last link) can be grabbed and pulled straight down; releasing
 *   past a threshold toggles the theme and the chain recoils.
 * - A plain click (or keyboard Enter/Space on the handle) also toggles, so the
 *   control stays fully accessible.
 *
 * Renders a deterministic straight chain on the server / before mount to avoid
 * hydration mismatches, and respects `prefers-reduced-motion` by staying still.
 */

/** Resting length of the chain, in pixels. */
const BASE_CORD = 96;
/** Number of links/segments the chain is split into. */
const SEGMENTS = 14;
/** Number of points (one more than segments). */
const POINTS = SEGMENTS + 1;
/** Rest length of a single segment. */
const SEG_LEN = BASE_CORD / SEGMENTS;
/** Width of the hosting box; the pin sits at its horizontal center. */
const BOX_W = 120;
/** Horizontal position of the fixed pin inside the box. */
const PIN_X = BOX_W / 2;
/** Handle knob size (square), in pixels. */
const HANDLE = 28;

/** Extra distance (px) the handle can be pulled beyond the chain's rest reach. */
const MAX_PULL = 32;
/** Downward drag distance (px) past which a release toggles the theme. */
const PULL_THRESHOLD = 30;
/** Movement (px) beyond which a pointer interaction counts as a drag. */
const DRAG_SLOP = 3;

// Simulation tuning.
const GRAVITY = 2600; // px/s^2
const FRICTION = 0.985; // velocity retained per frame (low damping -> long sway)
const CONSTRAINT_ITERATIONS = 20;
const INTERACT_RADIUS = 26; // how close the pointer must be to grab a link
const MAX_PUSH = 7; // cap per-move nudge so sweeps stay gentle
const REST_EPSILON = 0.02; // below this per-frame motion the chain is "slow"
const REST_DEVIATION = 0.3; // max horizontal offset from vertical to count as hanging

type Point = { x: number; y: number; px: number; py: number };

type Physics = {
  pts: Point[];
  dragging: boolean;
  moved: boolean;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  pull: number;
  pointer: { x: number; y: number } | null;
  running: boolean;
  raf: number;
  lastFrameT: number;
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const makePoints = (): Point[] =>
  Array.from({ length: POINTS }, (_, i) => ({
    x: PIN_X,
    y: i * SEG_LEN,
    px: PIN_X,
    py: i * SEG_LEN,
  }));

const INITIAL_POINTS = makePoints()
  .map(p => `${p.x},${p.y}`)
  .join(" ");
const INITIAL_HANDLE_TRANSFORM = `translate(${PIN_X - HANDLE / 2}px, ${
  BASE_CORD - HANDLE / 2
}px)`;

const now = () =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const isDark = resolvedTheme === "dark";

  // Live toggle reference for imperatively-added listeners.
  const toggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);
  const toggleRef = useRef(toggle);
  toggleRef.current = toggle;

  const boxRef = useRef<HTMLDivElement>(null);
  const cordRef = useRef<SVGPolylineElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);

  // Suppress the synthetic click that follows a drag so we don't toggle twice.
  const suppressClickRef = useRef(false);

  const phys = useRef<Physics>({
    pts: makePoints(),
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    targetX: PIN_X,
    targetY: BASE_CORD,
    pull: 0,
    pointer: null,
    running: false,
    raf: 0,
    lastFrameT: 0,
  });

  useEffect(() => setMounted(true), []);

  // Track the reduced-motion preference.
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const updateDOM = useCallback(() => {
    const { pts } = phys.current;
    if (cordRef.current) {
      let s = "";
      for (const p of pts) s += `${p.x.toFixed(2)},${p.y.toFixed(2)} `;
      cordRef.current.setAttribute("points", s.trim());
    }
    const h = pts[pts.length - 1];
    if (handleRef.current) {
      handleRef.current.style.transform = `translate(${(
        h.x -
        HANDLE / 2
      ).toFixed(2)}px, ${(h.y - HANDLE / 2).toFixed(2)}px)`;
    }
  }, []);

  const simulate = useCallback((dt: number) => {
    const cur = phys.current;
    const pts = cur.pts;
    const last = pts.length - 1;
    const g = GRAVITY * dt * dt;

    // Verlet integration for every free point.
    for (let i = 1; i < pts.length; i++) {
      if (cur.dragging && i === last) continue; // handle is pointer-driven
      const p = pts[i];
      const vx = (p.x - p.px) * FRICTION;
      const vy = (p.y - p.py) * FRICTION;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + g;
    }

    // While dragging, drive the handle toward the pointer (keep its momentum).
    if (cur.dragging) {
      const h = pts[last];
      h.px = h.x;
      h.py = h.y;
      h.x = cur.targetX;
      h.y = cur.targetY;
    }

    // Satisfy the distance constraints so links hold together.
    for (let k = 0; k < CONSTRAINT_ITERATIONS; k++) {
      // Hard pins: the top, and the handle while dragging.
      pts[0].x = PIN_X;
      pts[0].y = 0;
      if (cur.dragging) {
        pts[last].x = cur.targetX;
        pts[last].y = cur.targetY;
      }
      for (let i = 0; i < last; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 1e-4;
        const diff = (dist - SEG_LEN) / dist;
        const aPinned = i === 0 || (cur.dragging && i === last);
        const bPinned = cur.dragging && i + 1 === last;
        if (aPinned && bPinned) continue;
        if (aPinned) {
          b.x -= dx * diff;
          b.y -= dy * diff;
        } else if (bPinned) {
          a.x += dx * diff;
          a.y += dy * diff;
        } else {
          a.x += dx * 0.5 * diff;
          a.y += dy * 0.5 * diff;
          b.x -= dx * 0.5 * diff;
          b.y -= dy * 0.5 * diff;
        }
      }
    }
  }, []);

  const startLoop = useCallback(() => {
    const p = phys.current;
    if (p.running || typeof requestAnimationFrame !== "function") return;
    p.running = true;
    p.lastFrameT = now();

    const step = (t: number) => {
      const cur = phys.current;
      let dt = (t - cur.lastFrameT) / 1000;
      if (!Number.isFinite(dt) || dt <= 0) dt = 1 / 60;
      dt = Math.min(dt, 1 / 30);
      cur.lastFrameT = t;

      simulate(dt);
      updateDOM();

      // Stop only when the chain is both slow AND essentially vertical, so it
      // never freezes at a small left/right angle (e.g. at a swing's apex).
      let maxMove = 0;
      let maxDev = 0;
      for (let i = 1; i < cur.pts.length; i++) {
        const p0 = cur.pts[i];
        const m = Math.abs(p0.x - p0.px) + Math.abs(p0.y - p0.py);
        if (m > maxMove) maxMove = m;
        const dev = Math.abs(p0.x - PIN_X);
        if (dev > maxDev) maxDev = dev;
      }
      if (!cur.dragging && maxMove < REST_EPSILON && maxDev < REST_DEVIATION) {
        // Snap to a perfectly vertical hang so no residual lean remains.
        for (let i = 0; i < cur.pts.length; i++) {
          const p0 = cur.pts[i];
          p0.x = p0.px = PIN_X;
          p0.y = p0.py = i * SEG_LEN;
        }
        updateDOM();
        cur.running = false;
        return;
      }
      cur.raf = requestAnimationFrame(step);
    };

    p.raf = requestAnimationFrame(step);
  }, [simulate, updateDOM]);

  // Pointer "touch": grab the nearest link where the cursor crosses the chain.
  useEffect(() => {
    if (!mounted || reducedMotion) return;

    const onPointerMove = (e: PointerEvent) => {
      const cur = phys.current;
      if (cur.dragging) return;
      const box = boxRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      const prev = cur.pointer;
      cur.pointer = { x: lx, y: ly };
      if (!prev) return;

      // Find the closest link (skip the fixed pin).
      let bi = -1;
      let bd = Infinity;
      for (let i = 1; i < cur.pts.length; i++) {
        const d = Math.hypot(cur.pts[i].x - lx, cur.pts[i].y - ly);
        if (d < bd) {
          bd = d;
          bi = i;
        }
      }
      if (bi < 0 || bd > INTERACT_RADIUS) return;

      const dx = lx - prev.x;
      const dy = ly - prev.y;
      if (Math.hypot(dx, dy) < 0.5) return; // ignore idle jitter

      // Tug that link along with the cursor (lighter the farther away it is).
      const falloff = 1 - bd / INTERACT_RADIUS;
      const k = 0.7 * falloff;
      cur.pts[bi].x += clamp(dx * k, -MAX_PUSH, MAX_PUSH);
      cur.pts[bi].y += clamp(dy * k * 0.4, -MAX_PUSH, MAX_PUSH);
      startLoop();
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [mounted, reducedMotion, startLoop]);

  // Clean up any in-flight animation frame on unmount.
  useEffect(() => {
    const p = phys.current;
    return () => {
      if (p.raf && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(p.raf);
      }
    };
  }, []);

  const endDrag = useCallback(() => {
    const cur = phys.current;
    if (!cur.dragging) return;
    cur.dragging = false;
    window.removeEventListener("pointermove", onWindowDragMove);
    window.removeEventListener("pointerup", onWindowDragEnd);
    window.removeEventListener("pointercancel", onWindowDragEnd);

    if (cur.moved) {
      suppressClickRef.current = true;
      if (cur.pull > PULL_THRESHOLD) toggleRef.current();
    }
    startLoop(); // let it recoil and settle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startLoop]);

  const onWindowDragMove = useCallback(
    (e: PointerEvent) => {
      const cur = phys.current;
      if (!cur.dragging) return;
      const box = boxRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      let lx = e.clientX - rect.left;
      let ly = e.clientY - rect.top;

      // Allow the handle to be pulled a bit past the chain's rest reach so the
      // links visibly stretch (a lamp pull), capped so it can't fly away.
      const maxReach = BASE_CORD + MAX_PULL;
      const dx = lx - PIN_X;
      const dy = ly;
      const d = Math.hypot(dx, dy);
      if (d > maxReach) {
        lx = PIN_X + (dx / d) * maxReach;
        ly = (dy / d) * maxReach;
      }
      if (ly < 0) ly = 0;
      cur.targetX = lx;
      cur.targetY = ly;

      const ddx = e.clientX - cur.startX;
      const ddy = e.clientY - cur.startY;
      if (Math.abs(ddx) > DRAG_SLOP || Math.abs(ddy) > DRAG_SLOP)
        cur.moved = true;
      cur.pull = ddy; // downward gesture distance drives the toggle
      startLoop();
    },
    [startLoop],
  );

  const onWindowDragEnd = useCallback(() => {
    endDrag();
  }, [endDrag]);

  const onHandlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (reducedMotion) return;
      const cur = phys.current;
      const box = boxRef.current;
      cur.dragging = true;
      cur.moved = false;
      cur.startX = e.clientX;
      cur.startY = e.clientY;
      cur.pull = 0;
      if (box) {
        const rect = box.getBoundingClientRect();
        cur.targetX = e.clientX - rect.left;
        cur.targetY = Math.max(0, e.clientY - rect.top);
      }
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId);
      } catch {
        // setPointerCapture is unsupported in some environments (e.g. jsdom).
      }
      window.addEventListener("pointermove", onWindowDragMove);
      window.addEventListener("pointerup", onWindowDragEnd);
      window.addEventListener("pointercancel", onWindowDragEnd);
      startLoop();
    },
    [reducedMotion, onWindowDragMove, onWindowDragEnd, startLoop],
  );

  const onHandleClick = useCallback(() => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    toggleRef.current();
  }, []);

  const label = mounted
    ? `Switch to ${isDark ? "light" : "dark"} theme`
    : "Toggle theme";

  const H = BASE_CORD + HANDLE;

  return (
    <div
      ref={boxRef}
      className='relative select-none'
      style={{ width: BOX_W, height: H, pointerEvents: "none" }}
    >
      <svg
        width={BOX_W}
        height={H}
        viewBox={`0 0 ${BOX_W} ${H}`}
        className='text-muted-foreground'
        style={{ overflow: "visible", pointerEvents: "none" }}
        aria-hidden='true'
      >
        {/* Ball-chain: round, dashed stroke follows the real link positions. */}
        <polyline
          ref={cordRef}
          points={INITIAL_POINTS}
          fill='none'
          stroke='currentColor'
          strokeWidth={5}
          strokeLinecap='round'
          strokeDasharray='0.1 7'
        />
      </svg>

      <button
        ref={handleRef}
        type='button'
        onClick={onHandleClick}
        onPointerDown={onHandlePointerDown}
        aria-label={label}
        aria-pressed={mounted ? isDark : undefined}
        className='absolute left-0 top-0 inline-flex h-7 w-7 cursor-grab items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:cursor-grabbing'
        style={{
          transform: INITIAL_HANDLE_TRANSFORM,
          pointerEvents: "auto",
          touchAction: "none",
          ...(mounted && !isDark
            ? { boxShadow: "0 0 12px 1px hsl(45 90% 60% / 0.55)" }
            : null),
        }}
      >
        <SunIcon className={mounted && !isDark ? "block" : "hidden"} />
        <MoonIcon className={mounted && isDark ? "block" : "hidden"} />
        {!mounted && <SunIcon className='opacity-50' />}
      </button>
    </div>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width='15'
      height='15'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='4' />
      <path d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41' />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width='15'
      height='15'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
    </svg>
  );
}
