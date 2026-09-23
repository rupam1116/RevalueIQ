/**
 * RevalueIQ — Official Enterprise Design System
 * Defines reusable color tokens, typography, glassmorphism presets,
 * component design standards, and animation motion presets.
 */

export const REVALUE_DESIGN_SYSTEM = {
  name: "RevalueIQ Design System",
  version: "2.0.0",
  theme: "Dark Tech & Sustainability",
  
  // Primary Palette
  colors: {
    background: "#030712", // Deep Space Navy
    surface: "#0c1222",    // Slate Card Surface
    surfaceHover: "#151d32",
    border: "rgba(255, 255, 255, 0.08)",
    borderHover: "rgba(6, 182, 212, 0.3)",
    
    // Core Identity Accents
    primary: {
      main: "#3b82f6",     // High-Tech Blue
      light: "#60a5fa",
      dark: "#1d4ed8",
      glow: "rgba(59, 130, 246, 0.25)",
    },
    cyan: {
      main: "#06b6d4",     // Innovation Cyan
      light: "#22d3ee",
      dark: "#0891b2",
      glow: "rgba(6, 182, 212, 0.25)",
    },
    emerald: {
      main: "#10b981",    // Eco Sustainability Emerald
      light: "#34d399",
      dark: "#059669",
      glow: "rgba(16, 185, 129, 0.25)",
    },
    
    // Text Hierarchy
    text: {
      primary: "#f8fafc",   // High contrast white
      secondary: "#94a3b8", // Slate 400
      muted: "#64748b font-normal",    // Slate 500
      dim: "#475569",
    },

    // Status Colors
    status: {
      error: "#ef4444",
      errorBg: "rgba(239, 68, 68, 0.1)",
      errorBorder: "rgba(239, 68, 68, 0.25)",
      success: "#10b981",
      successBg: "rgba(16, 185, 129, 0.1)",
      successBorder: "rgba(16, 185, 129, 0.25)",
      warning: "#f59e0b",
      info: "#06b6d4",
    }
  },

  // Glassmorphism System
  glass: {
    card: "backdrop-blur-xl bg-[#0c1222]/80 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
    input: "bg-slate-950/80 border border-slate-800/80 focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder:text-slate-500 transition-all duration-200",
    buttonPrimary: "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-[0.99]",
    buttonCyan: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all duration-200 active:scale-[0.99]",
    buttonEmerald: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-[0.99]",
  },

  // Motion Variants for Framer Motion
  motion: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
    scaleUp: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    },
    staggerContainer: {
      animate: {
        transition: {
          staggerChildren: 0.08
        }
      }
    }
  }
} as const;

export type RevalueDesignSystem = typeof REVALUE_DESIGN_SYSTEM;
