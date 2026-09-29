"use client";

import React, { useState } from "react";
import { useCreatorStore } from "../../lib/store";
import { GalleryStyle } from "../../types/gift";
import { Image as ImageIcon, Plus, Trash2, Calendar, Sparkles, Layers } from "lucide-react";

const GALLERY_STYLES: { id: GalleryStyle; label: string; desc: string }[] = [
  { id: "polaroid", label: "Polaroid", desc: "صور بولارويد كلاسيكية مائلة" },
  { id: "floating", label: "Floating Photos", desc: "صور تطفو في الفضاء 3D" },
  { id: "wall3d", label: "3D Wall", desc: "جدار ذكريات سينمائي متدرج" },
  { id: "cards", label: "Memory Cards", desc: "بطاقات ذكريات أنيقة ومضيئة" },
];

export function StepMemories() {
  const { giftData, updateGiftData, addMemory, removeMemory } = useCreatorStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDate, setNewDate] = useState("");

  const handleAdd = () => {
    if (!newUrl.trim()) return;
    addMemory({
      url: newUrl,
      title: newTitle || "ذكرى لا تُنسى ❤️",
      description: newDesc || "أجمل اللحظات التي عشناها معاً",
      date: newDate || undefined,
    });
    setNewTitle("");
    setNewDesc("");
    setNewUrl("");
    setNewDate("");
    setShowAddModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setNewUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-burgundy-900/60 border border-rose-romantic/30 text-rose-glow mb-2">
          <ImageIcon className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-readex text-champagne-100">
          ذكرياتنا 📸
        </h2>
        <p className="text-sm text-champagne-300/70">
          أضف صوركم الجميلة لتعرض في تجربة ثلاثية الأبعاد مميزة
        </p>
      </div>

      {/* Gallery Display Style Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-champagne-200">
          نمط عرض الصور ثلاثي الأبعاد:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {GALLERY_STYLES.map((style) => {
            const isSelected = giftData.galleryStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => updateGiftData({ galleryStyle: style.id })}
                className={`p-3 rounded-2xl text-center transition-all border ${
                  isSelected
                    ? "bg-burgundy-800 text-white border-rose-glow shadow-md shadow-burgundy-950/50"
                    : "glass-panel text-champagne-300/70 hover:bg-white/5 border-rose-romantic/15"
                }`}
              >
                <Layers className="w-4 h-4 mx-auto mb-1 text-rose-romantic" />
                <div className="text-xs sm:text-sm font-semibold">{style.label}</div>
                <div className="text-[10px] text-champagne-300/50 mt-0.5">{style.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Memories Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-champagne-200">
            الصور المضافة ({giftData.memories.length}):
          </label>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-burgundy-700 to-rose-glow text-white text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة صورة جديدة</span>
          </button>
        </div>

        {giftData.memories.length === 0 ? (
          <div className="glass-panel p-8 rounded-3xl text-center border-dashed border-rose-romantic/30 space-y-3">
            <ImageIcon className="w-10 h-10 mx-auto text-champagne-300/40" />
            <p className="text-sm text-champagne-300/60">
              لم تقم بإضافة صور حتى الآن، اضغط على زر الإضافة لإثراء الهدية
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {giftData.memories.map((mem) => (
              <div
                key={mem.id}
                className="glass-panel rounded-2xl overflow-hidden border border-rose-romantic/20 group relative"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-black/40 relative">
                  <img
                    src={mem.url}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeMemory(mem.id)}
                    className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="حذف الصورة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="font-semibold text-sm text-champagne-100 truncate">
                    {mem.title}
                  </h4>
                  <p className="text-xs text-champagne-300/60 line-clamp-2">
                    {mem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel border-rose-romantic/30 p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="font-bold text-lg text-champagne-100">إضافة ذكرى جديدة 📸</h3>

            {/* Direct File or URL */}
            <div className="space-y-2">
              <label className="text-xs text-champagne-200">رفع صورة من جهازك:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs text-champagne-300 file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-burgundy-800 file:text-white hover:file:bg-burgundy-700"
              />
              <span className="text-[10px] text-champagne-300/50 block text-center">أو أدخل رابط الصورة المباشر</span>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-champagne-200">عنوان الصورة:</label>
              <input
                type="text"
                placeholder="مثال: أجمل يوم ❤️"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-champagne-200">تاريخ الذكرى (اختياري):</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-champagne-200">وصف قصير:</label>
              <textarea
                rows={2}
                placeholder="هذا اليوم سيبقى دائماً من أجمل ذكرياتي معك..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-champagne-300/70 hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={!newUrl.trim()}
                onClick={handleAdd}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-burgundy-700 to-rose-glow text-white text-xs font-semibold disabled:opacity-50"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
