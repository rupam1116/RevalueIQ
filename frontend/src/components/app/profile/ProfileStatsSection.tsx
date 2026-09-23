"use client";

import React from "react";
import { ProfileStats } from "@/lib/mockProfileData";
import {
  Smartphone,
  Tag,
  Wrench,
  HeartHandshake,
  ShoppingBag,
  MessageSquare,
  Users,
  UserCheck,
  Leaf,
  Award,
} from "lucide-react";

interface ProfileStatsSectionProps {
  stats: ProfileStats;
}

export const ProfileStatsSection: React.FC<ProfileStatsSectionProps> = ({ stats }) => {
  const statCards = [
    {
      label: "Devices Analysed",
      value: stats.devicesAnalysed,
      icon: Smartphone,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-500/10",
      borderColor: "border-emerald-200 dark:border-emerald-500/20",
      subtext: "AI Authenticated",
    },
    {
      label: "Devices Sold",
      value: stats.devicesSold,
      icon: Tag,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-100 dark:bg-cyan-500/10",
      borderColor: "border-cyan-200 dark:border-cyan-500/20",
      subtext: "Circular Resale",
    },
    {
      label: "Repairs Completed",
      value: stats.repairsCompleted,
      icon: Wrench,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-500/10",
      borderColor: "border-teal-200 dark:border-teal-500/20",
      subtext: "Lifespan Extended",
    },
    {
      label: "Donations Made",
      value: stats.donationsMade,
      icon: HeartHandshake,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-100 dark:bg-rose-500/10",
      borderColor: "border-rose-200 dark:border-rose-500/20",
      subtext: "Digital Inclusion",
    },
    {
      label: "Marketplace Purchases",
      value: stats.marketplacePurchases,
      icon: ShoppingBag,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-500/10",
      borderColor: "border-indigo-200 dark:border-indigo-500/20",
      subtext: "Refurbished Tech",
    },
    {
      label: "Community Posts",
      value: stats.communityPosts,
      icon: MessageSquare,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-500/10",
      borderColor: "border-amber-200 dark:border-amber-500/20",
      subtext: "Guides & Topics",
    },
    {
      label: "Followers",
      value: stats.followers,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-500/10",
      borderColor: "border-purple-200 dark:border-purple-500/20",
      subtext: "Community Reach",
    },
    {
      label: "Following",
      value: stats.following,
      icon: UserCheck,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-500/10",
      borderColor: "border-blue-200 dark:border-blue-500/20",
      subtext: "Eco Network",
    },
    {
      label: "CO₂ Saved",
      value: `${stats.co2SavedKg} kg`,
      icon: Leaf,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-500/10",
      borderColor: "border-emerald-200 dark:border-emerald-500/20",
      subtext: "E-waste Diverted",
    },
    {
      label: "Circular Score",
      value: `${stats.circularScore}/100`,
      icon: Award,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-500/10",
      borderColor: "border-amber-200 dark:border-amber-500/20",
      subtext: `Grade ${stats.circularGrade} Tier`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Sustainability & Platform Statistics
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-time Metrics</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {statCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900/70 backdrop-blur-md border ${card.borderColor} hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200 group flex flex-col justify-between space-y-3 shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  {card.subtext}
                </span>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {card.value}
                </p>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                  {card.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
