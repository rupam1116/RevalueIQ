"use client";

import React, { useState } from "react";
import { CenterReview } from "@/types/repairRecommendation";
import { Star, ThumbsUp, MessageSquare, ShieldCheck } from "lucide-react";

interface CustomerReviewsSectionProps {
  reviews: CenterReview[];
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({ reviews }) => {
  const [likes, setLikes] = useState<Record<string, number>>(
    reviews.reduce((acc, r) => ({ ...acc, [r.id]: r.helpfulCount }), {})
  );
  const [likedUser, setLikedUser] = useState<Record<string, boolean>>({});

  const handleToggleLike = (id: string) => {
    setLikedUser((prev) => {
      const isAlready = !!prev[id];
      setLikes((l) => ({ ...l, [id]: l[id] + (isAlready ? -1 : 1) }));
      return { ...prev, [id]: !isAlready };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
          Latest Verified Google & RevalueIQ Reviews ({reviews.length})
        </h4>
        <span className="text-[11px] text-emerald-400 font-bold">100% Authentic Customers</span>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-sm flex items-center justify-center shadow-md">
                  {rev.userName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-white text-sm">{rev.userName}</h5>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Customer
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{rev.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 font-bold text-amber-400 text-xs bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {rev.rating}.0
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              "{rev.reviewText}"
            </p>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleToggleLike(rev.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                  likedUser[rev.id]
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({likes[rev.id] || 0})</span>
              </button>
            </div>

            {rev.ownerResponse && (
              <div className="p-3.5 rounded-xl bg-slate-900 border-l-2 border-emerald-500 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                  <span>Store Owner Response</span>
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  "{rev.ownerResponse}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
