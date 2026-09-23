"use client";

import React from "react";
import { REPAIR_TIMELINE_STAGES } from "@/lib/mockRepairShopData";
import { CheckCircle2, Clock, Wrench, ShieldCheck, Truck, Sparkles, RefreshCw } from "lucide-react";

export const RepairTimeline: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#0b1a13] border border-emerald-200/80 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-100 dark:border-emerald-900/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mb-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600 animate-spin" /> Real-time Repair Status Tracker
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Repair Lifecycle Timeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track your device repair journey step-by-step from drop-off to eco-friendly return.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold self-start sm:self-auto">
          Active Job: iPhone 14 Pro (#RIX-88421)
        </div>
      </div>

      {/* Visual Timeline Steps */}
      <div className="relative space-y-6 before:absolute before:left-5 sm:before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200 dark:before:bg-emerald-900">
        {REPAIR_TIMELINE_STAGES.map((stage) => {
          return (
            <div key={stage.step} className="relative flex items-start gap-4 z-10">
              {/* Status Circle Icon */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border-2 transition-all ${
                  stage.completed
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : stage.current
                    ? "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-600 dark:text-emerald-400 animate-pulse ring-4 ring-emerald-500/20"
                    : "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-400"
                }`}
              >
                {stage.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : stage.current ? (
                  <Wrench className="w-5 h-5 animate-spin" />
                ) : (
                  <span>{stage.step}</span>
                )}
              </div>

              {/* Stage Content Card */}
              <div
                className={`flex-1 p-4 rounded-2xl border transition-all ${
                  stage.current
                    ? "bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-700 shadow-sm"
                    : "bg-white dark:bg-[#09140e] border-emerald-200/80 dark:border-emerald-900/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                    {stage.title}
                  </h4>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    stage.completed
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : stage.current
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {stage.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
