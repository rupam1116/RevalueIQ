"use client";

import React from "react";
import {
  X,
  Smartphone,
  Wrench,
  ShoppingBag,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Download,
  Calendar,
  IndianRupee,
  CheckCircle2,
  FileText,
  Clock,
  Lightbulb,
  CheckCheck,
} from "lucide-react";
import { ActivityItem } from "@/lib/historyApi";
import { Button } from "@/components/ui/button";

interface ActivityDetailsModalProps {
  activity: ActivityItem | null;
  onClose: () => void;
  onDownloadReport: (activity: ActivityItem) => void;
  onRepeatAction: (activity: ActivityItem) => void;
  onConfirmCompletion?: () => void;
}

export const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  activity,
  onClose,
  onDownloadReport,
  onRepeatAction,
  onConfirmCompletion,
}) => {
  if (!activity) return null;

  const getActivityIcon = () => {
    switch (activity.type) {
      case "valuation":
        return <Smartphone className="w-6 h-6 text-emerald-500" />;
      case "repair":
        return <Wrench className="w-6 h-6 text-blue-500" />;
      case "marketplace":
        return <ShoppingBag className="w-6 h-6 text-teal-500" />;
      case "donation":
        return <HeartHandshake className="w-6 h-6 text-pink-500" />;
      default:
        return <FileText className="w-6 h-6 text-emerald-500" />;
    }
  };

  const isCompleted = activity.tier === "externally_completed";
  const isInitiated = activity.tier === "action_initiated";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 relative">
        {/* Modal Header */}
        <div className="p-6 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/30">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/60 dark:border-emerald-800/60 shadow-sm">
              {getActivityIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {activity.title}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  isCompleted
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    : isInitiated
                    ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                }`}>
                  {activity.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {activity.date} • Code: <span className="font-mono">{activity.event_code}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {/* Truth Tier Banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isCompleted
              ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
              : isInitiated
              ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200"
              : "bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
          }`}>
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : isInitiated ? (
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            ) : (
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <p className="font-black uppercase tracking-wider mb-0.5">
                {isCompleted
                  ? "Tier 3: Externally Completed & Verified"
                  : isInitiated
                  ? "Tier 2: Action Initiated (In Progress)"
                  : "Tier 1: AI Recommendation Generated"}
              </p>
              <p className="opacity-90 leading-relaxed">
                {isCompleted
                  ? "RevalueIQ has verified physical completion. Real environmental savings are officially credited."
                  : isInitiated
                  ? "An action step was initiated on RevalueIQ. Verification is pending completion."
                  : "Algorithm-generated recommendation. No physical transaction has taken place yet."}
              </p>
            </div>
          </div>

          {/* Main Info Box */}
          <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Target Electronic Asset
                </p>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {activity.device_name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Category: {activity.category}
                </p>
              </div>

              {activity.value_inr > 0 && (
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Recorded Value / Cost</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    ₹{activity.value_inr.toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-emerald-200/50 dark:border-emerald-800/40 pt-3">
              {activity.description}
            </p>
          </div>

          {/* Environmental Impact Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <Leaf className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isCompleted ? "Verified CO₂ Saved" : "Potential CO₂ Opportunity"}
                </span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                {isCompleted
                  ? `${activity.verified_co2_saved_kg.toFixed(1)} kg`
                  : `${activity.potential_co2_opportunity_kg.toFixed(1)} kg`}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isCompleted ? "Realized emissions avoided" : "Identified abatement potential"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isCompleted ? "Verified E-Waste Diverted" : "Potential E-Waste"}
                </span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                {isCompleted
                  ? `${activity.verified_ewaste_prevented_kg.toFixed(2)} kg`
                  : `${activity.potential_ewaste_opportunity_kg.toFixed(2)} kg`}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isCompleted ? "Diverted from toxic landfills" : "Preventable landfill impact"}
              </p>
            </div>
          </div>

          {/* Specific Details Grid */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Verified Event Metadata
            </h5>

            <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
              {activity.details.repair_shop && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Service Center</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{activity.details.repair_shop}</span>
                </div>
              )}
              {activity.details.buyer_or_ngo && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Recipient / Buyer</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{activity.details.buyer_or_ngo}</span>
                </div>
              )}
              {activity.details.condition_grade && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Condition Grade</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{activity.details.condition_grade}</span>
                </div>
              )}
              {activity.details.external_reference && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Receipt / Reference</span>
                  <span className="font-mono text-slate-900 dark:text-white">{activity.details.external_reference}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-emerald-100 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40">
          <Button
            variant="outline"
            onClick={() => onDownloadReport(activity)}
            className="border-emerald-200 dark:border-emerald-800 text-xs font-bold"
          >
            <Download className="w-4 h-4 mr-1.5 text-emerald-600" />
            Download PDF Report
          </Button>

          <div className="flex items-center gap-2">
            {activity.can_complete && onConfirmCompletion && (
              <Button
                onClick={onConfirmCompletion}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white font-extrabold text-xs shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Confirm External Completion
              </Button>
            )}

            <Button
              onClick={() => onRepeatAction(activity)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md"
            >
              Take Action on Device
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
