"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Float,
  Icosahedron,
  MeshDistortMaterial,
  Environment,
} from "@react-three/drei";
import type { Mesh } from "three";

type HeroSceneProps = {
  /** When true, autonomous rotation is disabled (reduced motion). */
  reducedMotion?: boolean;
};

/**
 * The 3D content of the hero canvas: a slowly-morphing icosahedron wrapped in
 * a cloud of small floating shards. Kept deliberately lightweight so it holds
 * 60fps on mid-range hardware.
 */
export function HeroScene({ reducedMotion = false }: HeroSceneProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#7c3aed" />

      <Float
        speed={reducedMotion ? 0 : 1.4}
        rotationIntensity={reducedMotion ? 0 : 0.6}
        floatIntensity={reducedMotion ? 0 : 0.8}
      >
        <CoreShape reducedMotion={reducedMotion} />
      </Float>

      <Shards reducedMotion={reducedMotion} />

      <Environment preset="city" />
    </>
  );
}

function CoreShape({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y += delta * 0.2;
    ref.current.rotation.x += delta * 0.05;
  });

  return (
    <Icosahedron ref={ref} args={[1.4, 4]}>
      <MeshDistortMaterial
        color="#7c3aed"
        emissive="#2dd4bf"
        emissiveIntensity={0.15}
        roughness={0.15}
        metalness={0.6}
        distort={reducedMotion ? 0.1 : 0.35}
        speed={reducedMotion ? 0 : 1.8}
      />
    </Icosahedron>
  );
}

function Shards({ reducedMotion }: { reducedMotion: boolean }) {
  // Deterministic positions so the layout is stable across renders/tests.
  const shards = useMemo(() => {
    const items: { position: [number, number, number]; scale: number }[] = [];
    const count = 18;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.6 + (i % 3) * 0.4;
      items.push({
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle * 1.7) * 1.4,
          Math.sin(angle) * radius,
        ],
        scale: 0.08 + (i % 4) * 0.03,
      });
    }
    return items;
  }, []);

  const group = useRef<Mesh>(null);

  return (
    <group>
      {shards.map((shard, i) => (
        <Float
          key={i}
          speed={reducedMotion ? 0 : 2}
          rotationIntensity={reducedMotion ? 0 : 1}
          floatIntensity={reducedMotion ? 0 : 1.5}
        >
          <mesh position={shard.position} scale={shard.scale} ref={group}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#2dd4bf"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
