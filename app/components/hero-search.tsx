"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Loader2, Sparkles } from "lucide-react";
import { searchUsers } from "@/app/lib/deezer-api";
import type { DeezerUser } from "@/app/types/deezer";
import Image from "next/image";

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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DeezerUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
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
      className="relative w-full max-w-xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-text-secondary">
            Discover Your Music Legend
          </span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
          <span className="text-gradient">Deezer</span>{" "}
          <span className="text-white">Legends</span>
        </h1>

        <p className="text-text-secondary text-lg max-w-md mx-auto">
          Search for any Deezer user and generate their unique holographic
          trading card
        </p>
      </motion.div>

      {/* Search Input */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="relative flex items-center">
          <div className="absolute left-5 text-text-muted">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Enter a Deezer username..."
            className="input-capsule w-full pl-14 pr-6"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="absolute mt-2 text-sm text-red-400 text-center w-full"
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
              className="absolute top-full left-0 right-0 mt-3 dropdown-menu z-50"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-2 max-h-80 overflow-y-auto">
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
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-elevated flex-shrink-0">
                      {user.picture_medium ? (
                        <Image
                          src={getProxiedImageUrl(user.picture_medium)}
                          alt={user.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-6 h-6 text-text-muted" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {user.name}
                      </p>
                      {user.country && (
                        <p className="text-sm text-text-secondary truncate">
                          {user.country}
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                        View Card
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
        className="text-center text-text-muted text-sm mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Try searching for your Deezer name or username
      </motion.p>
    </motion.div>
  );
}

