"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/app/context/language-context";
import type { Language } from "@/app/lib/translations";

/**
 * LanguageSwitcher Component
 * Toggle between English and French
 */
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "fr", label: "FR", flag: "🇫🇷" },
  ];

  return (
    <motion.div
      className="flex items-center gap-1 p-1 rounded-full bg-surface border border-white/10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${
              language === lang.code
                ? "bg-primary text-white shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }
          `}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </motion.div>
  );
}

