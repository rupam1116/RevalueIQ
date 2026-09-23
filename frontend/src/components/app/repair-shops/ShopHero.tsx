"use client";

import React from "react";
import { Sparkles, ShieldCheck, MapPin, Leaf, Award, ArrowRight, Wrench } from "lucide-react";

interface ShopHeroProps {
  onQuickBookClick: () => void;
  onExploreMapClick: () => void;
}

export const ShopHero: React.FC<ShopHeroProps> = ({
  onQuickBookClick,
  onExploreMapClick,
}) => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-[#0b1a13] dark:via-[#09140e] dark:to-[#050b07] border border-emerald-200/80 dark:border-emerald-900/60 p-6 sm:p-10 shadow-sm overflow-hidden transition-all duration-300">
      {/* Background Subtle Shapes */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading & Copy */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>AI-Powered Eco Repair Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Find Trusted Repair Centers.{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              Cut E-Waste.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Compare verified local repair shops, review transparent OEM pricing, book instant doorstep pickups, and track your circular carbon savings in real time.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onQuickBookClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Wrench className="w-4 h-4" /> Book Repair Appointment
            </button>

            <button
              onClick={onExploreMapClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-sm"
            >
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Explore Interactive Map
            </button>
          </div>
        </div>

        {/* Right Column: Key Ecosystem Metrics Banner */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 shadow-sm backdrop-blur-md space-y-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">140+</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Certified Repair Centers</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 shadow-sm backdrop-blur-md space-y-1">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/60 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">99.2%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Customer Trust Rating</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 shadow-sm backdrop-blur-md space-y-1">
            <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/60 flex items-center justify-center text-green-700 dark:text-green-300 font-bold">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">8.4 Tons</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">E-Waste Prevented</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 shadow-sm backdrop-blur-md space-y-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">12,450+</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Successful Repairs</p>
          </div>
        </div>
      </div>
    </div>
  );
};
