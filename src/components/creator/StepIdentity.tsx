"use client";

import React from "react";
import { useCreatorStore } from "../../lib/store";
import { RelationshipType } from "../../types/gift";
import { Heart, User, Sparkles } from "lucide-react";

const RELATIONSHIPS: RelationshipType[] = [
  "حبيبتي",
  "حبيبي",
  "زوجتي",
  "زوجي",
  "خطيبتي",
  "خطيبي",
  "صديقتي",
  "صديقي",
  "شخص مميز ❤️",
];

export function StepIdentity() {
  const { giftData, updateGiftData } = useCreatorStore();

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-burgundy-900/60 border border-rose-romantic/30 text-rose-glow mb-2">
          <Heart className="w-6 h-6 fill-current animate-pulse" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-readex text-champagne-100">
          من أنت؟ ومن تُهدي؟
        </h2>
        <p className="text-sm text-champagne-300/70">
          سنستخدم هذه الأسماء لتخصيص كل تفاصيل التجربة والقصة
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Sender Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-champagne-200">
            ما اسمك؟ <span className="text-rose-glow">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="مثال: أحمد"
              value={giftData.senderName}
              onChange={(e) => updateGiftData({ senderName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input pr-10 text-right"
              required
            />
            <User className="absolute right-3 top-3.5 w-4 h-4 text-champagne-300/40" />
          </div>
        </div>

        {/* Recipient Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-champagne-200">
            اسم من تحب؟ <span className="text-rose-glow">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="مثال: سارة"
              value={giftData.recipientName}
              onChange={(e) => updateGiftData({ recipientName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input pr-10 text-right"
              required
            />
            <Heart className="absolute right-3 top-3.5 w-4 h-4 text-rose-glow/60" />
          </div>
        </div>
      </div>

      {/* Relationship Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-champagne-200">
          ما هي طبيعة علاقتكما؟
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {RELATIONSHIPS.map((rel) => {
            const isSelected = giftData.relationship === rel;
            return (
              <button
                key={rel}
                type="button"
                onClick={() => updateGiftData({ relationship: rel })}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all text-center flex items-center justify-center gap-1.5 border ${
                  isSelected
                    ? "bg-gradient-to-r from-burgundy-800 to-rose-glow/80 text-white border-rose-glow shadow-md shadow-burgundy-950/60 scale-102"
                    : "glass-panel text-champagne-200/80 hover:bg-white/5 border-rose-romantic/15"
                }`}
              >
                {isSelected && <Sparkles className="w-3 h-3 text-gold-glow" />}
                <span>{rel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
