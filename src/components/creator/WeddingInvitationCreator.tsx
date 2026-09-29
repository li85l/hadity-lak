"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LuxuryEnvelopeCard, LuxuryCardData } from "../experience/LuxuryEnvelopeCard";
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Share2, 
  MapPin, 
  Calendar, 
  Users, 
  Copy,
  CheckCircle2,
  Heart
} from "lucide-react";
import confetti from "canvas-confetti";

export function WeddingInvitationCreator() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [createdUrl, setCreatedUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Form State
  const [cardData, setCardData] = useState<LuxuryCardData>({
    category: "wedding",
    title: "بَشَائِرُ عَقْدِ القِرَانِ وَالفَرَح",
    subtitle: "دعوة زفاف ملكية",
    hosts: "يتشرف الشيخ خالد بن سلطان آل سعود وعائلته الكريمة",
    honorees: "سـعـود & رِيـم",
    quranVerse: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    eventDateHijri: "الخميس ١٥ شـوال ١٤٤٧ هـ",
    eventDateGregorian: "٢٣ أبريل ٢٠٢٦ م",
    eventTime: "الساعة ٨:٣٠ مـسـاءً",
    hallName: "قاعة ليلتي الكبرى للمناسبات",
    city: "مدينة الرياض - طريق الملك سلمان",
    mapUrl: "https://maps.google.com",
    message: "بقلوب تفيض فرحاً وامتناناً، ندعوكم لمشاركتنا فرحة العمر في هذه الليلة المباركة، سائلين المولى أن يديم أفراحكم وأفراحنا بكل خير.",
    note: "دعوتنا لكم شرف لنا، وجنة الأطفال منازلهم.",
    waxSealColor: "gold",
    envelopeTheme: "emerald",
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinish = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#C5A059", "#246B52", "#FFFFFF"],
    });

    if (typeof window !== "undefined") {
      const generatedLink = `${window.location.origin}/gift/preview`;
      setCreatedUrl(generatedLink);
      try {
        localStorage.setItem("maraseem_custom_card", JSON.stringify(cardData));
      } catch (e) {}
    }
    setCurrentStep(3);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(createdUrl || window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      
      {/* Step Tracker Header */}
      <div className="luxury-card-surface p-4 sm:p-6 rounded-3xl mb-8 border border-[#D4AF37]/30 shadow-2xl">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          
          {/* Progress Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 right-0 h-0.5 bg-[#D4AF37] -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%" }}
          />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              currentStep >= 1 ? "bg-[#D4AF37] text-[#1E1A16] shadow-md shadow-[#D4AF37]/30" : "bg-white/10 text-white/50"
            }`}>
              {currentStep > 1 ? <Check className="w-4 h-4" /> : "١"}
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-ivory-200">الطابع والنمط</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              currentStep >= 2 ? "bg-[#D4AF37] text-[#1E1A16] shadow-md shadow-[#D4AF37]/30" : "bg-white/10 text-white/50"
            }`}>
              {currentStep > 2 ? <Check className="w-4 h-4" /> : "٢"}
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-ivory-200">بيانات الحفل</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              currentStep === 3 ? "bg-[#D4AF37] text-[#1E1A16] shadow-md shadow-[#D4AF37]/30" : "bg-white/10 text-white/50"
            }`}>
              {"٣"}
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-ivory-200">المعاينة والمشاركة</span>
          </div>

        </div>
      </div>

      {/* Step Contents */}
      <div className="luxury-card-surface p-6 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative min-h-[500px] flex flex-col justify-between">
        
        {/* Step 1: Occasion Type & Royal Colors */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                الخطوة الأولى
              </span>
              <h2 className="text-2xl sm:text-3xl font-ruqaa font-bold text-ivory-100">
                اختر نوع المناسبة واللون الملكي
              </h2>
              <p className="text-xs sm:text-sm text-ivory-300/70 font-alexandria">
                حدد طبيعة دعوتك لاختيار العبارات والزخارف المناسبة لها.
              </p>
            </div>

            {/* Occasion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: "wedding",
                  title: "حفل زفاف ملكي",
                  icon: "💍",
                  desc: "دعوة زفاف متكاملة مع أسماء العائلات وموقع القاعة والـ RSVP",
                },
                {
                  id: "engagement",
                  title: "عقد قران وملكة",
                  icon: "✨",
                  desc: "بشائر عقد القران وميثاق المودة بأرقى عبارات التهنئة",
                },
                {
                  id: "eid",
                  title: "معايدة ومناسبة خاصة",
                  icon: "🌙",
                  desc: "بطاقات الأعياد والتخرج والمواليد مع إمكانية تخصيص الأسماء",
                },
              ].map((occ) => (
                <div
                  key={occ.id}
                  onClick={() => setCardData({ ...cardData, category: occ.id as any })}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all text-center space-y-2 ${
                    cardData.category === occ.id
                      ? "border-[#D4AF37] bg-[#D4AF37]/15 shadow-lg shadow-[#D4AF37]/20 scale-[1.02]"
                      : "border-white/10 hover:border-white/25 bg-black/20"
                  }`}
                >
                  <span className="text-3xl block">{occ.icon}</span>
                  <h3 className="font-ruqaa font-bold text-lg text-ivory-100">{occ.title}</h3>
                  <p className="text-xs text-ivory-300/60 leading-relaxed font-alexandria">{occ.desc}</p>
                </div>
              ))}
            </div>

            {/* Theme Colors */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="block text-xs sm:text-sm font-semibold text-ivory-200">
                اختر طابع المغلف الفاخر:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "emerald", label: "الزمردي الملكي", color: "bg-[#0A261D] border-emerald-500" },
                  { id: "burgundy", label: "الخمري الكلاسيكي", color: "bg-[#2B0811] border-rose-500" },
                  { id: "navy", label: "الكحلي الليلي", color: "bg-[#0C1628] border-blue-500" },
                  { id: "ivory", label: "العاجي والذهب", color: "bg-[#2A241E] border-amber-500" },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setCardData({ ...cardData, envelopeTheme: th.id as any })}
                    className={`p-3 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                      cardData.envelopeTheme === th.id
                        ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37] font-bold"
                        : "border-white/10 text-ivory-300/70 hover:border-white/20"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${th.color} border`} />
                    <span className="text-xs">{th.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wax Seal Choice */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs sm:text-sm font-semibold text-ivory-200">
                لون الختم الشمعي:
              </label>
              <div className="flex items-center gap-4">
                {[
                  { id: "gold", label: "ذهب خالص مطفي", sealClass: "wax-seal-gold text-amber-100" },
                  { id: "burgundy", label: "أحمر قرمزي ملكي", sealClass: "wax-seal-button text-rose-100" },
                ].map((ws) => (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => setCardData({ ...cardData, waxSealColor: ws.id as any })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs transition-all ${
                      cardData.waxSealColor === ws.id
                        ? "border-[#D4AF37] bg-[#D4AF37]/15 text-gold-light font-bold"
                        : "border-white/10 text-ivory-300/70"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full inline-block ${ws.sealClass}`} />
                    <span>{ws.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Event Details Form */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                الخطوة الثانية
              </span>
              <h2 className="text-2xl sm:text-3xl font-ruqaa font-bold text-ivory-100">
                تفاصيل وبيانات المناسبة
              </h2>
              <p className="text-xs sm:text-sm text-ivory-300/70 font-alexandria">
                أدخل أسماء العائلات والعروسين وموعد ومكان الحفل.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Hosts */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                  أسماء الداعين (عائلات العريس والعروس):
                </label>
                <input
                  type="text"
                  value={cardData.hosts}
                  onChange={(e) => setCardData({ ...cardData, hosts: e.target.value })}
                  placeholder="يتشرف الشيخ فلان بن فلان والشيخ فلان بن فلان..."
                  className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100"
                />
              </div>

              {/* Honorees (Groom & Bride) */}
              <div>
                <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                  اسم العريس والعروس (أو المكرّمين):
                </label>
                <input
                  type="text"
                  value={cardData.honorees}
                  onChange={(e) => setCardData({ ...cardData, honorees: e.target.value })}
                  placeholder="مثال: فيصل & ريم"
                  className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100"
                />
              </div>

              {/* Title / Ceremony Name */}
              <div>
                <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                  عنوان الدعوة:
                </label>
                <input
                  type="text"
                  value={cardData.title}
                  onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
                  placeholder="دَعْوَةُ زِفَافٍ مَلَكِيَّة"
                  className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100"
                />
              </div>

              {/* Hijri Date */}
              <div>
                <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                  التاريخ الهجري:
                </label>
                <input
                  type="text"
                  value={cardData.eventDateHijri}
                  onChange={(e) => setCardData({ ...cardData, eventDateHijri: e.target.value })}
                  placeholder="الخميس ١٥ شوال ١٤٤٧ هـ"
                  className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100"
                />
              </div>

              {/* Gregorian Date */}
              <div>
                <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                  التاريخ الميلادي:
                </label>
                <input
                  type="text"
                  value={cardData.eventDateGregorian}
                  onChange={(e) => setCardData({ ...cardData, eventDateGregorian: e.target.value })}
                  placeholder="٢٣ أبريل ٢٠٢٦ م"
                  className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                  وقت الحضور:
                </label>
                <input
                  type="text"
                  value={cardData.eventTime}
                  onChange={(e) => setCardData({ ...cardData, eventTime: e.target.value })}
                  placeholder="الساعة ٨:٣٠ مساءً"
                  className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100"
                />
              </div>

              {/* Hall Name */}
              <div>
                <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                  اسم القاعة أو الفندق:
                </label>
                <input
                  type="text"
                  value={cardData.hallName}
                  onChange={(e) => setCardData({ ...cardData, hallName: e.target.value })}
                  placeholder="قاعة ليلتي الكبرى"
                  className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100"
                />
              </div>

              {/* City & Location */}
              <div>
                <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                  المدينة والحي:
                </label>
                <input
                  type="text"
                  value={cardData.city}
                  onChange={(e) => setCardData({ ...cardData, city: e.target.value })}
                  placeholder="مدينة الرياض - طريق الملك سلمان"
                  className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100"
                />
              </div>

              {/* Google Maps Link */}
              <div>
                <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                  رابط خريطة قوقل (Google Maps):
                </label>
                <input
                  type="text"
                  value={cardData.mapUrl || ""}
                  onChange={(e) => setCardData({ ...cardData, mapUrl: e.target.value })}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100"
                />
              </div>

              {/* Welcome Message */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                  نص الترحيب والدعوة:
                </label>
                <textarea
                  rows={3}
                  value={cardData.message}
                  onChange={(e) => setCardData({ ...cardData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100"
                />
              </div>

              {/* Note / Children */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ivory-200 mb-1.5">
                  ملاحظة إضافية (مثل جنة الأطفال منازلهم / الزي الرسمي):
                </label>
                <input
                  type="text"
                  value={cardData.note || ""}
                  onChange={(e) => setCardData({ ...cardData, note: e.target.value })}
                  placeholder="دعوتنا لكم شرف لنا، وجنة الأطفال منازلهم."
                  className="w-full px-4 py-2.5 rounded-xl luxury-input text-sm text-ivory-100"
                />
              </div>

            </div>
          </div>
        )}

        {/* Step 3: Review & Final Live Sharing */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#947425] via-[#D4AF37] to-[#F7E1A0] flex items-center justify-center mx-auto text-2xl text-[#1E1A16] shadow-lg">
                ⚜️
              </div>
              <h2 className="text-2xl sm:text-3xl font-ruqaa font-bold text-ivory-100">
                دعوتك الملكية أصبحت جاهزة!
              </h2>
              <p className="text-xs sm:text-sm text-ivory-300/70 font-alexandria max-w-md mx-auto">
                تم تجهيز مغلف الدعوة والختم الشمعي وتأكيد الحضور. يمكنك نسخ الرابط ومشاركته فوراً مع ضيوفك الكرام.
              </p>
            </div>

            {/* Sharing Box */}
            <div className="bg-black/30 p-4 sm:p-6 rounded-2xl border border-[#D4AF37]/30 max-w-lg mx-auto space-y-4 text-center">
              <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={createdUrl || "https://maraseem.cards/invitation/royal-preview"}
                  className="bg-transparent flex-1 text-xs text-ivory-200 outline-none px-2 text-left font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#1E1A16] text-xs font-bold hover:bg-[#E5C378] transition-all flex items-center gap-1.5"
                >
                  {isCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "تم النسخ!" : "نسخ الرابط"}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const text = `أتشرف بدعوتكم لحضور ${cardData.title}: ${cardData.honorees}\n\nلمشاهدة بطاقة الدعوة الملكية وتأكيد الحضور:\n${createdUrl || window.location.href}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#246B52] hover:bg-[#1A4F3C] text-white text-xs sm:text-sm font-semibold transition-all shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>إرسال عبر واتساب</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Preview */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-center text-xs text-gold-light/80 font-medium mb-3">
                معاينة مباشرة للدعوة كما ستظهر للضيوف:
              </p>
              <LuxuryEnvelopeCard cardData={cardData} autoOpen={false} />
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={handlePrev}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-ivory-200 text-xs sm:text-sm font-semibold disabled:opacity-30 disabled:pointer-events-none transition-all border border-white/10"
          >
            <ArrowRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <span className="text-xs text-ivory-300/50">
            الخطوة {currentStep} من ٣
          </span>

          {currentStep < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8902A] text-[#1E1A16] text-xs sm:text-sm font-bold shadow-lg shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all"
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : currentStep === 2 ? (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#B8902A] to-[#8C6D23] text-[#1E1A16] text-xs sm:text-sm font-bold shadow-lg shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>توليد الدعوة الملكية</span>
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 text-ivory-100 text-xs sm:text-sm font-semibold hover:bg-white/20 transition-all"
            >
              <span>العودة للرئيسية</span>
            </Link>
          )}
        </div>

      </div>

    </div>
  );
}
