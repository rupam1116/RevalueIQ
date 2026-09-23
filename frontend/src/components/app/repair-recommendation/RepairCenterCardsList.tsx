"use client";

import React, { useState } from "react";
import { RepairCenterItem } from "@/types/repairCenter";
import {
  Star,
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  Sparkles,
  Bookmark,
  Eye,
  PackageSearch,
  CheckCircle,
  ExternalLink,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RepairCenterCardsListProps {
  centers: RepairCenterItem[];
  onSelectCenter: (center: RepairCenterItem) => void;
  isLoading?: boolean;
}

export const RepairCenterCardsList: React.FC<RepairCenterCardsListProps> = ({
  centers,
  onSelectCenter,
  isLoading = false,
}) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="rounded-3xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-[#0b1a13] p-5 h-80 flex flex-col justify-between space-y-4">
            <div className="w-full h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-1/2" />
            </div>
            <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (centers.length === 0) {
    return (
      <div className="rounded-3xl border border-emerald-100 dark:border-emerald-900/50 bg-white dark:bg-[#0b1a13] p-10 sm:p-14 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100/80 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-300">
          <PackageSearch className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">No repair centers found nearby</h3>
        <div className="text-slate-500 dark:text-slate-400 text-xs max-w-md mx-auto leading-relaxed text-left bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-2xl space-y-1.5">
          <p className="font-bold text-slate-700 dark:text-slate-300">Try the following:</p>
          <ul className="list-disc list-inside space-y-1 text-[11px]">
            <li>Increasing the search radius (e.g. 50 km or 100 km)</li>
            <li>Changing your search location or enabling GPS location</li>
            <li>Searching by a major metropolitan city or area</li>
            <li>Broadening the repair or device category filter</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Counter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Discovered Repair Centers</span>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {centers.length} {centers.length === 1 ? "center" : "centers"}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified real-world electronics repair businesses with direct communication
          </p>
        </div>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {centers.map((center) => {
          const isSaved = savedIds.includes(center.id);
          const isOsm = center.provider === "osm" || !center.google_place_id;
          const directionsUrl = isOsm
            ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${center.latitude}%2C${center.longitude}`
            : `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}&destination_place_id=${center.google_place_id || ""}`;

          return (
            <div
              key={center.id}
              className="group relative rounded-3xl border border-emerald-100 dark:border-emerald-900/50 bg-white dark:bg-[#0b1a13] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Hero Image Container */}
              <div
                className="relative aspect-4/3 overflow-hidden bg-emerald-950 cursor-pointer"
                onClick={() => onSelectCenter(center)}
              >
                <img
                  src={center.hero_image || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"}
                  alt={center.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
                />

                {/* Top Badges Bar */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/90 text-emerald-300 font-extrabold text-[10px] backdrop-blur-md border border-emerald-700/60 shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{center.is_authorized ? "OEM Authorized" : "Google Verified"}</span>
                  </div>

                  <button
                    onClick={(e) => toggleSave(center.id, e)}
                    className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md ${
                      isSaved
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900"
                    }`}
                    title={isSaved ? "Saved" : "Save Center"}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
                  </button>
                </div>

                {/* Quick View Overlay on Hover */}
                <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCenter(center);
                    }}
                    className="pointer-events-auto rounded-full bg-white text-slate-900 font-extrabold text-xs shadow-lg hover:bg-emerald-50 px-4 py-2 flex items-center gap-1.5 border-0 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-600" /> View Details
                  </Button>
                </div>

                {/* Bottom Overlay Badges */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none text-[10px]">
                  {center.match_score ? (
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/85 text-emerald-300 font-bold backdrop-blur-md border border-emerald-800/60 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      {center.match_score}% Match Score
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/85 text-emerald-300 font-bold backdrop-blur-md border border-emerald-800/60 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {center.rating} ({center.review_count})
                    </span>
                  )}

                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/90 border-emerald-700/60 text-emerald-300 font-bold backdrop-blur-md border">
                    {center.open_now === true ? "Open Now" : center.open_now === false ? "Closed" : "Google Listed"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>{center.city || "Verified Location"}</span>
                    {center.distance_km !== null && center.distance_km !== undefined && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{center.distance_km} km away</span>
                    )}
                  </div>

                  <h3
                    onClick={() => onSelectCenter(center)}
                    className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {center.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{center.address}</span>
                  </p>
                </div>

                {/* Brands & Services Tags */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {center.brand_services.slice(0, 3).map((brand, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                      >
                        {brand}
                      </span>
                    ))}
                    {center.brand_services.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500">
                        +{center.brand_services.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Top Capabilities */}
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    {center.repair_services.slice(0, 2).map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 truncate font-medium">
                        <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Contact Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-100 dark:border-emerald-900/50">
                  {center.phone ? (
                    <a
                      href={`tel:${center.phone}`}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-9 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer text-center"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => onSelectCenter(center)}
                      className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs h-9 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer text-center"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  )}

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-800 dark:text-slate-200 border border-emerald-200 dark:border-emerald-800 font-bold text-xs h-9 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer text-center"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
