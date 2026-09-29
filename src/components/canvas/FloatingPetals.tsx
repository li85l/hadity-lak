"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingPetalsProps {
  count?: number;
  color?: string;
}

export function FloatingPetals({ count = 35, color = "#C9184A" }: FloatingPetalsProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Pre-generate petal initial offsets and rotation speeds
  const petals = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 12,
      y: Math.random() * 12 - 6,
      z: (Math.random() - 0.5) * 8,
      rx: Math.random() * Math.PI,
      ry: Math.random() * Math.PI,
      speedY: 0.3 + Math.random() * 0.4,
      rotationSpeed: 0.4 + Math.random() * 0.6,
      scale: 0.15 + Math.random() * 0.15,
    }));
  }, [count]);

  const petalShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.2, 0.3, 0.4, 0.6, 0, 1);
    shape.bezierCurveTo(-0.4, 0.6, -0.2, 0.3, 0, 0);
    return shape;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    groupRef.current.children.forEach((child, index) => {
      const data = petals[index];
      if (!data) return;

      // Fall down
      child.position.y -= data.speedY * delta;
      
      // Gentle spiral sway
      child.position.x += Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.008;
      child.position.z += Math.cos(state.clock.elapsedTime * 0.7 + index) * 0.006;
      
      child.rotation.x += data.rotationSpeed * delta * 0.5;
      child.rotation.y += data.rotationSpeed * delta;

      // Reset to top when passing bottom boundary
      if (child.position.y < -6) {
        child.position.y = 6;
        child.position.x = (Math.random() - 0.5) * 12;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {petals.map((petal, i) => (
        <mesh
          key={i}
          position={[petal.x, petal.y, petal.z]}
          rotation={[petal.rx, petal.ry, 0]}
          scale={petal.scale}
        >
          <shapeGeometry args={[petalShape]} />
          <meshStandardMaterial
            color={color}
            side={THREE.DoubleSide}
            roughness={0.4}
            metalness={0.1}
            transparent
            opacity={0.82}
          />
        </mesh>
      ))}
    </group>
  );
}
