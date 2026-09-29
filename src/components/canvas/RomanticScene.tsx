"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { GlassHeart } from "./GlassHeart";
import { FloatingParticles } from "./FloatingParticles";
import { FloatingPetals } from "./FloatingPetals";
import { FloatingHearts } from "./FloatingHearts";
import { RomanticSnow } from "./RomanticSnow";
import { Fireflies } from "./Fireflies";
import { THEME_CONFIGS } from "../../lib/templates";
import { ThemePreset, VisualEffectType } from "../../types/gift";

interface RomanticSceneProps {
  theme?: ThemePreset;
  effects?: VisualEffectType[];
  interactive?: boolean;
  scale?: number;
  showPetals?: boolean;
}

export function RomanticScene({
  theme = "rose_luxury",
  effects = ["petals", "stardust"],
  interactive = true,
  scale = 1.3,
  showPetals = true,
}: RomanticSceneProps) {
  const currentTheme = THEME_CONFIGS[theme] || THEME_CONFIGS.rose_luxury;
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // Check if mobile or low power hardware
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      const isLowCores = typeof navigator !== "undefined" && (navigator.hardwareConcurrency || 4) <= 4;
      setIsLowPower(isMobile || isLowCores);
    }
  }, []);

  const hasEffect = (ef: VisualEffectType) => effects.includes(ef);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        dpr={isLowPower ? [1, 1.25] : [1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={50} />

        {/* Cinematic Soft Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight
          position={[3, 3, 3]}
          intensity={1.8}
          color={currentTheme.particleColor}
        />
        <pointLight
          position={[-3, -2, -2]}
          intensity={1.2}
          color={currentTheme.secondaryParticleColor}
        />
        <directionalLight
          position={[0, 5, 2]}
          intensity={0.8}
          color="#FAF4EB"
        />

        <Suspense fallback={null}>
          {/* Glass Heart */}
          <GlassHeart
            color={currentTheme.heartColor}
            emissive={currentTheme.heartEmissive}
            scale={scale}
          />

          {/* Dynamic Selectable Effects */}

          {/* Stardust / Galactic Particles */}
          {(hasEffect("stardust") || effects.length === 0) && (
            <FloatingParticles
              count={isLowPower ? 200 : 450}
              color={currentTheme.particleColor}
              secondaryColor={currentTheme.secondaryParticleColor}
            />
          )}

          {/* Rose Petals */}
          {(hasEffect("petals") || (showPetals && effects.length === 0)) && (
            <FloatingPetals
              count={isLowPower ? 18 : 35}
              color={currentTheme.heartColor}
            />
          )}

          {/* 3D Floating Hearts */}
          {hasEffect("hearts") && (
            <FloatingHearts
              count={isLowPower ? 15 : 28}
              color={currentTheme.heartEmissive}
            />
          )}

          {/* Romantic Snowflakes */}
          {hasEffect("snow") && (
            <RomanticSnow count={isLowPower ? 140 : 280} />
          )}

          {/* Glowing Fireflies */}
          {hasEffect("fireflies") && (
            <Fireflies
              count={isLowPower ? 35 : 65}
              color={currentTheme.secondaryParticleColor}
            />
          )}
        </Suspense>

        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 2.3}
            rotateSpeed={0.5}
            dampingFactor={0.05}
          />
        )}
      </Canvas>
    </div>
  );
}
