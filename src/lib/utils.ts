import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTimeElapsed(startDateStr: string) {
  const start = new Date(startDateStr);
  const now = new Date();
  
  if (isNaN(start.getTime())) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let diffMs = Math.max(0, now.getTime() - start.getTime());
  
  const seconds = Math.floor((diffMs / 1000) % 60);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  
  // Approximate years, months, days
  const daysTotal = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(daysTotal / 365);
  const months = Math.floor((daysTotal % 365) / 30);
  const days = Math.floor((daysTotal % 365) % 30);

  return { years, months, days, hours, minutes, seconds };
}

export function formatArabicNumber(num: number): string {
  return num.toLocaleString('ar-SA');
}

/**
 * Extracts YouTube Video ID from any YouTube URL format,
 * cleaning any accidental leading/trailing spaces, underscores, or prefixes.
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  // Clean url from accidental leading characters like "_" or spaces
  const cleanUrl = url.trim().replace(/^[^a-zA-Z0-9]*(?=https?:\/\/)/i, "").replace(/^[_\s'"]+|[_\s'"]+$/g, "");
  
  const match = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|watch\?.+&v=))([\w-]{11})/i
  );
  return match ? match[1] : null;
}

/**
 * Formats total seconds into MM:SS string (e.g. 90 -> "01:30")
 */
export function secondsToMMSS(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/**
 * Intelligently parses user input (e.g. "1:30", "01:30", "1.30", "1.3", "90") into total seconds.
 * For example:
 * - "1:30" -> 90 seconds
 * - "1.3"  -> 90 seconds (1 min 30 sec)
 * - "2.2"  -> 140 seconds (2 min 20 sec)
 * - "90"   -> 90 seconds
 */
export function parseTimeToSeconds(input: string | number): number {
  if (typeof input === "number") {
    // If it's a decimal like 1.3 or 2.2, convert via string interpretation
    input = input.toString();
  }
  if (!input) return 0;
  const str = input.trim();

  // If format is MM:SS (e.g. "1:30" or "02:15")
  if (str.includes(":")) {
    const parts = str.split(":");
    const m = parseInt(parts[0], 10) || 0;
    const s = parseInt(parts[1], 10) || 0;
    return Math.max(0, m * 60 + s);
  }

  // If format is MM.SS or MM.S (e.g. "1.3" or "2.2" or "1.30")
  if (str.includes(".")) {
    const parts = str.split(".");
    const m = parseInt(parts[0], 10) || 0;
    let sStr = parts[1] || "0";
    if (sStr.length === 1) {
      sStr = sStr + "0"; // "1.3" -> 30 seconds
    }
    const s = parseInt(sStr, 10) || 0;
    return Math.max(0, m * 60 + Math.min(59, s));
  }

  // Pure integer in seconds
  const num = parseInt(str, 10);
  return isNaN(num) ? 0 : Math.max(0, num);
}

/**
 * Returns a human friendly Arabic duration description (e.g. "دقيقة و ٣٠ ثانية")
 */
export function formatDurationInArabic(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return "٠ ثانية";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);

  if (m > 0 && s > 0) {
    return `${m} دقيقة و ${s} ثانية`;
  }
  if (m > 0) {
    return `${m} دقيقة`;
  }
  return `${s} ثانية`;
}
