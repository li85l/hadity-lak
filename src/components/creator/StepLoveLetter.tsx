"use client";

import React, { useState } from "react";
import { useCreatorStore } from "../../lib/store";
import { LetterTone } from "../../types/gift";
import { SAMPLE_ROMANTIC_QUOTES } from "../../lib/templates";
import { PenTool, Sparkles, Wand2, RefreshCw } from "lucide-react";

const TONES: { id: LetterTone; label: string; desc: string }[] = [
  { id: "رومانسي", label: "رومانسي", desc: "دافئ وعذب" },
  { id: "عميق", label: "عميق", desc: "فلسفي وشاعري" },
  { id: "شاعري", label: "شاعري", desc: "أدبي وبليغ" },
  { id: "لطيف", label: "لطيف", desc: "عفوي ومبتسم" },
  { id: "عاطفي", label: "عاطفي", desc: "صادق ومؤثر" },
  { id: "مختصر", label: "مختصر", desc: "كلمات قليلة وأثر كبير" },
];

export function StepLoveLetter() {
  const { giftData, updateGiftData } = useCreatorStore();
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiDraftInput, setAiDraftInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiGenerate = async () => {
    if (!aiDraftInput.trim()) return;
    setIsGenerating(true);

    try {
      // Simulate/Trigger AI Romantic Scribe
      // In production, this hits our Next.js API route /api/ai-scribe
      const res = await fetch("/api/ai-scribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiDraftInput,
          tone: giftData.letterTone,
          sender: giftData.senderName,
          recipient: giftData.recipientName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        updateGiftData({ loveLetter: data.text });
      } else {
        // Fallback enhancement generator if API is offline
        const romanticFallback = `إلى ${giftData.recipientName || "حبيبتي"} الغالية،\n\n${aiDraftInput}\n\nأنتِ لستِ مجرد شخص عبر في حياتي، بل أنتِ الحياة بأكملها حين تبتسمين. دمتِ لي وطناً وأماناً وحباً لا ينتهي أبداً ❤️`;
        updateGiftData({ loveLetter: romanticFallback });
      }
    } catch {
      const romanticFallback = `إلى ${giftData.recipientName || "حبيبتي"} الغالية،\n\n${aiDraftInput}\n\nأنتِ النبض الذي يحيي كل يوم في عمري. كل الحروف تقف عاجزة أمام ما يحمله قلبي لكِ ❤️`;
      updateGiftData({ loveLetter: romanticFallback });
    } finally {
      setIsGenerating(false);
      setShowAiModal(false);
    }
  };

  const insertQuote = (quote: string) => {
    updateGiftData({
      loveLetter: giftData.loveLetter ? `${giftData.loveLetter}\n\n${quote}` : quote,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-burgundy-900/60 border border-rose-romantic/30 text-rose-glow mb-2">
          <PenTool className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-readex text-champagne-100">
          اكتب لها ما في قلبك ❤️
        </h2>
        <p className="text-sm text-champagne-300/70">
          كلماتك الصادقة هي جوهر هذه الهدية وسر جمالها
        </p>
      </div>

      {/* Tone Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-champagne-200">
          أسلوب ونبرة الكلمات:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {TONES.map((t) => {
            const isSelected = giftData.letterTone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => updateGiftData({ letterTone: t.id })}
                className={`p-2.5 rounded-xl text-center transition-all border ${
                  isSelected
                    ? "bg-burgundy-800 text-white border-rose-glow"
                    : "glass-panel text-champagne-300/70 hover:bg-white/5 border-rose-romantic/15"
                }`}
              >
                <div className="text-xs sm:text-sm font-semibold">{t.label}</div>
                <div className="text-[10px] text-champagne-300/50 mt-0.5">{t.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Area & AI Button Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-champagne-200">
            نص الرسالة:
          </label>
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-900/60 to-rose-glow/30 border border-rose-romantic/30 text-xs text-rose-glow hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-glow animate-spin" />
            <span>اكتبها لي بالذكاء الاصطناعي ✨</span>
          </button>
        </div>

        <textarea
          rows={6}
          value={giftData.loveLetter}
          onChange={(e) => updateGiftData({ loveLetter: e.target.value })}
          placeholder="منذ أن دخلتِ حياتي وأنا أشعر أن هناك شيئاً جميلاً تغير في عالمي..."
          className="w-full p-4 rounded-2xl glass-input text-champagne-100 font-readex leading-relaxed text-base resize-none"
        />
      </div>

      {/* Romantic Quick Quotes */}
      <div className="space-y-2">
        <span className="text-xs text-champagne-300/60 block">
          اقتباسات جاهزة يمكنك إضافتها بنقرة واحدة:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_ROMANTIC_QUOTES.slice(0, 3).map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => insertQuote(q)}
              className="text-xs glass-panel px-3 py-1.5 rounded-full text-champagne-200/80 hover:text-white hover:border-rose-romantic/40 transition-all text-right"
            >
              + {q.substring(0, 45)}...
            </button>
          ))}
        </div>
      </div>

      {/* AI Assistant Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel border-rose-romantic/30 p-6 rounded-3xl max-w-lg w-full space-y-4">
            <div className="flex items-center gap-2 text-rose-glow font-bold text-lg">
              <Wand2 className="w-5 h-5 text-gold-glow" />
              <span>مساعد الكتابة الرومانسي بالذكاء الاصطناعي</span>
            </div>

            <p className="text-xs text-champagne-300/80 leading-relaxed">
              اكتب أفكارك أو مشاعرك بعفوية بأي طريقة وبأي لهجة عامية، وسنقوم بتحويلها إلى رسالة حب بليغة وأنيقة تحتفظ بنفس مشاعرك الصادقة:
            </p>

            <textarea
              rows={3}
              value={aiDraftInput}
              onChange={(e) => setAiDraftInput(e.target.value)}
              placeholder="مثال: أحبها لأنها دائماً توقف وياي وتخليني أضحك وأشعر بالأمان."
              className="w-full p-3 rounded-xl glass-input text-sm text-champagne-100 resize-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-champagne-300/70 hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={isGenerating || !aiDraftInput.trim()}
                onClick={handleAiGenerate}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-burgundy-700 to-rose-glow text-white text-xs font-semibold disabled:opacity-50"
              >
                {isGenerating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{isGenerating ? "جاري الصياغة..." : "صياغة الرسالة ✨"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
