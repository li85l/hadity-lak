"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Music, Youtube } from "lucide-react";
import { formatTimeMMSS } from "../../lib/templates";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubeAudioPlayerProps {
  videoId: string;
  startTime?: number; // In seconds
  endTime?: number;   // In seconds
  title?: string;
  artist?: string;
  autoPlay?: boolean;
  className?: string;
}

export function YouTubeAudioPlayer({
  videoId,
  startTime = 0,
  endTime = 180,
  title = "موسيقى من اليوتيوب",
  artist = "المقطع المختار",
  autoPlay = false,
  className = "",
}: YouTubeAudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [playerReady, setPlayerReady] = useState(false);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Unique container id
  const playerElementId = useRef(`yt-audio-${Math.random().toString(36).substring(2, 8)}`);

  useEffect(() => {
    // Load YouTube IFrame API script if not loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error(e);
        }
      }

      playerRef.current = new window.YT.Player(playerElementId.current, {
        height: "1",
        width: "1",
        videoId: videoId,
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          start: startTime,
          end: endTime > startTime ? endTime : undefined,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
            if (autoPlay) {
              playerRef.current?.seekTo(startTime, true);
              playerRef.current?.playVideo();
              setIsPlaying(true);
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING === 1, PAUSED === 2, ENDED === 0
            if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2 || event.data === 0) {
              setIsPlaying(false);
              // Loop back to start time if ended
              if (event.data === 0) {
                playerRef.current?.seekTo(startTime, true);
                playerRef.current?.playVideo();
              }
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
      }
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [videoId, startTime, endTime, autoPlay]);

  // Track progress and enforce clip end boundary
  useEffect(() => {
    if (isPlaying && playerReady) {
      progressTimerRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
          const curr = playerRef.current.getCurrentTime();
          setCurrentTime(curr);

          // If reached or exceeded user's clipped end time, loop to start
          if (endTime > startTime && curr >= endTime) {
            playerRef.current.seekTo(startTime, true);
          }
        }
      }, 500);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, playerReady, startTime, endTime]);

  const togglePlay = () => {
    if (!playerRef.current || !playerReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      const curr = playerRef.current.getCurrentTime();
      if (curr < startTime || (endTime > startTime && curr >= endTime)) {
        playerRef.current.seekTo(startTime, true);
      }
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current || !playerReady) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const clipDuration = Math.max(1, (endTime || 180) - (startTime || 0));
  const clipProgress = Math.min(100, Math.max(0, ((currentTime - startTime) / clipDuration) * 100));

  return (
    <div
      ref={containerRef}
      className={`glass-panel rounded-2xl p-4 flex items-center gap-4 border border-rose-romantic/20 ${className}`}
    >
      {/* Hidden YouTube IFrame */}
      <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
        <div id={playerElementId.current} />
      </div>

      {/* Play / Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className="w-11 h-11 rounded-full bg-gradient-to-tr from-burgundy-700 to-rose-glow flex items-center justify-center text-white shadow-lg shadow-burgundy-900/50 hover:scale-105 active:scale-95 transition-transform shrink-0"
        title={isPlaying ? "إيقاف مؤقت" : "تشغيل مقطع اليوتيوب"}
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
            <Youtube className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-sm font-medium text-champagne-100 truncate">
              {title}
            </span>
            <span className="text-xs text-rose-glow/80 shrink-0">
              [{formatTimeMMSS(startTime)} - {formatTimeMMSS(endTime)}]
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

        {/* Progress Bar for the Trimmed Clip */}
        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-rose-glow to-burgundy-600 h-full transition-all duration-200"
            style={{ width: `${clipProgress}%` }}
          />
        </div>
      </div>

      {/* Volume / Mute */}
      <button
        type="button"
        onClick={toggleMute}
        className="text-champagne-300/70 hover:text-champagne-100 p-2 rounded-full hover:bg-white/5 transition-colors shrink-0"
        title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
