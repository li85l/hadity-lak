"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FirefliesProps {
  count?: number;
  color?: string;
}

export function Fireflies({ count = 65, color = "#FFDF78" }: FirefliesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, offsets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const offs = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      offs[i * 3] = Math.random() * Math.PI * 2;
      offs[i * 3 + 1] = Math.random() * Math.PI * 2;
      offs[i * 3 + 2] = 0.5 + Math.random();
    }

    return [pos, offs];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const ox = offsets[i * 3];
      const oy = offsets[i * 3 + 1];
      const speed = offsets[i * 3 + 2];

      array[i * 3] += Math.sin(t * speed + ox) * 0.008;
      array[i * 3 + 1] += Math.cos(t * speed + oy) * 0.008;
      array[i * 3 + 2] += Math.sin(t * 0.5 * speed) * 0.006;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color={color}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
