"use client";

import React, { useState } from "react";
import { useCreatorStore } from "../../lib/store";
import { Sparkles, Plus, Trash2, HeartHandshake } from "lucide-react";

export function StepTraits() {
  const { giftData, addTrait, removeTrait } = useCreatorStore();
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTrait({
      title: newTitle,
      description: newDesc || "من أجمل الصفات التي تميزك وتجعلني أحبك أكثر.",
    });
    setNewTitle("");
    setNewDesc("");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-burgundy-900/60 border border-rose-romantic/30 text-rose-glow mb-2">
          <HeartHandshake className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-readex text-champagne-100">
          أشياء أحبها فيك ❤️
        </h2>
        <p className="text-sm text-champagne-300/70">
          أضف التفاصيل الصغيرة التي تعشقها في شخصيته وستظهر كبطاقات مضيئة
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-panel p-5 rounded-3xl border border-rose-romantic/20 space-y-4 max-w-xl mx-auto">
        <div className="space-y-2">
          <label className="text-xs text-champagne-200">الشيء الذي تحبه:</label>
          <input
            type="text"
            placeholder="مثال: ابتسامتك العفوية، طيبة قلبك، اهتمامك بي..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-champagne-200">لماذا تحبه؟ أو ماذا يعني لك؟ (اختياري):</label>
          <textarea
            rows={2}
            placeholder="لأنها تجعل أصعب أيامي أسهل وتشعرني بالأمان..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs resize-none"
          />
        </div>

        <button
          type="button"
          disabled={!newTitle.trim()}
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-burgundy-700 to-rose-glow text-white text-xs font-semibold hover:scale-101 active:scale-98 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة إلى القائمة</span>
        </button>
      </div>

      {/* Traits List */}
      <div className="space-y-3 max-w-xl mx-auto">
        <label className="text-xs font-medium text-champagne-300/70 block">
          البطاقات المضافة ({giftData.traits.length}):
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {giftData.traits.map((trait, index) => (
            <div
              key={trait.id}
              className="glass-panel p-4 rounded-2xl border border-rose-romantic/20 flex flex-col justify-between group relative hover:border-rose-romantic/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-rose-glow text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-gold-glow" />
                  <span>#{index + 1} {trait.title}</span>
                </div>
                <p className="text-xs text-champagne-300/70 leading-relaxed">
                  {trait.description}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeTrait(trait.id)}
                  className="text-xs text-red-400/80 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
