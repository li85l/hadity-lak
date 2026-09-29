"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Calendar, 
  Clock, 
  Sparkles, 
  Heart, 
  Music, 
  Camera, 
  Disc,
  Lock,
  ChevronDown
} from "lucide-react";
import confetti from "canvas-confetti";
import { YouTubeAudioPlayer } from "../common/YouTubeAudioPlayer";
import { calculateTimeElapsed, formatArabicNumber } from "../../lib/utils";

export interface LoveLetterMemory {
  id: string;
  imageUrl: string;
  caption: string;
  date?: string;
  rotation?: number; // tilt angle for polaroid feel (-4 to 4)
}

export type LetterFontType = 
  | 'ruqaa' 
  | 'tajawal' 
  | 'amiri' 
  | 'noto' 
  | 'alexandria' 
  | 'cairo' 
  | 'marhey';

export type LetterFontSizeType = 'sm' | 'md' | 'lg' | 'xl';

export const LETTER_FONTS = [
  { id: 'ruqaa', name: 'خط الرقعة اليدوي', fontClass: 'font-ruqaa', sample: 'حبيبتي ونور عيني' },
  { id: 'tajawal', name: 'خط تجوال الناعم', fontClass: 'font-tajawal', sample: 'أنتِ كل حياتي وفرحي' },
  { id: 'amiri', name: 'خط النسخ الكلاسيكي (أميري)', fontClass: 'font-amiri', sample: 'أدامكِ الله لقلبي' },
  { id: 'noto', name: 'خط نوتو الأدبي', fontClass: 'font-noto', sample: 'حبكِ سكن في أعماقي' },
  { id: 'alexandria', name: 'خط الإسكندرية الأنيق', fontClass: 'font-alexandria', sample: 'كل دقيقة معكِ حكاية' },
  { id: 'cairo', name: 'خط القاهرة الواضح', fontClass: 'font-cairo', sample: 'ضحكتكِ وحدها تكفيني' },
  { id: 'marhey', name: 'خط مارحي الشاعري', fontClass: 'font-marhey', sample: 'دمتِ لي فرحاً لا ينتهي' },
] as const;

export interface LoveLetterData {
  recipientName: string;
  senderName: string;
  specialDate: string; // e.g. "2023-10-15"
  specialDateTitle?: string; // e.g. "أول يوم التقت فيه أعيننا"
  songTitle: string;
  songArtist: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  audioStartTime?: number;
  audioEndTime?: number;
  audioUrl?: string; // MP3 fallback
  letterText: string;
  letterFont?: LetterFontType;
  letterFontSize?: LetterFontSizeType;
  memories: LoveLetterMemory[];
  finalPromise: string;
  passcode?: string;
}

interface HandcraftedLoveLetterProps {
  data: LoveLetterData;
  isOwner?: boolean;
}

export function HandcraftedLoveLetter({ data, isOwner = false }: HandcraftedLoveLetterProps) {
  // Experience States
  const [unlocked, setUnlocked] = useState(!data.passcode);
  const [enteredPass, setEnteredPass] = useState("");
  const [passError, setPassError] = useState(false);

  // Unfolding Envelope State
  const [isOpened, setIsOpened] = useState(false);
  const [isVinylSpinning, setIsVinylSpinning] = useState(true);

  // Time elapsed counter
  const [elapsed, setElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const letterRef = useRef<HTMLDivElement>(null);

  // Calculate live elapsed story time
  useEffect(() => {
    if (data.specialDate) {
      setElapsed(calculateTimeElapsed(data.specialDate));
      const interval = setInterval(() => {
        setElapsed(calculateTimeElapsed(data.specialDate));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [data.specialDate]);

  // Handle Envelope Open
  const handleOpenEnvelope = () => {
    setIsOpened(true);
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#E09F67", "#C9455B", "#F5E6D3", "#FFFFFF"],
    });

    // Smooth scroll down to letter after opening
    setTimeout(() => {
      letterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 600);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.passcode && enteredPass.trim() === data.passcode.trim()) {
      setUnlocked(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  // Passcode Protection Screen
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#0C090A] text-[#FAF4EB] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#171214] border border-[#C5A059]/30 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-[#2B0E14] border border-[#8C1527]/40 flex items-center justify-center mx-auto text-[#FF7597]">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-ruqaa font-bold text-[#F5EAD9]">
              رسالة خاصة لـ {data.recipientName}
            </h3>
            <p className="text-xs text-[#FAF4EB]/60 font-alexandria">
              كُتبت هذه الرسالة بحب وسرية، يرجى إدخال كلمة السر لفتحها
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="أدخل كلمة السر..."
              value={enteredPass}
              onChange={(e) => setEnteredPass(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-[#C5A059]/40 text-center text-sm text-[#FAF4EB] outline-none focus:border-[#C5A059]"
              autoFocus
            />
            {passError && (
              <p className="text-xs text-rose-400 font-medium">كلمة السر غير صحيحة، حاولي مجدداً</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#8C1527] to-[#C9455B] text-white text-xs font-bold shadow-lg hover:scale-[1.02] active:scale-98 transition-all"
            >
              فتح الرسالة
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0A0C] text-[#FAF5ED] selection:bg-[#C9455B] selection:text-white font-alexandria relative overflow-x-hidden">
      
      {/* Warm Ambient Candlelight Atmosphere (No tacky neons) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-[#611624]/20 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 left-1/5 w-[500px] h-[500px] bg-[#783E1A]/15 rounded-full blur-[180px]" />
        <div className="absolute bottom-10 right-1/3 w-[400px] h-[400px] bg-[#42121E]/25 rounded-full blur-[150px]" />
      </div>

      {/* Floating Retro Song Player (Shows only when opened and has video/audio) */}
      {isOpened && data.youtubeVideoId && (
        <div className="fixed top-4 left-4 right-4 sm:right-auto sm:left-6 z-50 max-w-sm mx-auto sm:mx-0">
          <div className="bg-[#171214]/90 backdrop-blur-md rounded-2xl p-2.5 border border-[#C5A059]/30 shadow-2xl">
            <YouTubeAudioPlayer
              videoId={data.youtubeVideoId}
              startTime={data.audioStartTime || 0}
              endTime={data.audioEndTime || 240}
              title={data.songTitle}
              artist={data.songArtist}
              autoPlay={true}
              className="!bg-transparent !p-0 !border-0"
            />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 sm:py-20 space-y-16 sm:space-y-24">

        {/* 1. The Sealed Vintage Envelope Stage */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center">
          
          <div className="space-y-4 mb-8">
            <span className="text-xs tracking-widest text-[#E09F67] uppercase font-light">
              رسالة خاصة جداً
            </span>
            <h1 className="text-3xl sm:text-5xl font-ruqaa font-bold text-[#FAF5ED] leading-tight">
              إلى مَن سَكَنتِ القَلْب.. <br />
              <span className="text-[#E8A598] font-ruqaa">
                {data.recipientName}
              </span>
            </h1>
          </div>

          {/* The Physical Envelope */}
          <div className="w-full max-w-lg mx-auto">
            {!isOpened ? (
              <div 
                onClick={handleOpenEnvelope}
                className="cursor-pointer group relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-b from-[#241318] via-[#1B0E12] to-[#12080B] border border-[#C5A059]/35 shadow-2xl transition-all duration-500 hover:scale-[1.01]"
              >
                {/* Subtle paper grain & gold stitching */}
                <div className="absolute inset-3 border border-[#C5A059]/20 rounded-2xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center justify-center space-y-6 py-6 sm:py-10">
                  
                  {/* Handwritten tag */}
                  <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#E5D7C5]/80 font-ruqaa">
                    كُتبت لكِ بصدق ومن القلب
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-[#FAF5ED]/50 font-light">موجّهة إلى:</p>
                    <h2 className="text-2xl sm:text-3xl font-ruqaa font-bold text-[#F5EAD9]">
                      {data.recipientName}
                    </h2>
                  </div>

                  {/* Tactile Wax Seal Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleOpenEnvelope}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full wax-seal-button flex flex-col items-center justify-center text-white shadow-2xl border border-white/20 group-hover:scale-105 active:scale-95 transition-all"
                    >
                      <Heart className="w-6 h-6 fill-current text-rose-200" />
                      <span className="text-[10px] font-bold font-alexandria mt-1 opacity-90">
                        انقري للفتح
                      </span>
                    </button>
                  </div>

                  <p className="text-xs text-[#FAF5ED]/40 font-light pt-2 flex items-center gap-1.5">
                    <span>اضغطي على الختم لتنفتح الرسالة والموسيقى</span>
                  </p>
                </div>
              </div>
            ) : (
              /* Opened Notice */
              <div className="text-center py-4 animate-fadeIn">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2B0E14] border border-[#8C1527]/40 text-xs text-[#E8A598]">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>انفتحت الرسالة... انزلي برقة للأسفل</span>
                </span>
              </div>
            )}
          </div>

          {/* Smooth scroll down arrow */}
          {isOpened && (
            <div className="pt-10 animate-bounce text-xs text-[#FAF5ED]/50 flex flex-col items-center gap-2">
              <span>اقرئي ما كتبته لكِ</span>
              <ChevronDown className="w-4 h-4 text-[#E09F67]" />
            </div>
          )}
        </section>

        {/* 2. Revealed Content (Letter, Vinyl, Moments) */}
        {isOpened && (
          <div ref={letterRef} className="space-y-20 sm:space-y-28 animate-fadeIn transition-all duration-700">
            
            {/* The Vintage Vinyl Player & Song Presentation */}
            <section className="bg-[#171114] p-6 sm:p-10 rounded-3xl border border-[#C5A059]/25 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-center sm:text-right">
                
                {/* Rotating Vinyl Record Graphic */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0">
                  <div className={`w-full h-full rounded-full bg-[#0D0B0C] border-4 border-[#22191C] shadow-2xl flex items-center justify-center relative ${isVinylSpinning ? "animate-[spin_10s_linear_infinite]" : ""}`}>
                    {/* Vinyl Grooves */}
                    <div className="absolute inset-2 rounded-full border border-white/5" />
                    <div className="absolute inset-5 rounded-full border border-white/5" />
                    <div className="absolute inset-8 rounded-full border border-white/5" />
                    <div className="absolute inset-11 rounded-full border border-white/5" />
                    
                    {/* Vinyl Center Label */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#8C1527] to-[#C9455B] flex items-center justify-center text-white border-2 border-[#FAF5ED]/30">
                      <Music className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Song Details */}
                <div className="space-y-2 flex-1">
                  <span className="text-xs text-[#E09F67] uppercase tracking-wider block font-medium">
                    🎵 الأغنية التي تذكرني بكِ دائماً
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-ruqaa text-[#FAF5ED]">
                    {data.songTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAF5ED]/60 font-light">
                    {data.songArtist}
                  </p>
                  <p className="text-xs text-[#E8A598]/80 italic pt-1">
                    «كل نغمة في هذه الأغنية تحمل صوتك وملامحك الجميلة»
                  </p>
                </div>
              </div>
            </section>

            {/* The Special Journey Date (Our Story) */}
            {data.specialDate && (
              <section className="bg-[#171114] p-6 sm:p-10 rounded-3xl border border-[#C5A059]/25 text-center space-y-6 shadow-2xl">
                <div className="space-y-2">
                  <span className="text-xs text-[#E09F67] uppercase tracking-widest block font-medium">
                    تاريخ لا يُنسى
                  </span>
                  <h3 className="text-xl sm:text-3xl font-ruqaa font-bold text-[#F5EAD9]">
                    {data.specialDateTitle || "منذ أن أشرقتِ في حياتي"}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAF5ED]/60 font-light">
                    {data.specialDate}
                  </p>
                </div>

                {/* Poetic Time Journey Display */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 max-w-xl mx-auto pt-2">
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <span className="block text-xl sm:text-2xl font-bold text-[#FAF5ED]">
                      {formatArabicNumber(elapsed.years)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#FAF5ED]/50">سنوات</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <span className="block text-xl sm:text-2xl font-bold text-[#FAF5ED]">
                      {formatArabicNumber(elapsed.months)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#FAF5ED]/50">أشهر</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <span className="block text-xl sm:text-2xl font-bold text-[#FAF5ED]">
                      {formatArabicNumber(elapsed.days)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#FAF5ED]/50">أيام</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <span className="block text-xl sm:text-2xl font-bold text-[#FAF5ED]">
                      {formatArabicNumber(elapsed.hours)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#FAF5ED]/50">ساعات</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <span className="block text-xl sm:text-2xl font-bold text-[#FAF5ED]">
                      {formatArabicNumber(elapsed.minutes)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#FAF5ED]/50">دقائق</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <span className="block text-xl sm:text-2xl font-bold text-[#E8A598]">
                      {formatArabicNumber(elapsed.seconds)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#FAF5ED]/50">ثوانٍ</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#FAF5ED]/70 font-ruqaa pt-2 leading-relaxed">
                  «وما زالت كل دقيقة معكِ تسوى عمراً كاملاً»
                </p>
              </section>
            )}

            {/* The Handwritten Love Letter on Natural Cotton Paper */}
            <section className="relative">
              {/* Paper Texture Card */}
              <div className="bg-[#FAF6EE] text-[#2C1D18] p-8 sm:p-14 rounded-3xl shadow-2xl border border-[#D9C4A6] relative overflow-hidden">
                
                {/* Vintage Letter Border Line */}
                <div className="absolute inset-4 sm:inset-6 border border-[#2C1D18]/15 rounded-2xl pointer-events-none" />

                {/* Letter Header */}
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between border-b border-[#2C1D18]/15 pb-4">
                    <span className="text-xs text-[#8C6D23] font-ruqaa font-semibold">
                      إلى أغلى ما أملك في الوجود
                    </span>
                    <span className="text-xs text-[#2C1D18]/50 font-mono">
                      {new Date().toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  {/* Letter Salutation */}
                  <h2 className={`text-2xl sm:text-3xl ${data.letterFont ? `font-${data.letterFont}` : 'font-ruqaa'} font-bold text-[#2C1D18]`}>
                    حبيبتي الغالية {data.recipientName}..
                  </h2>

                  {/* The Actual Heartfelt Letter Body with dynamic font and size */}
                  <div className={`${data.letterFont ? `font-${data.letterFont}` : 'font-ruqaa'} ${
                    data.letterFontSize === 'sm' ? 'text-base sm:text-lg leading-[2.2]' :
                    data.letterFontSize === 'lg' ? 'text-xl sm:text-2xl leading-[2.6]' :
                    data.letterFontSize === 'xl' ? 'text-2xl sm:text-3xl leading-[2.8]' :
                    'text-lg sm:text-xl leading-[2.4]'
                  } text-[#2C1D18] whitespace-pre-line tracking-wide`}>
                    {data.letterText}
                  </div>

                  {/* Signature */}
                  <div className="pt-8 border-t border-[#2C1D18]/15 text-left space-y-1">
                    <span className={`text-xs text-[#8C6D23] ${data.letterFont ? `font-${data.letterFont}` : 'font-ruqaa'} block`}>
                      المحب لكِ حتى آخر نفس..
                    </span>
                    <p className={`text-xl sm:text-2xl ${data.letterFont ? `font-${data.letterFont}` : 'font-ruqaa'} font-bold text-[#2C1D18]`}>
                      {data.senderName}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Moments & Memories (Realistic Polaroid Scrapbook) */}
            {data.memories && data.memories.length > 0 && (
              <section className="space-y-8">
                <div className="text-center space-y-2">
                  <span className="text-xs uppercase tracking-widest text-[#E09F67] font-medium">
                    لحظات لا تغيب عن بالي
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-ruqaa font-bold text-[#FAF5ED]">
                    ذكرياتنا الجميلة معاً
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAF5ED]/60 font-light">
                    كل صورة هنا خلفها حكاية لا تفارق قلبي
                  </p>
                </div>

                {/* Polaroids Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
                  {data.memories.map((mem, index) => {
                    const rotations = [-2.5, 2, -1.5, 3, -3, 1.5];
                    const rot = mem.rotation ?? rotations[index % rotations.length];

                    return (
                      <div
                        key={mem.id}
                        style={{ transform: `rotate(${rot}deg)` }}
                        className="bg-[#FCFBF7] text-[#221A15] p-3 sm:p-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 hover:rotate-0 transition-all duration-300 group border border-black/5"
                      >
                        {/* Washi Tape Graphic */}
                        <div className="w-16 h-4 bg-[#E8C574]/40 mx-auto -mt-5 mb-2 rounded-sm shadow-sm backdrop-blur-xs" />

                        {/* Photo */}
                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#EAE2D5] mb-3 relative">
                          <img
                            src={mem.imageUrl}
                            alt={mem.caption}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Handwritten Caption */}
                        <div className="px-1 text-center space-y-1">
                          <p className="font-ruqaa text-base sm:text-lg text-[#221A15] leading-snug">
                            {mem.caption}
                          </p>
                          {mem.date && (
                            <span className="text-[11px] text-[#221A15]/50 font-sans block">
                              {mem.date}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Final Heartfelt Promise */}
            {data.finalPromise && (
              <section className="bg-gradient-to-b from-[#241117] to-[#14080D] p-8 sm:p-12 rounded-3xl border border-[#8C1527]/40 text-center space-y-4 shadow-2xl">
                <Heart className="w-8 h-8 text-[#FF7597] fill-current mx-auto animate-pulse" />
                <h3 className="text-xl sm:text-2xl font-ruqaa font-bold text-[#F5EAD9]">
                  وعدي لكِ
                </h3>
                <p className="text-base sm:text-lg font-ruqaa text-[#FAF5ED]/90 max-w-lg mx-auto leading-relaxed">
                  «{data.finalPromise}»
                </p>
                <div className="pt-2 text-xs text-[#E09F67] font-ruqaa">
                  — {data.senderName} ❤️
                </div>
              </section>
            )}

          </div>
        )}

      </div>

      {/* Intimate Footer */}
      <footer className="relative z-10 py-8 text-center text-xs text-[#FAF5ED]/30 border-t border-white/5 font-ruqaa">
        <p>صُنعت لكِ أنتِ وحدكِ.. بكل ما يحمله قلبي من حب ❤️</p>
      </footer>

    </div>
  );
}
