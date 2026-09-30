"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HandcraftedLoveLetter, LoveLetterData } from "../../../components/experience/HandcraftedLoveLetter";
import { decodeLoveLetterFromUrlHash } from "../../../lib/letterCodec";
import { Heart, AlertCircle, Sparkles } from "lucide-react";

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

export default function GiftRecipientPage() {
  const params = useParams();
  const giftId = (params?.id as string) || "";
  const [data, setData] = useState<LoveLetterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadLetter() {
      if (typeof window === "undefined") return;

      try {
        // 1. Check URL Hash (e.g. #d=... or #data=...)
        const hash = window.location.hash;
        if (hash && hash.length > 5) {
          const decoded = await decodeLoveLetterFromUrlHash(hash);
          if (decoded && (decoded.recipientName || decoded.senderName)) {
            setData(decoded);
            setLoading(false);
            return;
          }
        }

        // 2. Check Query Parameter (?d=... or ?data=...)
        const searchParams = new URLSearchParams(window.location.search);
        const queryData = searchParams.get("d") || searchParams.get("data");
        if (queryData) {
          const decoded = await decodeLoveLetterFromUrlHash(queryData);
          if (decoded && (decoded.recipientName || decoded.senderName)) {
            setData(decoded);
            setLoading(false);
            return;
          }
        }

        // 3. If ID is provided (and not special keywords like "preview" or "shared")
        if (giftId && giftId !== "preview" && giftId !== "shared") {
          // Attempt A: Fetch from local server API
          try {
            const apiRes = await fetch(`/api/gift?id=${encodeURIComponent(giftId)}`);
            if (apiRes.ok) {
              const resData = await apiRes.json();
              if (resData.success && resData.data) {
                setData(resData.data);
                setLoading(false);
                return;
              }
            }
          } catch (apiErr) {
            console.warn("Local API fetch failed, trying direct cloud:", apiErr);
          }

          // Attempt B: Fetch directly from Catbox cloud storage
          try {
            const cloudRes = await fetch(`https://files.catbox.moe/${giftId}.json`);
            if (cloudRes.ok) {
              const cloudData = await cloudRes.json();
              if (cloudData && (cloudData.recipientName || cloudData.senderName)) {
                setData(cloudData);
                setLoading(false);
                return;
              }
            }
          } catch (cloudErr) {
            console.warn("Direct cloud fetch failed:", cloudErr);
          }
        }

        // 4. Fallback to LocalStorage (for local creator preview on same device)
        const saved = localStorage.getItem("my_intimate_love_letter");
        if (saved) {
          try {
            const localData = JSON.parse(saved);
            if (localData && (localData.recipientName || localData.senderName)) {
              setData(localData);
              setLoading(false);
              return;
            }
          } catch (e) {}
        }

        // 5. If this is explicitly preview or demo mode
        if (giftId === "preview" || giftId === "demo") {
          setData(DEFAULT_SAMPLE_DATA);
          setLoading(false);
          return;
        }

        // If nothing matched and it's not preview, mark not found
        setNotFound(true);
      } catch (e) {
        console.error("Failed to load love letter:", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadLetter();
  }, [giftId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0A0C] flex flex-col items-center justify-center text-[#E09F67] gap-4 p-4 text-center">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-2 border-[#C9455B] border-t-transparent animate-spin" />
          <Heart className="w-6 h-6 text-[#FF7597] fill-current absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-ruqaa text-[#F5EAD9]">جارٍ تحضير رسالتكِ الخاصة بكل حب...</p>
          <p className="text-xs text-[#FAF5ED]/50 font-alexandria font-light">لحظات قليلة وتكتمل المفاجأة ❤️</p>
        </div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-[#0E0A0C] flex flex-col items-center justify-center text-[#FAF5ED] p-6 text-center font-alexandria">
        <div className="bg-[#171114] border border-[#C5A059]/30 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-ruqaa text-[#F5EAD9]">لم نتمكن من العثور على الرسالة</h2>
            <p className="text-xs text-[#FAF5ED]/60 leading-relaxed font-light">
              يبدو أن الرابط المستخدم غير مكتمل أو تم حذفه. يرجى التأكد من نسخ الرابط كاملاً من مرسل الهدية.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C9455B] hover:bg-[#8C1527] text-white text-xs font-bold transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>اصنع رسالة حب خاصة بك</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pure, clean, intimate experience for her
  return <HandcraftedLoveLetter data={data} isOwner={false} />;
}
