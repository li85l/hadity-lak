"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

interface AudioPlayerProps {
  audioUrl?: string;
  title?: string;
  artist?: string;
  autoPlay?: boolean;
  className?: string;
}

export function AudioPlayer({
  audioUrl,
  title = "أغنيتنا المفضلة",
  artist = "لحن الحب",
  autoPlay = false,
  className = "",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (autoPlay) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Autoplay waiting for user gesture:", err);
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlay, audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Play failed", e));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  if (!audioUrl) return null;

  return (
    <div
      className={`glass-panel rounded-2xl p-4 flex items-center gap-4 border border-rose-romantic/20 ${className}`}
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      {/* Play / Pause Button */}
      <button
        onClick={togglePlay}
        className="w-11 h-11 rounded-full bg-gradient-to-tr from-burgundy-700 to-rose-glow flex items-center justify-center text-white shadow-lg shadow-burgundy-900/50 hover:scale-105 active:scale-95 transition-transform shrink-0"
        title={isPlaying ? "إيقاف مؤقت" : "تشغيل الموسيقى"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current mr-0.5" />
        )}
      </button>

      {/* Info & Waveform */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 truncate">
            <Music className="w-3.5 h-3.5 text-rose-glow shrink-0 animate-pulse" />
            <span className="text-sm font-medium text-champagne-100 truncate">
              {title}
            </span>
            <span className="text-xs text-champagne-300/60 truncate">
              • {artist}
            </span>
          </div>

          {/* Animated Waveform */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3.5 px-2">
              <span className="w-0.5 bg-rose-glow rounded-full animate-[bounce_1s_infinite_100ms] h-full" />
              <span className="w-0.5 bg-rose-glow rounded-full animate-[bounce_1s_infinite_300ms] h-2/3" />
              <span className="w-0.5 bg-rose-glow rounded-full animate-[bounce_1s_infinite_200ms] h-4/5" />
              <span className="w-0.5 bg-rose-glow rounded-full animate-[bounce_1s_infinite_400ms] h-1/2" />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-rose-glow to-burgundy-600 h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Volume / Mute */}
      <button
        onClick={toggleMute}
        className="text-champagne-300/70 hover:text-champagne-100 p-2 rounded-full hover:bg-white/5 transition-colors shrink-0"
        title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
