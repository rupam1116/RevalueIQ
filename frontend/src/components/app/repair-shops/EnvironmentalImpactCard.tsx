"use client";

import React from "react";
import { Leaf, Sparkles, ShieldCheck, Trophy, ArrowUpRight, Recycle, Info } from "lucide-react";

export const EnvironmentalImpactCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-emerald-700/60 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Planet Impact Analytics
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Environmental Impact & Circular Economy Contribution
          </h2>
          <p className="text-xs text-emerald-200/80 mt-0.5 max-w-xl">
            Choosing repair over new device purchases directly prevents hazardous electronic waste and conserves finite planetary resources.
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">E-Waste Prevented</span>
            <Recycle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">8,450 kg</div>
          <p className="text-[11px] text-emerald-200/70">Total electronics diverted from landfills</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">CO2 Emissions Avoided</span>
            <Sparkles className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">52.4 Tons</div>
          <p className="text-[11px] text-emerald-200/70">Equivalent to planting 2,400 trees</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-green-300">Gold & Metals Recovered</span>
            <ShieldCheck className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">1,240 g</div>
          <p className="text-[11px] text-emerald-200/70">Precious copper, gold, and cobalt saved</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Circular Score Index</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300">96 / 100</div>
          <p className="text-[11px] text-emerald-200/70">Enterprise Zero-Landfill Grade</p>
        </div>
      </div>

      {/* Explanation Box */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-emerald-100">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">How Circular Contribution Scores Work:</strong> RevalueIQ calculates each repair shop's score based on verified OEM part usage, hazardous battery recycling compliance, e-waste weight loggings, and component-level micro-soldering vs total board replacement ratios.
        </p>
      </div>
    </div>
  );
};
