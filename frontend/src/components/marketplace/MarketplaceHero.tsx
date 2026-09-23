"use client";

import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Zap, RefreshCw, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketplaceHeroProps {
  onOpenSellModal: () => void;
  onExploreClick?: () => void;
}

export const MarketplaceHero: React.FC<MarketplaceHeroProps> = ({
  onOpenSellModal,
  onExploreClick,
}) => {
  return (
    <div className="relative rounded-3xl border border-emerald-100 dark:border-emerald-900/50 bg-white dark:bg-[#0b1a13] p-8 sm:p-12 overflow-hidden shadow-xl">
      {/* Background Radial Glowing Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Top AI Tag Pill */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs"
        >
          <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>AI-Powered Circular Economy Marketplace</span>
        </div>

        {/* Hero Title */}
        <h1
          className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
        >
          Discover Quality{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
            Circular Electronics
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl"
        >
          Buy and sell verified pre-owned electronics with instant AI appraisals, accurate condition grading, repair estimates, and transparent circular economy sustainability scores.
        </p>

        {/* Action Buttons */}
        <div
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <Button
            onClick={onExploreClick}
            size="lg"
            className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm h-12 px-6 shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-0"
          >
            <span>Explore Electronics</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Button
            onClick={onOpenSellModal}
            size="lg"
            variant="outline"
            className="rounded-2xl border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-extrabold text-xs sm:text-sm h-12 px-6 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
            <span>Sell Device with AI Appraisal</span>
          </Button>
        </div>

        {/* Value Props Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">AI Verified</p>
              <p className="text-[10px] text-slate-500">Condition guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Circular Trade</p>
              <p className="text-[10px] text-slate-500">Zero e-waste mindset</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
            <div className="w-8 h-8 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">CO₂ Diverted</p>
              <p className="text-[10px] text-slate-500">Tracked eco metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
