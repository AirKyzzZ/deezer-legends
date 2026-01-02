"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  X,
  Twitter,
  Linkedin,
  Send,
  MessageCircle,
  Link2,
  Check,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/app/context/language-context";
import { toBlob } from "html-to-image";

interface ShareButtonProps {
  userName: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

interface ShareOption {
  name: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

/**
 * ShareButton Component
 * Allows sharing the card image directly to social media platforms
 */
export function ShareButton({ userName, cardRef }: ShareButtonProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = t.shareTitle;
  const shareText = "Découvrez ma carte Deezer Legends ! 🎵";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const generateCardImage = useCallback(async () => {
    if (!cardRef.current) return null;

    try {
      const cardElement = cardRef.current.querySelector(".cursor-pointer") as HTMLElement;

      if (!cardElement) return null;

      const blob = await toBlob(cardElement, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: "#000000",
        cacheBust: true,
        style: {
          transform: "none",
        },
      });

      return blob;
    } catch (error) {
      console.error("Failed to generate image for sharing:", error);
      return null;
    }
  }, [cardRef]);

  const handleNativeShare = useCallback(async () => {
    setIsGenerating(true);
    try {
      const blob = await generateCardImage();

      if (blob && navigator.share) {
        const file = new File([blob], "deezer-legend-card.png", {
          type: "image/png",
        });

        // Check if file sharing is supported
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            files: [file],
          });
        } else {
          // Fallback to URL sharing if files not supported
          await navigator.share({
            title: shareTitle,
            text: shareText + " " + shareUrl,
            url: shareUrl,
          });
        }
        setIsOpen(false);
      } else {
        // Fallback for desktop or failed blob
        setIsOpen(true);
      }
    } catch (err) {
      console.log("Share cancelled or failed:", err);
      // If native share fails/cancelled, maybe open menu?
      // Usually users cancel, so doing nothing is fine.
    } finally {
      setIsGenerating(false);
    }
  }, [generateCardImage, shareTitle, shareText, shareUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy link");
    }
  }, [shareUrl]);

  const shareOptions: ShareOption[] = [
    {
      name: "X (Twitter)",
      icon: <Twitter className="h-5 w-5" />,
      color: "#000000",
      action: () => {
        const text = encodeURIComponent(shareText + " " + shareUrl);
        const url = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(url, "_blank", "noopener,noreferrer");
        setIsOpen(false);
      },
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      color: "#0077b5",
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        setIsOpen(false);
      },
    },
    {
      name: "Discord",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "#5865F2",
      action: () => {
        navigator.clipboard.writeText(shareText + " " + shareUrl);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          setIsOpen(false);
        }, 1500);
      },
    },
    {
      name: "Telegram",
      icon: <Send className="h-5 w-5" />,
      color: "#0088cc",
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        setIsOpen(false);
      },
    },
  ];

  // Check if native share is available
  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        className="btn-secondary flex min-w-[120px] items-center justify-center gap-2"
        onClick={() => (hasNativeShare ? handleNativeShare() : setIsOpen(!isOpen))}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        <span>{t.shareCard}</span>
      </motion.button>

      {/* Desktop Share Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="bg-surface absolute bottom-full left-1/2 z-50 mb-3 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-3">
              <span className="text-sm font-semibold text-white">{t.shareCard}</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Share Options */}
            <div className="p-2">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/10"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: option.color }}
                  >
                    {option.icon}
                  </div>
                  <span className="text-sm text-white">{option.name}</span>
                </button>
              ))}

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="mt-1 flex w-full items-center gap-3 rounded-xl border-t border-white/5 px-3 py-2.5 pt-3 text-left transition-colors hover:bg-white/10"
              >
                <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Link2 className="text-primary h-4 w-4" />
                  )}
                </div>
                <span className="text-sm text-white">{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
