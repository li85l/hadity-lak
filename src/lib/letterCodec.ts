import { LoveLetterData } from "../components/experience/HandcraftedLoveLetter";
import * as fflate from "fflate";

/**
 * Compact representation with single/two-character keys for minimal URL length
 */
interface CompactPayload {
  r: string; // recipientName
  s: string; // senderName
  d: string; // specialDate
  t?: string; // specialDateTitle
  st?: string; // songTitle
  sa?: string; // songArtist
  y?: string; // youtubeVideoId
  t1?: number; // audioStartTime
  t2?: number; // audioEndTime
  l: string; // letterText
  f?: string; // letterFont
  fs?: string; // letterFontSize
  m?: Array<{
    u: string; // imageUrl (only URLs, not raw base64)
    c: string; // caption
    d?: string; // date
    r?: number; // rotation
  }>;
  p?: string; // finalPromise
  k?: string; // passcode
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(str: string): Uint8Array {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encodes LoveLetterData into a compact, compressed, URL-safe string.
 * Uses high-speed, zero-dependency fflate gzip.
 */
export async function encodeLoveLetterToUrlHash(data: LoveLetterData): Promise<string> {
  // Convert to compact schema
  const compact: CompactPayload = {
    r: data.recipientName || "",
    s: data.senderName || "",
    d: data.specialDate || "",
    l: data.letterText || "",
  };

  if (data.specialDateTitle) compact.t = data.specialDateTitle;
  if (data.songTitle) compact.st = data.songTitle;
  if (data.songArtist) compact.sa = data.songArtist;
  if (data.youtubeVideoId) compact.y = data.youtubeVideoId;
  if (data.audioStartTime !== undefined && data.audioStartTime > 0) compact.t1 = data.audioStartTime;
  if (data.audioEndTime !== undefined) compact.t2 = data.audioEndTime;
  if (data.letterFont && data.letterFont !== "ruqaa") compact.f = data.letterFont;
  if (data.letterFontSize && data.letterFontSize !== "md") compact.fs = data.letterFontSize;
  if (data.finalPromise) compact.p = data.finalPromise;
  if (data.passcode) compact.k = data.passcode;

  // Memories: exclude any massive base64 strings from URL payload to prevent URL truncation
  if (data.memories && data.memories.length > 0) {
    compact.m = data.memories
      .filter((mem) => mem.imageUrl && !mem.imageUrl.startsWith("data:"))
      .map((mem) => ({
        u: mem.imageUrl,
        c: mem.caption || "",
        d: mem.date || "",
        r: Math.round((mem.rotation || 0) * 10) / 10,
      }));
  }

  const json = JSON.stringify(compact);

  // 1. Primary: fflate pure JS Gzip (ultra-fast, works across ALL browsers & WebViews)
  try {
    const u8 = fflate.strToU8(json);
    const gz = fflate.gzipSync(u8, { level: 9 });
    return "gz_" + bytesToBase64Url(gz);
  } catch (err) {
    console.warn("fflate gzip failed, trying fallback:", err);
  }

  // 2. Fallback: native base64url
  try {
    const u8 = fflate.strToU8(json);
    return "b64_" + bytesToBase64Url(u8);
  } catch (e) {
    return "raw_" + encodeURIComponent(json);
  }
}

/**
 * Normalizes decoded payload (whether legacy full keys or modern compact keys) into LoveLetterData
 */
function normalizeToLoveLetterData(obj: any): LoveLetterData {
  const isCompact = "r" in obj || "l" in obj;

  if (isCompact) {
    return {
      recipientName: obj.r || "",
      senderName: obj.s || "",
      specialDate: obj.d || "",
      specialDateTitle: obj.t || "",
      songTitle: obj.st || "أغنيتنا المفضلة",
      songArtist: obj.sa || "",
      youtubeVideoId: obj.y || "",
      youtubeUrl: obj.y ? `https://www.youtube.com/watch?v=${obj.y}` : "",
      audioStartTime: obj.t1 ?? 0,
      audioEndTime: obj.t2 ?? 210,
      letterText: obj.l || "",
      letterFont: obj.f || "ruqaa",
      letterFontSize: obj.fs || "md",
      memories: (obj.m || []).map((mem: any, idx: number) => ({
        id: `mem-${idx}`,
        imageUrl: mem.u || "",
        caption: mem.c || "",
        date: mem.d || "",
        rotation: mem.r ?? 0,
      })),
      finalPromise: obj.p || "",
      passcode: obj.k || "",
    };
  }

  return {
    recipientName: obj.recipientName || "",
    senderName: obj.senderName || "",
    specialDate: obj.specialDate || "",
    specialDateTitle: obj.specialDateTitle || "",
    songTitle: obj.songTitle || "أغنيتنا المفضلة",
    songArtist: obj.songArtist || "",
    youtubeVideoId: obj.youtubeVideoId || "",
    youtubeUrl: obj.youtubeUrl || "",
    audioStartTime: obj.audioStartTime ?? 0,
    audioEndTime: obj.audioEndTime ?? 210,
    letterText: obj.letterText || "",
    letterFont: obj.letterFont || "ruqaa",
    letterFontSize: obj.letterFontSize || "md",
    memories: obj.memories || [],
    finalPromise: obj.finalPromise || "",
    passcode: obj.passcode || "",
  };
}

/**
 * Decodes LoveLetterData from a compressed or base64 URL hash/query string.
 */
export async function decodeLoveLetterFromUrlHash(str: string): Promise<LoveLetterData | null> {
  if (!str) return null;

  // Clean common prefixes
  let cleanStr = str.trim();
  if (cleanStr.startsWith("#")) cleanStr = cleanStr.slice(1);
  if (cleanStr.startsWith("data=")) cleanStr = cleanStr.slice(5);
  if (cleanStr.startsWith("d=")) cleanStr = cleanStr.slice(2);

  try {
    if (cleanStr.startsWith("gz_")) {
      const bytes = base64UrlToBytes(cleanStr.slice(3));
      // Primary: fflate gunzip
      try {
        const decompressed = fflate.gunzipSync(bytes);
        const text = fflate.strFromU8(decompressed);
        const parsed = JSON.parse(text);
        return normalizeToLoveLetterData(parsed);
      } catch (ffErr) {
        // Fallback to DecompressionStream if available
        if (typeof DecompressionStream !== "undefined") {
          const stream = new Blob([bytes as any]).stream().pipeThrough(new DecompressionStream("gzip"));
          const text = await new Response(stream).text();
          const parsed = JSON.parse(text);
          return normalizeToLoveLetterData(parsed);
        }
        throw ffErr;
      }
    }

    if (cleanStr.startsWith("b64_")) {
      const bytes = base64UrlToBytes(cleanStr.slice(4));
      const text = fflate.strFromU8(bytes);
      const parsed = JSON.parse(text);
      return normalizeToLoveLetterData(parsed);
    }

    if (cleanStr.startsWith("raw_")) {
      const text = decodeURIComponent(cleanStr.slice(4));
      const parsed = JSON.parse(text);
      return normalizeToLoveLetterData(parsed);
    }

    // Try fallback URI decode
    try {
      const decoded = decodeURIComponent(cleanStr);
      const parsed = JSON.parse(decoded);
      return normalizeToLoveLetterData(parsed);
    } catch {}

  } catch (err) {
    console.error("Failed to decode love letter from URL payload:", err);
  }

  return null;
}
