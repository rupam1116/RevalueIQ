"use client";

import React from "react";
import { Sparkles, DollarSign, Leaf, TrendingUp } from "lucide-react";

interface AIInsightCardProps {
  rationale: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ rationale }) => {
  return (
    <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 border-b border-emerald-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
          <Sparkles className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">Why AI Recommends Repair</h3>
          <p className="text-[11px] text-slate-500 font-medium">Synthesized Circular Decision Rationale</p>
        </div>
      </div>

      {/* Rationale Text */}
      <p className="text-xs text-slate-800 leading-relaxed font-medium bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
        "{rationale}"
      </p>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Money Saved</div>
            <div className="font-black text-slate-900">₹42,000</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Carbon Avoided</div>
            <div className="font-black text-slate-900">12.4 kg CO2</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <TrendingUp className="w-4 h-4 text-teal-600 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Lifecycle Extension</div>
            <div className="font-black text-slate-900">+3 Years</div>
          </div>
        </div>
      </div>
    </div>
  );
};
