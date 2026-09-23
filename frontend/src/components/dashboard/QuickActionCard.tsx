"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  gradient?: string;
  badge?: string;
}

export default function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  gradient = "from-emerald-600 to-teal-600",
  badge,
}: QuickActionCardProps) {
  return (
    <Link href={href} className="block group">
      <div
        className="relative p-5 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-md hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      >
        {/* Glow corner accent */}
        <div className={`absolute top-0 right-0 w-28 h-28 rounded-bl-full bg-gradient-to-br ${gradient} opacity-10 dark:opacity-20 blur-xl group-hover:opacity-30 transition-opacity pointer-events-none`} />

        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md group-hover:rotate-3 transition-transform duration-300`}>
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">
            {badge && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {badge}
              </span>
            )}
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
