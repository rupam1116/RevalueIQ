"use client";

import React from "react";
import {
  History,
  Smartphone,
  Wrench,
  ShoppingBag,
  HeartHandshake,
  TrendingUp,
  ShieldCheck,
  Leaf,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  Clock,
  Lightbulb,
} from "lucide-react";

interface HistoryHeroHeaderProps {
  stats: {
    totalAnalyzed: number;
    recommendationsCount: number;
    actionsInitiatedCount: number;
    externallyCompletedCount: number;
    repairsCompleted: number;
    devicesSold: number;
    devicesDonated: number;
    circularScore: number;
    verifiedCo2Saved: number;
    potentialCo2Opportunity: number;
    verifiedEwastePrevented: number;
    moneyEarnedOrSaved: number;
  };
}

export const HistoryHeroHeader: React.FC<HistoryHeroHeaderProps> = ({ stats }) => {
  const statCards = [
    {
      title: "Total Devices Analysed",
      value: `${stats.totalAnalyzed} Units`,
      icon: Smartphone,
      gradient: "from-emerald-500/10 to-teal-500/10",
      border: "border-emerald-500/20",
      textAccent: "text-emerald-500 dark:text-emerald-400",
      badge: "Real Appraisals",
      subtext: "Scanned via Gemini Vision",
    },
    {
      title: "Tier 1: Recommendations",
      value: `${stats.recommendationsCount} Generated`,
      icon: Lightbulb,
      gradient: "from-amber-500/10 to-yellow-500/10",
      border: "border-amber-500/20",
      textAccent: "text-amber-500 dark:text-amber-400",
      badge: "AI Pathways",
      subtext: "Awaiting action initiation",
    },
    {
      title: "Tier 2: Actions Initiated",
      value: `${stats.actionsInitiatedCount} Active`,
      icon: Clock,
      gradient: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/20",
      textAccent: "text-blue-500 dark:text-cyan-400",
      badge: "In Progress",
      subtext: "Listings & inquiries opened",
    },
    {
      title: "Tier 3: Verified Completed",
      value: `${stats.externallyCompletedCount} Closed`,
      icon: CheckCircle2,
      gradient: "from-emerald-600/15 to-teal-600/15",
      border: "border-emerald-500/30",
      textAccent: "text-emerald-600 dark:text-emerald-400",
      badge: "Verified Proof",
      subtext: `${stats.repairsCompleted} Repaired • ${stats.devicesSold} Sold • ${stats.devicesDonated} Donated`,
    },
    {
      title: "Verified CO₂ Saved",
      value: `${stats.verifiedCo2Saved.toFixed(1)} kg`,
      icon: Leaf,
      gradient: "from-emerald-500/10 to-teal-500/10",
      border: "border-emerald-500/20",
      textAccent: "text-emerald-600 dark:text-emerald-400",
      badge: "Realized Impact",
      subtext: "Strictly from confirmed actions",
    },
    {
      title: "Potential CO₂ Opportunity",
      value: `${stats.potentialCo2Opportunity.toFixed(1)} kg`,
      icon: TrendingUp,
      gradient: "from-teal-500/10 to-cyan-600/10",
      border: "border-teal-500/20",
      textAccent: "text-teal-600 dark:text-teal-400",
      badge: "Identified Potential",
      subtext: "Realizable upon completion",
    },
    {
      title: "Circular Integrity Score",
      value: `${stats.circularScore}/100`,
      icon: ShieldCheck,
      gradient: "from-emerald-600/15 to-teal-600/15",
      border: "border-emerald-500/30",
      textAccent: "text-emerald-600 dark:text-emerald-300",
      badge: stats.externallyCompletedCount > 0 ? "Verified Active" : "Starting Tier",
      subtext: "Truthful dynamic rank",
    },
    {
      title: "Verified Money Earned / Saved",
      value: `₹${stats.moneyEarnedOrSaved.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      gradient: "from-teal-600/10 to-emerald-700/10",
      border: "border-teal-600/20",
      textAccent: "text-teal-700 dark:text-emerald-300",
      badge: "Real Transactions",
      subtext: "Confirmed sales & repair savings",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Production Lifecycle Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              History & Lifecycle Audit
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Transparent, real-time audit ledger of your electronic assets. Clearly tracks recommendations generated, actions initiated, and verified closed-loop completions.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 p-4 rounded-2xl shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Data Truthfulness</p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                100% Verified Persistent Data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl bg-white dark:bg-[#0b1a13] border ${card.border} shadow-sm hover:shadow-md hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />
              
              <div className="relative z-10 flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/50">
                  <Icon className={`w-5 h-5 ${card.textAccent}`} />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {card.badge}
                </span>
              </div>

              <div className="relative z-10">
                <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {card.value}
                </p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  {card.title}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  {card.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
