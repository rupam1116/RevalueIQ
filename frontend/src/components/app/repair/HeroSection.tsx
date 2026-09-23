"use client";

import React from "react";
import { Wrench, ShieldCheck, Zap, ArrowRight, Cpu, Activity, Leaf } from "lucide-react";
import { DEMO_REPAIR_PRESETS } from "@/lib/mockRepairData";
import { DemoRepairPreset } from "@/types/repair";

interface HeroSectionProps {
  onStartDiagnosis?: () => void;
  onSelectPreset: (preset: DemoRepairPreset) => void;
  onScrollToForm?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartDiagnosis,
  onSelectPreset,
  onScrollToForm,
}) => {
  return (
    <div className="relative rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-10 overflow-hidden shadow-xl">
      {/* Background Neural Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headlines & CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>AI Circular Repair Engine • Phase 5</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            AI-Powered <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">Eco Repair Advisor</span> & Cost Estimator
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Instantly diagnose hardware failures, calculate exact replacement costs, evaluate DIY feasibility, locate certified local repair shops, and prevent unnecessary e-waste.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
            <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
                <Cpu className="w-3.5 h-3.5" /> Diagnostic Accuracy
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">98.4%</span>
            </div>
            <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-xs font-bold mb-1">
                <Zap className="w-3.5 h-3.5" /> Avg Analysis Time
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">&lt; 3 Sec</span>
            </div>
            <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> E-Waste Diverted
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">85% Rate</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartDiagnosis}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2 border-0"
            >
              <Wrench className="w-4 h-4 fill-white" />
              <span>Start Device Diagnosis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Demo Presets */}
        <div className="lg:col-span-5 bg-emerald-50/40 dark:bg-[#06140e]/80 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Try Instant Sample Diagnostics</span>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              1-Click Load
            </span>
          </div>

          <div className="space-y-2.5">
            {DEMO_REPAIR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="w-full text-left p-3.5 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {preset.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {preset.subtitle}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
