"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "odonto-manager-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.style.setProperty("color-scheme", theme === "dark" ? "dark" : "light");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      setThemeState((prev) => {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") {
          return stored;
        }
        return event.matches ? "dark" : "light";
      });
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: (next) => setThemeState(next),
      toggleTheme: () =>
        setThemeState((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
