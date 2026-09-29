"use client";

import React, { useEffect, useState } from "react";
import { useCreatorStore } from "../../lib/store";
import { StoryDateType } from "../../types/gift";
import { calculateTimeElapsed, formatArabicNumber } from "../../lib/utils";
import { Calendar, Clock, Sparkles } from "lucide-react";

const DATE_TYPES: StoryDateType[] = [
  "أول لقاء",
  "أول رسالة",
  "أول موعد",
  "ذكرى الزواج",
  "ذكرى الخطوبة",
  "تاريخ مخصص",
];

export function StepStoryDate() {
  const { giftData, updateGiftData } = useCreatorStore();
  const [elapsed, setElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (giftData.hasStoryDate && giftData.storyDate) {
      setElapsed(calculateTimeElapsed(giftData.storyDate));
      const interval = setInterval(() => {
        setElapsed(calculateTimeElapsed(giftData.storyDate!));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [giftData.hasStoryDate, giftData.storyDate]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-burgundy-900/60 border border-rose-romantic/30 text-rose-glow mb-2">
          <Calendar className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-readex text-champagne-100">
          متى بدأت قصتكما؟
        </h2>
        <p className="text-sm text-champagne-300/70">
          سننشئ عداداً زمنياً حياً ينبض بكل لحظة عشتماها معاً
        </p>
      </div>

      {/* Date Toggle */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => updateGiftData({ hasStoryDate: true })}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            giftData.hasStoryDate
              ? "bg-gradient-to-r from-burgundy-800 to-rose-glow text-white shadow-lg"
              : "glass-panel text-champagne-300/60 hover:text-white"
          }`}
        >
          تحديد تاريخ مميز
        </button>
        <button
          type="button"
          onClick={() => updateGiftData({ hasStoryDate: false })}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            !giftData.hasStoryDate
              ? "bg-gradient-to-r from-burgundy-800 to-rose-glow text-white shadow-lg"
              : "glass-panel text-champagne-300/60 hover:text-white"
          }`}
        >
          تخطي هذا القسم
        </button>
      </div>

      {giftData.hasStoryDate && (
        <div className="space-y-6 max-w-xl mx-auto">
          {/* Date Type Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-200">
              ماذا يمثل هذا اليوم؟
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {DATE_TYPES.map((dt) => {
                const isSelected = giftData.storyDateType === dt;
                return (
                  <button
                    key={dt}
                    type="button"
                    onClick={() => updateGiftData({ storyDateType: dt })}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all text-center border ${
                      isSelected
                        ? "bg-burgundy-800/90 text-white border-rose-glow"
                        : "glass-panel text-champagne-300/70 hover:bg-white/5 border-rose-romantic/15"
                    }`}
                  >
                    {dt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-200">
              اختر التاريخ:
            </label>
            <input
              type="date"
              value={giftData.storyDate || ""}
              onChange={(e) => updateGiftData({ storyDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-champagne-100 text-center text-lg"
            />
          </div>

          {/* Live Counter Preview Box */}
          <div className="glass-panel p-6 rounded-3xl border border-rose-romantic/25 text-center space-y-4 shadow-xl">
            <div className="inline-flex items-center gap-2 text-rose-glow text-xs uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>منذ ذلك اليوم الجميل...</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
              <div className="bg-black/40 p-2.5 rounded-2xl border border-white/5">
                <span className="block text-xl sm:text-2xl font-bold text-champagne-100">
                  {formatArabicNumber(elapsed.years)}
                </span>
                <span className="text-[10px] sm:text-xs text-champagne-300/60">سنوات</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded-2xl border border-white/5">
                <span className="block text-xl sm:text-2xl font-bold text-champagne-100">
                  {formatArabicNumber(elapsed.months)}
                </span>
                <span className="text-[10px] sm:text-xs text-champagne-300/60">أشهر</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded-2xl border border-white/5">
                <span className="block text-xl sm:text-2xl font-bold text-champagne-100">
                  {formatArabicNumber(elapsed.days)}
                </span>
                <span className="text-[10px] sm:text-xs text-champagne-300/60">أيام</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded-2xl border border-white/5">
                <span className="block text-xl sm:text-2xl font-bold text-champagne-100">
                  {formatArabicNumber(elapsed.hours)}
                </span>
                <span className="text-[10px] sm:text-xs text-champagne-300/60">ساعات</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded-2xl border border-white/5">
                <span className="block text-xl sm:text-2xl font-bold text-champagne-100">
                  {formatArabicNumber(elapsed.minutes)}
                </span>
                <span className="text-[10px] sm:text-xs text-champagne-300/60">دقائق</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded-2xl border border-white/5">
                <span className="block text-xl sm:text-2xl font-bold text-rose-glow">
                  {formatArabicNumber(elapsed.seconds)}
                </span>
                <span className="text-[10px] sm:text-xs text-champagne-300/60">ثواني</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
