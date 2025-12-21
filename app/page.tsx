"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { HeroSearch } from "@/app/components/hero-search";
import { HoloCard } from "@/app/components/holo-card";
import { DownloadButton } from "@/app/components/download-button";
import { BackgroundEffects } from "@/app/components/background-effects";
import { getLegendCardData } from "@/app/lib/deezer-api";
import type { DeezerUser, LegendCardData } from "@/app/types/deezer";

type AppState = "search" | "loading" | "card" | "error";

/**
 * Main Page Component
 * Orchestrates the flow: Search → Loading → Card Display
 */
export default function Home() {
  const [state, setState] = useState<AppState>("search");
  const [cardData, setCardData] = useState<LegendCardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleUserSelect = useCallback(async (user: DeezerUser) => {
    setState("loading");
    setError(null);

    try {
      const data = await getLegendCardData(user.id);
      setCardData(data);
      setState("card");
    } catch (err) {
      console.error("Failed to load user data:", err);
      setError("Failed to generate card. Please try again.");
      setState("error");
    }
  }, []);

  const handleReset = useCallback(() => {
    setState("search");
    setCardData(null);
    setError(null);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6">
      {/* Animated Background */}
      <BackgroundEffects />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
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
                <div className="w-20 h-20 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-primary" />
              </motion.div>

              <motion.p
                className="mt-6 text-xl font-semibold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Generating Legend Card...
              </motion.p>

              <motion.p
                className="mt-2 text-text-secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Analyzing music stats and creating your card
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
                className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full glass text-text-secondary hover:text-white transition-colors"
                onClick={handleReset}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ x: -4 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">New Search</span>
              </motion.button>

              {/* Card */}
              <HoloCard ref={cardRef} data={cardData} />

              {/* Actions */}
              <motion.div
                className="mt-8 flex flex-col sm:flex-row items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <DownloadButton
                  cardRef={cardRef}
                  userName={cardData.user.name}
                />

                <motion.button
                  className="btn-secondary flex items-center gap-2"
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Search Another</span>
                </motion.button>
              </motion.div>

              {/* Share Hint */}
              <motion.p
                className="mt-6 text-sm text-text-muted text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Share your Legend Card on social media! 🎵
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
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <span className="text-3xl">😢</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Oops! Something went wrong
              </h2>

              <p className="text-text-secondary mb-6 max-w-md">
                {error || "We couldn't generate the Legend Card. Please try again."}
              </p>

              <motion.button
                className="btn-primary flex items-center gap-2"
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.footer
        className="absolute bottom-4 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-xs text-text-muted">
          Made with 💜 by Maxime Mansiet • Not affiliated with Deezer
        </p>
      </motion.footer>
    </main>
  );
}
