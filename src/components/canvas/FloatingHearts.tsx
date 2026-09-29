"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingHeartsProps {
  count?: number;
  color?: string;
}

export function FloatingHearts({ count = 25, color = "#FF4D6D" }: FloatingHeartsProps) {
  const groupRef = useRef<THREE.Group>(null);

  // 2D Heart geometry shape
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.2);
    shape.bezierCurveTo(0, 0.2, -0.15, 0.45, -0.35, 0.45);
    shape.bezierCurveTo(-0.65, 0.45, -0.65, 0.18, -0.65, 0.18);
    shape.bezierCurveTo(-0.65, -0.06, -0.48, -0.33, 0, -0.65);
    shape.bezierCurveTo(0.48, -0.33, 0.65, -0.06, 0.65, 0.18);
    shape.bezierCurveTo(0.65, 0.18, 0.65, 0.45, 0.35, 0.45);
    shape.bezierCurveTo(0.15, 0.45, 0, 0.2, 0, 0.2);
    return shape;
  }, []);

  const heartData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 6,
      speedY: 0.25 + Math.random() * 0.45,
      scale: 0.15 + Math.random() * 0.18,
      rotSpeed: 0.3 + Math.random() * 0.5,
    }));
  }, [count]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, i) => {
      const data = heartData[i];
      if (!data) return;

      // Float upwards
      child.position.y += data.speedY * delta;
      child.position.x += Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.005;
      child.rotation.y += data.rotSpeed * delta;
      child.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.15;

      // Recycle when exceeding top boundary
      if (child.position.y > 5.5) {
        child.position.y = -5.5;
        child.position.x = (Math.random() - 0.5) * 10;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {heartData.map((d, i) => (
        <mesh
          key={i}
          position={[d.x, d.y, d.z]}
          scale={d.scale}
        >
          <shapeGeometry args={[heartShape]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}
