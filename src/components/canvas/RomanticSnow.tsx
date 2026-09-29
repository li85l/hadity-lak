"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RomanticSnowProps {
  count?: number;
}

export function RomanticSnow({ count = 280 }: RomanticSnowProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 12 - 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i] = 0.4 + Math.random() * 0.6;
    }

    return [pos, vel];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Fall down
      array[i * 3 + 1] -= velocities[i] * delta;
      // Gentle horizontal sway
      array[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.003;

      // Recycle to top
      if (array[i * 3 + 1] < -6) {
        array[i * 3 + 1] = 6;
        array[i * 3] = (Math.random() - 0.5) * 14;
      }
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
        size={0.07}
        color="#FFFFFF"
        transparent
        opacity={0.88}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
