"use client";

import React from "react";
import {
  Search,
  MapPin,
  X,
  Sparkles,
  Building2,
  School,
  Heart,
  BookOpen,
  ShieldCheck,
  Monitor,
  Grid,
  Recycle,
  Laptop
} from "lucide-react";

export const FILTER_CATEGORIES = [
  { id: "All Categories", label: "All Categories", icon: Grid, countDesc: "All Hubs" },
  { id: "Education", label: "Education", icon: BookOpen, countDesc: "Schools & Labs" },
  { id: "NGOs", label: "NGOs", icon: Heart, countDesc: "Non-Profits" },
  { id: "Orphanages", label: "Orphanages", icon: Building2, countDesc: "Youth Care" },
  { id: "Rural Schools", label: "Rural Schools", icon: School, countDesc: "Village STEM" },
  { id: "Digital Literacy", label: "Digital Literacy", icon: Monitor, countDesc: "Tech Labs" },
  { id: "Government Collection", label: "Government Collection", icon: ShieldCheck, countDesc: "Public Hubs" },
  { id: "E-Waste Recyclers", label: "E-Waste Recyclers", icon: Recycle, countDesc: "Certified Metals" },
] as const;

export const DONATION_TYPE_PILLS = [
  { id: "", label: "All Items" },
  { id: "Electronics", label: "Electronics" },
  { id: "Computers", label: "Computers & PCs" },
  { id: "Laptops", label: "Laptops" },
  { id: "Mobile Phones", label: "Mobile Phones" },
  { id: "Books", label: "Educational Books" },
  { id: "E-Waste", label: "E-Waste Scrap" },
];

export const QUICK_LOCATION_TAGS = [
  "Hyderabad",
  "Madhapur",
  "Gachibowli",
  "500081",
  "Banjara Hills",
  "Secunderabad",
];

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cityOrPincode: string;
  onCityOrPincodeChange: (cp: string) => void;
  deviceTypeFilter: string;
  onDeviceTypeChange: (dt: string) => void;
  selectedCategory: string;
  onCategorySelect: (cat: string) => void;
  onResetFilters: () => void;
  resultsCount: number;
  categoryCounts?: Record<string, number>;
}

export const DonationSearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  cityOrPincode,
  onCityOrPincodeChange,
  deviceTypeFilter,
  onDeviceTypeChange,
  selectedCategory,
  onCategorySelect,
  onResetFilters,
  resultsCount,
  categoryCounts = {},
}) => {
  const isFiltered = searchQuery || cityOrPincode || deviceTypeFilter || selectedCategory !== "All Categories";

  return (
    <div className="space-y-4">
      {/* Smart Search Bar Component */}
      <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search genuine organizations by name, cause, keyword..."
              className="w-full pl-11 pr-10 py-3.5 bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location & Pincode Filter */}
          <div className="relative w-full sm:w-64">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
            <input
              type="text"
              value={cityOrPincode}
              onChange={(e) => onCityOrPincodeChange(e.target.value)}
              placeholder="City, area, or PIN (e.g. 500081)..."
              className="w-full pl-9 pr-4 py-3.5 bg-white dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
            />
          </div>

          {/* Reset button */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="px-4 py-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-extrabold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" /> Reset
            </button>
          )}
        </div>

        {/* Quick Location Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Popular Locations:
          </span>
          {QUICK_LOCATION_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => onCityOrPincodeChange(tag)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 border cursor-pointer ${
                cityOrPincode.toLowerCase() === tag.toLowerCase()
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                  : "bg-emerald-50/60 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900 hover:bg-emerald-100/80"
              }`}
            >
              {tag}
            </button>
          ))}

          <div className="ml-auto text-[11px] font-bold text-slate-400 shrink-0">
            Showing <span className="text-emerald-700 dark:text-emerald-400">{resultsCount}</span> verified places
          </div>
        </div>

        {/* Donation Type Filter Section */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-emerald-50 dark:border-emerald-950/40 no-scrollbar">
          <span className="text-slate-500 dark:text-slate-400 font-extrabold text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Laptop className="w-3.5 h-3.5 text-teal-500" /> Filter Donation Type:
          </span>
          {DONATION_TYPE_PILLS.map((pill) => {
            const isSelected = (deviceTypeFilter || "") === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => onDeviceTypeChange(pill.id)}
                className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-teal-600 text-white shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 8-Grid Category Cards */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Filter by Organization Category
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {FILTER_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-md shadow-emerald-900/10"
                    : "bg-white dark:bg-[#0b1a13] hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50 text-slate-800 dark:text-slate-200 hover:border-emerald-300 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-emerald-100/70 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-200/70"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-white/20 text-emerald-100"
                        : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900"
                    }`}
                  >
                    Live
                  </span>
                </div>

                <div>
                  <h4 className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    {cat.label}
                  </h4>
                  <p className={`text-[10px] mt-0.5 font-extrabold ${isSelected ? "text-emerald-100" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {cat.id === "All Categories" ? `${resultsCount} found` : `${categoryCounts[cat.id] || 0} found`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
