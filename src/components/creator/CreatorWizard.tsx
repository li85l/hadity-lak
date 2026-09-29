"use client";

import React, { useEffect } from "react";
import { useCreatorStore } from "../../lib/store";
import { StepIdentity } from "./StepIdentity";
import { StepStoryDate } from "./StepStoryDate";
import { StepLoveLetter } from "./StepLoveLetter";
import { StepMemories } from "./StepMemories";
import { StepMusic } from "./StepMusic";
import { StepVideo } from "./StepVideo";
import { StepTraits } from "./StepTraits";
import { StepTheme } from "./StepTheme";
import { StepSecurity } from "./StepSecurity";
import { StepReview } from "./StepReview";
import { ArrowRight, ArrowLeft, Heart, Check, Sparkles } from "lucide-react";

const STEP_TITLES = [
  "من أنت؟",
  "بداية القصة",
  "رسالة الحب",
  "ذكرياتنا",
  "أغنيتنا",
  "فيديو",
  "أحبها فيك",
  "التصميم",
  "الخصوصية",
  "المشاركة",
];

export function CreatorWizard() {
  const { currentStep, setStep, nextStep, prevStep, giftData, loadSavedGift } =
    useCreatorStore();

  useEffect(() => {
    loadSavedGift();
  }, [loadSavedGift]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepIdentity />;
      case 2:
        return <StepStoryDate />;
      case 3:
        return <StepLoveLetter />;
      case 4:
        return <StepMemories />;
      case 5:
        return <StepMusic />;
      case 6:
        return <StepVideo />;
      case 7:
        return <StepTraits />;
      case 8:
        return <StepTheme />;
      case 9:
        return <StepSecurity />;
      case 10:
        return <StepReview />;
      default:
        return <StepIdentity />;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !giftData.senderName.trim() || !giftData.recipientName.trim();
    }
    return false;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Step Progress Tracker */}
      <div className="glass-panel p-4 rounded-3xl mb-8 border border-rose-romantic/15 shadow-xl">
        {/* Progress Bar Line */}
        <div className="relative w-full bg-black/40 h-1.5 rounded-full overflow-hidden mb-4">
          <div
            className="bg-gradient-to-r from-burgundy-700 via-rose-romantic to-rose-glow h-full transition-all duration-300"
            style={{ width: `${(currentStep / 10) * 100}%` }}
          />
        </div>

        {/* Step Buttons */}
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1 scrollbar-none">
          {STEP_TITLES.map((title, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <button
                key={title}
                type="button"
                onClick={() => setStep(stepNum)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isCurrent
                    ? "bg-rose-romantic/20 text-rose-glow border border-rose-romantic/40"
                    : isCompleted
                    ? "text-champagne-100 hover:text-white"
                    : "text-champagne-300/40 hover:text-champagne-300/70"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent
                      ? "bg-rose-glow text-obsidian-950 font-bold"
                      : isCompleted
                      ? "bg-burgundy-800 text-rose-romantic"
                      : "bg-white/10 text-champagne-300/60"
                  }`}
                >
                  {isCompleted ? <Check className="w-2.5 h-2.5" /> : stepNum}
                </span>
                <span className="hidden sm:inline">{title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Content Container */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-rose-romantic/20 shadow-2xl relative min-h-[480px] flex flex-col justify-between">
        <div className="flex-1">{renderStepContent()}</div>

        {/* Navigation Buttons Bottom Bar */}
        <div className="flex items-center justify-between pt-10 border-t border-white/5 mt-8">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 rounded-full glass-panel hover:bg-white/5 text-champagne-200 text-sm font-semibold disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <span className="text-xs text-champagne-300/50">
            الخطوة {currentStep} من 10
          </span>

          {currentStep < 10 ? (
            <button
              type="button"
              disabled={isNextDisabled()}
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-burgundy-700 to-rose-glow text-white text-sm font-semibold shadow-lg shadow-burgundy-950/60 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.open(`/gift/${giftData.shortCode || "preview"}`, "_blank");
                }
              }}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-burgundy-700 via-rose-romantic to-rose-glow text-white text-sm font-semibold shadow-lg shadow-burgundy-950/60 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-gold-glow animate-spin" />
              <span>معاينة الهدية كاملة</span>
              <Heart className="w-4 h-4 fill-current text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
