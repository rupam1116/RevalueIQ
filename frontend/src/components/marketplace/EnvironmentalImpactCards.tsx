"use client";

import React from 'react';
import { Leaf, Recycle, Droplet, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { EnvironmentalImpactMetrics } from './types';

const DEFAULT_ZERO_METRICS: EnvironmentalImpactMetrics = {
  totalCo2AvoidedKg: 0,
  totalEwasteDivertedKg: 0,
  totalWaterSavedLiters: 0,
  circularPlatformIndex: 0,
  totalDevicesRefurbished: 0,
};

interface EnvironmentalImpactCardsProps {
  metrics?: EnvironmentalImpactMetrics;
  compact?: boolean;
}

export const EnvironmentalImpactCards: React.FC<EnvironmentalImpactCardsProps> = ({
  metrics = DEFAULT_ZERO_METRICS,
  compact = false,
}) => {
  const dynamicTrend = metrics.totalDevicesRefurbished > 0
    ? `+${Math.min(35, (metrics.totalDevicesRefurbished * 4.5)).toFixed(1)}%`
    : "+0.0%";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? 'lg:grid-cols-4 gap-4' : 'lg:grid-cols-4 gap-5'}`}>
      {/* 1. CO2 Avoided */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/40 border border-emerald-100/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all duration-300" />
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {dynamicTrend}
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CO₂e Emissions Saved</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {metrics.totalCo2AvoidedKg.toLocaleString("en-US", { maximumFractionDigits: 1 })}
          </span>
          <span className="text-sm font-extrabold text-emerald-700">kg CO₂e</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
          <span>Equivalent to ~{Math.max(0, Math.round(metrics.totalCo2AvoidedKg / 21))} trees offset</span>
        </p>
      </div>

      {/* 2. E-Waste Diverted */}
      <div className="bg-gradient-to-br from-teal-50 via-white to-emerald-50/40 border border-teal-100/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl group-hover:bg-teal-500/10 transition-all duration-300" />
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600/10 text-teal-700 flex items-center justify-center font-bold">
            <Recycle className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-teal-700 bg-teal-100/80 px-2.5 py-0.5 rounded-full">
            Landfill Free
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">E-Waste Diverted</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {metrics.totalEwasteDivertedKg.toLocaleString("en-US", { maximumFractionDigits: 1 })}
          </span>
          <span className="text-sm font-extrabold text-teal-700">kg</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          <span>{metrics.totalDevicesRefurbished} verified circular listing{metrics.totalDevicesRefurbished === 1 ? '' : 's'}</span>
        </p>
      </div>

      {/* 3. Water Saved */}
      <div className="bg-gradient-to-br from-cyan-50 via-white to-emerald-50/40 border border-cyan-100/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all duration-300" />
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-700 flex items-center justify-center font-bold">
            <Droplet className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-cyan-700 bg-cyan-100/80 px-2.5 py-0.5 rounded-full">
            Mfg Saved
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Water Preserved</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {metrics.totalWaterSavedLiters >= 1000
              ? `${(metrics.totalWaterSavedLiters / 1000).toFixed(1)}k`
              : metrics.totalWaterSavedLiters.toLocaleString("en-US")}
          </span>
          <span className="text-sm font-extrabold text-cyan-700">Liters</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          <span>Mining & manufacturing water saved</span>
        </p>
      </div>

      {/* 4. Circular Platform Score */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 border border-emerald-500 rounded-2xl p-5 text-white shadow-md shadow-emerald-900/10 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold backdrop-blur-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-200" /> AI Verified
          </span>
        </div>
        <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Circular Platform Index</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black tracking-tight">{metrics.circularPlatformIndex}</span>
          <span className="text-sm font-extrabold text-emerald-200">/ 100</span>
        </div>
        <div className="mt-3 w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-300 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, metrics.circularPlatformIndex))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
