"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { GiftExperience } from "../../types/gift";
import { calculateTimeElapsed, formatArabicNumber } from "../../lib/utils";
import confetti from "canvas-confetti";
import { YouTubeAudioPlayer } from "../common/YouTubeAudioPlayer";
import {
  Heart,
  Music,
  Lock,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Film,
  Calendar,
  Layers,
  Edit3,
} from "lucide-react";

const RomanticScene = dynamic(
  () => import("../canvas/RomanticScene").then((mod) => mod.RomanticScene),
  { ssr: false }
);

interface RecipientPortalProps {
  gift: GiftExperience;
}

export function RecipientPortal({ gift }: RecipientPortalProps) {
  // Experience States
  const [unlocked, setUnlocked] = useState(!gift.isPasswordProtected);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // Time Lock State
  const [isTimeLocked, setIsTimeLocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Cinematic States
  const [started, setStarted] = useState(false); // Has clicked "افتحي هديتك ❤️"
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Elapsed Story Time
  const [elapsed, setElapsed] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Confetti trigger ref
  const confettiTriggered = useRef(false);

  // Check schedule countdown
  useEffect(() => {
    if (gift.hasScheduleDate && gift.scheduledUnlockAt) {
      const targetTime = new Date(gift.scheduledUnlockAt).getTime();
      const checkCountdown = () => {
        const now = Date.now();
        const diff = targetTime - now;
        if (diff > 0) {
          setIsTimeLocked(true);
          const s = Math.floor((diff / 1000) % 60);
          const m = Math.floor((diff / (1000 * 60)) % 60);
          const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          setTimeRemaining({ days: d, hours: h, minutes: m, seconds: s });
        } else {
          setIsTimeLocked(false);
        }
      };
      checkCountdown();
      const timer = setInterval(checkCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, [gift.hasScheduleDate, gift.scheduledUnlockAt]);

  // Elapsed story timer
  useEffect(() => {
    if (gift.hasStoryDate && gift.storyDate) {
      setElapsed(calculateTimeElapsed(gift.storyDate));
      const interval = setInterval(() => {
        setElapsed(calculateTimeElapsed(gift.storyDate!));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gift.hasStoryDate, gift.storyDate]);

  // Start Experience & Audio
  const handleOpenGift = () => {
    setStarted(true);
    if (gift.audioSourceType !== "youtube" && audioRef.current && gift.audioUrl) {
      audioRef.current.play().then(() => setAudioPlaying(true)).catch((e) => console.log(e));
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gift.password && passwordInput.trim() === gift.password.trim()) {
      setUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const triggerGrandConfetti = () => {
    if (!confettiTriggered.current) {
      confettiTriggered.current = true;
      confetti({
        particleCount: 140,
        spread: 110,
        origin: { y: 0.6 },
        colors: ["#F4B8C5", "#DFB15B", "#FF3355", "#FFFFFF"],
      });
    }
  };

  // 1. Password Lock Gate Screen
  if (!unlocked) {
    return (
      <div className="fixed inset-0 z-50 bg-obsidian-950 flex items-center justify-center p-6 text-center">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-md w-full border border-rose-romantic/20 space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-burgundy-900/80 border border-rose-romantic/30 mx-auto flex items-center justify-center text-rose-glow">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-readex text-champagne-100">
              هذه الهدية لك وحدك ❤️
            </h2>
            <p className="text-sm text-champagne-300/70">
              صنعها {gift.senderName} خصيصاً لك، يرجى إدخال كلمة السر لفتحها
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="أدخل كلمة السر..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl glass-input text-center text-champagne-100 text-base"
              autoFocus
            />
            {passwordError && (
              <p className="text-xs text-rose-glow font-medium animate-shake">
                كلمة السر غير صحيحة، حاول مجدداً ❤️
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-burgundy-700 to-rose-glow text-white font-semibold text-sm shadow-xl shadow-burgundy-950/60 hover:scale-102 active:scale-98 transition-all"
            >
              فتح الهدية 🔐
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Countdown Gate Screen
  if (isTimeLocked) {
    return (
      <div className="fixed inset-0 z-50 bg-obsidian-950 flex items-center justify-center p-6 text-center">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-lg w-full border border-rose-romantic/20 space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-burgundy-900/80 border border-rose-romantic/30 mx-auto flex items-center justify-center text-gold-glow">
            <Clock className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-readex text-champagne-100">
              هناك هدية خاصة تنتظرك...
            </h2>
            <p className="text-sm text-champagne-300/70">
              أعدها {gift.senderName} وستفتح تلقائياً في موعدها المحدد
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 pt-4">
            <div className="bg-black/50 p-3 rounded-2xl border border-white/5">
              <span className="block text-2xl font-bold text-champagne-100">
                {formatArabicNumber(timeRemaining.days)}
              </span>
              <span className="text-xs text-champagne-300/60">أيام</span>
            </div>
            <div className="bg-black/50 p-3 rounded-2xl border border-white/5">
              <span className="block text-2xl font-bold text-champagne-100">
                {formatArabicNumber(timeRemaining.hours)}
              </span>
              <span className="text-xs text-champagne-300/60">ساعات</span>
            </div>
            <div className="bg-black/50 p-3 rounded-2xl border border-white/5">
              <span className="block text-2xl font-bold text-champagne-100">
                {formatArabicNumber(timeRemaining.minutes)}
              </span>
              <span className="text-xs text-champagne-300/60">دقائق</span>
            </div>
            <div className="bg-black/50 p-3 rounded-2xl border border-white/5">
              <span className="block text-2xl font-bold text-rose-glow">
                {formatArabicNumber(timeRemaining.seconds)}
              </span>
              <span className="text-xs text-champagne-300/60">ثواني</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Cinematic Prologue Black Screen (Before clicking "افتحي هديتك ❤️")
  if (!started) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center cursor-pointer">
        <div className="space-y-8 max-w-md w-full animate-fadeIn">
          <p className="text-sm sm:text-base text-champagne-300/60 tracking-widest font-light">
            هناك شخص صنع لك شيئاً مميزاً...
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold font-readex text-champagne-100 leading-relaxed text-glow">
            هذه الهدية صُنعت خصيصاً لكِ ❤️
          </h2>

          <div className="py-4">
            <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-glow to-champagne-100 font-readex">
              {gift.recipientName}
            </span>
          </div>

          <button
            onClick={handleOpenGift}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-burgundy-700 via-rose-romantic to-rose-glow text-white font-bold text-lg shadow-2xl shadow-burgundy-950/80 hover:scale-105 active:scale-95 transition-all border border-rose-romantic/30 group"
          >
            <span>افتحي هديتك ❤️</span>
            <Heart className="w-5 h-5 fill-current text-white animate-bounce" />
          </button>
        </div>
      </div>
    );
  }

  // 4. Full Cinematic Interactive Experience (Post-Unveil)
  return (
    <div className="relative min-h-screen w-full bg-obsidian-950 text-champagne-100">
      {/* Background Audio (Standard HTML5 Audio) */}
      {gift.audioSourceType !== "youtube" && gift.audioUrl && (
        <audio
          ref={audioRef}
          src={gift.audioUrl}
          loop
          onEnded={() => setAudioPlaying(false)}
        />
      )}

      {/* Floating Audio Controller */}
      {gift.audioSourceType === "youtube" && gift.youtubeVideoId ? (
        <div className="fixed top-6 left-6 z-50 max-w-xs sm:max-w-sm">
          <YouTubeAudioPlayer
            videoId={gift.youtubeVideoId}
            startTime={gift.audioStartTime}
            endTime={gift.audioEndTime}
            title={gift.audioTitle || "أغنيتنا المفضلة"}
            artist={gift.audioArtist || "مقطع اليوتيوب"}
            autoPlay={true}
          />
        </div>
      ) : gift.audioUrl ? (
        <div className="fixed top-6 left-6 z-50 flex items-center gap-2 glass-panel py-2 px-4 rounded-full border border-rose-romantic/20 shadow-lg">
          <button
            onClick={() => {
              if (audioRef.current) {
                if (audioPlaying) {
                  audioRef.current.pause();
                  setAudioPlaying(false);
                } else {
                  audioRef.current.play();
                  setAudioPlaying(true);
                }
              }
            }}
            className="text-rose-glow hover:text-white transition-colors"
            title={audioPlaying ? "إيقاف مؤقت" : "تشغيل الموسيقى"}
          >
            {audioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <span className="text-xs text-champagne-200 truncate max-w-[120px]">
            {gift.audioTitle || "أغنيتنا"}
          </span>

          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }
            }}
            className="text-champagne-300/70 hover:text-white transition-colors ml-1"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      ) : null}

      {/* Floating Quick Edit Button (For Creator Convenience) */}
      <div className="fixed top-6 right-6 z-50">
        <Link
          href="/create"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel text-xs text-rose-glow hover:text-white hover:border-rose-romantic/40 transition-all border border-rose-romantic/20 shadow-lg"
          title="تعديل تفاصيل الهدية"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>تعديل الهدية</span>
        </Link>
      </div>

      {/* 3D Glass Heart Background Canvas with Selectable Visual Effects */}
      <div className="fixed inset-0 z-0">
        <RomanticScene
          theme={gift.theme}
          effects={gift.visualEffects || ["petals", "stardust"]}
          scale={1.25}
          showPetals={true}
        />
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      </div>

      {/* Scroll-driven Storytelling Content Layer */}
      <div className="relative z-10 space-y-36 pb-32">
        {/* Stage 1: Hero Opening */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-2xl space-y-6 animate-fadeIn">
            <span className="text-sm tracking-widest text-rose-glow font-medium">
              كل قصة حب لها بداية...
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold font-readex leading-tight text-glow">
              وقصتنا بدأت بكِ يا {gift.recipientName} ❤️
            </h1>
            <p className="text-sm sm:text-base text-champagne-300/70 font-light">
              هذه الرحلة صُممت خصيصاً لكِ من قِبل {gift.senderName}
            </p>
            <div className="pt-8 animate-bounce text-xs text-champagne-300/50 flex flex-col items-center gap-2">
              <span>انزلي للأسفل لتكتشفي هديتك</span>
              <span className="w-1 h-6 rounded-full bg-rose-glow/60" />
            </div>
          </div>
        </section>

        {/* Stage 2: Our Story & Live Counter */}
        {gift.hasStoryDate && gift.storyDate && (
          <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
            <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-3xl w-full border border-rose-romantic/25 space-y-8 shadow-2xl">
              <div className="space-y-2">
                <span className="text-xs text-rose-glow uppercase tracking-wider flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 text-gold-glow" />
                  <span>قصتنا ❤️</span>
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold font-readex text-champagne-100">
                  {gift.storyDateType || "منذ أن التقينا"}
                </h2>
                <p className="text-xs sm:text-sm text-champagne-300/70">
                  تاريخ مميز غيّر مجرى كل شيء في حياتنا
                </p>
              </div>

              {/* Live Counter Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                  <span className="block text-2xl sm:text-3xl font-bold text-champagne-100">
                    {formatArabicNumber(elapsed.years)}
                  </span>
                  <span className="text-xs text-champagne-300/60">سنوات</span>
                </div>
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                  <span className="block text-2xl sm:text-3xl font-bold text-champagne-100">
                    {formatArabicNumber(elapsed.months)}
                  </span>
                  <span className="text-xs text-champagne-300/60">أشهر</span>
                </div>
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                  <span className="block text-2xl sm:text-3xl font-bold text-champagne-100">
                    {formatArabicNumber(elapsed.days)}
                  </span>
                  <span className="text-xs text-champagne-300/60">أيام</span>
                </div>
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                  <span className="block text-2xl sm:text-3xl font-bold text-champagne-100">
                    {formatArabicNumber(elapsed.hours)}
                  </span>
                  <span className="text-xs text-champagne-300/60">ساعات</span>
                </div>
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                  <span className="block text-2xl sm:text-3xl font-bold text-champagne-100">
                    {formatArabicNumber(elapsed.minutes)}
                  </span>
                  <span className="text-xs text-champagne-300/60">دقائق</span>
                </div>
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                  <span className="block text-2xl sm:text-3xl font-bold text-rose-glow">
                    {formatArabicNumber(elapsed.seconds)}
                  </span>
                  <span className="text-xs text-champagne-300/60">ثواني</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Stage 3: Memories 3D Gallery */}
        {gift.memories && gift.memories.length > 0 && (
          <section className="min-h-[90vh] flex flex-col items-center justify-center px-6">
            <div className="max-w-5xl w-full space-y-12">
              <div className="text-center space-y-3">
                <span className="text-xs text-rose-glow uppercase tracking-wider">
                  صندوق الذكريات 📸
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold font-readex text-champagne-100">
                  ذكرياتنا التي لا تموت
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gift.memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="glass-panel p-4 rounded-3xl border border-rose-romantic/20 shadow-2xl hover:scale-103 transition-transform duration-500 group"
                  >
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 mb-4 border border-white/10 relative">
                      <img
                        src={mem.url}
                        alt={mem.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      />
                      {mem.date && (
                        <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-[10px] text-champagne-200 px-2 py-0.5 rounded-full">
                          {mem.date}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-champagne-100 mb-1">
                      {mem.title}
                    </h3>
                    <p className="text-xs text-champagne-300/70 leading-relaxed font-light">
                      {mem.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stage 4: The Love Letter (Cinematic Reveal) */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="glass-panel p-8 sm:p-14 rounded-3xl max-w-3xl w-full border border-rose-romantic/30 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="space-y-2">
              <span className="text-xs text-rose-glow uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-glow" />
                <span>رسالة من القلب ❤️</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-readex text-champagne-100">
                إليكِ يا {gift.recipientName}...
              </h2>
            </div>

            <div className="py-4">
              <p className="text-lg sm:text-2xl font-readex leading-loose text-champagne-100/90 whitespace-pre-line font-light text-glow">
                {gift.loveLetter}
              </p>
            </div>

            <div className="pt-6 border-t border-rose-romantic/15 flex justify-end">
              <div className="text-left font-readex">
                <span className="text-xs text-champagne-300/60 block">المخلص دائماً،</span>
                <span className="text-lg font-bold text-rose-glow">{gift.senderName} ❤️</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stage 5: Things I Love About You */}
        {gift.traits && gift.traits.length > 0 && (
          <section className="min-h-[80vh] flex flex-col items-center justify-center px-6">
            <div className="max-w-4xl w-full space-y-12">
              <div className="text-center space-y-3">
                <span className="text-xs text-rose-glow uppercase tracking-wider">
                  أسباب عشقي ❤️
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold font-readex text-champagne-100">
                  أشياء أحبها فيك
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {gift.traits.map((t) => (
                  <div
                    key={t.id}
                    className="glass-panel p-6 rounded-3xl border border-rose-romantic/20 space-y-3 hover:border-rose-glow/40 transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 text-rose-glow font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-gold-glow" />
                      <span>{t.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-champagne-300/80 leading-relaxed font-light">
                      {t.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stage 6: Personal Video (Optional) */}
        {gift.videoUrl && (
          <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
            <div className="glass-panel p-6 sm:p-10 rounded-3xl max-w-3xl w-full border border-rose-romantic/25 space-y-6 shadow-2xl">
              <div className="space-y-1">
                <span className="text-xs text-rose-glow uppercase tracking-wider">
                  رسالة فيديو خاصة 🎬
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold font-readex text-champagne-100">
                  شيء أريدكِ أن تشاهديه
                </h2>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                <video src={gift.videoUrl} controls className="w-full h-full object-cover" />
              </div>
            </div>
          </section>
        )}

        {/* Stage 7: Grand Climax & Emotional Finale */}
        <section
          onMouseEnter={triggerGrandConfetti}
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="max-w-2xl space-y-8 animate-fadeIn">
            <span className="text-sm tracking-widest text-champagne-300/60 font-light">
              بعد كل هذه الذكريات...
            </span>

            <h2 className="text-3xl sm:text-5xl font-bold font-readex leading-snug text-glow">
              لو عاد بي الزمن إلى البداية...
              <br />
              <span className="text-rose-glow">لاخترتكِ من جديد. كل مرة ❤️</span>
            </h2>

            <div className="py-8">
              <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full glass-panel border border-rose-romantic/40 text-xl sm:text-3xl font-bold font-readex text-champagne-100 shadow-2xl">
                <span>{gift.senderName}</span>
                <Heart className="w-6 h-6 text-rose-glow fill-rose-glow animate-pulse" />
                <span>{gift.recipientName}</span>
              </div>
              <p className="text-xs text-champagne-300/60 mt-3 font-light">إلى الأبد...</p>
            </div>

            <p className="text-xl sm:text-2xl font-readex text-gold-glow font-medium text-glow">
              "{gift.finalPledge || "أحبكِ إلى الأبد ❤️"}"
            </p>

            {/* Direct Romantic Reply Button */}
            <div className="pt-6">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `فتحت هديتك التي صنعتها لي... شكراً لك من أعماق قلبي، أحبك جداً ❤️`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-burgundy-800 to-rose-glow text-white font-semibold text-sm shadow-xl shadow-burgundy-950/70 hover:scale-105 active:scale-95 transition-all border border-rose-romantic/30"
              >
                <span>الرد على {gift.senderName} عبر واتساب ❤️</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
