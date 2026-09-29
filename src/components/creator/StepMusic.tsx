"use client";

import React, { useState } from "react";
import { useCreatorStore } from "../../lib/store";
import { AudioPlayer } from "../common/AudioPlayer";
import { YouTubeAudioPlayer } from "../common/YouTubeAudioPlayer";
import {
  Music,
  Upload,
  CheckCircle2,
  Youtube,
  Scissors,
  Sparkles,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  PRESET_YOUTUBE_SONGS,
  extractYouTubeId,
  formatTimeMMSS,
  parseTimeToSeconds,
} from "../../lib/templates";

const PRESET_SONGS = [
  {
    title: "بيانو رومانسي هادئ",
    artist: "لحن المشاعر",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
  },
  {
    title: "همسات المساء",
    artist: "أوتار الحب",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73507.mp3?filename=tender-love-10874.mp3",
  },
  {
    title: "قصة حب تحت النجوم",
    artist: "كمان وسكينة",
    url: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=romantic-dinner-124438.mp3",
  },
];

export function StepMusic() {
  const { giftData, updateGiftData } = useCreatorStore();

  const [activeTab, setActiveTab] = useState<"youtube" | "preset" | "upload">(
    giftData.audioSourceType === "youtube" ? "youtube" : "preset"
  );

  const [ytUrlInput, setYtUrlInput] = useState(giftData.youtubeUrl || "");
  const [startInput, setStartInput] = useState(
    formatTimeMMSS(giftData.audioStartTime || 0)
  );
  const [endInput, setEndInput] = useState(
    formatTimeMMSS(giftData.audioEndTime || 180)
  );

  const handleApplyYouTube = (url: string, startSec = 0, endSec = 180, songTitle = "أغنية خاصة") => {
    const videoId = extractYouTubeId(url);
    if (!videoId) return;

    updateGiftData({
      audioSourceType: "youtube",
      youtubeUrl: url,
      youtubeVideoId: videoId,
      audioStartTime: startSec,
      audioEndTime: endSec,
      audioTitle: songTitle,
      audioArtist: "مقطع اليوتيوب المختار",
    });
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Audio = event.target.result as string;
          updateGiftData({
            audioSourceType: "upload",
            audioUrl: base64Audio,
            audioTitle: file.name.replace(/\.[^/.]+$/, ""),
            audioArtist: "ملف صوتي خاص",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-burgundy-900/60 border border-rose-romantic/30 text-rose-glow mb-2">
          <Music className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-readex text-champagne-100">
          أغنيتنا المفضلة 🎵
        </h2>
        <p className="text-sm text-champagne-300/70">
          اختر من اليوتيوب وقص المقطع المطلوب، أو اختر من مقطوعاتنا الجاهزة، أو ارفع ملفك الخاص
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="glass-panel p-1.5 rounded-full flex gap-1 border border-rose-romantic/20">
          <button
            type="button"
            onClick={() => setActiveTab("youtube")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "youtube"
                ? "bg-gradient-to-r from-red-600 to-rose-glow text-white shadow-lg"
                : "text-champagne-300/70 hover:text-white"
            }`}
          >
            <Youtube className="w-4 h-4 text-white" />
            <span>من اليوتيوب وقص المقطع ✂️</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preset")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "preset"
                ? "bg-gradient-to-r from-burgundy-800 to-rose-glow text-white shadow-lg"
                : "text-champagne-300/70 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>مقطوعات رومانسية هادئة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "upload"
                ? "bg-gradient-to-r from-burgundy-800 to-rose-glow text-white shadow-lg"
                : "text-champagne-300/70 hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>رفع ملف MP3</span>
          </button>
        </div>
      </div>

      {/* 1. YouTube & Clip Trimmer Tab */}
      {activeTab === "youtube" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-romantic/25 space-y-6 max-w-2xl mx-auto shadow-xl">
          <div className="space-y-2">
            <label className="text-sm font-medium text-champagne-100 flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>أدخل رابط فيديو اليوتيوب:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={ytUrlInput}
                onChange={(e) => {
                  setYtUrlInput(e.target.value);
                  const id = extractYouTubeId(e.target.value);
                  if (id) {
                    handleApplyYouTube(
                      e.target.value,
                      parseTimeToSeconds(startInput),
                      parseTimeToSeconds(endInput),
                      giftData.audioTitle || "أغنية يوتيوب رومانسية"
                    );
                  }
                }}
                className="flex-1 px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm text-left font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  handleApplyYouTube(
                    ytUrlInput,
                    parseTimeToSeconds(startInput),
                    parseTimeToSeconds(endInput),
                    "أغنية يوتيوب رومانسية"
                  );
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-glow text-white text-xs font-semibold hover:scale-102 transition-transform"
              >
                تطبيق
              </button>
            </div>
          </div>

          {/* Clip Trimmer Controls */}
          <div className="glass-panel p-5 rounded-2xl border border-rose-romantic/20 space-y-4 bg-black/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-glow flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5" />
                <span>قص المقطع المطلوب (بدء ونهاية المقطع):</span>
              </span>
              <span className="text-[11px] text-champagne-300/60 font-mono">
                صيغة الدقائق:الثواني (MM:SS)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Time */}
              <div className="space-y-1.5">
                <label className="text-xs text-champagne-200 block">
                  يبدأ المقطع عند:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={startInput}
                    onChange={(e) => {
                      setStartInput(e.target.value);
                      const sec = parseTimeToSeconds(e.target.value);
                      updateGiftData({ audioStartTime: sec });
                    }}
                    placeholder="00:30"
                    className="w-24 px-3 py-2 rounded-xl glass-input text-center text-sm font-mono text-champagne-100"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const sec = Math.max(0, parseTimeToSeconds(startInput) - 5);
                        setStartInput(formatTimeMMSS(sec));
                        updateGiftData({ audioStartTime: sec });
                      }}
                      className="px-2 py-1 rounded-lg bg-white/10 text-[10px] text-champagne-200 hover:bg-white/20"
                    >
                      -5 ث
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sec = parseTimeToSeconds(startInput) + 5;
                        setStartInput(formatTimeMMSS(sec));
                        updateGiftData({ audioStartTime: sec });
                      }}
                      className="px-2 py-1 rounded-lg bg-white/10 text-[10px] text-champagne-200 hover:bg-white/20"
                    >
                      +5 ث
                    </button>
                  </div>
                </div>
              </div>

              {/* End Time */}
              <div className="space-y-1.5">
                <label className="text-xs text-champagne-200 block">
                  ينتهي المقطع عند:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={endInput}
                    onChange={(e) => {
                      setEndInput(e.target.value);
                      const sec = parseTimeToSeconds(e.target.value);
                      updateGiftData({ audioEndTime: sec });
                    }}
                    placeholder="02:15"
                    className="w-24 px-3 py-2 rounded-xl glass-input text-center text-sm font-mono text-champagne-100"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const sec = Math.max(0, parseTimeToSeconds(endInput) - 5);
                        setEndInput(formatTimeMMSS(sec));
                        updateGiftData({ audioEndTime: sec });
                      }}
                      className="px-2 py-1 rounded-lg bg-white/10 text-[10px] text-champagne-200 hover:bg-white/20"
                    >
                      -5 ث
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sec = parseTimeToSeconds(endInput) + 5;
                        setEndInput(formatTimeMMSS(sec));
                        updateGiftData({ audioEndTime: sec });
                      }}
                      className="px-2 py-1 rounded-lg bg-white/10 text-[10px] text-champagne-200 hover:bg-white/20"
                    >
                      +5 ث
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Preset YouTube Songs */}
          <div className="space-y-2">
            <span className="text-xs text-champagne-300/70 block">
              أو اختر مقطعاً رومانسياً مقصوصاً جاهزاً:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_YOUTUBE_SONGS.map((ps) => (
                <button
                  key={ps.videoId}
                  type="button"
                  onClick={() => {
                    setYtUrlInput(ps.url);
                    setStartInput(formatTimeMMSS(ps.startTime));
                    setEndInput(formatTimeMMSS(ps.endTime));
                    handleApplyYouTube(ps.url, ps.startTime, ps.endTime, ps.title);
                  }}
                  className={`p-3 rounded-2xl text-right transition-all border text-xs ${
                    giftData.youtubeVideoId === ps.videoId
                      ? "bg-red-950/60 border-rose-glow text-white shadow-md"
                      : "glass-panel text-champagne-300/80 hover:bg-white/5 border-rose-romantic/15"
                  }`}
                >
                  <div className="font-semibold truncate text-champagne-100">{ps.title}</div>
                  <div className="text-[10px] text-champagne-300/60 truncate mt-0.5">{ps.artist}</div>
                  <div className="text-[9px] text-rose-glow mt-1">
                    المقطع: {formatTimeMMSS(ps.startTime)} - {formatTimeMMSS(ps.endTime)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Live YouTube Player Preview */}
          {giftData.youtubeVideoId && (
            <div className="space-y-2 pt-2">
              <span className="text-xs text-champagne-300/60 block">معاينة تشغيل المقطع المقصوص:</span>
              <YouTubeAudioPlayer
                videoId={giftData.youtubeVideoId}
                startTime={giftData.audioStartTime}
                endTime={giftData.audioEndTime}
                title={giftData.audioTitle}
                artist={giftData.audioArtist}
              />
            </div>
          )}
        </div>
      )}

      {/* 2. Preset Songs Tab */}
      {activeTab === "preset" && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_SONGS.map((song) => {
              const isSelected =
                giftData.audioSourceType !== "youtube" && giftData.audioUrl === song.url;
              return (
                <button
                  key={song.title}
                  type="button"
                  onClick={() =>
                    updateGiftData({
                      audioSourceType: "preset",
                      audioUrl: song.url,
                      audioTitle: song.title,
                      audioArtist: song.artist,
                      youtubeVideoId: undefined,
                    })
                  }
                  className={`p-4 rounded-2xl text-right transition-all border flex items-center justify-between ${
                    isSelected
                      ? "bg-burgundy-800 text-white border-rose-glow shadow-md shadow-burgundy-950/50"
                      : "glass-panel text-champagne-300/80 hover:bg-white/5 border-rose-romantic/15"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm text-champagne-100">{song.title}</div>
                    <div className="text-xs text-champagne-300/60">{song.artist}</div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-rose-glow shrink-0" />}
                </button>
              );
            })}
          </div>

          {giftData.audioUrl && giftData.audioSourceType !== "youtube" && (
            <div className="space-y-2 pt-2">
              <span className="text-xs text-champagne-300/60 block">معاينة مشغل الصوت:</span>
              <AudioPlayer
                audioUrl={giftData.audioUrl}
                title={giftData.audioTitle}
                artist={giftData.audioArtist}
              />
            </div>
          )}
        </div>
      )}

      {/* 3. Direct Upload Tab */}
      {activeTab === "upload" && (
        <div className="glass-panel p-6 rounded-3xl border border-rose-romantic/20 space-y-4 max-w-xl mx-auto">
          <h4 className="font-semibold text-sm text-champagne-100 flex items-center gap-2">
            <Upload className="w-4 h-4 text-rose-glow" />
            <span>ارفع أغنيتكما المفضلة كملف MP3:</span>
          </h4>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="w-full text-xs text-champagne-300 file:ml-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-burgundy-800 file:text-white hover:file:bg-burgundy-700"
          />

          {giftData.audioUrl && giftData.audioSourceType === "upload" && (
            <div className="space-y-2 pt-2">
              <span className="text-xs text-champagne-300/60 block">معاينة الصوت المرفوع:</span>
              <AudioPlayer
                audioUrl={giftData.audioUrl}
                title={giftData.audioTitle}
                artist={giftData.audioArtist}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
