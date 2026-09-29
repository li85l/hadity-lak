"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GlassHeartProps {
  color?: string;
  emissive?: string;
  isPulsing?: boolean;
  scale?: number;
}

export function GlassHeart({
  color = "#9E1B2F",
  emissive = "#FF3355",
  isPulsing = true,
  scale = 1,
}: GlassHeartProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate 2D Heart Shape using parametric formula
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0;
    const y = 0;
    
    shape.moveTo(x, y + 0.35);
    shape.bezierCurveTo(x, y + 0.35, x - 0.25, y + 0.75, x - 0.6, y + 0.75);
    shape.bezierCurveTo(x - 1.1, y + 0.75, x - 1.1, y + 0.3, x - 1.1, y + 0.3);
    shape.bezierCurveTo(x - 1.1, y - 0.1, x - 0.8, y - 0.55, x, y - 1.1);
    shape.bezierCurveTo(x + 0.8, y - 0.55, x + 1.1, y - 0.1, x + 1.1, y + 0.3);
    shape.bezierCurveTo(x + 1.1, y + 0.3, x + 1.1, y + 0.75, x + 0.6, y + 0.75);
    shape.bezierCurveTo(x + 0.25, y + 0.75, x, y + 0.35, x, y + 0.35);
    
    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.45,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.15,
      bevelThickness: 0.15,
    }),
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Slow gentle floating rotation
    meshRef.current.rotation.y += delta * 0.4;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;

    // Realistic emotional heartbeat pulse
    if (isPulsing) {
      const t = state.clock.elapsedTime * 2.2;
      // Dual heartbeat rhythm: lub-dub
      const pulse = Math.sin(t) * Math.sin(t * 1.5);
      const targetScale = scale * (1 + Math.max(0, pulse) * 0.12);
      meshRef.current.scale.set(targetScale, targetScale, targetScale);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <extrudeGeometry args={[heartShape, extrudeSettings]} />
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.6}
        roughness={0.12}
        metalness={0.15}
        transmission={0.88} // Glass effect
        ior={1.45}
        thickness={1.2}
        transparent={true}
        opacity={0.92}
      />
    </mesh>
  );
}
