"use client";

import React from "react";
import { RepairShop } from "@/types/repairShop";
import { Sparkles, ShieldCheck, Clock, MapPin, Truck, Leaf, Star, ArrowRight, Award, CheckCircle2 } from "lucide-react";

interface AIRecommendedShopProps {
  shop: RepairShop;
  onBookShop: (shop: RepairShop) => void;
  onViewDetails: (shop: RepairShop) => void;
}

export const AIRecommendedShop: React.FC<AIRecommendedShopProps> = ({
  shop,
  onBookShop,
  onViewDetails,
}) => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-emerald-700/60">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Badge & Shop Branding */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>#1 AI Recommended Shop Match</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shrink-0 shadow-lg">
              {shop.logo}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{shop.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                  {shop.aiTrustScore}% AI Match
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">{shop.tagline}</p>
              <p className="text-xs text-emerald-300/80 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{shop.address}, {shop.city} ({shop.distanceMiles} mi away)</span>
              </p>
            </div>
          </div>

          {/* AI Match Rationale Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-xs text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>99% Genuine OEM Parts</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-xs text-emerald-100">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Fastest 45-Min Express</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-xs text-emerald-100">
              <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Top 1% Eco Recycler</span>
            </div>
          </div>
        </div>

        {/* Right Side: Score Card & Action Buttons */}
        <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <div className="text-[11px] text-emerald-200 uppercase tracking-wider font-bold">Circular Score</div>
              <div className="text-2xl font-extrabold text-white flex items-center gap-1.5">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span>{shop.circularContributionScore}/100</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-emerald-200 uppercase tracking-wider font-bold">Customer Rating</div>
              <div className="text-2xl font-extrabold text-amber-300 flex items-center justify-end gap-1">
                <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
                <span>{shop.rating}</span>
                <span className="text-xs text-emerald-200 font-normal">({shop.reviewCount})</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-emerald-100">
            <div className="flex justify-between">
              <span className="text-emerald-300">Warranty:</span>
              <span className="font-bold">{shop.warrantyPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-300">Pickup Status:</span>
              <span className="font-bold text-emerald-300">{shop.pickupAvailable ? "Free Express Courier" : "Walk-in Only"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onBookShop(shop)}
              className="flex-1 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-400/20 cursor-pointer text-center"
            >
              Book Priority Appointment
            </button>
            <button
              onClick={() => onViewDetails(shop)}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 cursor-pointer"
            >
              View Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
