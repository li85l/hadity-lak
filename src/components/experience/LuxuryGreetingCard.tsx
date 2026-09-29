"use client";

import React, { useState } from "react";
import { Sparkles, Share2, Download, Check, Copy } from "lucide-react";
import confetti from "canvas-confetti";

export interface GreetingPreset {
  id: string;
  category: "eid_fitr" | "eid_adha" | "ramadan" | "graduation" | "newborn" | "general";
  categoryName: string;
  title: string;
  defaultRecipient: string;
  blessingText: string;
  poemVerse?: string;
  signatureTitle: string;
  themeStyle: "gold_ivory" | "emerald_gold" | "night_navy" | "rose_gold";
}

const GREETING_PRESETS: GreetingPreset[] = [
  {
    id: "eid_mubarak",
    category: "eid_fitr",
    categoryName: "عيد الفطر المبارك",
    title: "عِـيـدٌ مُـبـارَك",
    defaultRecipient: "الأحبة والأصدقاء الكرام",
    blessingText: "تقبل الله منا ومنكم صالح الأعمال، وأعاده الله عليكم باليمن والبركات والمسرات، وكل عام وأنتم بخير وصحة وعافية.",
    poemVerse: "أمانينا تسبق تهانينا، وفرحتنا تسبق ليالينا، مبارك عليكم العيد.",
    signatureTitle: "محبكم / محبتكم",
    themeStyle: "gold_ivory",
  },
  {
    id: "eid_adha",
    category: "eid_adha",
    categoryName: "عيد الأضحى المبارك",
    title: "تَهْنِئَةُ عِيدِ الأَضْحَى",
    defaultRecipient: "أهلي وعزوتي وأصدقائي",
    blessingText: "أسمى آيات التهاني والتبريكات بمناسبة حلول عيد الأضحى المبارك، سائلين المولى عز وجل أن يتقبل طاعاتكم وأن يغمر أيامكم بالفرح والسعادة.",
    poemVerse: "يا بهجة العيد طوفي حول دارهمُ، وانثري الفرح في أرجاء ليلهمُ.",
    signatureTitle: "أخوكم / أختكم",
    themeStyle: "emerald_gold",
  },
  {
    id: "ramadan_kareem",
    category: "ramadan",
    categoryName: "رمضان المبارك",
    title: "رَمَـضَـان كَـرِيـم",
    defaultRecipient: "الأفاضل الكرام",
    blessingText: "مبارك عليكم شهر رمضان الفضيل، جعله الله شهر خير وبركة وغفران، وأعاننا وإياكم على صيامه وقيامه إيماناً واحتساباً.",
    signatureTitle: "الداعي لكم بالخير",
    themeStyle: "night_navy",
  },
  {
    id: "graduation_joy",
    category: "graduation",
    categoryName: "تهنئة تخرج ونجاح",
    title: "بَشَائِرُ التَّخَرُّجِ وَالنَّجَاح",
    defaultRecipient: "الخريج العزيز",
    blessingText: "ألف مبارك التخرج والنجاح الباهر، ثمرة جدك واجتهادك توجت اليوم بالفرح والسرور، ومنها لأعلى المراتب والمناصب بإذن الله.",
    poemVerse: "زرعتَ الجدَّ أزماناً فطابَ الجنى، ونلتَ المجدَ بعدَ التعبِ والمنى.",
    signatureTitle: "مع فائق الفخر والمحبة",
    themeStyle: "gold_ivory",
  },
  {
    id: "newborn_blessing",
    category: "newborn",
    categoryName: "بشارة مولود",
    title: "بَارَكَ اللَّهُ لَكُمْ فِي المَوْهُوب",
    defaultRecipient: "العائلة الكريمة",
    blessingText: "ألف مبارك قدوم المولود الجديد، جعله الله قرة عين لوالديه ومن مواليد السعادة، وأنتبه نباتاً حسناً وبارك لكم فيه.",
    signatureTitle: "المحبون والمهنئون",
    themeStyle: "rose_gold",
  },
];

export function LuxuryGreetingCard() {
  const [selectedPreset, setSelectedPreset] = useState<GreetingPreset>(GREETING_PRESETS[0]);
  const [senderName, setSenderName] = useState<string>("عبدالرحمن بن فهد");
  const [recipientName, setRecipientName] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleShare = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#FFFFFF", "#246B52"],
    });

    const shareText = `*${selectedPreset.title}*\n\nإلى: ${recipientName || selectedPreset.defaultRecipient}\n\n${selectedPreset.blessingText}\n\n${selectedPreset.signatureTitle}: ${senderName || "محبكم"}`;

    if (navigator.share) {
      navigator.share({
        title: selectedPreset.title,
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getStyleClasses = () => {
    switch (selectedPreset.themeStyle) {
      case "emerald_gold":
        return {
          cardBg: "bg-gradient-to-b from-[#092219] to-[#04120D] text-[#FAF8F5]",
          border: "border-[#D4AF37]/50",
          goldAccent: "text-[#E6C66E]",
          verseColor: "text-emerald-200/80",
          innerFrame: "border-[#D4AF37]/30 bg-black/20",
          textColor: "text-[#FAF8F5]",
        };
      case "night_navy":
        return {
          cardBg: "bg-gradient-to-b from-[#0B1528] to-[#050B15] text-[#FAF8F5]",
          border: "border-[#D4AF37]/50",
          goldAccent: "text-[#E6C66E]",
          verseColor: "text-blue-200/80",
          innerFrame: "border-[#D4AF37]/30 bg-black/20",
          textColor: "text-[#FAF8F5]",
        };
      case "rose_gold":
        return {
          cardBg: "bg-gradient-to-b from-[#FAF4F5] to-[#F5E6EB] text-[#2E1820]",
          border: "border-[#D4AF37]/50",
          goldAccent: "text-[#9E2B4B]",
          verseColor: "text-[#7A3648]",
          innerFrame: "border-[#D4AF37]/30 bg-white/70",
          textColor: "text-[#2E1820]",
        };
      case "gold_ivory":
      default:
        return {
          cardBg: "bg-[#FAF7F0] text-[#1E1A16]",
          border: "border-[#D4AF37]/60",
          goldAccent: "text-[#8C6D23]",
          verseColor: "text-[#6B5E4B]",
          innerFrame: "border-[#D4AF37]/35 bg-white/80",
          textColor: "text-[#1E1A16]",
        };
    }
  };

  const styles = getStyleClasses();

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 scrollbar-none">
        {GREETING_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => setSelectedPreset(preset)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              selectedPreset.id === preset.id
                ? "bg-[#D4AF37] text-[#1E1A16] font-bold shadow-md shadow-[#D4AF37]/20 scale-105"
                : "bg-white/5 hover:bg-white/10 text-ivory-200 border border-white/10"
            }`}
          >
            {preset.categoryName}
          </button>
        ))}
      </div>

      {/* Main Interactive Grid: Controls Left, Live Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
        
        {/* Customization Inputs (5 Columns on Desktop) */}
        <div className="lg:col-span-5 luxury-card-surface p-6 rounded-3xl border border-[#D4AF37]/20 space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-ivory-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>تخصيص البطاقة بالاسم</span>
            </h3>
            <p className="text-xs text-ivory-300/60 font-light">
              اكتب اسمك واسم المُهدى إليه لتجهيز بطاقة جاهزة للمشاركة الفورية.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                اسم المُرسِل (أنت):
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="مثال: سلمان بن عبدالعزيز"
                className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100 placeholder-white/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                اسم المُهدى إليه (اختياري):
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="اتركه فارغاً ليكون عاماً لجميع الأحبة"
                className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100 placeholder-white/30"
              />
            </div>

            {/* Quick Themes inside Preset */}
            <div>
              <label className="block text-xs font-semibold text-ivory-200 mb-2">
                اختر طابع الألوان:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "gold_ivory", label: "عاجي وذهب ملكي" },
                  { id: "emerald_gold", label: "زمردي وأخضر فخم" },
                  { id: "night_navy", label: "كحلي ليل مذهب" },
                  { id: "rose_gold", label: "وردي ناعم وأنيق" },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() =>
                      setSelectedPreset((prev) => ({
                        ...prev,
                        themeStyle: th.id as any,
                      }))
                    }
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      selectedPreset.themeStyle === th.id
                        ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] font-bold"
                        : "border-white/10 hover:border-white/20 text-ivory-300/70"
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Share / Copy Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleShare}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#AA822A] to-[#8C6D23] text-white font-bold text-sm shadow-xl shadow-amber-950/40 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>تم نسخ نص التهنئة!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-white" />
                    <span>مشاركة البطاقة عبر واتساب</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Rendered Card Preview (7 Columns on Desktop) */}
        <div className="lg:col-span-7">
          <div className={`rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-double ${styles.border} ${styles.cardBg} relative overflow-hidden transition-all duration-500`}>
            
            {/* Elegant Arabesque Borders */}
            <div className="arabesque-corner-tl" />
            <div className="arabesque-corner-br" />

            <div className={`border rounded-2xl p-6 sm:p-8 text-center space-y-6 relative z-10 backdrop-blur-sm ${styles.innerFrame}`}>
              
              {/* Islamic Ornament Icon */}
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-xl">
                ✨
              </div>

              {/* Title */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block">
                  تهنئة خاصة
                </span>
                <h2 className="text-3xl sm:text-4xl font-ruqaa font-bold py-1">
                  {selectedPreset.title}
                </h2>
              </div>

              {/* Recipient Greeting */}
              <p className={`text-base sm:text-lg font-amiri font-bold ${styles.goldAccent}`}>
                إلى: {recipientName.trim() || selectedPreset.defaultRecipient}
              </p>

              {/* Blessing Body Text */}
              <p className={`text-sm sm:text-base font-alexandria leading-relaxed max-w-md mx-auto ${styles.textColor}`}>
                {selectedPreset.blessingText}
              </p>

              {/* Poem Verse */}
              {selectedPreset.poemVerse && (
                <div className={`border-y border-[#D4AF37]/25 py-3 text-xs sm:text-sm font-amiri italic max-w-sm mx-auto ${styles.verseColor}`}>
                  « {selectedPreset.poemVerse} »
                </div>
              )}

              {/* Signature / Sender */}
              <div className="pt-2 text-center space-y-0.5">
                <span className="text-xs text-[#D4AF37] block font-medium">
                  {selectedPreset.signatureTitle}
                </span>
                <p className="text-lg sm:text-xl font-ruqaa font-bold">
                  {senderName || "محبكم في الله"}
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
