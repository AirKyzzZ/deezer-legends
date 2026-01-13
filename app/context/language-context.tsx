"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { type Language, translations, type Translations } from "@/app/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Detects the user's preferred language from browser settings
 */
function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "fr";

  const browserLang = navigator.language || navigator.languages?.[0] || "fr";
  // Check if the browser language starts with "fr" (e.g., "fr", "fr-FR", "fr-CA")
  return browserLang.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  // Detect browser language on mount (legitimate use case for SSR hydration)
  useEffect(() => {
    const detectedLang = detectBrowserLanguage();
    if (detectedLang !== language) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Required for browser language detection after SSR hydration
      setLanguageState(detectedLang);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- Only run once on mount

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
