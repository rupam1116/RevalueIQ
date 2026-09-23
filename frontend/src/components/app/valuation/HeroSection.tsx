"use client";

import React from "react";
import { Leaf, ShieldCheck, Zap, ArrowRight, Activity, Recycle, ArrowLeft } from "lucide-react";

interface HeroSectionProps {
  onStartValuation: () => void;
  onBackToDashboard?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartValuation, onBackToDashboard }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-10 shadow-xl">
      {/* Background Decorative Gradients & Mesh */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading, Subtitle & Action */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" /> RevalueIQ Circular Valuation Engine
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              <Activity className="w-3.5 h-3.5" /> E-Waste Diversion Tech
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Instant AI Device <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                Eco Valuation & Diagnostics
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Upload multi-angle photos or select device specifications. Our computer vision algorithms inspect cosmetic condition, estimate circular resale pricing, and divert tech from landfills.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
            <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Total Appraisals</p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">48,290+</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">CO₂ Diverted</p>
              <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">1,180 Tons</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Value Restored</p>
              <p className="text-lg font-extrabold text-teal-600 dark:text-teal-400">₹14.2 Cr</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartValuation}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-2 group border-0"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Start Instant Eco AI Valuation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Visual Interactive Graphic Card */}
        <div className="lg:col-span-5">
          <div
            className="relative rounded-3xl bg-emerald-50/40 dark:bg-[#06140e]/80 border border-emerald-100 dark:border-emerald-900/50 p-6 space-y-4 shadow-xl backdrop-blur-xl transition-all duration-300 animate-in fade-in"
          >
            {/* Live Scan Preview Card Header */}
            <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Live Vision Diagnostic Stream</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                ECO ENGINE ACTIVE
              </span>
            </div>

            {/* Graphic Illustration */}
            <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-950 border border-emerald-900/40 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop"
                alt="AI Diagnostics Scan"
                className="w-full h-full object-cover opacity-60"
              />
              
              {/* Overlay Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-dashed border-emerald-400/80 rounded-2xl flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 border-2 border-emerald-400 rounded-full" />
                </div>
              </div>

              {/* Holographic Diagnostic Badges */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-800 text-[10px] font-mono text-emerald-300 flex items-center gap-1.5">
                <Recycle className="w-3 h-3 text-emerald-400" />
                <span>NAND: 256GB Verified</span>
              </div>

              <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-800 text-[10px] font-mono text-teal-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                <span>Surface Integrity: 98%</span>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
              <span>Model Recognition: <strong>iPhone 15 Pro</strong></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Est: ₹74,500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
