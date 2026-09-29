import { ThemePreset, VisualEffectType, AudioSourceType } from "../types/gift";

export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  emoji: string;
  bgGradient: string;
  heartColor: string;
  heartEmissive: string;
  particleColor: string;
  secondaryParticleColor: string;
  accentText: string;
  cardBg: string;
  cardBorder: string;
}

export const THEME_CONFIGS: Record<ThemePreset, ThemeConfig> = {
  royal_gold: {
    id: "royal_gold",
    name: "ذهبي ملكي وعاجي",
    emoji: "⚜️",
    bgGradient: "from-[#120F0B] via-[#1C1710] to-[#0A0806]",
    heartColor: "#C5A059",
    heartEmissive: "#D4AF37",
    particleColor: "#D4AF37",
    secondaryParticleColor: "#FAF4EB",
    accentText: "text-[#D4AF37]",
    cardBg: "rgba(28, 23, 16, 0.85)",
    cardBorder: "rgba(212, 175, 55, 0.35)",
  },
  emerald_luxury: {
    id: "emerald_luxury",
    name: "زمردي ملكي مطرز",
    emoji: "🌿",
    bgGradient: "from-[#081F17] via-[#0D281E] to-[#04120D]",
    heartColor: "#1A4F3C",
    heartEmissive: "#246B52",
    particleColor: "#D4AF37",
    secondaryParticleColor: "#86EFAC",
    accentText: "text-emerald-300",
    cardBg: "rgba(10, 38, 29, 0.85)",
    cardBorder: "rgba(212, 175, 55, 0.35)",
  },
  velvet_burgundy: {
    id: "velvet_burgundy",
    name: "خمري مخملي فاخر",
    emoji: "🍷",
    bgGradient: "from-[#24060E] via-[#330913] to-[#120206]",
    heartColor: "#8C1527",
    heartEmissive: "#B31B32",
    particleColor: "#D4AF37",
    secondaryParticleColor: "#F4B8C5",
    accentText: "text-rose-300",
    cardBg: "rgba(43, 8, 17, 0.85)",
    cardBorder: "rgba(212, 175, 55, 0.35)",
  },
  midnight_navy: {
    id: "midnight_navy",
    name: "كحلي ليل مذهب",
    emoji: "🌌",
    bgGradient: "from-[#080E1A] via-[#0C1628] to-[#040810]",
    heartColor: "#162544",
    heartEmissive: "#243E70",
    particleColor: "#E2B86E",
    secondaryParticleColor: "#A3B8FF",
    accentText: "text-blue-300",
    cardBg: "rgba(12, 22, 40, 0.85)",
    cardBorder: "rgba(226, 184, 110, 0.35)",
  },
  rose_luxury: {
    id: "rose_luxury",
    name: "حب وورود",
    emoji: "🌹",
    bgGradient: "from-obsidian-950 via-burgundy-950 to-obsidian-900",
    heartColor: "#9E1B2F",
    heartEmissive: "#FF3355",
    particleColor: "#F4B8C5",
    secondaryParticleColor: "#DFB15B",
    accentText: "text-rose-glow",
    cardBg: "rgba(35, 10, 18, 0.65)",
    cardBorder: "rgba(244, 184, 197, 0.2)",
  },
  romantic_night: {
    id: "romantic_night",
    name: "ليلة رومانسية",
    emoji: "🌙",
    bgGradient: "from-[#05060F] via-[#0B0F24] to-[#05060F]",
    heartColor: "#2F3B78",
    heartEmissive: "#5468FF",
    particleColor: "#A3B8FF",
    secondaryParticleColor: "#E2E8FF",
    accentText: "text-indigo-300",
    cardBg: "rgba(11, 15, 36, 0.65)",
    cardBorder: "rgba(163, 184, 255, 0.2)",
  },
  galaxy_stars: {
    id: "galaxy_stars",
    name: "مجرة ونجوم",
    emoji: "✨",
    bgGradient: "from-[#08020D] via-[#1A052E] to-[#08020D]",
    heartColor: "#6A149B",
    heartEmissive: "#B94BFF",
    particleColor: "#E3A3FF",
    secondaryParticleColor: "#FFE399",
    accentText: "text-purple-300",
    cardBg: "rgba(26, 5, 46, 0.65)",
    cardBorder: "rgba(227, 163, 255, 0.25)",
  },
  golden_sunset: {
    id: "golden_sunset",
    name: "غروب دافئ",
    emoji: "🌅",
    bgGradient: "from-[#0D0502] via-[#2A0E06] to-[#120702]",
    heartColor: "#B54E15",
    heartEmissive: "#FF8C42",
    particleColor: "#FFC58D",
    secondaryParticleColor: "#FFDF96",
    accentText: "text-amber-300",
    cardBg: "rgba(42, 14, 6, 0.65)",
    cardBorder: "rgba(255, 197, 141, 0.25)",
  },
  sakura_blossom: {
    id: "sakura_blossom",
    name: "أزهار الكرز",
    emoji: "🌸",
    bgGradient: "from-[#0E0609] via-[#260D17] to-[#0E0609]",
    heartColor: "#C94572",
    heartEmissive: "#FF75A7",
    particleColor: "#FFD0E0",
    secondaryParticleColor: "#FFFFFF",
    accentText: "text-pink-300",
    cardBg: "rgba(38, 13, 23, 0.65)",
    cardBorder: "rgba(255, 208, 224, 0.25)",
  },
  noir_luxury: {
    id: "noir_luxury",
    name: "أسود فاخر",
    emoji: "🖤",
    bgGradient: "from-[#030303] via-[#121212] to-[#030303]",
    heartColor: "#222222",
    heartEmissive: "#DFB15B",
    particleColor: "#DFB15B",
    secondaryParticleColor: "#E5E5E5",
    accentText: "text-gold-glow",
    cardBg: "rgba(18, 18, 18, 0.75)",
    cardBorder: "rgba(223, 177, 91, 0.3)",
  },
  dreamy_pink: {
    id: "dreamy_pink",
    name: "وردي حالم",
    emoji: "💗",
    bgGradient: "from-[#0D050A] via-[#240A1A] to-[#0D050A]",
    heartColor: "#B82E78",
    heartEmissive: "#FF4DAB",
    particleColor: "#FFA3D7",
    secondaryParticleColor: "#FFF0F8",
    accentText: "text-pink-300",
    cardBg: "rgba(36, 10, 26, 0.65)",
    cardBorder: "rgba(255, 163, 215, 0.25)",
  },
  memory_vintage: {
    id: "memory_vintage",
    name: "ذكريات دافئة",
    emoji: "📸",
    bgGradient: "from-[#0A0704] via-[#1F1710] to-[#0A0704]",
    heartColor: "#804A26",
    heartEmissive: "#C47945",
    particleColor: "#DFBA91",
    secondaryParticleColor: "#F5EAD9",
    accentText: "text-amber-200",
    cardBg: "rgba(31, 23, 16, 0.7)",
    cardBorder: "rgba(223, 186, 145, 0.25)",
  },
};

export interface VisualEffectOption {
  id: VisualEffectType;
  title: string;
  emoji: string;
  description: string;
}

export const VISUAL_EFFECTS_LIST: VisualEffectOption[] = [
  {
    id: "petals",
    title: "بتلات الورد",
    emoji: "🌹",
    description: "بتلات ورد تتطاير وتتساقط في حركة سينمائية هادئة",
  },
  {
    id: "hearts",
    title: "قلوب ثلاثية الأبعاد",
    emoji: "❤️",
    description: "قلوب صغيرة متوهجة تطفو وترتفع في الفضاء",
  },
  {
    id: "snow",
    title: "ثلج رومانسي",
    emoji: "❄️",
    description: "بلورات ثلج ناعمة تضفي لمسة شتوية دافئة وحالمة",
  },
  {
    id: "fireflies",
    title: "يراعات مضيئة",
    emoji: "✨",
    description: "نقاط ضوئية ذهبية تنبض كالنجوم الدافئة",
  },
  {
    id: "stardust",
    title: "غبار النجوم",
    emoji: "🌌",
    description: "سديم من الجزيئات المتلألئة تحيط بالقلب الزجاجي",
  },
];

export const PRESET_YOUTUBE_SONGS = [
  {
    title: "أنت عمري — كلاسيكيات",
    artist: "موسيقى شرقية رومانسية",
    videoId: "y6120QOlsfU",
    url: "https://www.youtube.com/watch?v=y6120QOlsfU",
    startTime: 45,
    endTime: 165,
  },
  {
    title: "ع بالي حبيبي",
    artist: "لحن الرومانسية الدافئ",
    videoId: "hT_nvWreIhg",
    url: "https://www.youtube.com/watch?v=hT_nvWreIhg",
    startTime: 30,
    endTime: 150,
  },
  {
    title: "Tender Romantic Piano",
    artist: "بيانو سينمائي عالمي",
    videoId: "4Tr0otuiQuU",
    url: "https://www.youtube.com/watch?v=4Tr0otuiQuU",
    startTime: 10,
    endTime: 120,
  },
];

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function formatTimeMMSS(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  const directSec = Number(timeStr);
  return isNaN(directSec) ? 0 : directSec;
}

export const SAMPLE_ROMANTIC_QUOTES = [
  "لو عاد بي الزمن إلى البداية، لاخترتكِ في كل مرة دون تردد.",
  "أنتِ لستِ مجرد صدفة جميلة، بل دعاء استجاب الله له بعد طول رجاء.",
  "كل لحظة معكِ هي عمرٌ كامل من الطمأنينة والفرح.",
  "ضحكتكِ تختصر كل المعاني الجميلة في هذا العالم.",
  "معكِ تعلمتُ أن للحب وطناً، وأنكِ أنتِ الوطن.",
];

export const INITIAL_GIFT_DATA = {
  senderName: "",
  recipientName: "",
  relationship: "حبيبتي" as const,
  hasStoryDate: true,
  storyDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  storyDateType: "أول لقاء" as const,
  loveLetter: "منذ أن دخلتِ حياتي، تغير كل شيء للأجمل... أصبحت الأيام أكثر دفئاً، وتفاصيل الحياة أبهى. شكراً لأنكِ كنتِ وما زلتِ أعظم هدية أهداني إياها القدر ❤️",
  letterTone: "رومانسي" as const,
  memories: [
    {
      id: "sample-1",
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      title: "أجمل يوم جمعنا",
      description: "اليوم الذي التقت فيه قلوبنا وتغيرت فيه ملامح عالمي بالكامل.",
      order: 0,
    },
    {
      id: "sample-2",
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
      title: "ضحكتنا الأولى",
      description: "حين ضحكتِ لأول مرة، شعرت أن كل همومي قد تلاشت في لحظة.",
      order: 1,
    }
  ],
  galleryStyle: "polaroid" as const,
  audioSourceType: "preset" as AudioSourceType,
  audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
  audioTitle: "لحن قلبي ❤️",
  audioArtist: "بيانو رومانسي هادئ",
  youtubeUrl: "",
  youtubeVideoId: "",
  audioStartTime: 0,
  audioEndTime: 180,
  traits: [
    { id: "1", title: "ابتسامتكِ الساحرة", description: "تشرق في قلبي كلما اشتدت عليّ الأيام وتمنحني أملاً متجدداً." },
    { id: "2", title: "طيبتكِ وحنانكِ", description: "قلبكِ النقي الذي لا يعرف إلا الحب والاحتواء لكل من حولك." },
    { id: "3", title: "وقوفكِ بجانبي دائماً", description: "لأنكِ اليد التي تمسك بيدي في كل خطوة دون أن تفلت أبداً." }
  ],
  theme: "rose_luxury" as const,
  visualEffects: ["petals", "stardust"] as VisualEffectType[],
  isPasswordProtected: false,
  password: "",
  hasScheduleDate: false,
  finalPledge: "أحبكِ إلى الأبد ❤️",
};
