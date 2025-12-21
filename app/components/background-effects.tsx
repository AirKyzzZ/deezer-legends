"use client";

import { motion } from "framer-motion";

/**
 * BackgroundEffects Component
 * Animated ambient background with floating orbs and gradients
 */
export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-black" />

      {/* Primary glow orb */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(162, 54, 255, 0.15) 0%, transparent 70%)",
          left: "20%",
          top: "10%",
        }}
        animate={{
          x: [0, 50, 0, -30, 0],
          y: [0, 30, 60, 30, 0],
          scale: [1, 1.1, 1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary glow orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)",
          right: "10%",
          bottom: "20%",
        }}
        animate={{
          x: [0, -40, 0, 30, 0],
          y: [0, -40, -20, 10, 0],
          scale: [1, 0.9, 1.05, 1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Accent orb */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(72, 219, 251, 0.08) 0%, transparent 70%)",
          left: "60%",
          top: "40%",
        }}
        animate={{
          x: [0, 60, 30, -20, 0],
          y: [0, -30, 40, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Top fade for header space */}
      <div
        className="absolute top-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

