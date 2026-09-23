"use client";

import React, { useState } from "react";
import { AchievementBadge } from "@/lib/mockProfileData";
import {
  Award,
  Leaf,
  Wrench,
  ShoppingBag,
  MessageSquare,
  Heart,
  ShieldCheck,
  Recycle,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";

interface AchievementsSectionProps {
  achievements: AchievementBadge[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const categories = ["All", "Sustainability", "Repair", "Marketplace", "Donation", "Verification"];

  const filteredAchievements = achievements.filter((badge) => {
    if (filterCategory === "All") return true;
    return badge.category === filterCategory;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Leaf":
        return Leaf;
      case "Wrench":
        return Wrench;
      case "ShoppingBag":
        return ShoppingBag;
      case "MessageSquare":
        return MessageSquare;
      case "Heart":
        return Heart;
      case "ShieldCheck":
        return ShieldCheck;
      case "Recycle":
        return Recycle;
      case "Award":
      default:
        return Award;
    }
  };

  const totalUnlocked = achievements.filter((a) => a.unlocked).length;
  const totalXP = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-amber-500 dark:text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Verified Achievements & Milestones
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Earn badges by verifying device repairs, selling refurbished tech, and donating electronics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-200 dark:border-slate-800 pt-4 sm:pt-0">
          <div className="text-center sm:text-right">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Unlocked</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {totalUnlocked} / {achievements.length}
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Achievement XP</p>
            <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
              +{totalXP.toLocaleString()} XP
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
              filterCategory === cat
                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40"
                : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAchievements.map((badge) => {
          const IconComp = getIcon(badge.iconName);
          return (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 shadow-lg ${
                badge.unlocked
                  ? "bg-white dark:bg-slate-900/80 backdrop-blur-md border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:bg-slate-50 dark:hover:bg-slate-900"
                  : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 opacity-80"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-2xl ${
                      badge.unlocked
                        ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      badge.unlocked
                        ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    +{badge.xpReward} XP
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{badge.title}</h4>
                    {badge.unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                </div>
              </div>

              {/* Bottom Progress or Unlocked Date */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80">
                {badge.unlocked ? (
                  <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Unlocked</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{badge.unlockedDate}</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>Progress</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{badge.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 dark:bg-amber-400 h-full rounded-full"
                        style={{ width: `${badge.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
