"use client";

import React, { useState } from "react";
import { UserActivityItem } from "@/lib/mockProfileData";
import {
  History,
  Cpu,
  ShoppingBag,
  Wrench,
  Heart,
  FileText,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";

interface ActivityTimelineSectionProps {
  activities: UserActivityItem[];
  onNavigateTab?: (tabId: string) => void;
}

export const ActivityTimelineSection: React.FC<ActivityTimelineSectionProps> = ({
  activities,
  onNavigateTab,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const categories = ["All", "Valuation", "Marketplace", "Repair", "Donation", "History"];

  const filteredActivities = activities.filter((act) => {
    if (selectedFilter === "All") return true;
    return act.category === selectedFilter;
  });

  const getCategoryIcon = (category: UserActivityItem["category"]) => {
    switch (category) {
      case "Valuation":
        return Cpu;
      case "Marketplace":
        return ShoppingBag;
      case "Repair":
        return Wrench;
      case "Donation":
        return Heart;
      case "History":
      default:
        return FileText;
    }
  };

  const getCategoryColor = (category: UserActivityItem["category"]) => {
    switch (category) {
      case "Valuation":
        return "text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30";
      case "Marketplace":
        return "text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30";
      case "Repair":
        return "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30";
      case "Donation":
        return "text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30";
      case "History":
      default:
        return "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Activity Summary & Timeline
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Chronological audit log of all valuations, repairs, marketplace transactions, and donations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
                selectedFilter === cat
                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40"
                  : "bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline items */}
      {filteredActivities.length === 0 ? (
        <div className="p-8 text-center space-y-3 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              No Recorded Activities Yet
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              When you appraise electronics, schedule repairs, or post listings, your activities will appear here chronologically.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l border-slate-200 dark:border-slate-800 space-y-6">
          {filteredActivities.map((act) => {
            const CatIcon = getCategoryIcon(act.category);
            const catStyle = getCategoryColor(act.category);
            return (
              <div key={act.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:border-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shadow-xs">
                  <CatIcon className="w-3.5 h-3.5" />
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${catStyle}`}>
                        {act.category}
                      </span>
                      <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                        {act.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                      {act.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60 text-xs">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      Status: {act.status}
                    </span>
                    {onNavigateTab && (
                      <button
                        onClick={() => {
                          const cat = act.category.toLowerCase();
                          if (cat === "valuation") onNavigateTab("valuation");
                          else if (cat === "repair") onNavigateTab("repair-shops");
                          else if (cat === "donation") onNavigateTab("donation");
                          else if (cat === "marketplace") onNavigateTab("marketplace");
                          else onNavigateTab("history");
                        }}
                        className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold flex items-center gap-1 text-[11px] cursor-pointer bg-transparent border-0"
                      >
                        View Details <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
