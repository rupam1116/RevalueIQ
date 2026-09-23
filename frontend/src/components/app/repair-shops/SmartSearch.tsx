"use client";

import React, { useState } from "react";
import { Search, MapPin, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { FilterOptions } from "@/types/repairShop";

interface SmartSearchProps {
  filters: FilterOptions;
  onFilterChange: (updated: Partial<FilterOptions>) => void;
  totalResults: number;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  filters,
  onFilterChange,
  totalResults,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const SUGGESTED_SEARCHES = [
    "iPhone Screen",
    "MacBook Battery",
    "San Francisco",
    "Micro-soldering",
    "Doorstep Pickup",
  ];

  return (
    <div className="bg-white dark:bg-[#0b1a13] border border-emerald-200/80 dark:border-emerald-900/60 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar Input */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search by shop name, city, zip code, device (e.g. iPhone 14 Pro), or repair service..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: "" })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Quick Auto Suggestions dropdown */}
          {isFocused && !filters.searchQuery && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#0d1f17] border border-emerald-200 dark:border-emerald-900 rounded-2xl shadow-xl p-3 z-30 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">Popular Searches</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SEARCHES.map((item) => (
                  <button
                    key={item}
                    onMouseDown={() => onFilterChange({ searchQuery: item })}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-medium text-emerald-800 dark:text-emerald-300 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:flex-none">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="w-full md:w-auto pl-9 pr-8 py-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all appearance-none cursor-pointer"
            >
              <option value="trust">Sort by AI Trust Score</option>
              <option value="rating">Sort by Rating</option>
              <option value="distance">Sort by Distance</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>

          {/* Quick Toggles */}
          <button
            onClick={() => onFilterChange({ pickupOnly: !filters.pickupOnly })}
            className={`px-4 py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap cursor-pointer ${
              filters.pickupOnly
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-slate-700 dark:text-slate-300 hover:bg-emerald-100"
            }`}
          >
            <span>Pickup Available</span>
          </button>

          <button
            onClick={() => onFilterChange({ oemOnly: !filters.oemOnly })}
            className={`px-4 py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap cursor-pointer ${
              filters.oemOnly
                ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                : "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-slate-700 dark:text-slate-300 hover:bg-emerald-100"
            }`}
          >
            <span>OEM Certified</span>
          </button>
        </div>
      </div>

      {/* Result Counter & Active Query Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {totalResults} {totalResults === 1 ? "Repair Center" : "Repair Centers"} Found
          </span>
          {filters.searchQuery && (
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-semibold">
              "{filters.searchQuery}"
            </span>
          )}
        </div>

        {(filters.searchQuery || filters.pickupOnly || filters.oemOnly || filters.category !== "All") && (
          <button
            onClick={() =>
              onFilterChange({
                searchQuery: "",
                category: "All",
                pickupOnly: false,
                oemOnly: false,
                sortBy: "trust",
              })
            }
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
