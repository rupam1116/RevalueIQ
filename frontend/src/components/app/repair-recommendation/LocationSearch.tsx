"use client";

import React from "react";
import { Search, Locate, Loader2, X, Sparkles, Filter, MapPin, Wrench, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  selectedRepairType: string;
  onRepairTypeChange: (type: string) => void;
  selectedRadius: number;
  onRadiusChange: (radius: number) => void;
  onAutoDetect: () => void;
  isDetecting: boolean;
  totalResults: number;
  isVerifiedOnly: boolean;
  onToggleVerifiedOnly: () => void;
}

export const POPULAR_CITIES = ["All", "Hyderabad", "Bengaluru", "Mumbai", "New Delhi"];
export const POPULAR_BRANDS = ["All", "Apple", "Samsung", "Dell", "HP", "Lenovo", "Xiaomi", "OnePlus"];
export const POPULAR_REPAIRS = [
  "All",
  "Screen Replacement",
  "Battery Replacement",
  "Water Damage",
  "Motherboard Micro-Soldering",
  "Charging Port Fix",
  "Camera Repair"
];

export const LocationSearch: React.FC<LocationSearchProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedBrand,
  onBrandChange,
  selectedRepairType,
  onRepairTypeChange,
  selectedRadius,
  onRadiusChange,
  onAutoDetect,
  isDetecting,
  totalResults,
  isVerifiedOnly,
  onToggleVerifiedOnly,
}) => {
  return (
    <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Top Search Input & GPS Button */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Main Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by city, area, pincode, brand, or service (e.g. Apple, Hyderabad, Screen Repair)..."
            className="w-full pl-11 pr-10 py-3.5 bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
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

        {/* Auto Detect Location Button */}
        <Button
          onClick={onAutoDetect}
          disabled={isDetecting}
          variant="outline"
          className="rounded-2xl border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-bold text-xs h-12 px-4 shrink-0 shadow-xs cursor-pointer"
        >
          {isDetecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600 mr-1.5" />
              <span>Detecting GPS...</span>
            </>
          ) : (
            <>
              <Locate className="w-4 h-4 text-emerald-600 mr-1.5" />
              <span>Use My Location</span>
            </>
          )}
        </Button>
      </div>

      {/* Filter Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
        {/* City Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-600" /> City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full py-2 px-3 bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {POPULAR_CITIES.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Cities" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Device Brand
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full py-2 px-3 bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {POPULAR_BRANDS.map((b) => (
              <option key={b} value={b}>
                {b === "All" ? "All Brands" : b}
              </option>
            ))}
          </select>
        </div>

        {/* Repair Service Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Wrench className="w-3 h-3 text-emerald-600" /> Repair Service
          </label>
          <select
            value={selectedRepairType}
            onChange={(e) => onRepairTypeChange(e.target.value)}
            className="w-full py-2 px-3 bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {POPULAR_REPAIRS.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "All Repair Types" : r}
              </option>
            ))}
          </select>
        </div>

        {/* Radius Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3 text-emerald-600" /> Max Radius
          </label>
          <select
            value={selectedRadius}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="w-full py-2 px-3 bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value={10}>Within 10 km</option>
            <option value={25}>Within 25 km</option>
            <option value={50}>Within 50 km</option>
            <option value={100}>Within 100 km</option>
          </select>
        </div>
      </div>

      {/* Counter and Verified Only Strip */}
      <div className="flex items-center justify-between pt-2 border-t border-emerald-50 dark:border-emerald-900/30 text-xs">
        <button
          onClick={onToggleVerifiedOnly}
          className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
            isVerifiedOnly
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-emerald-50/60 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>OEM Verified Only</span>
        </button>

        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          Found <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{totalResults}</span> verified {totalResults === 1 ? "center" : "centers"}
        </div>
      </div>
    </div>
  );
};
