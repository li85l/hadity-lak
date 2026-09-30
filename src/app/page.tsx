"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HandcraftedLoveLetter, LoveLetterData } from "../components/experience/HandcraftedLoveLetter";
import { Edit3, Share2, Sparkles, Heart, Copy, Check, MessageCircle, ExternalLink, X } from "lucide-react";
import confetti from "canvas-confetti";
import { encodeLoveLetterToUrlHash } from "../lib/letterCodec";

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
  const [isSharing, setIsSharing] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

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

  const handleCopyShare = async () => {
    setIsSharing(true);
    try {
      // 1. Save to server to get permanent short ID
      let shortId = "";
      try {
        const apiRes = await fetch("/api/gift", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (apiRes.ok) {
          const resData = await apiRes.json();
          if (resData.id) {
            shortId = resData.id;
          }
        }
      } catch (err) {
        console.warn("API gift save error:", err);
      }

      // 2. Generate fallback hash
      const hashPayload = await encodeLoveLetterToUrlHash(data);

      // 3. Create clean short link
      let url = "";
      if (shortId) {
        url = `${window.location.origin}/gift/${shortId}`;
      } else {
        url = `${window.location.origin}/gift/shared#d=${hashPayload}`;
      }

      setShareUrl(url);
      setShareModalOpen(true);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF7597", "#C9455B", "#F5EAD9", "#FFFFFF"],
      });

      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error("Failed to share from home page:", e);
    } finally {
      setIsSharing(false);
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
              disabled={isSharing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8902A] text-[#1E1A16] text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{isSharing ? "جارٍ التجهيز..." : copied ? "تم النسخ!" : "مشاركة الرابط"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* The Pure Love Letter Experience */}
      <HandcraftedLoveLetter data={data} isOwner={true} />

      {/* Share & Copy Link Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#171114] border border-[#C5A059]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-right">
            {/* Close Button */}
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF5ED] flex items-center justify-center transition-all"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#C9455B]/20 border border-[#C9455B]/40 flex items-center justify-center text-[#FF7597]">
                <Heart className="w-7 h-7 fill-current animate-pulse" />
              </div>
              <h3 className="font-ruqaa text-2xl font-bold text-[#F5EAD9]">
                رابط هديتكِ جاهز للإرسال! ❤️
              </h3>
              <p className="text-xs text-[#FAF5ED]/70 font-light leading-relaxed">
                رابط قصير وآمن يحتوي على كامل تفاصيلك، يعمل بسلاسة على هاتفها وأي متصفح!
              </p>
            </div>

            {/* Link Box */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/50 border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="bg-transparent text-xs text-[#FAF5ED]/80 px-2 py-1 outline-none w-full text-left font-mono truncate"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(shareUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C9455B] text-white text-xs font-bold hover:bg-[#8C1527] transition-all flex items-center gap-1.5 shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "تم النسخ!" : "نسخ"}</span>
                </button>
              </div>
              {copied && (
                <p className="text-[11px] text-green-400 text-center font-medium">
                  ✓ تم نسخ الرابط القصير بنجاح، يمكنك الآن لصقه وإرساله لها في واتساب أو أي مكان!
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[#FAF5ED] text-xs font-semibold transition-all border border-white/10"
              >
                <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
                <span>تجربة الرابط</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`صنعت لكِ شيئاً خاصاً من قلبي... افتحيها بهدوء ❤️\n${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-bold transition-all border border-[#25D366]/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>إرسال عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
