"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Loader2, Sparkles } from "lucide-react";
import { searchUsers } from "@/app/lib/deezer-api";
import type { DeezerUser } from "@/app/types/deezer";
import Image from "next/image";
import { useLanguage } from "@/app/context/language-context";

/**
 * Proxy an image URL through our API to avoid CORS issues
 */
function getProxiedImageUrl(url: string): string {
  if (!url) return "";
  return `/api/deezer/image?url=${encodeURIComponent(url)}`;
}

interface HeroSearchProps {
  onUserSelect: (user: DeezerUser) => void;
}

/**
 * HeroSearch Component
 * Capsule-shaped search input with animated dropdown for user discovery
 */
export function HeroSearch({ onUserSelect }: HeroSearchProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DeezerUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchUsers(searchQuery);
      setResults(response.data || []);
      setIsOpen(response.data?.length > 0);
    } catch {
      setError("Failed to search. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle user selection
  const handleSelect = (user: DeezerUser) => {
    setIsOpen(false);
    setQuery(user.name);
    onUserSelect(user);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="relative mx-auto w-full max-w-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.div
          className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Sparkles className="text-primary h-4 w-4" />
          <span className="text-text-secondary text-sm">{t.discoverYourMusicLegend}</span>
        </motion.div>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
          <span className="text-gradient">{t.title.split(" ")[0]}</span>{" "}
          <span className="text-white">{t.title.split(" ")[1] || "Legends"}</span>
        </h1>

        <p className="text-text-secondary mx-auto max-w-md text-lg">{t.subtitle}</p>
      </motion.div>

      {/* Search Input with Glow Effect */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="group relative flex items-center">
          {/* Glow Background */}
          <div
            className={`from-primary/50 to-primary/50 absolute -inset-1 rounded-full bg-gradient-to-r via-purple-500/50 opacity-0 blur-md transition-all duration-300 ${isFocused ? "opacity-60" : "group-hover:opacity-30"} `}
          />

          <div className="text-text-muted absolute left-5 z-10">
            {isLoading ? (
              <Loader2 className="text-primary h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              results.length > 0 && setIsOpen(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={t.searchPlaceholder}
            className={`placeholder:text-text-muted relative flex h-14 w-full rounded-full border bg-[#191919] py-2 pr-6 pl-14 text-base text-white transition-all duration-300 ${
              isFocused
                ? "border-primary/50 ring-primary/30 shadow-[0_0_20px_rgba(162,54,255,0.3)] ring-2"
                : "hover:border-primary/30 border-white/10 hover:shadow-[0_0_15px_rgba(162,54,255,0.15)]"
            } focus:outline-none`}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="absolute mt-2 w-full text-center text-sm text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Dropdown Results */}
        <AnimatePresence>
          {isOpen && results.length > 0 && (
            <motion.div
              className="dropdown-menu absolute top-full right-0 left-0 z-50 mt-3"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-h-80 overflow-y-auto py-2">
                {results.map((user, index) => (
                  <motion.button
                    key={user.id}
                    className="dropdown-item w-full text-left"
                    onClick={() => handleSelect(user)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="bg-surface-elevated relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                      {user.picture_medium ? (
                        <Image
                          src={getProxiedImageUrl(user.picture_medium)}
                          alt={user.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="text-text-muted h-6 w-6" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">{user.name}</p>
                      {user.country && (
                        <p className="text-text-secondary truncate text-sm">{user.country}</p>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <span className="bg-primary/20 text-primary rounded-full px-2 py-1 text-xs">
                        {t.viewCard}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hint Text */}
      <motion.p
        className="text-text-muted mt-4 text-center text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {t.searchHint}
      </motion.p>
    </motion.div>
  );
}
