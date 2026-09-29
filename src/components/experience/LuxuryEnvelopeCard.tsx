"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Share2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Heart,
  Clock,
  Compass,
  Users
} from "lucide-react";
import confetti from "canvas-confetti";

export interface LuxuryCardData {
  category: "wedding" | "engagement" | "eid" | "general";
  title: string;
  subtitle: string;
  hosts: string;
  honorees: string; // e.g. "فيصل & سارة" أو "عيدكم مبارك وكل عام وأنتم بخير"
  quranVerse?: string;
  eventDateHijri: string;
  eventDateGregorian: string;
  eventTime: string;
  hallName: string;
  city: string;
  mapUrl?: string;
  message: string;
  note?: string;
  waxSealColor: "gold" | "burgundy" | "emerald";
  envelopeTheme: "emerald" | "burgundy" | "ivory" | "navy";
}

interface LuxuryEnvelopeCardProps {
  cardData: LuxuryCardData;
  autoOpen?: boolean;
}

export function LuxuryEnvelopeCard({ cardData, autoOpen = false }: LuxuryEnvelopeCardProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "attending" | "apologizing" | "confirmed">("idle");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [guestName, setGuestName] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#C5A059", "#F7E1A0", "#FFFFFF"],
      });
    }
  };

  const handleRsvpSubmit = (status: "attending" | "apologizing") => {
    setRsvpStatus("confirmed");
    if (status === "attending") {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.7 },
        colors: ["#D4AF37", "#246B52", "#FFFFFF"],
      });
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const shareUrl = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: cardData.title,
          text: `دعوة خاصة: ${cardData.honorees} - ${cardData.hallName}`,
          url: shareUrl,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    }
  };

  const addToCalendar = () => {
    // Generate Google Calendar Link
    const text = encodeURIComponent(cardData.title + ": " + cardData.honorees);
    const details = encodeURIComponent(cardData.message + "\n" + cardData.hallName);
    const location = encodeURIComponent(cardData.hallName + " - " + cardData.city);
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
    window.open(gCalUrl, "_blank");
  };

  // Color schemes for envelope
  const themeClasses = {
    emerald: {
      envelopeBg: "bg-gradient-to-b from-[#0A261D] via-[#081F17] to-[#04120D]",
      border: "border-emerald-700/40",
      accent: "text-emerald-300",
      sealBg: "bg-radial from-[#D4AF37] via-[#AA822A] to-[#684E12]",
      sealText: "text-amber-100",
    },
    burgundy: {
      envelopeBg: "bg-gradient-to-b from-[#2B0811] via-[#1F040B] to-[#120206]",
      border: "border-rose-900/40",
      accent: "text-rose-300",
      sealBg: "bg-radial from-[#C92A42] via-[#8A1325] to-[#45050F]",
      sealText: "text-rose-100",
    },
    navy: {
      envelopeBg: "bg-gradient-to-b from-[#0C1628] via-[#080E1A] to-[#040810]",
      border: "border-blue-900/40",
      accent: "text-blue-300",
      sealBg: "bg-radial from-[#E2B86E] via-[#BA8A3B] to-[#7A5415]",
      sealText: "text-amber-100",
    },
    ivory: {
      envelopeBg: "bg-gradient-to-b from-[#2E2822] via-[#201C18] to-[#141210]",
      border: "border-amber-900/40",
      accent: "text-amber-200",
      sealBg: "bg-radial from-[#D4AF37] via-[#AA822A] to-[#684E12]",
      sealText: "text-amber-100",
    },
  }[cardData.envelopeTheme || "emerald"];

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-3 sm:px-4">
      {/* Outer Envelope Wrapper */}
      <div className="relative">
        {/* Closed Envelope Visual Presentation (When Not Opened) */}
        {!isOpen ? (
          <div 
            onClick={handleOpen}
            className={`cursor-pointer group relative rounded-3xl p-8 sm:p-12 overflow-hidden border ${themeClasses.border} shadow-2xl transition-all duration-500 hover:scale-[1.01] ${themeClasses.envelopeBg}`}
          >
            {/* Texture and gold foil borders */}
            <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
            <div className="absolute inset-3 sm:inset-4 border border-gold-foil/30 rounded-2xl pointer-events-none" />
            
            {/* Envelope Triangles Fold illusion */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 py-8 sm:py-14">
              <span className="text-xs sm:text-sm tracking-widest text-gold-light/70 uppercase font-sans font-light">
                دعوة خاصة ومميزة
              </span>

              {/* Title & Honorees On Envelope */}
              <div className="space-y-3 max-w-md">
                <h3 className="text-2xl sm:text-3xl font-ruqaa text-gold-light font-bold">
                  {cardData.title}
                </h3>
                <p className="text-xl sm:text-2xl font-amiri text-ivory-100 font-semibold tracking-wide">
                  {cardData.honorees}
                </p>
              </div>

              {/* Wax Seal Centerpiece */}
              <div className="relative pt-4">
                <button
                  type="button"
                  onClick={handleOpen}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center shadow-2xl border border-amber-300/40 relative z-20 transition-all duration-300 group-hover:scale-105 active:scale-95 ${
                    cardData.waxSealColor === "burgundy" ? "wax-seal-button" : "wax-seal-gold"
                  }`}
                  aria-label="فتح الدعوة"
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow">⚜️</span>
                  <span className="text-[10px] sm:text-xs font-bold font-alexandria mt-0.5 opacity-90">
                    افتح الدعوة
                  </span>
                </button>
              </div>

              {/* Gentle Instruction */}
              <p className="text-xs text-ivory-300/60 font-light flex items-center gap-1.5 pt-2">
                <Sparkles className="w-3.5 h-3.5 text-gold-foil" />
                <span>انقر على الختم لفتح بطاقة الدعوة</span>
              </p>
            </div>
          </div>
        ) : (
          /* Opened Luxury Invitation Card */
          <div className="animate-slide-card transition-all duration-700">
            {/* The Unfolded Royal Card */}
            <div className="bg-[#FAF8F5] text-[#1E1B18] rounded-3xl p-6 sm:p-12 shadow-2xl border-4 border-double border-[#D4AF37]/50 relative overflow-hidden">
              
              {/* Luxury Corner Arabesque Accents */}
              <div className="arabesque-corner-tl" />
              <div className="arabesque-corner-br" />

              {/* Inner Decorative Frame */}
              <div className="border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-8 space-y-6 sm:space-y-8 text-center relative z-10 bg-white/70 backdrop-blur-sm shadow-inner">
                
                {/* Bismillah / Opening Sacred Verse */}
                <div className="space-y-3">
                  <p className="font-amiri text-xl sm:text-2xl text-[#8C6D23] font-bold">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  {cardData.quranVerse && (
                    <p className="font-amiri text-sm sm:text-base text-[#5C5346] italic max-w-lg mx-auto leading-relaxed">
                      ﴿ {cardData.quranVerse} ﴾
                    </p>
                  )}
                </div>

                {/* Hosts Introduction */}
                {cardData.hosts && (
                  <div className="text-sm sm:text-base font-alexandria text-[#4A433A] font-medium">
                    {cardData.hosts}
                  </div>
                )}

                {/* Main Honorees / Couple Names */}
                <div className="py-2 space-y-2">
                  <span className="text-xs sm:text-sm text-[#8C6D23] tracking-widest block font-medium">
                    يتشرفون بدعوتكم لحضور حفل
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-ruqaa text-[#2B1B10] font-bold py-1">
                    {cardData.honorees}
                  </h2>
                </div>

                {/* Heartfelt Warm Welcome Message */}
                <p className="text-sm sm:text-base font-alexandria text-[#453E35] max-w-lg mx-auto leading-relaxed">
                  {cardData.message}
                </p>

                {/* Event Schedule & Location Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 max-w-xl mx-auto text-right">
                  {/* Date & Time */}
                  <div className="bg-[#F5EFE6] p-4 rounded-2xl border border-[#D4AF37]/25 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8DEC8] flex items-center justify-center shrink-0 text-[#8C6D23]">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-[#7A6F5D] block font-medium">التاريخ والموعد</span>
                      <p className="text-sm sm:text-base font-bold text-[#1E1B18] mt-0.5">
                        {cardData.eventDateHijri}
                      </p>
                      <p className="text-xs text-[#5C5346] mt-0.5">
                        الموافق {cardData.eventDateGregorian}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-[#8C6D23] mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{cardData.eventTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hall & City */}
                  <div className="bg-[#F5EFE6] p-4 rounded-2xl border border-[#D4AF37]/25 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8DEC8] flex items-center justify-center shrink-0 text-[#8C6D23]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-[#7A6F5D] block font-medium">مكان الحفل</span>
                      <p className="text-sm sm:text-base font-bold text-[#1E1B18] mt-0.5">
                        {cardData.hallName}
                      </p>
                      <p className="text-xs text-[#5C5346] mt-0.5">
                        {cardData.city}
                      </p>
                      {cardData.mapUrl && (
                        <a
                          href={cardData.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#8C6D23] hover:text-[#5A4512] font-semibold mt-1.5 underline decoration-[#8C6D23]/50 underline-offset-2"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>فتح الموقع على الخريطة</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Note / Dress code */}
                {cardData.note && (
                  <p className="text-xs text-[#8A7D69] italic pt-1">
                    * {cardData.note}
                  </p>
                )}

                {/* Action Bar: Calendar & Share */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={addToCalendar}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E1B18] text-[#FDFBF7] text-xs sm:text-sm font-semibold hover:bg-[#38332C] transition-all shadow-md active:scale-95"
                  >
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span>حفظ الموعد في التقويم</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F5EFE6] text-[#2B1B10] border border-[#D4AF37]/40 text-xs sm:text-sm font-semibold hover:bg-[#EDE3D2] transition-all shadow-sm active:scale-95"
                  >
                    <Share2 className="w-4 h-4 text-[#8C6D23]" />
                    <span>{copiedLink ? "تم نسخ الرابط!" : "مشاركة الدعوة"}</span>
                  </button>
                </div>

                {/* Smart RSVP Section (تأكيد الحضور الذكي) */}
                <div className="mt-8 pt-6 border-t border-[#D4AF37]/30 max-w-lg mx-auto">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-[#8C6D23]" />
                    <h4 className="text-sm sm:text-base font-bold text-[#1E1B18]">
                      تأكيد الحضور (RSVP)
                    </h4>
                  </div>

                  {rsvpStatus === "confirmed" ? (
                    <div className="bg-[#EBF7EE] border border-green-300 text-green-900 rounded-2xl p-4 text-center space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" />
                      <p className="text-sm font-bold">شكراً لك، تم تسجيل ردك بنجاح!</p>
                      <p className="text-xs text-green-700">نسعد بمشاركتكم فرحتنا وتواجدكم معنا.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-right bg-[#F5EFE6]/60 p-4 rounded-2xl border border-[#D4AF37]/20">
                      <div>
                        <label className="block text-xs font-semibold text-[#5C5346] mb-1">
                          اسم الضيف الكريم:
                        </label>
                        <input
                          type="text"
                          placeholder="الاسم الثلاثي..."
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-[#D4AF37]/40 bg-white text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#5C5346]">
                        <span>عدد المرافقين (بما فيهم أنت):</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setGuestCount(num)}
                              className={`w-7 h-7 rounded-full font-bold transition-all ${
                                guestCount === num
                                  ? "bg-[#8C6D23] text-white"
                                  : "bg-white border border-[#D4AF37]/30 text-[#5C5346]"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          disabled={!guestName.trim()}
                          onClick={() => handleRsvpSubmit("attending")}
                          className="flex-1 py-2.5 rounded-xl bg-[#246B52] text-white text-xs sm:text-sm font-semibold hover:bg-[#1C5541] disabled:opacity-50 transition-all shadow-sm"
                        >
                          أتشرف بالحضور
                        </button>
                        <button
                          type="button"
                          disabled={!guestName.trim()}
                          onClick={() => handleRsvpSubmit("apologizing")}
                          className="flex-1 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                        >
                          أعتذر بكل ود
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Close/Refold Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-[#8C6D23] hover:underline"
                  >
                    إعادة إغلاق المغلف
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
