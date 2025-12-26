"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Check, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { useLanguage } from "@/app/context/language-context";

interface DownloadButtonProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  userName: string;
}

/**
 * DownloadButton Component
 * Exports the trading card as a high-quality PNG
 */
export function DownloadButton({ cardRef, userName }: DownloadButtonProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;

    setStatus("loading");

    try {
      // Get the actual card element (the inner div with the styling)
      const cardElement = cardRef.current.querySelector(
        ".cursor-pointer"
      ) as HTMLElement;

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Ensure all images are fully loaded before capturing
      const images = Array.from(cardElement.querySelectorAll("img"));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // Continue even if error
          });
        })
      );

      // Wait a tiny bit for rendering to settle
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Generate PNG with high quality settings
      const dataUrl = await toPng(cardElement, {
        quality: 1,
        pixelRatio: 3, // High resolution
        backgroundColor: "#000000",
        cacheBust: true, // Bust cache for fresh images
        skipAutoScale: true, // Prevent html-to-image from handling scaling, we want raw size * pixelRatio
        style: {
          transform: "none", // Reset any transforms for clean export
        },
        filter: () => {
          // Skip problematic elements if needed
          return true;
        },
      });

      // Create download link
      const link = document.createElement("a");
      const fileName = `${userName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-legend-card.png`;
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      setStatus("success");

      // Reset after 2 seconds
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to export card:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [cardRef, userName]);

  const getButtonContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t.generating}</span>
          </>
        );
      case "success":
        return (
          <>
            <Check className="w-5 h-5" />
            <span>{t.downloaded}</span>
          </>
        );
      case "error":
        return (
          <>
            <Download className="w-5 h-5" />
            <span>{t.tryAgain}</span>
          </>
        );
      default:
        return (
          <>
            <Download className="w-5 h-5" />
            <span>{t.downloadCard}</span>
          </>
        );
    }
  };

  return (
    <motion.button
      className={`
        btn-primary flex items-center gap-2 min-w-[160px] justify-center
        ${status === "success" ? "!bg-green-500 !shadow-[0_0_30px_rgba(34,197,94,0.4)]" : ""}
        ${status === "error" ? "!bg-red-500 !shadow-[0_0_30px_rgba(239,68,68,0.4)]" : ""}
      `}
      onClick={handleDownload}
      disabled={status === "loading"}
      whileHover={{ scale: status === "idle" ? 1.05 : 1 }}
      whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {getButtonContent()}
    </motion.button>
  );
}
