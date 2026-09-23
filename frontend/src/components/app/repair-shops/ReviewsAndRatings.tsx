"use client";

import React, { useState } from "react";
import { ShopReview } from "@/types/repairShop";
import { Star, ShieldCheck, ThumbsUp, MessageSquare, Filter, Search } from "lucide-react";

interface ReviewsAndRatingsProps {
  reviews: ShopReview[];
  overallRating: number;
  totalCount: number;
}

export const ReviewsAndRatings: React.FC<ReviewsAndRatingsProps> = ({
  reviews,
  overallRating,
  totalCount,
}) => {
  const [filterRating, setFilterRating] = useState<number | "all">("all");

  const filtered = reviews.filter((r) => filterRating === "all" || r.rating === filterRating);

  return (
    <div className="bg-white dark:bg-[#0b1a13] border border-emerald-200/80 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100 dark:border-emerald-900/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Verified Customer Feedback
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Ratings & Reviews
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent community feedback from customers who completed certified repairs.
          </p>
        </div>

        {/* Rating Breakdown Pill */}
        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
            <span>{overallRating}</span>
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-xs text-slate-500">
            <div className="font-bold text-slate-800 dark:text-slate-200">Excellent</div>
            <div>{totalCount} Verified Reviews</div>
          </div>
        </div>
      </div>

      {/* Rating Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterRating("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            filterRating === "all"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          All Reviews
        </button>
        {[5, 4, 3].map((stars) => (
          <button
            key={stars}
            onClick={() => setFilterRating(stars)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
              filterRating === stars
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <span>{stars} Stars</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </button>
        ))}
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-emerald-50/30 dark:bg-[#09140e] border border-emerald-200/80 dark:border-emerald-900/60 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  {rev.author[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rev.author}</h4>
                    {rev.verifiedPurchase && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Repair
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Device: {rev.device} • {rev.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 font-bold text-amber-400 text-xs">
                <Star className="w-4 h-4 fill-amber-400" /> {rev.rating}.0
              </div>
            </div>

            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Service: {rev.repairType}
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              "{rev.content}"
            </p>

            {rev.shopResponse && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                  <span>Shop Response ({rev.shopResponse.date})</span>
                  <MessageSquare className="w-3 h-3" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {rev.shopResponse.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
