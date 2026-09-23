"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
  variant?: "emerald" | "teal" | "forest";
  icon?: React.ReactNode;
}

export default function LoadingButton({
  loading = false,
  children,
  variant = "emerald",
  icon,
  className = "",
  disabled,
  ...props
}: LoadingButtonProps) {
  const gradients = {
    emerald: "from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-emerald-600/25",
    teal: "from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-700 hover:to-emerald-700 shadow-teal-600/25",
    forest: "from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-900 hover:to-teal-900 shadow-emerald-900/25",
  };

  return (
    <button
      disabled={loading || disabled}
      className={`relative w-full h-12 rounded-xl bg-gradient-to-r ${gradients[variant]} text-white font-bold text-sm sm:text-base shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${className}`}
      {...props}
    >
      {/* Subtle Shimmer Effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />

      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-white" />
          <span>Processing...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {children}
          {icon && <span className="shrink-0">{icon}</span>}
        </span>
      )}
    </button>
  );
}
