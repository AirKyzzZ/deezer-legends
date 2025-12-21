"use client";

import { useRef, useState, useCallback, forwardRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Guitar,
  Mic,
  Zap,
  Piano,
  Music,
  Skull,
  Heart,
  Leaf,
  Disc3,
} from "lucide-react";
import Image from "next/image";
import type { LegendCardData, GenreType, Attack } from "@/app/types/deezer";
import { useLanguage } from "@/app/context/language-context";

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

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;
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
 * Get genre icon component
 */
function getGenreIcon(iconName: string, className: string = "w-5 h-5") {
  const icons: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className={className} />,
    Guitar: <Guitar className={className} />,
    Mic: <Mic className={className} />,
    Zap: <Zap className={className} />,
    Piano: <Piano className={className} />,
    Music: <Music className={className} />,
    Skull: <Skull className={className} />,
    Heart: <Heart className={className} />,
    Leaf: <Leaf className={className} />,
  };
  return icons[iconName] || <Music className={className} />;
}

/**
 * Get genre background gradient
 */
function getGenreGradient(genre: GenreType): string {
  const gradients: Record<GenreType, string> = {
    Pop: "from-pink-500/20 via-purple-500/10 to-pink-400/20",
    Rock: "from-red-500/20 via-orange-500/10 to-red-400/20",
    Rap: "from-orange-500/20 via-red-500/10 to-amber-400/20",
    "Hip-Hop": "from-orange-500/20 via-red-500/10 to-amber-400/20",
    Electronic: "from-cyan-400/20 via-blue-500/10 to-cyan-300/20",
    Jazz: "from-purple-500/20 via-violet-500/10 to-fuchsia-400/20",
    Classical: "from-amber-400/20 via-yellow-500/10 to-amber-300/20",
    Metal: "from-slate-600/30 via-gray-800/20 to-slate-500/30",
    "R&B": "from-pink-500/20 via-rose-500/10 to-pink-400/20",
    Indie: "from-green-500/20 via-emerald-500/10 to-green-400/20",
    Mixed: "from-purple-500/20 via-violet-500/10 to-purple-400/20",
  };
  return gradients[genre] || gradients.Mixed;
}

/**
 * Get genre border color
 */
function getGenreBorderColor(genre: GenreType): string {
  const colors: Record<GenreType, string> = {
    Pop: "border-pink-400/50",
    Rock: "border-red-500/50",
    Rap: "border-orange-500/50",
    "Hip-Hop": "border-orange-500/50",
    Electronic: "border-cyan-400/50",
    Jazz: "border-purple-500/50",
    Classical: "border-amber-400/50",
    Metal: "border-slate-500/50",
    "R&B": "border-pink-500/50",
    Indie: "border-green-500/50",
    Mixed: "border-purple-500/50",
  };
  return colors[genre] || colors.Mixed;
}

/**
 * Get rarity styles
 */
function getRarityStyles(rarity: string): { bg: string; text: string } {
  const styles: Record<string, { bg: string; text: string }> = {
    LEGENDARY: {
      bg: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500",
      text: "text-black",
    },
    "ULTRA RARE": {
      bg: "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500",
      text: "text-white",
    },
    RARE: {
      bg: "bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500",
      text: "text-white",
    },
    UNCOMMON: {
      bg: "bg-gradient-to-r from-green-500 via-emerald-400 to-green-500",
      text: "text-white",
    },
    COMMON: {
      bg: "bg-gradient-to-r from-gray-500 via-slate-400 to-gray-500",
      text: "text-white",
    },
  };
  return styles[rarity] || styles.COMMON;
}

/**
 * HoloCard Component - Pokemon/TCG Style with real genre names
 */
export const HoloCard = forwardRef<HTMLDivElement, HoloCardProps>(
  function HoloCard({ data }, ref) {
    const cardRef = useRef<HTMLDivElement>(null);
    const { transform, handleMouseMove, handleMouseLeave } = useTilt();
    const { user, tcg } = data;
    const { t, language } = useLanguage();

    const proxiedImageUrl = useMemo(
      () => getProxiedImageUrl(user.picture_xl || user.picture_big),
      [user.picture_xl, user.picture_big]
    );

    const genreGradient = getGenreGradient(tcg.element.genre);
    const genreBorder = getGenreBorderColor(tcg.element.genre);
    const rarityStyles = getRarityStyles(tcg.rarity);

    // Get localized rarity
    const localizedRarity = useMemo(() => {
      const rarityMap: Record<string, keyof typeof t> = {
        LEGENDARY: "legendary",
        "ULTRA RARE": "ultraRare",
        RARE: "rare",
        UNCOMMON: "uncommon",
        COMMON: "common",
      };
      const key = rarityMap[tcg.rarity];
      return key ? (t[key] as string) : tcg.rarity;
    }, [tcg.rarity, t]);

    // Get localized flavor text
    const flavorText = useMemo(() => {
      const texts = t.flavorTexts as Record<string, string>;
      return texts[tcg.genre] || texts.default;
    }, [tcg.genre, t.flavorTexts]);

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
          className="relative w-[320px] md:w-[360px] aspect-[2.5/3.5] cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Card Container with 3D Transform */}
          <div
            className={`relative w-full h-full rounded-[1.5rem] overflow-hidden transition-transform duration-200 ease-out border-4 ${genreBorder}`}
            style={{
              transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
              transformStyle: "preserve-3d",
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.8),
                0 0 60px -15px ${tcg.element.color}40,
                ${transform.rotateY * 2}px ${transform.rotateX * -2}px 30px rgba(0, 0, 0, 0.3)
              `,
            }}
          >
            {/* Card Background with Genre Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${genreGradient}`} />
            <div className="absolute inset-0 bg-[#0a0a12]/90" />

            {/* Holographic Overlay */}
            <div
              className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none z-20"
              style={{
                background: `
                  linear-gradient(
                    ${45 + transform.rotateY * 3}deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0.1) 25%,
                    ${tcg.element.color}40 50%,
                    rgba(255, 255, 255, 0.1) 75%,
                    transparent 100%
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
                    rgba(255, 255, 255, 0.3) 0%,
                    rgba(255, 255, 255, 0.1) 20%,
                    transparent 60%
                  )
                `,
                opacity: transform.rotateX !== 0 || transform.rotateY !== 0 ? 1 : 0,
              }}
            />

            {/* Card Content */}
            <div className="relative h-full flex flex-col p-4 z-10">
              {/* === HEADER: Name + HP === */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl font-extrabold text-white truncate">
                    {user.name}
                  </h2>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs text-white/60">{t.hp}</span>
                  <span className="text-2xl font-black text-white">{tcg.hp}</span>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center ml-1"
                    style={{ backgroundColor: tcg.element.color }}
                  >
                    {getGenreIcon(tcg.element.icon, "w-4 h-4 text-white")}
                  </div>
                </div>
              </div>

              {/* === IMAGE AREA === */}
              <div className="relative mb-3">
                {/* Image Frame */}
                <div
                  className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2"
                  style={{ borderColor: `${tcg.element.color}60` }}
                >
                  <Image
                    src={proxiedImageUrl}
                    alt={user.name}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                    crossOrigin="anonymous"
                  />

                  {/* Genre Type Badge */}
                  <div
                    className="absolute bottom-2 right-2 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold"
                    style={{ backgroundColor: tcg.element.color, color: "#fff" }}
                  >
                    {getGenreIcon(tcg.element.icon, "w-3 h-3")}
                    <span>{tcg.element.genre}</span>
                  </div>

                  {/* Rarity Badge */}
                  <div
                    className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold ${rarityStyles.bg} ${rarityStyles.text}`}
                  >
                    {localizedRarity}
                  </div>
                </div>

                {/* Flavor Text below image */}
                <p className="text-[10px] text-white/50 italic mt-1 text-center px-2 line-clamp-1">
                  {flavorText}
                </p>
              </div>

              {/* === ATTACKS LIST (Top Artists) === */}
              <div className="flex-1 flex flex-col gap-2">
                {tcg.attacks.map((attack, index) => (
                  <AttackRow
                    key={index}
                    attack={attack}
                    elementColor={tcg.element.color}
                    elementIcon={tcg.element.icon}
                  />
                ))}
              </div>

              {/* === FOOTER: Weakness / Resistance / Retreat === */}
              <div className="mt-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-[10px]">
                  {/* Weakness */}
                  <div className="flex items-center gap-1">
                    <span className="text-white/40 uppercase tracking-wide">{t.weakness}</span>
                    <GenreBadge genre={tcg.element.weakness} />
                    <span className="text-red-400 font-bold">×2</span>
                  </div>

                  {/* Resistance */}
                  <div className="flex items-center gap-1">
                    <span className="text-white/40 uppercase tracking-wide">{t.resistance}</span>
                    <GenreBadge genre={tcg.element.resistance} />
                    <span className="text-green-400 font-bold">-20</span>
                  </div>

                  {/* Retreat Cost */}
                  <div className="flex items-center gap-1">
                    <span className="text-white/40 uppercase tracking-wide">{t.retreat}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: tcg.retreatCost }).map((_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center"
                        >
                          <Disc3 className="w-3 h-3 text-white/60" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Number / Set Info */}
              <div className="mt-2 flex items-center justify-between text-[8px] text-white/30">
                <span>{t.deezerLegends} • {user.country || "INTL"}</span>
                <span>#{user.id.toString().slice(-4)}/9999</span>
              </div>
            </div>

            {/* Card Border Inner Glow */}
            <div
              className="absolute inset-0 rounded-[1.3rem] pointer-events-none"
              style={{
                boxShadow: `inset 0 0 20px ${tcg.element.color}20`,
              }}
            />
          </div>
        </div>

        {/* Shadow underneath */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 blur-2xl opacity-50"
          style={{
            background: `radial-gradient(ellipse, ${tcg.element.color}40 0%, transparent 70%)`,
          }}
        />
      </motion.div>
    );
  }
);

/**
 * Attack Row Component (Now shows Artist names)
 */
function AttackRow({
  attack,
  elementColor,
  elementIcon,
}: {
  attack: Attack;
  elementColor: string;
  elementIcon: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      {/* Energy Cost */}
      <div className="flex gap-0.5 flex-shrink-0">
        {Array.from({ length: attack.energyCost }).map((_, i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: elementColor }}
          >
            {getGenreIcon(elementIcon, "w-3 h-3 text-white")}
          </div>
        ))}
      </div>

      {/* Artist Name & Track */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{attack.name}</p>
        {attack.description && (
          <p className="text-[10px] text-white/50 truncate">{attack.description}</p>
        )}
      </div>

      {/* Damage */}
      <div className="flex-shrink-0">
        <span className="text-2xl font-black text-white">{attack.damage}</span>
      </div>
    </div>
  );
}

/**
 * Genre Badge Component
 */
function GenreBadge({ genre }: { genre: GenreType }) {
  const genreColors: Record<GenreType, string> = {
    Pop: "#ff69b4",
    Rock: "#e74c3c",
    Rap: "#ff6b35",
    "Hip-Hop": "#ff6b35",
    Electronic: "#00d4ff",
    Jazz: "#9b59b6",
    Classical: "#c9a227",
    Metal: "#2c3e50",
    "R&B": "#e91e63",
    Indie: "#27ae60",
    Mixed: "#a236ff",
  };

  const genreIcons: Record<GenreType, string> = {
    Pop: "Sparkles",
    Rock: "Guitar",
    Rap: "Mic",
    "Hip-Hop": "Mic",
    Electronic: "Zap",
    Jazz: "Piano",
    Classical: "Music",
    Metal: "Skull",
    "R&B": "Heart",
    Indie: "Leaf",
    Mixed: "Music",
  };

  const color = genreColors[genre] || genreColors.Mixed;
  const icon = genreIcons[genre] || "Music";

  return (
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center"
      style={{ backgroundColor: color }}
      title={genre}
    >
      {getGenreIcon(icon, "w-3 h-3 text-white")}
    </div>
  );
}
