"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { HeroSearch } from "@/app/components/hero-search";
import { HoloCard } from "@/app/components/holo-card";
import { DownloadButton } from "@/app/components/download-button";
import { ShareButton } from "@/app/components/share-button";
import { BackgroundEffects } from "@/app/components/background-effects";
import { getLegendCardData } from "@/app/lib/deezer-api";
import { useLanguage } from "@/app/context/language-context";
import type { DeezerUser, LegendCardData } from "@/app/types/deezer";

type AppState = "search" | "loading" | "card" | "error";

/**
 * Main Page Component
 * Orchestrates the flow: Search → Loading → Card Display
 */
export default function Home() {
  const { t } = useLanguage();
  const [state, setState] = useState<AppState>("search");
  const [cardData, setCardData] = useState<LegendCardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleUserSelect = useCallback(
    async (user: DeezerUser) => {
      setState("loading");
      setError(null);

      try {
        const data = await getLegendCardData(user.id);
        setCardData(data);
        setState("card");
      } catch (err) {
        console.error("Failed to load user data:", err);
        setError(t.errorMessage);
        setState("error");
      }
    },
    [t.errorMessage]
  );

  const handleReset = useCallback(() => {
    setState("search");
    setCardData(null);
    setError(null);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6">
      {/* Animated Background */}
      <BackgroundEffects />

      {/* Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {/* Search State */}
          {state === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-8"
            >
              <HeroSearch onUserSelect={handleUserSelect} />
            </motion.div>
          )}

          {/* Loading State */}
          {state === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="border-primary/20 h-20 w-20 rounded-full border-4" />
                <div className="border-t-primary absolute inset-0 h-20 w-20 rounded-full border-4 border-transparent" />
              </motion.div>

              <motion.p
                className="mt-6 text-xl font-semibold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t.generatingCard}
              </motion.p>

              <motion.p
                className="text-text-secondary mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t.analyzingStats}
              </motion.p>
            </motion.div>
          )}

          {/* Card Display State */}
          {state === "card" && cardData && (
            <motion.div
              key="card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-8"
            >
              {/* Back Button */}
              <motion.button
                className="glass text-text-secondary absolute top-6 left-6 flex items-center gap-2 rounded-full px-4 py-2 transition-colors hover:text-white"
                onClick={handleReset}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ x: -4 }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">{t.newSearch}</span>
              </motion.button>

              {/* Card */}
              <HoloCard ref={cardRef} data={cardData} />

              {/* Actions */}
              <motion.div
                className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <DownloadButton cardRef={cardRef} userName={cardData.user.name} />

                <ShareButton userName={cardData.user.name} cardRef={cardRef} />

                <motion.button
                  className="btn-secondary flex items-center gap-2"
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>{t.searchAnother}</span>
                </motion.button>
              </motion.div>

              {/* Share Hint */}
              <motion.p
                className="text-text-muted mt-6 text-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {t.shareOnSocial}
              </motion.p>
            </motion.div>
          )}

          {/* Error State */}
          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <span className="text-3xl">😢</span>
              </div>

              <h2 className="mb-2 text-2xl font-bold text-white">{t.oops}</h2>

              <p className="text-text-secondary mb-6 max-w-md">{error || t.errorMessage}</p>

              <motion.button
                className="btn-primary flex items-center gap-2"
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="h-4 w-4" />
                <span>{t.tryAgain}</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.footer
        className="absolute right-0 bottom-4 left-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-text-muted text-xs">
          {t.madeWith}{" "}
          <a
            href="https://github.com/airkyzzz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            {t.creatorName}
          </a>
          {" • "}
          {t.notAffiliated}
        </p>
      </motion.footer>
    </main>
  );
}
