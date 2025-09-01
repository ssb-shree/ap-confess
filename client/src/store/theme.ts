// store/themeStore.ts
import { create } from "zustand";

interface ThemeState {
  theme: string;
  setTheme: (t: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: typeof window !== "undefined" ? localStorage.getItem("theme") || "coffee" : "coffee",
  setTheme: (t: string) => {
    localStorage.setItem("theme", t);
    document.documentElement.setAttribute("data-theme", t);
    set({ theme: t });
  },
}));
