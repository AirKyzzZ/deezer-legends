"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, X, Twitter, Linkedin, Send, MessageCircle, Link2, Check, Loader2 } from "lucide-react";
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
      const cardElement = cardRef.current.querySelector(
        ".cursor-pointer"
      ) as HTMLElement;

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
      icon: <Twitter className="w-5 h-5" />,
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
      icon: <Linkedin className="w-5 h-5" />,
      color: "#0077b5",
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        setIsOpen(false);
      },
    },
    {
      name: "Discord",
      icon: <MessageCircle className="w-5 h-5" />,
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
      icon: <Send className="w-5 h-5" />,
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
        className="btn-secondary flex items-center gap-2 min-w-[120px] justify-center"
        onClick={() => (hasNativeShare ? handleNativeShare() : setIsOpen(!isOpen))}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        <span>{t.shareCard}</span>
      </motion.button>

      {/* Desktop Share Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <span className="text-sm font-semibold text-white">{t.shareCard}</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Share Options */}
            <div className="p-2">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
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
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left mt-1 border-t border-white/5 pt-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Link2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <span className="text-sm text-white">
                  {copied ? "Copied!" : "Copy Link"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
