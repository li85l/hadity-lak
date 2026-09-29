import { LoveLetterData } from "../components/experience/HandcraftedLoveLetter";

/**
 * Encodes LoveLetterData into a compact, compressed, URL-safe string.
 * Uses native CompressionStream (gzip) with base64url encoding.
 */
export async function encodeLoveLetterToUrlHash(data: LoveLetterData): Promise<string> {
  const json = JSON.stringify(data);

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

  // Safe UTF-8 base64url fallback
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
      return JSON.parse(text) as LoveLetterData;
    }

    if (cleanStr.startsWith("b64_")) {
      const base64 = cleanStr.slice(4).replace(/-/g, "+").replace(/_/g, "/");
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const text = new TextDecoder().decode(bytes);
      return JSON.parse(text) as LoveLetterData;
    }

    if (cleanStr.startsWith("raw_")) {
      return JSON.parse(decodeURIComponent(cleanStr.slice(4))) as LoveLetterData;
    }

    // Try fallback URI decode
    try {
      const decoded = decodeURIComponent(cleanStr);
      return JSON.parse(decoded) as LoveLetterData;
    } catch {}

  } catch (err) {
    console.error("Failed to decode love letter from URL payload:", err);
  }

  return null;
}
