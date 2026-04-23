"use client";
import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext(null);

export function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Standardize to Light mode on first-visit using a fresh storage key
    const saved = localStorage.getItem("theme_v2");
    if (saved === null) {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      const isDark = saved === "true";
      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme_v2", next);
    document.documentElement.classList.toggle("dark", next);
  };

  return <DarkModeContext.Provider value={{ dark, toggle }}>{children}</DarkModeContext.Provider>;
}

export const useDarkMode = () => useContext(DarkModeContext);
