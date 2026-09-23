"use client";

import React from "react";
import { LucideIcon, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient?: string;
  borderColor?: string;
  trend?: string;
  trendPositive?: boolean;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient = "from-emerald-600 to-teal-600",
  borderColor = "border-emerald-100 dark:border-emerald-900/50",
  trend = "+12% this month",
  trendPositive = true,
}: StatsCardProps) {
  return (
    <div
      className={`relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0b1a13] border ${borderColor} shadow-md dark:shadow-emerald-950/30 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 overflow-hidden group`}
    >
      {/* Background Subtle Radial Gradient */}
      <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 dark:opacity-20 blur-2xl group-hover:opacity-30 transition-opacity pointer-events-none`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </div>
        </div>

        {/* Icon Badge */}
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} border border-white/10 shadow-md text-white group-hover:scale-105 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Subtitle & Trend */}
      <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-semibold">{subtitle}</span>
        {trend && (
          <span className={`inline-flex items-center gap-1 font-bold ${trendPositive ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
