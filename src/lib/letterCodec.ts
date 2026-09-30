import { LoveLetterData } from "../components/experience/HandcraftedLoveLetter";

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

/**
 * Encodes LoveLetterData into a compact, compressed, URL-safe string.
 * Uses native CompressionStream (gzip) with base64url encoding.
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

  // 1. Try gzip CompressionStream
  try {
    if (typeof CompressionStream !== "undefined") {
      const stream = new Blob([new TextEncoder().encode(json)])
        .stream()
        .pipeThrough(new CompressionStream("gzip"));
      const buffer = await new Response(stream).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return "gz_" + btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
  } catch (e) {
    console.warn("gzip compression stream unavailable, falling back", e);
  }

  // 2. Safe UTF-8 base64url fallback
  try {
    const utf8Bytes = new TextEncoder().encode(json);
    let binary = "";
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return "b64_" + btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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
      recipientName: obj.r || "سارة",
      senderName: obj.s || "أحمد",
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
    recipientName: obj.recipientName || "سارة",
    senderName: obj.senderName || "أحمد",
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
      const base64 = cleanStr.slice(3).replace(/-/g, "+").replace(/_/g, "/");
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
      const text = await new Response(stream).text();
      const parsed = JSON.parse(text);
      return normalizeToLoveLetterData(parsed);
    }

    if (cleanStr.startsWith("b64_")) {
      const base64 = cleanStr.slice(4).replace(/-/g, "+").replace(/_/g, "/");
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const text = new TextDecoder().decode(bytes);
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
