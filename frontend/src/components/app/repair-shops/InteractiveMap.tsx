"use client";

import React, { useState } from "react";
import { RepairShop } from "@/types/repairShop";
import { MapPin, Navigation, Star, ShieldCheck, Wrench, Layers, Maximize2, LocateFixed, Eye } from "lucide-react";

interface InteractiveMapProps {
  shops: RepairShop[];
  selectedShop: RepairShop | null;
  onSelectShop: (shop: RepairShop) => void;
  onBookShop: (shop: RepairShop) => void;
  radiusMiles: number;
  onRadiusChange: (radius: number) => void;
  viewMode: "map" | "grid";
  onToggleViewMode: (mode: "map" | "grid") => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  shops,
  selectedShop,
  onSelectShop,
  onBookShop,
  radiusMiles,
  onRadiusChange,
  viewMode,
  onToggleViewMode,
}) => {
  const [activePinId, setActivePinId] = useState<string | null>(shops[0]?.id || null);

  const activeShop = shops.find((s) => s.id === activePinId) || shops[0];

  return (
    <div className="bg-white dark:bg-[#0b1a13] border border-emerald-200/80 dark:border-emerald-900/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 transition-all duration-300">
      {/* Map Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-emerald-100 dark:border-emerald-900/40">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Eco Repair Network Map</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive map of verified local technicians within your selected search radius.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Radius Selector */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-3 py-1.5 rounded-xl">
            <span>Radius:</span>
            <select
              value={radiusMiles}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="bg-transparent border-none text-emerald-700 dark:text-emerald-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value={5}>5 Miles</option>
              <option value={10}>10 Miles</option>
              <option value={25}>25 Miles</option>
              <option value={50}>50 Miles</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-emerald-100/60 dark:bg-emerald-950/80 p-1 rounded-xl border border-emerald-200/60 dark:border-emerald-900/60">
            <button
              onClick={() => onToggleViewMode("map")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "map"
                  ? "bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => onToggleViewMode("grid")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Grid View
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Map Canvas */}
      <div className="relative h-80 sm:h-96 w-full rounded-2xl bg-[#e8f5e9] dark:bg-[#07130c] overflow-hidden border border-emerald-200 dark:border-emerald-900/80">
        {/* Map Grid / Vector Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          {/* Simulated Roads */}
          <path d="M -50 120 Q 200 80 500 250 T 900 150" fill="none" stroke="#34d399" strokeWidth="10" opacity="0.4" />
          <path d="M 100 -50 Q 300 200 450 400" fill="none" stroke="#059669" strokeWidth="8" opacity="0.3" />
          <path d="M 0 300 Q 400 150 800 350" fill="none" stroke="#10b981" strokeWidth="6" opacity="0.3" />
        </svg>

        {/* User Location Radar Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-emerald-400 opacity-40"></span>
            <div className="w-5 h-5 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900 shadow-md" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[10px] font-bold shadow-md">
            Your Location
          </span>
        </div>

        {/* Map Pins for Repair Shops */}
        {shops.map((shop, idx) => {
          // Calculate stylized position on map grid
          const offsets = [
            { top: "25%", left: "28%" },
            { top: "60%", left: "68%" },
            { top: "35%", left: "75%" },
            { top: "72%", left: "22%" },
            { top: "18%", left: "55%" },
          ];
          const pos = offsets[idx % offsets.length];
          const isSelected = activePinId === shop.id;

          return (
            <div
              key={shop.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              onClick={() => {
                setActivePinId(shop.id);
                onSelectShop(shop);
              }}
            >
              <div
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-bold text-xs transition-all duration-200 shadow-md ${
                  isSelected
                    ? "bg-emerald-600 text-white scale-110 ring-4 ring-emerald-500/30 z-30"
                    : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-emerald-300 dark:border-emerald-800 hover:scale-105"
                }`}
              >
                <span className="text-sm">{shop.logo}</span>
                <span className="max-w-[100px] truncate">{shop.name}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">
                  {shop.aiTrustScore}%
                </span>
              </div>
              <div className={`w-2.5 h-2.5 bg-emerald-600 rotate-45 mx-auto -mt-1 ${isSelected ? "bg-emerald-600" : "bg-white dark:bg-slate-900"}`} />
            </div>
          );
        })}

        {/* Active Pin Card Preview Overlay at Bottom Left */}
        {activeShop && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-30 bg-white/95 dark:bg-[#091710]/95 backdrop-blur-md border border-emerald-300 dark:border-emerald-800 p-3.5 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-base">
                  {activeShop.logo}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{activeShop.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{activeShop.distanceMiles} mi away • {activeShop.estimatedTime}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800">
                {activeShop.aiTrustScore}% Trust
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-emerald-100 dark:border-emerald-900/60">
              <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" /> {activeShop.rating} ({activeShop.reviewCount})
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{activeShop.warrantyPeriod}</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onBookShop(activeShop)}
                className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all text-center cursor-pointer shadow-sm"
              >
                Book Now
              </button>
              <button
                onClick={() => onSelectShop(activeShop)}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition-all cursor-pointer border border-emerald-200 dark:border-emerald-800"
              >
                Details
              </button>
            </div>
          </div>
        )}

        {/* Map Floating Map Controls */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <button
            onClick={() => setActivePinId(shops[0]?.id || null)}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-md hover:bg-emerald-50 border border-emerald-200 dark:border-emerald-800"
            title="Recenter Map"
          >
            <LocateFixed className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
