"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HandcraftedLoveLetter, LoveLetterData } from "../../../components/experience/HandcraftedLoveLetter";

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

import { decodeLoveLetterFromUrlHash } from "../../../lib/letterCodec";

export default function GiftRecipientPage() {
  const params = useParams();
  const giftId = params?.id as string;
  const [data, setData] = useState<LoveLetterData>(DEFAULT_SAMPLE_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLetter() {
      if (typeof window !== "undefined") {
        try {
          // 1. Check URL Hash (e.g. #data=... or #d=...)
          const hash = window.location.hash;
          if (hash && hash.length > 5) {
            const decoded = await decodeLoveLetterFromUrlHash(hash);
            if (decoded && decoded.recipientName) {
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
            if (decoded && decoded.recipientName) {
              setData(decoded);
              setLoading(false);
              return;
            }
          }

          // 3. Fallback to LocalStorage (for local creator preview)
          const saved = localStorage.getItem("my_intimate_love_letter");
          if (saved) {
            setData(JSON.parse(saved));
          }
        } catch (e) {
          console.error("Failed to load love letter", e);
        }
      }
      setLoading(false);
    }

    loadLetter();
  }, [giftId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0A0C] flex items-center justify-center text-[#E09F67]">
        <div className="w-8 h-8 rounded-full border-2 border-[#C9455B] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Pure, clean, intimate experience for her
  return <HandcraftedLoveLetter data={data} isOwner={false} />;
}
