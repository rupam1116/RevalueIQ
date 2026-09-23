"use client";

import React from "react";
import { AIReviewSummaryData } from "@/types/repairRecommendation";
import { Sparkles, Star, CheckCircle2, AlertCircle, ThumbsUp } from "lucide-react";

interface AIReviewSummaryCardProps {
  summary: AIReviewSummaryData;
}

export const AIReviewSummaryCard: React.FC<AIReviewSummaryCardProps> = ({ summary }) => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0a1811] via-[#08151c] to-[#040a12] border border-emerald-500/30 p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              AI Synthesized Sentiment Analysis
            </div>
            <h3 className="text-base font-extrabold text-white">AI Review Summary</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-extrabold text-white text-sm">{summary.overallRating}</span>
          <span className="text-xs text-slate-400">({summary.reviewCount} Verified Reviews)</span>
        </div>
      </div>

      {/* AI Summary Text */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-medium">
        "{summary.summaryText}"
      </div>

      {/* Strengths vs Weaknesses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Key Strengths</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300 font-medium">
            {summary.strengths.map((str, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Areas for Improvement</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300 font-medium">
            {summary.weaknesses.map((weak, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{weak}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
