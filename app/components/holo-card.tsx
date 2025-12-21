"use client";

import { useRef, useState, useCallback, forwardRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Music, Users, ListMusic, Disc3, Zap } from "lucide-react";
import Image from "next/image";
import type { LegendCardData } from "@/app/types/deezer";

/**
 * Proxy an image URL through our API to avoid CORS issues
 */
function getProxiedImageUrl(url: string): string {
  if (!url) return "";
  return `/api/deezer/image?url=${encodeURIComponent(url)}`;
}

interface HoloCardProps {
  data: LegendCardData;
}

/**
 * Custom hook for 3D tilt effect
 * Implements the tilt functionality without external dependencies
 */
function useTilt() {
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    shineX: 50,
    shineY: 50,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation (max 15 degrees)
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      // Calculate shine position (0-100%)
      const shineX = (x / rect.width) * 100;
      const shineY = (y / rect.height) * 100;

      setTransform({ rotateX, rotateY, shineX, shineY });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });
  }, []);

  return { transform, handleMouseMove, handleMouseLeave };
}

/**
 * Get rank class based on legend rank
 */
function getRankClass(rank: string): string {
  const rankMap: Record<string, string> = {
    MYTHIC: "rank-mythic",
    LEGENDARY: "rank-legendary",
    EPIC: "rank-epic",
    RARE: "rank-rare",
    COMMON: "rank-common",
  };
  return rankMap[rank] || "rank-common";
}

/**
 * Format large numbers
 */
function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

/**
 * HoloCard Component
 * A holographic trading card with 3D tilt effects
 */
export const HoloCard = forwardRef<HTMLDivElement, HoloCardProps>(
  function HoloCard({ data }, ref) {
    const cardRef = useRef<HTMLDivElement>(null);
    const { transform, handleMouseMove, handleMouseLeave } = useTilt();
    const { user, stats } = data;

    // Proxy the user image to avoid CORS issues during export
    const proxiedImageUrl = useMemo(
      () => getProxiedImageUrl(user.picture_xl || user.picture_big),
      [user.picture_xl, user.picture_big]
    );

    return (
      <motion.div
        ref={ref}
        className="relative"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          ref={cardRef}
          className="relative w-[340px] md:w-[380px] aspect-[2.5/3.5] cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Card Container with 3D Transform */}
          <div
            className="relative w-full h-full rounded-[2rem] overflow-hidden transition-transform duration-200 ease-out"
            style={{
              transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
              transformStyle: "preserve-3d",
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.8),
                0 0 60px -15px rgba(162, 54, 255, 0.4),
                ${transform.rotateY * 2}px ${transform.rotateX * -2}px 30px rgba(0, 0, 0, 0.3)
              `,
            }}
          >
            {/* Card Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]" />

            {/* Holographic Overlay */}
            <div
              className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none z-20"
              style={{
                background: `
                  linear-gradient(
                    ${45 + transform.rotateY * 2}deg,
                    rgba(255, 107, 107, 0.5) 0%,
                    rgba(254, 202, 87, 0.5) 25%,
                    rgba(72, 219, 251, 0.5) 50%,
                    rgba(162, 54, 255, 0.5) 75%,
                    rgba(29, 209, 161, 0.5) 100%
                  )
                `,
              }}
            />

            {/* Shine Effect */}
            <div
              className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
              style={{
                background: `
                  radial-gradient(
                    circle at ${transform.shineX}% ${transform.shineY}%,
                    rgba(255, 255, 255, 0.25) 0%,
                    rgba(255, 255, 255, 0.1) 20%,
                    transparent 60%
                  )
                `,
                opacity: transform.rotateX !== 0 || transform.rotateY !== 0 ? 1 : 0,
              }}
            />

            {/* Card Content */}
            <div className="relative h-full flex flex-col p-5 z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Disc3 className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Deezer Legend
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getRankClass(stats.legendRank)}`}
                >
                  {stats.legendRank}
                </span>
              </div>

              {/* User Image */}
              <div className="relative mx-auto mb-4">
                <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
                  <Image
                    src={proxiedImageUrl}
                    alt={user.name}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                    crossOrigin="anonymous"
                  />
                </div>

                {/* Decorative Corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-lg" />
              </div>

              {/* User Name */}
              <h2 className="text-2xl md:text-3xl font-extrabold text-center text-white mb-1 truncate px-2">
                {user.name}
              </h2>

              {/* Country */}
              {user.country && (
                <p className="text-center text-text-secondary text-sm mb-4">
                  📍 {user.country}
                </p>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <StatBox
                  icon={<Users className="w-4 h-4" />}
                  label="Fans"
                  value={formatNumber(stats.totalFans)}
                />
                <StatBox
                  icon={<ListMusic className="w-4 h-4" />}
                  label="Playlists"
                  value={formatNumber(stats.totalPlaylists)}
                />
                <StatBox
                  icon={<Music className="w-4 h-4" />}
                  label="Tracks"
                  value={formatNumber(stats.totalTracks)}
                />
                <StatBox
                  icon={<Zap className="w-4 h-4" />}
                  label="Power"
                  value={formatNumber(stats.powerLevel)}
                  highlight
                />
              </div>

              {/* Bottom Badge */}
              <div className="mt-4 flex items-center justify-center">
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="text-xs font-medium text-text-secondary">
                    🎵 {stats.topGenre} Enthusiast
                  </span>
                </div>
              </div>
            </div>

            {/* Card Border Glow */}
            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/10 pointer-events-none" />
          </div>
        </div>

        {/* Shadow underneath */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 blur-2xl opacity-50"
          style={{
            background:
              "radial-gradient(ellipse, rgba(162, 54, 255, 0.4) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    );
  }
);

/**
 * StatBox Component
 * Individual stat display box
 */
function StatBox({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        flex items-center gap-2 p-3 rounded-xl
        ${highlight ? "bg-primary/20 border border-primary/30" : "bg-white/5 border border-white/10"}
      `}
    >
      <div className={highlight ? "text-primary" : "text-text-secondary"}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-secondary">{label}</p>
        <p
          className={`font-bold truncate ${highlight ? "text-primary" : "text-white"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

