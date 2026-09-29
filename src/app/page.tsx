"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HandcraftedLoveLetter, LoveLetterData } from "../components/experience/HandcraftedLoveLetter";
import { Edit3, Share2, Sparkles, Heart, Copy, Check } from "lucide-react";
import confetti from "canvas-confetti";

const DEFAULT_SAMPLE_DATA: LoveLetterData = {
  recipientName: "سارة",
  senderName: "أحمد",
  specialDate: "2023-11-14",
  specialDateTitle: "أول يوم التقت فيه أعيننا وتغير كل شيء",
  songTitle: "أجمل حب في الدنيا",
  songArtist: "أغنيتنا المفضلة",
  youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  youtubeVideoId: "dQw4w9WgXcQ",
  audioStartTime: 0,
  audioEndTime: 210,
  letterText: `حبيبتي ونور عيني..

منذ اللحظة التي دخلتِ فيها حياتي، تبدلت كل موازين الأيام، وأصبحت أرى الجمال في كل تفصيلة صغيرة تمرين بها. أنتِ لستِ مجرد شخص أحببته، أنتِ الأمان الذي كنت أبحث عنه طوال عمري، والراحة التي تلجأ إليها روحي في نهاية كل يوم.

كل ضحكة تخرج منكِ هي عيد بالنسبة لي، وكل كلمة دافئة تقولينها تسكن في قلبي كأنها أغنية لا تنتهي. شكراً لأنكِ كنتِ وما زلتِ أصدق وأجمل ما حدث لي.

أحبكِ بكل ما أوتيت من نبض، وما زال القادم معكِ هو الأجمل.`,
  memories: [
    {
      id: "mem-1",
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      caption: "أول قهوة شربناها سوا.. واليوم اللي عرفت فيه إنك الشخص الصح",
      date: "نوفمبر ٢٠٢٣",
      rotation: -2,
    },
    {
      id: "mem-2",
      imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
      caption: "يوم ما مشينا تحت المطر وضحكنا من قلوبنا",
      date: "يناير ٢٠٢٤",
      rotation: 2.5,
    },
    {
      id: "mem-3",
      imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      caption: "نظرتكِ اللي تخليني أنسى كل تعب الدنيا في ثانية",
      date: "مايو ٢٠٢٤",
      rotation: -1.5,
    },
  ],
  finalPromise: "أعدكِ أن أكون لكِ السند الذي لا يميل، والقلب الذي لا ينبض إلا بحبكِ، حتى آخر العمر.",
  passcode: "",
};

export default function HomePage() {
  const [data, setData] = useState<LoveLetterData>(DEFAULT_SAMPLE_DATA);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("my_intimate_love_letter");
        if (saved) {
          setData(JSON.parse(saved));
        }
      } catch (e) {}
    }
  }, []);

  const handleCopyShare = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF7597", "#C9455B", "#F5EAD9", "#FFFFFF"],
    });

    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/gift/preview`;
      if (navigator.share) {
        navigator.share({
          title: `رسالة خاصة لـ ${data.recipientName}`,
          text: `صنعت لكِ شيئاً خاصاً من قلبي... افتحيها بهدوء ❤️`,
          url: shareUrl,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#0E0A0C] relative">
      
      {/* Top Floating Control Bar for the Creator */}
      <div className="fixed top-4 left-4 right-4 z-40 max-w-xl mx-auto">
        <div className="bg-[#171114]/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#C5A059]/35 shadow-2xl flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-[#FAF5ED]/80 font-medium">
              رسالة {data.recipientName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/create"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-[#FAF5ED] font-semibold transition-all border border-white/10"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#E09F67]" />
              <span>تعديل التفاصيل</span>
            </Link>

            <button
              type="button"
              onClick={handleCopyShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8902A] text-[#1E1A16] text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "تم النسخ!" : "مشاركة الرابط"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* The Pure Love Letter Experience */}
      <HandcraftedLoveLetter data={data} isOwner={true} />

    </main>
  );
}
