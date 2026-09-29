// Supabase Client Utility with graceful fallback to local storage
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export async function saveGiftToCloud(giftData: any) {
  if (!isSupabaseConfigured) {
    console.log("Supabase not configured, saving locally in browser storage.");
    return { success: true, mode: "local" };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/gifts`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        short_code: giftData.shortCode,
        creator_session_id: giftData.id,
        sender_name: giftData.senderName,
        recipient_name: giftData.recipientName,
        relationship_type: giftData.relationship,
        story_date: giftData.storyDate ? new Date(giftData.storyDate).toISOString() : null,
        story_date_type: giftData.storyDateType,
        love_letter: giftData.loveLetter,
        letter_style: giftData.letterTone,
        audio_url: giftData.audioUrl,
        audio_title: giftData.audioTitle,
        theme_id: giftData.theme,
        final_message: giftData.finalPledge,
        is_password_protected: giftData.isPasswordProtected,
        password_hash: giftData.password, // In real prod, hash on server edge
        unlock_at: giftData.scheduledUnlockAt ? new Date(giftData.scheduledUnlockAt).toISOString() : null,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to save to Supabase: ${res.statusText}`);
    }

    return { success: true, mode: "cloud", data: await res.json() };
  } catch (error) {
    console.error("Cloud save failed, falling back to local:", error);
    return { success: true, mode: "local_fallback" };
  }
}
