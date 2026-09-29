import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Forward to Catbox free permanent image host
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

    // If external host failed, fallback to data URI / error
    return NextResponse.json({ error: "Host upload failed" }, { status: 502 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
