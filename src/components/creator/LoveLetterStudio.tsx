"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  HandcraftedLoveLetter, 
  LoveLetterData, 
  LoveLetterMemory, 
  LETTER_FONTS, 
  LetterFontType, 
  LetterFontSizeType 
} from "../experience/HandcraftedLoveLetter";
import { 
  Heart, 
  Music, 
  Calendar, 
  Camera, 
  Sparkles, 
  Share2, 
  Lock, 
  Copy, 
  Check, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Eye, 
  Edit3,
  Youtube,
  UploadCloud,
  ImagePlus,
  X,
  FolderOpen,
  Clock,
  ExternalLink
} from "lucide-react";
import confetti from "canvas-confetti";
import { 
  extractYouTubeVideoId, 
  secondsToMMSS, 
  parseTimeToSeconds, 
  formatDurationInArabic 
} from "../../lib/utils";
import { YouTubeAudioPlayer } from "../common/YouTubeAudioPlayer";
import { encodeLoveLetterToUrlHash } from "../../lib/letterCodec";

// Compress image in browser to lightweight JPEG blob before sending to server
async function compressImageToBlob(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob || file),
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = (e.target?.result as string) || "";
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

// Upload photo to cloud for permanent, short-URL hosting with local compression fallback
async function uploadPhotoToServer(file: File): Promise<string> {
  try {
    // 1. Client-side compression first to avoid 413 Payload Too Large and ensure fast upload
    const compressedBlob = await compressImageToBlob(file, 1200, 0.8);
    const fd = new FormData();
    fd.append("file", compressedBlob, file.name.replace(/\.[^/.]+$/, ".jpg") || "photo.jpg");

    const res = await fetch("/api/upload-photo", {
      method: "POST",
      body: fd,
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) return data.url;
    }
  } catch (err) {
    console.warn("Cloud photo upload fallback to compression", err);
  }
  // Local fallback with smaller dimension so URL never explodes
  return compressImage(file, 400, 0.6);
}

// Compress user-uploaded photos to preserve quality while fitting into localStorage
function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve((e.target?.result as string) || "");
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve((e.target?.result as string) || "");
      img.src = (e.target?.result as string) || "";
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

const DEFAULT_INITIAL_DATA: LoveLetterData = {
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

export function LoveLetterStudio() {
  const [data, setData] = useState<LoveLetterData>(DEFAULT_INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [newMemoryUrl, setNewMemoryUrl] = useState("");
  const [newMemoryCaption, setNewMemoryCaption] = useState("");
  const [newMemoryDate, setNewMemoryDate] = useState("");

  // Load from LocalStorage if exists
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

  // Save changes
  const saveToStorage = (updated: LoveLetterData) => {
    setData(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("my_intimate_love_letter", JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const handleYoutubeChange = (url: string) => {
    // Sanitize any accidental leading character like "_" or quotes
    const cleanUrl = url.trim().replace(/^[^a-zA-Z0-9]*(?=https?:\/\/)/i, "").replace(/^[_\s'"]+|[_\s'"]+$/g, "");
    const videoId = extractYouTubeVideoId(cleanUrl) || "";
    saveToStorage({
      ...data,
      youtubeUrl: cleanUrl,
      youtubeVideoId: videoId,
    });
  };

  const handleAddMemory = () => {
    if (!newMemoryUrl.trim()) return;
    const newMem: LoveLetterMemory = {
      id: `mem-${Date.now()}`,
      imageUrl: newMemoryUrl.trim(),
      caption: newMemoryCaption.trim() || "لحظة لا تُنسى",
      date: newMemoryDate.trim() || "ذكرى جميلة",
      rotation: (Math.random() * 4) - 2,
    };
    saveToStorage({
      ...data,
      memories: [...data.memories, newMem],
    });
    setNewMemoryUrl("");
    setNewMemoryCaption("");
    setNewMemoryDate("");
  };

  const handleRemoveMemory = (id: string) => {
    saveToStorage({
      ...data,
      memories: data.memories.filter((m) => m.id !== id),
    });
  };

  // Drag & Drop / File Browser States
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingFiles(true);

    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      setIsProcessingFiles(false);
      return;
    }

    if (validFiles.length === 1) {
      const uploadedUrl = await uploadPhotoToServer(validFiles[0]);
      setNewMemoryUrl(uploadedUrl);
      setIsProcessingFiles(false);
    } else {
      const newItems: LoveLetterMemory[] = [];
      for (const file of validFiles) {
        const uploadedUrl = await uploadPhotoToServer(file);
        if (uploadedUrl) {
          newItems.push({
            id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            imageUrl: uploadedUrl,
            caption: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ") || "لحظة لا تُنسى",
            date: new Date().toLocaleDateString("ar-EG", { month: "long", year: "numeric" }),
            rotation: (Math.random() * 4) - 2,
          });
        }
      }
      saveToStorage({
        ...data,
        memories: [...data.memories, ...newItems],
      });
      setIsProcessingFiles(false);
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#FF7597", "#FFFFFF"],
      });
    }
  };

  const handleUpdateMemoryCaption = (id: string, caption: string) => {
    saveToStorage({
      ...data,
      memories: data.memories.map((m) => (m.id === id ? { ...m, caption } : m)),
    });
  };

  const handleUpdateMemoryDate = (id: string, date: string) => {
    saveToStorage({
      ...data,
      memories: data.memories.map((m) => (m.id === id ? { ...m, date } : m)),
    });
  };

  const handleShare = async () => {
    setIsGeneratingLink(true);
    try {
      // 1. Generate the self-contained compact compressed payload
      const hashPayload = await encodeLoveLetterToUrlHash(data);

      // 2. Build the universal share URL (includes query param ?d= for 100% data preservation)
      const url = `${window.location.origin}/gift/shared?d=${hashPayload}`;

      setShareUrl(url);
      setShareModalOpen(true);

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF7597", "#C9455B", "#F5EAD9", "#FFFFFF"],
      });

      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 3000);
        });
      }
    } catch (e) {
      console.error("Failed to generate share link", e);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0A0C] text-[#FAF5ED] font-alexandria py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header & Tab Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#171114] p-4 sm:p-6 rounded-3xl border border-[#C5A059]/30 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8C1527] to-[#C9455B] flex items-center justify-center text-white shadow-md">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="font-ruqaa text-xl sm:text-2xl font-bold text-[#F5EAD9]">
                صانع رسالة الحب الخاصة
              </h1>
              <p className="text-xs text-[#FAF5ED]/50 font-light">
                رسالتك، أغنيتكم، تاريخ لقائكم، ولحظاتكم.. بدون أي مظهر مصطنع
              </p>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "edit"
                  ? "bg-[#C9455B] text-white shadow-md"
                  : "bg-white/5 text-[#FAF5ED]/70 hover:bg-white/10"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>كتابة الرسالة</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("preview");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "preview"
                  ? "bg-[#C9455B] text-white shadow-md"
                  : "bg-white/5 text-[#FAF5ED]/70 hover:bg-white/10"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة كما ستراها هي</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              disabled={isGeneratingLink}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8902A] text-[#1E1A16] text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isGeneratingLink ? "جارٍ التجهيز..." : copiedLink ? "تم النسخ!" : "مشاركة الرابط"}</span>
            </button>
          </div>
        </div>

        {/* 1. Edit Mode */}
        {activeTab === "edit" ? (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Section 1: Names & Identity */}
            <div className="bg-[#171114] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/25 shadow-xl space-y-4">
              <h2 className="text-base sm:text-lg font-ruqaa font-bold text-[#F5EAD9] flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#FF7597]" />
                <span>١. الأسماء والترحيب</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FAF5ED]/70 mb-1.5">
                    اسم حبيبتك (كما تناديها):
                  </label>
                  <input
                    type="text"
                    value={data.recipientName}
                    onChange={(e) => saveToStorage({ ...data, recipientName: e.target.value })}
                    placeholder="مثال: سارة، أميرتي، حبيبتي..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#C5A059]/30 text-sm text-[#FAF5ED] outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FAF5ED]/70 mb-1.5">
                    اسمك (توقيع الرسالة):
                  </label>
                  <input
                    type="text"
                    value={data.senderName}
                    onChange={(e) => saveToStorage({ ...data, senderName: e.target.value })}
                    placeholder="مثال: أحمد، حبيبك..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#C5A059]/30 text-sm text-[#FAF5ED] outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: The Song & Music */}
            <div className="bg-[#171114] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/25 shadow-xl space-y-5">
              
              {/* Header */}
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-alexandria font-bold text-[#F5EAD9] flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#E09F67]" />
                  <span>٢. أغنيتكم المشتركة (تعمل فور فتح المغلف)</span>
                </h2>
                <p className="text-xs text-[#FAF5ED]/60 font-light font-alexandria">
                  ضع رابط الأغنية من يوتيوب، وحدد بدقة الدقيقة والثانية التي يبدأ وينتهي عندها المقطع المفضل لكما.
                </p>
              </div>

              <div className="space-y-4">
                {/* YouTube Link Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#FAF5ED]/70 mb-1.5 font-alexandria">
                    رابط الأغنية من يوتيوب:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center text-red-500 shrink-0">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={data.youtubeUrl || ""}
                      onChange={(e) => handleYoutubeChange(e.target.value)}
                      placeholder="https://youtu.be/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#C5A059]/30 text-sm text-[#FAF5ED] outline-none focus:border-[#C5A059] font-mono text-left"
                    />
                  </div>
                  <span className="text-[10px] text-[#FAF5ED]/40 mt-1 block font-alexandria">
                    يدعم جميع صيغ روابط يوتيوب (بما فيها روابط المشاركة القصيرة youtu.be)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#FAF5ED]/70 mb-1.5 font-alexandria">
                      اسم الأغنية:
                    </label>
                    <input
                      type="text"
                      value={data.songTitle}
                      onChange={(e) => saveToStorage({ ...data, songTitle: e.target.value })}
                      placeholder="مثال: ياللي بديت العشق..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#C5A059]/30 text-sm text-[#FAF5ED] outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#FAF5ED]/70 mb-1.5 font-alexandria">
                      اسم الفنان / المغني:
                    </label>
                    <input
                      type="text"
                      value={data.songArtist}
                      onChange={(e) => saveToStorage({ ...data, songArtist: e.target.value })}
                      placeholder="مثال: عبدالمجيد عبدالله..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#C5A059]/30 text-sm text-[#FAF5ED] outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                {/* Trim Times - Minutes and Seconds Controllers */}
                <div className="pt-2 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#E09F67] font-alexandria">
                      تحديد وقت بداية ونهاية المقطع:
                    </label>
                    <span className="text-[11px] text-[#FAF5ED]/50 font-alexandria">
                      (بالدقائق والثواني بدقة)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Start Time Controller */}
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#FAF5ED]/80 font-alexandria">
                          بداية المقطع:
                        </span>
                        <span className="text-xs font-mono font-bold text-[#E09F67] bg-black/50 px-2 py-0.5 rounded-lg border border-white/10">
                          {secondsToMMSS(data.audioStartTime || 0)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Minutes */}
                        <div className="flex-1">
                          <label className="block text-[10px] text-[#FAF5ED]/50 mb-1">دقيقة</label>
                          <input
                            type="number"
                            min={0}
                            max={60}
                            value={Math.floor((data.audioStartTime || 0) / 60)}
                            onChange={(e) => {
                              const m = Math.max(0, parseInt(e.target.value, 10) || 0);
                              const s = (data.audioStartTime || 0) % 60;
                              saveToStorage({ ...data, audioStartTime: m * 60 + s });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-center text-sm font-mono text-[#FAF5ED] outline-none focus:border-[#E09F67]"
                          />
                        </div>

                        <span className="text-lg font-bold text-[#E09F67] pt-4">:</span>

                        {/* Seconds */}
                        <div className="flex-1">
                          <label className="block text-[10px] text-[#FAF5ED]/50 mb-1">ثانية</label>
                          <input
                            type="number"
                            min={0}
                            max={59}
                            value={(data.audioStartTime || 0) % 60}
                            onChange={(e) => {
                              const s = Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0));
                              const m = Math.floor((data.audioStartTime || 0) / 60);
                              saveToStorage({ ...data, audioStartTime: m * 60 + s });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-center text-sm font-mono text-[#FAF5ED] outline-none focus:border-[#E09F67]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* End Time Controller */}
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#FAF5ED]/80 font-alexandria">
                          نهاية المقطع:
                        </span>
                        <span className="text-xs font-mono font-bold text-[#E09F67] bg-black/50 px-2 py-0.5 rounded-lg border border-white/10">
                          {secondsToMMSS(data.audioEndTime || 240)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Minutes */}
                        <div className="flex-1">
                          <label className="block text-[10px] text-[#FAF5ED]/50 mb-1">دقيقة</label>
                          <input
                            type="number"
                            min={0}
                            max={60}
                            value={Math.floor((data.audioEndTime || 240) / 60)}
                            onChange={(e) => {
                              const m = Math.max(0, parseInt(e.target.value, 10) || 0);
                              const s = (data.audioEndTime || 240) % 60;
                              saveToStorage({ ...data, audioEndTime: m * 60 + s });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-center text-sm font-mono text-[#FAF5ED] outline-none focus:border-[#E09F67]"
                          />
                        </div>

                        <span className="text-lg font-bold text-[#E09F67] pt-4">:</span>

                        {/* Seconds */}
                        <div className="flex-1">
                          <label className="block text-[10px] text-[#FAF5ED]/50 mb-1">ثانية</label>
                          <input
                            type="number"
                            min={0}
                            max={59}
                            value={(data.audioEndTime || 240) % 60}
                            onChange={(e) => {
                              const s = Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0));
                              const m = Math.floor((data.audioEndTime || 240) / 60);
                              saveToStorage({ ...data, audioEndTime: m * 60 + s });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-center text-sm font-mono text-[#FAF5ED] outline-none focus:border-[#E09F67]"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Summary Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-[#22171B] px-4 py-3 rounded-2xl border border-[#C5A059]/20 text-xs">
                    <div className="flex items-center gap-2 text-[#FAF5ED]/80 font-alexandria">
                      <Clock className="w-4 h-4 text-[#E09F67]" />
                      <span>
                        يبدأ عند <strong className="text-white font-mono">{secondsToMMSS(data.audioStartTime || 0)}</strong> وينتهي عند <strong className="text-white font-mono">{secondsToMMSS(data.audioEndTime || 240)}</strong>
                      </span>
                    </div>
                    <div className="text-[#E09F67] font-semibold font-alexandria">
                      المدة الإجمالية للمقطع: {formatDurationInArabic(Math.max(0, (data.audioEndTime || 240) - (data.audioStartTime || 0)))}
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-[#FAF5ED]/50 font-alexandria">خيارات سريعة:</span>
                    {[
                      { label: "من البداية (00:00 - 01:30)", start: 0, end: 90 },
                      { label: "المقطع الأشهر (01:00 - 02:30)", start: 60, end: 150 },
                      { label: "دقيقة واحدة (01:30 - 02:30)", start: 90, end: 150 },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => saveToStorage({ ...data, audioStartTime: preset.start, audioEndTime: preset.end })}
                        className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-[#FAF5ED]/70 hover:text-white transition-all border border-white/10 font-alexandria"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Testing Player inside Section 2 */}
                  {data.youtubeVideoId && (
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-2 mt-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#E09F67] font-alexandria flex items-center gap-1.5">
                          <Music className="w-3.5 h-3.5" />
                          <span>اختبار تشغيل المقطع المختار لمعاينة التوقيت بدقة:</span>
                        </span>
                        <span className="text-[10px] text-[#FAF5ED]/50 font-mono">
                          {secondsToMMSS(data.audioStartTime || 0)} ➔ {secondsToMMSS(data.audioEndTime || 240)}
                        </span>
                      </div>
                      
                      <YouTubeAudioPlayer
                        key={`preview-player-${data.youtubeVideoId}-${data.audioStartTime}-${data.audioEndTime}`}
                        videoId={data.youtubeVideoId}
                        startTime={data.audioStartTime || 0}
                        endTime={data.audioEndTime || 240}
                        title={data.songTitle}
                        artist={data.songArtist}
                        autoPlay={false}
                      />
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Section 3: Special Date & Counter */}
            <div className="bg-[#171114] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/25 shadow-xl space-y-4">
              <h2 className="text-base sm:text-lg font-ruqaa font-bold text-[#F5EAD9] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>٣. تاريخ حكايتكم المميز</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FAF5ED]/70 mb-1.5">
                    التاريخ (سنة-شهر-يوم):
                  </label>
                  <input
                    type="date"
                    value={data.specialDate}
                    onChange={(e) => saveToStorage({ ...data, specialDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#C5A059]/30 text-sm text-[#FAF5ED] outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FAF5ED]/70 mb-1.5">
                    عنوان هذا اليوم الجميل:
                  </label>
                  <input
                    type="text"
                    value={data.specialDateTitle || ""}
                    onChange={(e) => saveToStorage({ ...data, specialDateTitle: e.target.value })}
                    placeholder="مثال: أول يوم التقينا فيه، ذكرى عقد قراننا..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#C5A059]/30 text-sm text-[#FAF5ED] outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Handwritten Love Letter & Font Customizer */}
            <div className="bg-[#171114] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/25 shadow-xl space-y-6">
              
              {/* Header */}
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-alexandria font-bold text-[#F5EAD9] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF7597]" />
                  <span>٤. رسالتك من القلب ونوع الخط</span>
                </h2>
                <p className="text-xs text-[#FAF5ED]/60 font-light font-alexandria">
                  اختر نوع الخط المفضل الذي يعكس مشاعرك، وسيظهر فوراً أثناء كتابتك وعلى الورقة الكلاسيكية.
                </p>
              </div>

              {/* Font Selector Cards */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#E09F67] flex items-center gap-1.5">
                    <span>اختر نوع الخط المفضل لديك:</span>
                  </label>
                  <span className="text-[11px] text-[#FAF5ED]/50 font-alexandria">
                    الخط الحالي: {LETTER_FONTS.find((f) => f.id === (data.letterFont || "ruqaa"))?.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {LETTER_FONTS.map((font) => {
                    const isSelected = (data.letterFont || "ruqaa") === font.id;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => saveToStorage({ ...data, letterFont: font.id as any })}
                        className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? "border-[#D4AF37] bg-[#D4AF37]/15 shadow-md shadow-[#D4AF37]/20 scale-[1.02]"
                            : "border-white/10 hover:border-white/20 bg-black/30 hover:bg-black/40"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-alexandria text-[#FAF5ED]/70 font-medium">
                            {font.name}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#1E1A16] flex items-center justify-center text-[10px] font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        {/* Live Font Sample */}
                        <span className={`text-base ${font.fontClass} text-[#F5EAD9] leading-snug truncate block pt-1`}>
                          {font.sample}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                <span className="text-xs font-semibold text-[#FAF5ED]/70 font-alexandria">
                  حجم خط الرسالة:
                </span>
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                  {[
                    { id: "sm", label: "صغير (A-)" },
                    { id: "md", label: "متوسط (A)" },
                    { id: "lg", label: "كبير (A+)" },
                    { id: "xl", label: "كبير جداً (A++)" },
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => saveToStorage({ ...data, letterFontSize: sz.id as any })}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        (data.letterFontSize || "md") === sz.id
                          ? "bg-[#C9455B] text-white font-bold shadow-sm"
                          : "text-[#FAF5ED]/60 hover:text-white"
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea with Selected Font Applied Live */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#FAF5ED]/70 font-alexandria">
                    اكتب كل ما تريد أن تقوله لها بصدق:
                  </label>
                  <span className="text-[10px] text-[#FAF5ED]/40 font-alexandria">
                    (يتغير الخط فوراً أمامك أثناء الكتابة)
                  </span>
                </div>
                <textarea
                  rows={9}
                  value={data.letterText}
                  onChange={(e) => saveToStorage({ ...data, letterText: e.target.value })}
                  placeholder="اكتب رسالتك الصادقة هنا..."
                  className={`w-full px-5 py-4 rounded-2xl bg-[#FAF6EE] text-[#2C1D18] ${
                    data.letterFont ? `font-${data.letterFont}` : "font-ruqaa"
                  } ${
                    data.letterFontSize === "sm" ? "text-base sm:text-lg leading-[2.2]" :
                    data.letterFontSize === "lg" ? "text-xl sm:text-2xl leading-[2.6]" :
                    data.letterFontSize === "xl" ? "text-2xl sm:text-3xl leading-[2.8]" :
                    "text-lg sm:text-xl leading-[2.4]"
                  } outline-none border border-[#D9C4A6] shadow-inner transition-all`}
                />
              </div>
            </div>

            {/* Section 5: Polaroids & Moments */}
            <div className="bg-[#171114] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/25 shadow-xl space-y-6">
              
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-alexandria font-bold text-[#F5EAD9] flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#E09F67]" />
                    <span>٥. ألبوم لحظاتنا وذكرياتنا (صور بولارويد)</span>
                  </h2>
                  <span className="text-xs text-[#FAF5ED]/50 font-light font-alexandria">
                    {data.memories.length} صور مضافة
                  </span>
                </div>
                <p className="text-xs text-[#FAF5ED]/60 font-light font-alexandria">
                  اسحب الصور مباشرة من جهازك أو تصفح ملفاتك لإضافتها إلى ألبوم البولارويد الكلاسيكي.
                </p>
              </div>

              {/* Drag and Drop Zone / File Browser Trigger */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files) {
                    handleFiles(e.dataTransfer.files);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-2xl p-6 sm:p-8 text-center border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? "border-[#D4AF37] bg-[#D4AF37]/15 scale-[1.01]"
                    : "border-[#C5A059]/30 hover:border-[#D4AF37] bg-black/25 hover:bg-black/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
                
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#F5EAD9] font-alexandria">
                    اسحب وأفلت صوركم هنا، أو <span className="text-[#E09F67] underline">اضغط لاختيار الصور من جهازك / هاتفك</span>
                  </p>
                  <p className="text-xs text-[#FAF5ED]/50 font-light font-alexandria">
                    يدعم صور الجوال والكمبيوتر (PNG, JPG, WEBP) • يمكنك اختيار أكثر من صورة معاً
                  </p>
                </div>

                {isProcessingFiles && (
                  <div className="flex items-center gap-2 text-xs text-[#E09F67] animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>جارٍ معالجة وضبط جودة الصور...</span>
                  </div>
                )}
              </div>

              {/* Single Image Preview & Customization Card */}
              {newMemoryUrl && (
                <div className="bg-[#1F171A] p-4 sm:p-5 rounded-2xl border border-[#C5A059]/40 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#E09F67] font-alexandria">
                      معاينة وتخصيص الصورة المختارة:
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewMemoryUrl("")}
                      className="text-xs text-[#FAF5ED]/50 hover:text-white flex items-center gap-1 font-alexandria"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>إلغاء</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-28 h-24 rounded-xl overflow-hidden bg-black/50 shrink-0 border border-white/10">
                      <img src={newMemoryUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#FAF5ED]/70 mb-1 font-alexandria">
                          التعليق المكتوب على الصورة:
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: أول يوم التقينا فيه وضحكنا سوا..."
                          value={newMemoryCaption}
                          onChange={(e) => setNewMemoryCaption(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-[#FAF5ED] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#FAF5ED]/70 mb-1 font-alexandria">
                          التاريخ (اختياري):
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: نوفمبر ٢٠٢٣..."
                          value={newMemoryDate}
                          onChange={(e) => setNewMemoryDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-[#FAF5ED] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddMemory}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#C9455B] to-[#8C1527] text-white text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md font-alexandria"
                    >
                      تأكيد إضافة الصورة للألبوم ✓
                    </button>
                  </div>
                </div>
              )}

              {/* Secondary URL Input Toggle */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-xs text-[#FAF5ED]/50 hover:text-[#E09F67] underline transition-colors font-alexandria"
                >
                  {showUrlInput ? "إخفاء خيار الرابط الخارجي" : "أو أضف صورة عبر رابط خارجي (URL)"}
                </button>
              </div>

              {showUrlInput && (
                <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="رابط الصورة (URL)..."
                        value={newMemoryUrl}
                        onChange={(e) => setNewMemoryUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-[#FAF5ED] outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="التعليق المكتوب على الصورة..."
                        value={newMemoryCaption}
                        onChange={(e) => setNewMemoryCaption(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-[#FAF5ED] outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="التاريخ (مثال: مايو ٢٠٢٤)..."
                        value={newMemoryDate}
                        onChange={(e) => setNewMemoryDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-[#FAF5ED] outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddMemory}
                        disabled={!newMemoryUrl.trim()}
                        className="px-4 py-2 rounded-xl bg-[#C9455B] text-white text-xs font-bold hover:bg-[#8C1527] disabled:opacity-40 transition-all shrink-0 font-alexandria"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Memories List with in-place editing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {data.memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="bg-[#1F171A] p-3.5 rounded-2xl border border-white/10 relative group hover:border-[#C5A059]/40 transition-all space-y-2"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/40 relative">
                      <img
                        src={mem.imageUrl}
                        alt={mem.caption}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMemory(mem.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* In-place Editable Caption */}
                    <div>
                      <input
                        type="text"
                        value={mem.caption}
                        onChange={(e) => handleUpdateMemoryCaption(mem.id, e.target.value)}
                        placeholder="التعليق المكتوب..."
                        className="w-full px-2 py-1 rounded-lg bg-black/30 border border-white/5 text-xs font-ruqaa text-[#FAF5ED] outline-none focus:border-[#C5A059]/50"
                      />
                    </div>

                    {/* In-place Editable Date */}
                    <div>
                      <input
                        type="text"
                        value={mem.date || ""}
                        onChange={(e) => handleUpdateMemoryDate(mem.id, e.target.value)}
                        placeholder="التاريخ..."
                        className="w-full px-2 py-0.5 rounded-lg bg-transparent text-[10px] text-[#FAF5ED]/50 outline-none hover:bg-black/20 focus:bg-black/30 focus:border-[#C5A059]/50 font-alexandria"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Closing Promise & Security */}
            <div className="bg-[#171114] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/25 shadow-xl space-y-4">
              <h2 className="text-base sm:text-lg font-ruqaa font-bold text-[#F5EAD9] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#D4AF37]" />
                <span>٦. الوعد الأخير وكلمة السر (اختياري)</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FAF5ED]/70 mb-1.5">
                    وعدك الأخير لها في نهاية الصفحة:
                  </label>
                  <input
                    type="text"
                    value={data.finalPromise}
                    onChange={(e) => saveToStorage({ ...data, finalPromise: e.target.value })}
                    placeholder="مثال: أعدكِ أن أكون لكِ السند الدائم..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#C5A059]/30 text-sm text-[#FAF5ED] outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FAF5ED]/70 mb-1.5">
                    كلمة سر لفتح الرسالة (اتركها فارغة إن أردت فتحها مباشرة بدون كلمة سر):
                  </label>
                  <input
                    type="text"
                    value={data.passcode || ""}
                    onChange={(e) => saveToStorage({ ...data, passcode: e.target.value })}
                    placeholder="مثال: تاريخ ميلادها أو كلمة سر خاصة بكما..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#C5A059]/30 text-sm text-[#FAF5ED] outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("preview");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#C9455B] hover:bg-[#8C1527] text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>معاينة الرسالة كاملة الآن</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                disabled={isGeneratingLink}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8902A] text-[#1E1A16] font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                <span>{isGeneratingLink ? "جارٍ حفظ وتجهيز الرابط..." : copiedLink ? "تم نسخ الرابط!" : "نسخ الرابط لإرساله لها"}</span>
              </button>
            </div>

          </div>
        ) : (
          /* 2. Full Live Preview Mode */
          <div className="space-y-4">
            <div className="bg-[#171114] p-3 rounded-2xl border border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#E09F67] font-medium flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>وضع المعاينة المباشرة (هكذا ستراها تماماً)</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className="text-xs text-[#FAF5ED] hover:text-[#C9455B] font-semibold underline"
              >
                العودة للتعديل
              </button>
            </div>

            {/* The Actual Rendered Experience */}
            <div className="rounded-3xl overflow-hidden border border-[#C5A059]/30 shadow-2xl">
              <HandcraftedLoveLetter data={data} isOwner={true} />
            </div>
          </div>
        )}

      </div>

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
                رابط رسالتكِ أصبح جاهزاً! ❤️
              </h3>
              <p className="text-xs text-[#FAF5ED]/70 font-light leading-relaxed">
                تم حفظ وتضمين الرسالة والموسيقى والصور وكل تفاصيلك في هذا الرابط. سيعمل فوراً على أي هاتف وأي متصفح!
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
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2500);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C9455B] text-white text-xs font-bold hover:bg-[#8C1527] transition-all flex items-center gap-1.5 shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "تم النسخ!" : "نسخ"}</span>
                </button>
              </div>
              {copiedLink && (
                <p className="text-[11px] text-green-400 text-center font-medium">
                  ✓ تم نسخ الرابط بنجاح، يمكنك الآن لصقه وإرساله لها في واتساب أو أي مكان!
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
                <span>فتح وتجربة الرابط</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`صنعت لكِ شيئاً خاصاً من قلبي... افتحيها بهدوء ❤️\n${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-bold transition-all border border-[#25D366]/30"
              >
                <span>إرسال عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
