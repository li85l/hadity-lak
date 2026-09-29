"use client";

import React from "react";
import { useCreatorStore } from "../../lib/store";
import { Lock, Clock, ShieldCheck } from "lucide-react";

export function StepSecurity() {
  const { giftData, updateGiftData } = useCreatorStore();

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-burgundy-900/60 border border-rose-romantic/30 text-rose-glow mb-2">
          <ShieldCheck className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-readex text-champagne-100">
          الخصوصية وموعد الفتح 🔐
        </h2>
        <p className="text-sm text-champagne-300/70">
          حدد ما إذا كنت تريد حماية الهدية بكلمة سر أو تحديد موعد محدد لفتحها
        </p>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        {/* Password Protection Card */}
        <div className="glass-panel p-6 rounded-3xl border border-rose-romantic/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-burgundy-900/80 flex items-center justify-center text-rose-glow border border-rose-romantic/30">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-champagne-100">
                  حماية الهدية بكلمة سر؟
                </h4>
                <p className="text-xs text-champagne-300/60">
                  لن يتمكن أحد من فتح الهدية بدون إدخال كلمة السر
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={giftData.isPasswordProtected}
              onChange={(e) => updateGiftData({ isPasswordProtected: e.target.checked })}
              className="w-5 h-5 accent-rose-glow rounded cursor-pointer"
            />
          </div>

          {giftData.isPasswordProtected && (
            <div className="pt-2 space-y-2 animate-fadeIn">
              <label className="text-xs text-champagne-200">أدخل كلمة السر للهدية:</label>
              <input
                type="text"
                placeholder="مثال: تاريخ ميلادها أو كلمة سر خاصة بينكما"
                value={giftData.password || ""}
                onChange={(e) => updateGiftData({ password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-center"
              />
            </div>
          )}
        </div>

        {/* Scheduled Unlock Card */}
        <div className="glass-panel p-6 rounded-3xl border border-rose-romantic/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-burgundy-900/80 flex items-center justify-center text-gold-glow border border-rose-romantic/30">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-champagne-100">
                  موعد فتح محدد للهدية؟
                </h4>
                <p className="text-xs text-champagne-300/60">
                  يظهر عد تنازلي حتى يحين وقت فتح الهدية بدقة
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={giftData.hasScheduleDate}
              onChange={(e) => updateGiftData({ hasScheduleDate: e.target.checked })}
              className="w-5 h-5 accent-rose-glow rounded cursor-pointer"
            />
          </div>

          {giftData.hasScheduleDate && (
            <div className="pt-2 space-y-2 animate-fadeIn">
              <label className="text-xs text-champagne-200">حدد تاريخ ووقت الفتح:</label>
              <input
                type="datetime-local"
                value={giftData.scheduledUnlockAt || ""}
                onChange={(e) => updateGiftData({ scheduledUnlockAt: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-center text-champagne-100"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
