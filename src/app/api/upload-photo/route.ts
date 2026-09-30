import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. First attempt: Forward to Catbox free permanent cloud image host
    try {
      const uploadData = new FormData();
      uploadData.append("reqtype", "fileupload");
      uploadData.append("fileToUpload", file, file.name || "polaroid.jpg");

      const catboxRes = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: uploadData,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HandcraftedLove/1.0",
        },
      });

      if (catboxRes.ok) {
        const fileUrl = (await catboxRes.text()).trim();
        if (fileUrl.startsWith("http")) {
          return NextResponse.json({ url: fileUrl });
        }
      }
    } catch (cloudErr) {
      console.warn("Catbox upload failed, attempting local fallback:", cloudErr);
    }

    // 2. Second attempt: Local filesystem storage in public/uploads (for local/self-hosted environments)
    try {
      const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name || ".jpg") || ".jpg";
      const filename = `photo-${Date.now()}-${nanoid(6)}${ext}`;
      const destPath = path.join(publicUploadsDir, filename);

      fs.writeFileSync(destPath, buffer);
      return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (localErr) {
      console.warn("Local filesystem write failed:", localErr);
    }

    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
