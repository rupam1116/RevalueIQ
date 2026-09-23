"use client";

import React from "react";
import Link from "next/link";
import { Camera, Leaf, ArrowRight, ShieldCheck } from "lucide-react";

export default function EmptyState() {
  return (
    <div
      className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 text-center space-y-6 shadow-xl relative overflow-hidden my-6 transition-all duration-300 animate-in fade-in zoom-in-95"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Illustration Badge */}
      <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600/20 via-teal-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
        <Camera className="w-10 h-10 stroke-[2]" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          No Devices Analyzed Yet
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          Start by scanning your first smartphone, laptop, or electronic device to get instant AI pricing, circular condition grading, and repair recommendations.
        </p>
      </div>

      <div className="pt-2 flex justify-center">
        <Link
          href="/upload"
          className="inline-flex items-center justify-center gap-2 px-8 h-13 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-600/20 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 group border-0"
        >
          <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Analyze Device for Eco Valuation</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
