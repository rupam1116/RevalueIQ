"use client";

import React from "react";
import { AIRecommendationReport } from "@/types/repairRecommendation";
import { CheckCircle2, ShieldCheck, DollarSign, Clock, Leaf, ArrowDown, Wrench, Smartphone, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIResultCardProps {
  report: AIRecommendationReport;
  onFindCentersClick: () => void;
  onBookRepairClick: () => void;
}

export const AIResultCard: React.FC<AIResultCardProps> = ({
  report,
  onFindCentersClick,
  onBookRepairClick,
}) => {
  return (
    <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-all">
      {/* Top Row: Title & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-emerald-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-300 shrink-0 shadow-md">
            <Smartphone className="w-7 h-7 text-emerald-400" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{report.actionRequired}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-900 text-emerald-300 border border-emerald-800/60 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Confidence: {report.confidenceScore}%</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {report.deviceName} Diagnostic Scan Report
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            onClick={onBookRepairClick}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-10 px-5 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Wrench className="w-4 h-4" />
            <span>Book Repair</span>
          </Button>

          <Button
            variant="outline"
            onClick={onFindCentersClick}
            className="rounded-xl bg-white hover:bg-emerald-50 text-slate-800 border border-emerald-200 font-bold text-xs h-10 px-5 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Find Nearby Centers</span>
            <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
          </Button>
        </div>
      </div>

      {/* Grid of Key Diagnostic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Detected Issues */}
        <div className="md:col-span-6 p-4.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Detected Hardware Issues ({report.detectedIssues.length})
          </div>

          <div className="space-y-2">
            {report.detectedIssues.map((issue, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-emerald-100 text-xs font-semibold text-slate-800 shadow-2xs"
              >
                <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 4 Metric Cards */}
        <div className="md:col-span-6 grid grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Est. Repair Cost</span>
            <div className="text-2xl font-black text-slate-900">₹{report.estimatedCostINR.toLocaleString("en-IN")}</div>
            <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Saves ₹42,000 vs Replace
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Turnaround Time</span>
            <div className="text-2xl font-black text-slate-900">{report.estimatedDays}</div>
            <div className="text-[11px] text-slate-500 font-medium">Express Courier Included</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Carbon Saved</span>
            <div className="text-2xl font-black text-emerald-700">12.4 kg CO2</div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-600" /> Zero E-Waste Guarantee
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Warranty Coverage</span>
            <div className="text-2xl font-black text-slate-900">1 Year</div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Genuine OEM Parts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
