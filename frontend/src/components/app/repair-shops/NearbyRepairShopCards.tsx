"use client";

import React from "react";
import { RepairShop } from "@/types/repairShop";
import { Star, MapPin, Clock, ShieldCheck, Truck, Leaf, Sparkles, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";

interface NearbyRepairShopCardsProps {
  shops: RepairShop[];
  onBookShop: (shop: RepairShop) => void;
  onViewDetails: (shop: RepairShop) => void;
}

export const NearbyRepairShopCards: React.FC<NearbyRepairShopCardsProps> = ({
  shops,
  onBookShop,
  onViewDetails,
}) => {
  if (shops.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0b1a13] border border-emerald-200/80 dark:border-emerald-900/60 rounded-3xl p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
          <MapPin className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Eco Repair Shops Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Try expanding your search radius or selecting a different category chip to discover certified repair centers near you.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map((shop) => {
        return (
          <div
            key={shop.id}
            className="group bg-white dark:bg-[#0b1a13] border border-emerald-200/80 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-700 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Row: Logo & Badges */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                    {shop.logo}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{shop.city} • {shop.distanceMiles} mi away</span>
                    </p>
                  </div>
                </div>

                {/* AI Trust Score Badge */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-extrabold shadow-2xs">
                    <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{shop.aiTrustScore}% Trust</span>
                  </span>
                </div>
              </div>

              {/* Tagline / Subtitle */}
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {shop.tagline}
              </p>

              {/* Rating & Turnaround Row */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-100 dark:border-emerald-900/40 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  <span>{shop.rating}</span>
                  <span className="text-slate-400 font-normal">({shop.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Est. {shop.estimatedTime}</span>
                </div>
              </div>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> {shop.warrantyPeriod}
                </span>

                <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[10px] font-semibold flex items-center gap-1">
                  <Truck className="w-3 h-3 text-teal-600" /> {shop.pickupAvailable ? "Pickup Available" : "In-store"}
                </span>

                <span className="px-2 py-0.5 rounded-md bg-green-50 dark:bg-green-950/60 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 text-[10px] font-semibold flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-green-600" /> {shop.circularContributionScore}/100 Eco Score
                </span>
              </div>

              {/* Services Offered Badges */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Top Services:</span>
                <div className="flex flex-wrap gap-1">
                  {shop.services.slice(0, 3).map((s) => (
                    <span key={s.id} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium">
                      {s.name} (${s.price})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 mt-4 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center gap-2">
              <button
                onClick={() => onBookShop(shop)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all text-center cursor-pointer active:scale-95"
              >
                Book Appointment
              </button>
              <button
                onClick={() => onViewDetails(shop)}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all border border-emerald-200 dark:border-emerald-800 cursor-pointer flex items-center gap-1"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
