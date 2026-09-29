export type CardCategory = 
  | 'wedding'      // دعوة زفاف ملكية
  | 'engagement'   // عقد قران وملكة
  | 'eid'          // بطاقة معايدة عيد الفطر والأضحى
  | 'ramadan'      // تهنئة شهر رمضان المبارك
  | 'graduation'   // تهنئة تخرج ونجاح
  | 'newborn'      // بشارة مولود
  | 'general';     // تهنئة خاصة وعامة

export type RelationshipType = 
  | 'حبيبتي'
  | 'حبيبي'
  | 'زوجتي'
  | 'زوجي'
  | 'خطيبتي'
  | 'خطيبي'
  | 'صديقتي'
  | 'صديقي'
  | 'شخص مميز ❤️'
  | 'الضيوف الكرام';

export type StoryDateType = 
  | 'أول لقاء'
  | 'أول رسالة'
  | 'أول موعد'
  | 'ذكرى الزواج'
  | 'ذكرى الخطوبة'
  | 'موعد الحفل'
  | 'تاريخ مخصص';

export type LetterTone = 
  | 'ملكي فاخر'
  | 'رسمي وقور'
  | 'شاعري'
  | 'دافئ'
  | 'رومانسي'
  | 'عميق'
  | 'لطيف'
  | 'عاطفي'
  | 'مختصر';

export type GalleryStyle = 
  | 'polaroid'
  | 'floating'
  | 'wall3d'
  | 'cards';

export type ThemePreset = 
  | 'royal_gold'        // ⚜️ ذهبي ملكي وعاجي
  | 'emerald_luxury'    // 🌿 زمردي ملكي مطرز
  | 'velvet_burgundy'   // 🍷 خمري مخملي فاخر
  | 'midnight_navy'     // 🌌 كحلي ليل وسديم ذهبي
  | 'rose_luxury'       // 🌹 حب وورود
  | 'romantic_night'    // 🌙 ليلة رومانسية
  | 'galaxy_stars'      // ✨ مجرة ونجوم
  | 'golden_sunset'     // 🌅 غروب
  | 'sakura_blossom'    // 🌸 أزهار الكرز
  | 'noir_luxury'       // 🖤 أسود فاخر
  | 'dreamy_pink'       // 💗 وردي حالم
  | 'memory_vintage';   // 📸 ذكرياتنا

export type VisualEffectType = 
  | 'gold_dust'  // ذرات الذهب المتلألئة
  | 'petals'     // بتلات الورد المتساقطة
  | 'hearts'     // قلوب ثلاثية الأبعاد متطايرة
  | 'snow'       // ندف الثلج اللامعة
  | 'fireflies'  // يراعات ونجوم متلألئة
  | 'stardust';  // غبار النجوم الكوني

export interface MemoryMedia {
  id: string;
  url: string;
  title: string;
  description: string;
  date?: string;
  order: number;
}

export interface TraitItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export type AudioSourceType = 'preset' | 'upload' | 'url' | 'youtube';

export interface WeddingDetails {
  groomName: string;
  brideName: string;
  groomFamilyTitle?: string; // مثال: أبناء الشيخ فلان
  brideFamilyTitle?: string;
  quranVerse?: string;
  invitationWelcome?: string;
  eventDateHijri: string;
  eventDateGregorian: string;
  eventTime: string;
  hallName: string;
  city: string;
  mapLocationUrl?: string;
  rsvpEnabled: boolean;
  rsvpPhone?: string;
  rsvpDeadline?: string;
  dressCode?: string;
  childrenNotice?: string;
  waxSealInitial?: string;
  waxSealColor?: 'gold' | 'burgundy' | 'emerald' | 'navy';
  envelopeStyle?: 'ivory_gold' | 'royal_emerald' | 'velvet_burgundy' | 'midnight_navy';
}

export interface GiftExperience {
  id: string;
  shortCode: string;
  
  // التصنيف الرئيسي
  cardCategory?: CardCategory;

  // تفاصيل العرس والمناسبات الملكية (اختيارية حسب النوع)
  weddingDetails?: WeddingDetails;
  
  // الخطوة 1: الهوية والعلاقة
  senderName: string;
  recipientName: string;
  relationship: RelationshipType;
  
  // الخطوة 2: بداية القصة أو موعد المناسبة
  hasStoryDate: boolean;
  storyDate?: string;
  storyDateType?: StoryDateType;
  
  // الخطوة 3: رسالة الدعوة أو المعايدة
  loveLetter: string;
  letterTone: LetterTone;
  
  // الخطوة 4: الذكريات / معرض الصور
  memories: MemoryMedia[];
  galleryStyle: GalleryStyle;
  
  // الخطوة 5: الأغنية والزفة واليوتيوب
  audioSourceType?: AudioSourceType;
  audioUrl?: string;
  audioTitle?: string;
  audioArtist?: string;
  audioCoverUrl?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  audioStartTime?: number;
  audioEndTime?: number;
  
  // الخطوة 6: الفيديو
  videoUrl?: string;
  
  // الخطوة 7: مميزات أو محطات
  traits: TraitItem[];
  
  // الخطوة 8: القالب والتصميم
  theme: ThemePreset;
  visualEffects: VisualEffectType[];
  
  // الخطوة 9: الحماية والموعد
  isPasswordProtected: boolean;
  password?: string;
  hasScheduleDate: boolean;
  scheduledUnlockAt?: string;
  
  // الخطوة 10: النهاية والمشاركة
  finalPledge: string;
  
  // البيانات الإضافية
  createdAt: string;
  isOpened?: boolean;
  openedAt?: string;
}
