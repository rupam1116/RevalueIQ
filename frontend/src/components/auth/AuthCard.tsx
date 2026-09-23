"use client";

import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "emerald" | "teal" | "forest";
}

export default function AuthCard({
  children,
  className = "",
  glowColor = "emerald",
}: AuthCardProps) {
  const glowGradients = {
    emerald: "from-emerald-600/30 via-teal-500/20 to-green-600/30",
    teal: "from-teal-500/30 via-emerald-500/20 to-teal-700/30",
    forest: "from-emerald-800/30 via-teal-600/20 to-emerald-900/30",
  };

  return (
    <div className={`relative w-full transition-all duration-300 animate-in fade-in zoom-in-95 ${className}`}>
      {/* Outer Gradient Glow */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${glowGradients[glowColor]} rounded-[2.5rem] blur-xl opacity-60 transition-all duration-700 pointer-events-none`}
      />

      {/* Main Glass Container */}
      <div className="relative rounded-[2rem] bg-[#0b1a13]/85 backdrop-blur-2xl border border-emerald-900/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-10 text-slate-100 space-y-6 overflow-hidden">
        {/* Subtle Top Inner Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent pointer-events-none" />

        {children}
      </div>
    </div>
  );
}
