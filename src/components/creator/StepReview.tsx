"use client";

import React, { useState, useEffect } from "react";
import { useCreatorStore } from "../../lib/store";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import Link from "next/link";
import {
  Send,
  Eye,
  Copy,
  Check,
  Share2,
  Heart,
  MessageCircle,
  Edit3,
  Calendar,
  Sparkles,
  Music,
  Image as ImageIcon,
  Palette,
} from "lucide-react";
import { VISUAL_EFFECTS_LIST } from "../../lib/templates";

export function StepReview() {
  const { giftData, updateGiftData, setStep } = useCreatorStore();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    // Generate unique short code if not already created
    if (!giftData.shortCode) {
      const code = nanoid(10);
      updateGiftData({ shortCode: code });
    }
  }, [giftData.shortCode, updateGiftData]);

  const giftUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/gift/${giftData.shortCode || "preview"}`
      : `/gift/${giftData.shortCode || "preview"}`;

  useEffect(() => {
    if (giftUrl) {
      QRCode.toDataURL(giftUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: "#781423",
          light: "#FAF4EB",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Code generation error", err));
    }
  }, [giftUrl]);

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(giftUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareText = `هناك هدية خاصة بانتظارك صنعتها لك بكل حب ❤️: ${giftUrl}`;

  const FINAL_PLEDGES = [
    "أحبكِ إلى الأبد ❤️",
    "شكراً لأنكِ في حياتي ❤️",
    "إلى أجمل أيامنا القادمة ❤️",
    "لو عاد بي الزمن، لاخترتكِ كل مرة ❤️",
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-burgundy-900/60 border border-rose-romantic/30 text-rose-glow mb-2">
          <Send className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-readex text-champagne-100">
          هديتك جاهزة للمشاركة ❤️
        </h2>
        <p className="text-sm text-champagne-300/70">
          يمكنك مراجعة وتعديل أي تفصيلة فوراً بنقرة واحدة، ثم نسخ الرابط أو إرساله
        </p>
      </div>

      {/* Quick Review & Instant Edit Grid */}
      <div className="glass-panel p-6 rounded-3xl border border-rose-romantic/20 space-y-4 max-w-2xl mx-auto shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="text-xs font-semibold text-rose-glow flex items-center gap-1.5">
            <Edit3 className="w-4 h-4" />
            <span>ملخص تفاصيل الهدية (اضغط على أي قسم للتعديل السريع):</span>
          </span>
          <span className="text-[11px] text-champagne-300/50">جاهز للإرسال</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Identity Card */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="p-3.5 rounded-2xl glass-panel hover:bg-white/5 border border-rose-romantic/15 text-right transition-all group flex items-start justify-between"
          >
            <div>
              <span className="text-champagne-300/60 block mb-0.5">المرسل والمستلم:</span>
              <span className="font-bold text-champagne-100 group-hover:text-rose-glow transition-colors">
                {giftData.senderName || "أحمد"} ➔ {giftData.recipientName || "سارة"} ({giftData.relationship})
              </span>
            </div>
            <Edit3 className="w-3.5 h-3.5 text-champagne-300/40 group-hover:text-rose-glow shrink-0 mt-0.5" />
          </button>

          {/* Story Date Card */}
          <button
            type="button"
            onClick={() => setStep(2)}
            className="p-3.5 rounded-2xl glass-panel hover:bg-white/5 border border-rose-romantic/15 text-right transition-all group flex items-start justify-between"
          >
            <div>
              <span className="text-champagne-300/60 block mb-0.5">تاريخ البداية:</span>
              <span className="font-bold text-champagne-100 group-hover:text-rose-glow transition-colors">
                {giftData.hasStoryDate && giftData.storyDate
                  ? `${giftData.storyDateType || "البداية"}: ${giftData.storyDate}`
                  : "تم تخطي التاريخ"}
              </span>
            </div>
            <Calendar className="w-3.5 h-3.5 text-champagne-300/40 group-hover:text-rose-glow shrink-0 mt-0.5" />
          </button>

          {/* Love Letter Card */}
          <button
            type="button"
            onClick={() => setStep(3)}
            className="p-3.5 rounded-2xl glass-panel hover:bg-white/5 border border-rose-romantic/15 text-right transition-all group flex items-start justify-between col-span-1 sm:col-span-2"
          >
            <div className="truncate max-w-[90%]">
              <span className="text-champagne-300/60 block mb-0.5">رسالة الحب:</span>
              <span className="font-medium text-champagne-100 group-hover:text-rose-glow transition-colors truncate block">
                "{giftData.loveLetter.substring(0, 75)}..."
              </span>
            </div>
            <Edit3 className="w-3.5 h-3.5 text-champagne-300/40 group-hover:text-rose-glow shrink-0 mt-0.5" />
          </button>

          {/* Music & YouTube Card */}
          <button
            type="button"
            onClick={() => setStep(5)}
            className="p-3.5 rounded-2xl glass-panel hover:bg-white/5 border border-rose-romantic/15 text-right transition-all group flex items-start justify-between"
          >
            <div>
              <span className="text-champagne-300/60 block mb-0.5">الأغنية والموسيقى:</span>
              <span className="font-bold text-champagne-100 group-hover:text-rose-glow transition-colors">
                {giftData.audioSourceType === "youtube"
                  ? `يوتيوب مقصوص (${giftData.audioTitle})`
                  : giftData.audioTitle || "لحن رومانسي"}
              </span>
            </div>
            <Music className="w-3.5 h-3.5 text-champagne-300/40 group-hover:text-rose-glow shrink-0 mt-0.5" />
          </button>

          {/* Visual Effects & Theme Card */}
          <button
            type="button"
            onClick={() => setStep(8)}
            className="p-3.5 rounded-2xl glass-panel hover:bg-white/5 border border-rose-romantic/15 text-right transition-all group flex items-start justify-between"
          >
            <div>
              <span className="text-champagne-300/60 block mb-0.5">المؤثرات والقالب:</span>
              <span className="font-bold text-champagne-100 group-hover:text-rose-glow transition-colors">
                {(giftData.visualEffects || []).length} مؤثرات بصرية مفعّلة
              </span>
            </div>
            <Palette className="w-3.5 h-3.5 text-champagne-300/40 group-hover:text-rose-glow shrink-0 mt-0.5" />
          </button>
        </div>
      </div>

      {/* Final Pledge Selection */}
      <div className="glass-panel p-6 rounded-3xl border border-rose-romantic/20 space-y-3 max-w-xl mx-auto">
        <label className="block text-sm font-medium text-champagne-200">
          الجملة الختامية للتجربة:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FINAL_PLEDGES.map((pledge) => (
            <button
              key={pledge}
              type="button"
              onClick={() => updateGiftData({ finalPledge: pledge })}
              className={`p-2.5 rounded-xl text-xs font-medium transition-all text-center border ${
                giftData.finalPledge === pledge
                  ? "bg-burgundy-800 text-white border-rose-glow shadow-sm"
                  : "glass-panel text-champagne-300/80 hover:bg-white/5 border-rose-romantic/15"
              }`}
            >
              {pledge}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={giftData.finalPledge}
          onChange={(e) => updateGiftData({ finalPledge: e.target.value })}
          placeholder="أو اكتب جملتك الختامية الخاصة..."
          className="w-full px-3 py-2 rounded-xl glass-input text-xs text-center"
        />
      </div>

      {/* Sharing Box with QR Code & Instant Links */}
      <div className="glass-panel p-6 rounded-3xl border border-rose-romantic/25 space-y-6 max-w-xl mx-auto shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Romantic QR Code */}
          {qrDataUrl && (
            <div className="p-3 bg-champagne-100 rounded-2xl shadow-xl shrink-0 border-2 border-rose-romantic/40">
              <img
                src={qrDataUrl}
                alt="Romantic QR Code"
                className="w-28 h-28 object-contain"
              />
              <span className="block text-[9px] text-center text-burgundy-900 font-bold mt-1">
                امسح لفتح الهدية ❤️
              </span>
            </div>
          )}

          {/* Link and Info */}
          <div className="flex-1 space-y-3 w-full text-center sm:text-right">
            <div>
              <h4 className="font-bold text-sm text-champagne-100 flex items-center justify-center sm:justify-start gap-1.5">
                <Heart className="w-4 h-4 text-rose-glow fill-rose-glow" />
                <span>رابط الهدية السري:</span>
              </h4>
              <p className="text-xs text-champagne-300/60 mt-0.5">
                رابط آمن ومشفر لا يمكن لأحد الوصول إليه إلا من يحمله
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={giftUrl}
                className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-rose-romantic/20 text-xs text-champagne-200/90 text-left font-mono"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-burgundy-800 hover:bg-burgundy-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "تم النسخ" : "نسخ"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-semibold border border-[#25D366]/30 transition-all hover:scale-102"
          >
            <MessageCircle className="w-4 h-4" />
            <span>واتساب</span>
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(giftUrl)}&text=${encodeURIComponent(
              "هناك هدية خاصة بانتظارك ❤️"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#229ED9]/20 hover:bg-[#229ED9]/30 text-[#229ED9] text-xs font-semibold border border-[#229ED9]/30 transition-all hover:scale-102"
          >
            <Share2 className="w-4 h-4" />
            <span>تيليجرام</span>
          </a>

          {/* Full Screen Live Preview */}
          <Link
            href={`/gift/${giftData.shortCode || "preview"}`}
            target="_blank"
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-burgundy-700 to-rose-glow text-white text-xs font-semibold shadow-lg shadow-burgundy-950/60 hover:scale-102 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>معاينة المستلم</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
