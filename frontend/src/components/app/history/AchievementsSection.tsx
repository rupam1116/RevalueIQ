"use client";

import React, { useState } from "react";
import {
  Trophy,
  Award,
  Sparkles,
  Leaf,
  Wrench,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Globe,
  Lock,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { HistoryAnalyticsResponse } from "@/lib/historyApi";

interface AchievementsSectionProps {
  analytics: HistoryAnalyticsResponse | null;
}

interface DynamicBadge {
  id: string;
  title: string;
  category: "Valuation" | "Repair" | "Resale" | "Donation" | "Carbon";
  iconName: string;
  description: string;
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedDate?: string;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ analytics }) => {
  const [filter, setFilter] = useState<"All" | "Unlocked" | "In Progress">("All");

  const totalAnalyzed = analytics?.total_analyzed_units || 0;
  const repairsCompleted = analytics?.repairs_completed || 0;
  const repairsInitiated = analytics?.repairs_initiated || 0;
  const devicesSold = analytics?.devices_sold || 0;
  const devicesDonated = analytics?.devices_donated || 0;
  const verifiedCo2 = analytics?.verified_co2_saved_kg || 0;
  const verifiedEwaste = analytics?.verified_ewaste_prevented_kg || 0;

  // Real, dynamically evaluated achievements based on authentic database records
  const dynamicBadges: DynamicBadge[] = [
    {
      id: "ach-1",
      title: "First AI Appraisal",
      category: "Valuation",
      iconName: "Sparkles",
      description: "Appraise your first electronic device using the multi-modal Gemini Vision engine.",
      points: 25,
      unlocked: totalAnalyzed >= 1,
      progress: Math.min(1, totalAnalyzed),
      maxProgress: 1,
      unlockedDate: totalAnalyzed >= 1 ? "Active" : undefined,
    },
    {
      id: "ach-2",
      title: "Device Inventory Pioneer",
      category: "Valuation",
      iconName: "ShieldCheck",
      description: "Complete 5 device valuations to map your household electronic portfolio.",
      points: 50,
      unlocked: totalAnalyzed >= 5,
      progress: Math.min(5, totalAnalyzed),
      maxProgress: 5,
      unlockedDate: totalAnalyzed >= 5 ? "Active" : undefined,
    },
    {
      id: "ach-3",
      title: "Repair Diagnostic Explorer",
      category: "Repair",
      iconName: "Wrench",
      description: "Initiate your first hardware triage diagnostic or repair inquiry.",
      points: 30,
      unlocked: (repairsInitiated + repairsCompleted) >= 1,
      progress: Math.min(1, repairsInitiated + repairsCompleted),
      maxProgress: 1,
      unlockedDate: (repairsInitiated + repairsCompleted) >= 1 ? "Active" : undefined,
    },
    {
      id: "ach-4",
      title: "Master Restorer (Tier 3)",
      category: "Repair",
      iconName: "Wrench",
      description: "Confirm external completion of a professional or DIY device repair.",
      points: 100,
      unlocked: repairsCompleted >= 1,
      progress: Math.min(1, repairsCompleted),
      maxProgress: 1,
      unlockedDate: repairsCompleted >= 1 ? "Active" : undefined,
    },
    {
      id: "ach-5",
      title: "Circular Marketplace Reseller",
      category: "Resale",
      iconName: "ShoppingBag",
      description: "Successfully sell and recirculate a verified electronic device.",
      points: 75,
      unlocked: devicesSold >= 1,
      progress: Math.min(1, devicesSold),
      maxProgress: 1,
      unlockedDate: devicesSold >= 1 ? "Active" : undefined,
    },
    {
      id: "ach-6",
      title: "Digital Inclusion Donor",
      category: "Donation",
      iconName: "Heart",
      description: "Complete and verify a device donation to an NGO, school, or authorized recycler.",
      points: 80,
      unlocked: devicesDonated >= 1,
      progress: Math.min(1, devicesDonated),
      maxProgress: 1,
      unlockedDate: devicesDonated >= 1 ? "Active" : undefined,
    },
    {
      id: "ach-7",
      title: "Carbon Abatement Champion",
      category: "Carbon",
      iconName: "Leaf",
      description: "Achieve 50 kg of verified avoided carbon emissions through completed circular actions.",
      points: 120,
      unlocked: verifiedCo2 >= 50.0,
      progress: Math.min(50, Math.round(verifiedCo2)),
      maxProgress: 50,
      unlockedDate: verifiedCo2 >= 50.0 ? "Active" : undefined,
    },
    {
      id: "ach-8",
      title: "Landfill Diversion Leader",
      category: "Carbon",
      iconName: "Globe",
      description: "Divert at least 1.0 kg of toxic e-waste heavy metals from municipal landfills.",
      points: 90,
      unlocked: verifiedEwaste >= 1.0,
      progress: Math.min(100, Math.round(verifiedEwaste * 100)),
      maxProgress: 100,
      unlockedDate: verifiedEwaste >= 1.0 ? "Active" : undefined,
    },
  ];

  const filteredAchievements = dynamicBadges.filter((item) => {
    if (filter === "Unlocked") return item.unlocked;
    if (filter === "In Progress") return !item.unlocked;
    return true;
  });

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Leaf":
        return <Leaf className="w-6 h-6 text-emerald-500" />;
      case "Wrench":
        return <Wrench className="w-6 h-6 text-cyan-500" />;
      case "Heart":
        return <Heart className="w-6 h-6 text-pink-500" />;
      case "ShoppingBag":
        return <ShoppingBag className="w-6 h-6 text-teal-500" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
      case "Globe":
        return <Globe className="w-6 h-6 text-blue-500" />;
      case "Sparkles":
      default:
        return <Sparkles className="w-6 h-6 text-amber-500" />;
    }
  };

  const unlockedCount = dynamicBadges.filter((a) => a.unlocked).length;
  const totalEarnedPoints = dynamicBadges.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      {/* Section Header & Points Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Persistent Sustainability Badges</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Circular Achievements & Milestones
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Badges unlock strictly when real actions are logged and verified in your persistent ledger.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 p-4 rounded-2xl shrink-0">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-white shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Earned Eco Credits</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              {totalEarnedPoints} Credits
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
              {unlockedCount} of {dynamicBadges.length} Badges Unlocked
            </p>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-emerald-500" /> Filter:
        </span>
        {(["All", "Unlocked", "In Progress"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === tab
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of Achievement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAchievements.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
              item.unlocked
                ? "bg-white dark:bg-[#0b1a13] border-emerald-300 dark:border-emerald-800/80 shadow-sm hover:shadow-md"
                : "bg-slate-50/70 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800/60 opacity-80"
            }`}
          >
            <div className="space-y-3">
              {/* Badge Icon & Credits */}
              <div className="flex items-center justify-between">
                <div
                  className={`p-3 rounded-2xl border flex items-center justify-center ${
                    item.unlocked
                      ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200/60 dark:border-emerald-800/60 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                  }`}
                >
                  {item.unlocked ? (
                    getBadgeIcon(item.iconName)
                  ) : (
                    <Lock className="w-6 h-6 text-slate-400 dark:text-slate-600" />
                  )}
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    item.unlocked
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                      : "bg-slate-200 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-800"
                  }`}
                >
                  +{item.points} Credits
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h4
                  className={`text-sm font-extrabold ${
                    item.unlocked
                      ? "text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Progress Bar & Status */}
            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-900">
              <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                <span className={item.unlocked ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                  {item.unlocked ? "Unlocked" : "In Progress"}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  {item.progress} / {item.maxProgress}
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.unlocked ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-600"
                  }`}
                  style={{ width: `${(item.progress / item.maxProgress) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
