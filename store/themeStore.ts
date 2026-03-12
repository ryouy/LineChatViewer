import { create } from "zustand";
import type { ThemeConfig, ThemeId } from "@/types/theme";

export const THEMES: Record<ThemeId, ThemeConfig> = {
  line: {
    id: "line",
    name: "LINE",
    background: "#e5ddd5",
    bubbleMine: "#a7e070",
    bubbleOther: "#ffffff",
    bubbleMineText: "#000000",
    bubbleOtherText: "#000000",
    headerBg: "#b2c7d9",
    headerText: "#ffffff",
    dateSeparatorBg: "rgba(0,0,0,0.15)",
    dateSeparatorText: "#666666",
    systemMessageBg: "rgba(0,0,0,0.08)",
    systemMessageText: "#666666",
  },
  light: {
    id: "light",
    name: "Light",
    background: "#f5f5f5",
    bubbleMine: "#dcf8c6",
    bubbleOther: "#ffffff",
    bubbleMineText: "#000000",
    bubbleOtherText: "#000000",
    headerBg: "#075e54",
    headerText: "#ffffff",
    dateSeparatorBg: "rgba(0,0,0,0.1)",
    dateSeparatorText: "#666666",
    systemMessageBg: "rgba(0,0,0,0.06)",
    systemMessageText: "#666666",
  },
  dark: {
    id: "dark",
    name: "Dark",
    background: "#0b141a",
    bubbleMine: "#005c4b",
    bubbleOther: "#202c33",
    bubbleMineText: "#e9edef",
    bubbleOtherText: "#e9edef",
    headerBg: "#202c33",
    headerText: "#e9edef",
    dateSeparatorBg: "rgba(255,255,255,0.1)",
    dateSeparatorText: "#8696a0",
    systemMessageBg: "rgba(255,255,255,0.08)",
    systemMessageText: "#8696a0",
  },
};

type ThemeState = {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  getTheme: () => ThemeConfig;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeId: "line",

  setTheme: (id) => set({ themeId: id }),

  getTheme: () => THEMES[get().themeId],
}));
