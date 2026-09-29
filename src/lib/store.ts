import { create } from "zustand";
import { GiftExperience, MemoryMedia, TraitItem, ThemePreset, RelationshipType, StoryDateType, LetterTone, GalleryStyle } from "../types/gift";
import { INITIAL_GIFT_DATA } from "./templates";

interface CreatorState {
  currentStep: number;
  giftData: GiftExperience;
  isSaving: boolean;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateGiftData: (data: Partial<GiftExperience>) => void;
  addMemory: (memory: Omit<MemoryMedia, "id" | "order">) => void;
  removeMemory: (id: string) => void;
  addTrait: (trait: Omit<TraitItem, "id">) => void;
  removeTrait: (id: string) => void;
  resetGift: () => void;
  loadSavedGift: () => void;
}

const STORAGE_KEY = "hadity_lak_draft_v1";

export const useCreatorStore = create<CreatorState>((set, get) => ({
  currentStep: 1,
  giftData: {
    id: "temp-draft",
    shortCode: "",
    ...INITIAL_GIFT_DATA,
    createdAt: new Date().toISOString(),
  },
  isSaving: false,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => set((state) => ({ currentStep: Math.min(10, state.currentStep + 1) })),

  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

  updateGiftData: (data) => {
    set((state) => {
      const updated = { ...state.giftData, ...data };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to auto-save to localStorage", e);
        }
      }
      return { giftData: updated };
    });
  },

  addMemory: (memory) => {
    set((state) => {
      const newMemory: MemoryMedia = {
        ...memory,
        id: "mem_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        order: state.giftData.memories.length,
      };
      const updated = {
        ...state.giftData,
        memories: [...state.giftData.memories, newMemory],
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { giftData: updated };
    });
  },

  removeMemory: (id) => {
    set((state) => {
      const updated = {
        ...state.giftData,
        memories: state.giftData.memories.filter((m) => m.id !== id),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { giftData: updated };
    });
  },

  addTrait: (trait) => {
    set((state) => {
      const newTrait: TraitItem = {
        ...trait,
        id: "trait_" + Date.now(),
      };
      const updated = {
        ...state.giftData,
        traits: [...state.giftData.traits, newTrait],
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { giftData: updated };
    });
  },

  removeTrait: (id) => {
    set((state) => {
      const updated = {
        ...state.giftData,
        traits: state.giftData.traits.filter((t) => t.id !== id),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { giftData: updated };
    });
  },

  resetGift: () => {
    const freshData: GiftExperience = {
      id: "draft_" + Date.now(),
      shortCode: "",
      ...INITIAL_GIFT_DATA,
      senderName: "",
      recipientName: "",
      createdAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ giftData: freshData, currentStep: 1 });
  },

  loadSavedGift: () => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          set({ giftData: { ...get().giftData, ...parsed } });
        }
      } catch (e) {
        console.error("Failed to load saved gift draft", e);
      }
    }
  },
}));
