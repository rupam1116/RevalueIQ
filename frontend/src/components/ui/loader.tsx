"use client";

import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  variant?: "emerald" | "teal" | "forest";
}

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  text,
  variant = "emerald",
}) => {
  const sizeMap = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colorMap = {
    emerald: "border-emerald-600 border-t-transparent text-emerald-600 dark:border-emerald-400 dark:border-t-transparent",
    teal: "border-teal-600 border-t-transparent text-teal-600 dark:border-teal-400 dark:border-t-transparent",
    forest: "border-emerald-800 border-t-transparent text-emerald-800 dark:border-emerald-500 dark:border-t-transparent",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div className="relative flex items-center justify-center">
        <div
          className={`rounded-full border-2 animate-spin ${sizeMap[size]} ${colorMap[variant]}`}
        />
        <div
          className="absolute inset-0 rounded-full bg-emerald-500/20 blur-sm animate-pulse"
        />
      </div>
      {text && <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 animate-pulse">{text}</p>}
    </div>
  );
};
