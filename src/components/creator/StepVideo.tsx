"use client";

import React, { useState } from "react";
import { useCreatorStore } from "../../lib/store";
import { Video, Upload, Trash2, Film } from "lucide-react";

export function StepVideo() {
  const { giftData, updateGiftData } = useCreatorStore();
  const [videoUrlInput, setVideoUrlInput] = useState(giftData.videoUrl || "");

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateGiftData({ videoUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-burgundy-900/60 border border-rose-romantic/30 text-rose-glow mb-2">
          <Film className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-readex text-champagne-100">
          رسالة فيديو شخصية 🎬
        </h2>
        <p className="text-sm text-champagne-300/70">
          هذه الخطوة اختيارية تماماً، يمكنك إضافة فيديو قصير تظهر فيه بصوتك وصورتك
        </p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-rose-romantic/20 space-y-6 max-w-xl mx-auto">
        <div className="space-y-2">
          <label className="text-xs text-champagne-200">رفع فيديو قصير من جهازك (MP4 / MOV):</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="w-full text-xs text-champagne-300 file:ml-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-burgundy-800 file:text-white hover:file:bg-burgundy-700"
          />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-champagne-300/50 block text-center">أو أدخل رابط فيديو مباشر</span>
          <input
            type="url"
            placeholder="https://example.com/video.mp4"
            value={videoUrlInput}
            onChange={(e) => {
              setVideoUrlInput(e.target.value);
              updateGiftData({ videoUrl: e.target.value });
            }}
            className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        {giftData.videoUrl && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-champagne-300/70 font-medium">معاينة الفيديو:</span>
              <button
                type="button"
                onClick={() => {
                  setVideoUrlInput("");
                  updateGiftData({ videoUrl: undefined });
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف الفيديو</span>
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10">
              <video
                src={giftData.videoUrl}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
