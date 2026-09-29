"use client";

import React from "react";
import { useCreatorStore } from "../../lib/store";
import { THEME_CONFIGS, VISUAL_EFFECTS_LIST } from "../../lib/templates";
import { VisualEffectType } from "../../types/gift";
import { Palette, CheckCircle2, Sparkles, Wand2 } from "lucide-react";

export function StepTheme() {
  const { giftData, updateGiftData } = useCreatorStore();

  const themes = Object.values(THEME_CONFIGS);

  const toggleEffect = (effectId: VisualEffectType) => {
    const current = giftData.visualEffects || ["petals", "stardust"];
    const exists = current.includes(effectId);
    let updated: VisualEffectType[];

    if (exists) {
      // Keep at least one effect
      if (current.length > 1) {
        updated = current.filter((e) => e !== effectId);
      } else {
        updated = current;
      }
    } else {
      updated = [...current, effectId];
    }

    updateGiftData({ visualEffects: updated });
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-burgundy-900/60 border border-rose-romantic/30 text-rose-glow mb-2">
          <Palette className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-readex text-champagne-100">
          طابع الهدية والمؤثرات البصرية 🎨
        </h2>
        <p className="text-sm text-champagne-300/70">
          اختر الألوان الساحرة والمؤثرات ثلاثية الأبعاد التي تريد أن تملأ المشهد
        </p>
      </div>

      {/* 1. Theme Presets */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-champagne-200 block">
          1. اختر القالب والألوان:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto">
          {themes.map((theme) => {
            const isSelected = giftData.theme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => updateGiftData({ theme: theme.id })}
                className={`p-4 rounded-3xl text-right transition-all border relative overflow-hidden flex flex-col justify-between h-32 ${
                  isSelected
                    ? "border-rose-glow ring-2 ring-rose-glow/50 shadow-xl shadow-burgundy-950/70 scale-102"
                    : "glass-panel hover:bg-white/5 border-rose-romantic/15"
                }`}
              >
                {/* Color Swatch Circle */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{theme.emoji}</span>
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                    style={{ backgroundColor: theme.heartColor }}
                  />
                </div>

                <div>
                  <h4 className="font-bold text-sm text-champagne-100 mb-0.5">
                    {theme.name}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: theme.particleColor }}
                    />
                    <span className="text-[10px] text-champagne-300/60">ألوان 3D متناسقة</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 left-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-glow" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Selectable Ambient Visual Effects */}
      <div className="space-y-4 max-w-3xl mx-auto pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-champagne-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-glow animate-spin" />
            <span>2. المؤثرات التفاعلية القابلة للاختيار (يمكنك تفعيل أكثر من مؤثر):</span>
          </label>
          <span className="text-xs text-rose-glow font-medium">
            {(giftData.visualEffects || []).length} مؤثرات مفعّلة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {VISUAL_EFFECTS_LIST.map((effect) => {
            const isChecked = (giftData.visualEffects || []).includes(effect.id);
            return (
              <button
                key={effect.id}
                type="button"
                onClick={() => toggleEffect(effect.id)}
                className={`p-4 rounded-2xl text-right transition-all border flex flex-col justify-between gap-2 ${
                  isChecked
                    ? "bg-burgundy-900/60 border-rose-glow shadow-lg shadow-burgundy-950/60 scale-101"
                    : "glass-panel text-champagne-300/70 hover:bg-white/5 border-rose-romantic/15"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{effect.emoji}</span>
                    <span className="font-bold text-sm text-champagne-100">
                      {effect.title}
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isChecked
                        ? "bg-rose-glow border-rose-glow text-obsidian-950"
                        : "border-white/20 bg-black/30"
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <p className="text-[11px] text-champagne-300/60 leading-relaxed font-light">
                  {effect.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
