"use client";

import React from "react";
import { Search, Filter, ArrowUpDown, X, Layers, Lightbulb, Clock, CheckCircle2 } from "lucide-react";
import { LifecycleTier } from "@/lib/historyApi";

export type FilterCategory = "All" | "Valuations" | "Repairs" | "Marketplace" | "Donations";
export type FilterTier = "All" | LifecycleTier;
export type SortOption = "Newest" | "Oldest" | "Highest Value";

interface HistorySearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
  selectedTier: FilterTier;
  onTierChange: (tier: FilterTier) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  categoryCounts: Record<FilterCategory, number>;
  tierCounts: {
    all: number;
    recommendation_generated: number;
    action_initiated: number;
    externally_completed: number;
  };
}

export const HistorySearchAndFilters: React.FC<HistorySearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTier,
  onTierChange,
  sortBy,
  onSortChange,
  categoryCounts,
  tierCounts,
}) => {
  const categories: FilterCategory[] = [
    "All",
    "Valuations",
    "Repairs",
    "Marketplace",
    "Donations",
  ];

  const tiers: { id: FilterTier; label: string; icon: React.FC<{ className?: string }>; count: number }[] = [
    { id: "All", label: "All Tiers", icon: Layers, count: tierCounts.all },
    { id: "recommendation_generated", label: "Tier 1: Recommendations", icon: Lightbulb, count: tierCounts.recommendation_generated },
    { id: "action_initiated", label: "Tier 2: Actions Initiated", icon: Clock, count: tierCounts.action_initiated },
    { id: "externally_completed", label: "Tier 3: Completed Actions", icon: CheckCircle2, count: tierCounts.externally_completed },
  ];

  const sortOptions: SortOption[] = [
    "Newest",
    "Oldest",
    "Highest Value",
  ];

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "All" || selectedTier !== "All" || sortBy !== "Newest";

  const handleReset = () => {
    onSearchChange("");
    onCategoryChange("All");
    onTierChange("All");
    onSortChange("Newest");
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4">
      {/* Search Input & Sort Dropdown Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Large Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search real activities by device, model, or status..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-full sm:w-auto">
            <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-bold text-slate-700 dark:text-slate-200">
              <ArrowUpDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-500 dark:text-slate-400 font-normal hidden xs:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-white dark:bg-[#0b1a13] text-slate-900 dark:text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="px-3.5 py-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Truth Tiers Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-emerald-100/60 dark:border-emerald-900/40 pt-3">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Truth Tier:
        </span>
        {tiers.map((t) => {
          const isActive = selectedTier === t.id;
          const TierIcon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onTierChange(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shrink-0 border ${
                isActive
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm"
                  : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <TierIcon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({t.count})</span>
            </button>
          );
        })}
      </div>

      {/* Row 3: Domain Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Domain:
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;

          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 shrink-0 border ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-sm"
                  : "bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-600 dark:text-slate-300 border-emerald-100 dark:border-emerald-900/40 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
