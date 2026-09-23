"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function SuccessCard({
  title,
  description,
  children,
}: SuccessCardProps) {
  return (
    <div
      className="p-6 sm:p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.1)] relative overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95"
    >
      <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
        <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
          {description}
        </p>
      </div>

      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}
