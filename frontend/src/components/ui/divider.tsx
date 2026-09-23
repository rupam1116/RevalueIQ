"use client";

import React from "react";

interface DividerProps {
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ label, className = "" }) => {
  return (
    <div className={`relative my-6 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-slate-800/80" />
      </div>
      {label && (
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
          <span className="bg-[#0c1222] px-3 text-slate-500 rounded-full border border-slate-800/50">
            {label}
          </span>
        </div>
      )}
    </div>
  );
};
