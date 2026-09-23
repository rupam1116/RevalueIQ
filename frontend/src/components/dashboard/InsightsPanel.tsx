"use client";

import React from "react";
import { Leaf, Cpu, Newspaper, ArrowRight, Zap, TrendingUp } from "lucide-react";

export default function InsightsPanel() {
  const insights = [
    {
      title: "Resale Price Trend Alert",
      desc: "Used MacBook M1 prices increased by 8.4% this week due to refurbished eco demand.",
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Circular Economy Impact",
      desc: "By repairing rather than replacing, your portfolio prevented 4.2 kg of e-waste.",
      icon: Leaf,
      color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800",
    },
    {
      title: "AI Eco Vision Model Live",
      desc: "Updated camera crack detection algorithm with 99.1% grading precision.",
      icon: Cpu,
      color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800",
    },
  ];

  const newsItems = [
    {
      title: "Global E-Waste Recycling Regulations & Circularity",
      source: "Eco circularity daily • 3h ago",
      href: "/blog",
    },
    {
      title: "How Certified Repair Shops Boost Device Longevity",
      source: "RevalueIQ Research • 6h ago",
      href: "/blog",
    },
  ];

  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" /> Circular AI Insights
        </h3>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          Live Eco Feed
        </span>
      </div>

      {/* Insight Cards */}
      <div className="space-y-3">
        {insights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 space-y-2 shadow-sm hover:shadow-md hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-1">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Latest News & Trends Widget */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-2">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Circular News & Trends
          </h4>
          <a href="/blog" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            View All
          </a>
        </div>

        <div className="space-y-2.5">
          {newsItems.map((news, idx) => (
            <a
              key={idx}
              href={news.href}
              className="block p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 group"
            >
              <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                {news.title}
              </h5>
              <p className="text-[10px] text-slate-500 mt-1">{news.source}</p>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
