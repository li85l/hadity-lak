import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

// In-memory cache for fast retrieval
const memoryCache = new Map<string, any>();

// Helper to get local storage file path
function getStorageFilePath(): string {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    return path.join(dataDir, "gifts.json");
  } catch {
    return path.join("/tmp", "gifts.json");
  }
}

// Read gifts from local file
function readLocalGifts(): Record<string, any> {
  try {
    const filePath = getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Failed to read local gifts file:", err);
  }
  return {};
}

// Write gifts to local file
function saveLocalGift(id: string, giftData: any) {
  try {
    const filePath = getStorageFilePath();
    const gifts = readLocalGifts();
    gifts[id] = giftData;
    fs.writeFileSync(filePath, JSON.stringify(gifts, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write to local gifts file:", err);
  }
}

/**
 * POST /api/gift
 * Saves gift data and returns a permanent short ID
 */
export async function POST(req: Request) {
  try {
    const giftData = await req.json();

    if (!giftData) {
      return NextResponse.json({ error: "Missing gift data" }, { status: 400 });
    }

    let shortId = giftData.shortCode || "";

    // 1. Try uploading JSON to Catbox for 100% permanent cloud persistence without any database setup
    try {
      const jsonString = JSON.stringify(giftData);
      const blob = new Blob([jsonString], { type: "application/json" });
      const uploadData = new FormData();
      uploadData.append("reqtype", "fileupload");
      uploadData.append("fileToUpload", blob, "gift.json");

      const catboxRes = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: uploadData,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HandcraftedLove/1.0",
        },
      });

      if (catboxRes.ok) {
        const fileUrl = (await catboxRes.text()).trim();
        // File URL format: https://files.catbox.moe/xxxxxx.json
        const match = fileUrl.match(/\/([a-zA-Z0-9]+)\.json$/);
        if (match && match[1]) {
          shortId = match[1];
        }
      }
    } catch (catboxErr) {
      console.warn("Catbox cloud save fallback:", catboxErr);
    }

    // If Catbox didn't provide an ID, generate a clean 7-char short ID
    if (!shortId) {
      shortId = nanoid(7);
    }

    // 2. Save in memory cache
    memoryCache.set(shortId, giftData);

    // 3. Save to local storage file
    saveLocalGift(shortId, giftData);

    return NextResponse.json({
      success: true,
      id: shortId,
      url: `/gift/${shortId}`,
    });
  } catch (error) {
    console.error("Save gift API error:", error);
    return NextResponse.json({ error: "Failed to save gift" }, { status: 500 });
  }
}

/**
 * GET /api/gift?id=xxxxxx
 * Retrieves gift data by short ID
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing gift id" }, { status: 400 });
    }

    // 1. Check in-memory cache
    if (memoryCache.has(id)) {
      return NextResponse.json({ success: true, data: memoryCache.get(id) });
    }

    // 2. Check local file
    const localGifts = readLocalGifts();
    if (localGifts[id]) {
      memoryCache.set(id, localGifts[id]);
      return NextResponse.json({ success: true, data: localGifts[id] });
    }

    // 3. Check Catbox cloud storage
    try {
      const catboxUrl = `https://files.catbox.moe/${id}.json`;
      const catboxRes = await fetch(catboxUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HandcraftedLove/1.0",
        },
      });

      if (catboxRes.ok) {
        const giftData = await catboxRes.json();
        if (giftData && (giftData.recipientName || giftData.senderName)) {
          memoryCache.set(id, giftData);
          saveLocalGift(id, giftData);
          return NextResponse.json({ success: true, data: giftData });
        }
      }
    } catch (catboxErr) {
      console.warn("Failed to fetch from Catbox:", catboxErr);
    }

    return NextResponse.json({ error: "Gift not found" }, { status: 404 });
  } catch (error) {
    console.error("Get gift API error:", error);
    return NextResponse.json({ error: "Failed to retrieve gift" }, { status: 500 });
  }
}
