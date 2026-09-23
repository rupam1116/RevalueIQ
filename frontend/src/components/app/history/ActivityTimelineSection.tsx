"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Wrench,
  ShoppingBag,
  HeartHandshake,
  FileText,
  Calendar,
  Eye,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Lightbulb,
  CheckCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { ActivityItem } from "@/lib/historyApi";
import { Button } from "@/components/ui/button";
import { ActivityDetailsModal } from "./ActivityDetailsModal";

interface ActivityTimelineSectionProps {
  activities: ActivityItem[];
  onDownloadReport: (activity: ActivityItem) => void;
  onRepeatAction: (activity: ActivityItem) => void;
  onConfirmCompletion?: (activity: ActivityItem) => void;
}

export const ActivityTimelineSection: React.FC<ActivityTimelineSectionProps> = ({
  activities,
  onDownloadReport,
  onRepeatAction,
  onConfirmCompletion,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "valuation":
        return <Smartphone className="w-5 h-5 text-emerald-500" />;
      case "repair":
        return <Wrench className="w-5 h-5 text-blue-500" />;
      case "marketplace":
        return <ShoppingBag className="w-5 h-5 text-teal-500" />;
      case "donation":
        return <HeartHandshake className="w-5 h-5 text-pink-500" />;
      default:
        return <FileText className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getTierBadge = (tier: ActivityItem["tier"]) => {
    switch (tier) {
      case "recommendation_generated":
        return {
          label: "Tier 1: AI Recommendation",
          icon: Lightbulb,
          color: "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        };
      case "action_initiated":
        return {
          label: "Tier 2: Action Initiated",
          icon: Clock,
          color: "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        };
      case "externally_completed":
        return {
          label: "Tier 3: Externally Completed & Verified",
          icon: CheckCircle2,
          color: "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        };
      default:
        return {
          label: "Lifecycle Event",
          icon: Sparkles,
          color: "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800",
        };
    }
  };

  if (activities.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100/60 dark:bg-emerald-950/60 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
          <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
          No matching activities found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Every record here represents real MongoDB activity for your account. You can start by appraising a device, diagnosing an issue, or creating a marketplace listing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Activity Timeline</span>
        </h2>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
          {activities.length} Recorded Real Events
        </span>
      </div>

      {/* Professional Vertical Timeline */}
      <div className="relative pl-4 sm:pl-8 space-y-6 before:absolute before:left-[17px] sm:before:left-[33px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-500/40 before:to-transparent">
        {activities.map((act) => {
          const tierInfo = getTierBadge(act.tier);
          const TierIcon = tierInfo.icon;
          const isCompleted = act.tier === "externally_completed";
          const isInitiated = act.tier === "action_initiated";

          return (
            <div key={act.id} className="relative group">
              {/* Node Bullet Icon */}
              <div className="absolute -left-[24px] sm:-left-[40px] top-4 w-9 h-9 rounded-2xl bg-white dark:bg-[#0b1a13] border-2 border-emerald-500 dark:border-emerald-400 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950 transition-all duration-300 z-10">
                {getActivityIcon(act.type)}
              </div>

              {/* Timeline Card */}
              <div className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0b1a13] border shadow-sm hover:shadow-md transition-all duration-300 space-y-4 ${
                isCompleted
                  ? "border-emerald-300/80 dark:border-emerald-800/80"
                  : isInitiated
                  ? "border-blue-200 dark:border-blue-900/60"
                  : "border-emerald-100 dark:border-emerald-900/50"
              }`}>
                {/* Top Row: Title, Device Name, Date, Tier Badge */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-emerald-100 dark:border-emerald-900/40">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {act.title}
                      </h3>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${tierInfo.color}`}>
                        <TierIcon className="w-3 h-3" />
                        {tierInfo.label}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-2">
                      <span>{act.device_name}</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-slate-500 dark:text-slate-400 font-normal">{act.category}</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="font-mono text-slate-400 text-[11px]">{act.event_code}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {act.date}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {act.description}
                </p>

                {/* Details Metrics Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100/60 dark:border-emerald-900/30">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    {act.value_inr > 0 && (
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Value / Price</span>
                        <span className="font-black text-slate-900 dark:text-white font-mono">
                          ₹{act.value_inr.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    {/* Environmental Impact Distinction */}
                    {isCompleted ? (
                      <div>
                        <span className="text-emerald-600 dark:text-emerald-400 block text-[10px] uppercase font-extrabold flex items-center gap-0.5">
                          <CheckCheck className="w-3 h-3" /> Verified CO₂ Saved
                        </span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                          {act.verified_co2_saved_kg.toFixed(1)} kg CO₂e
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-amber-600 dark:text-amber-400 block text-[10px] uppercase font-bold">
                          Potential CO₂ Opportunity
                        </span>
                        <span className="font-semibold text-amber-700 dark:text-amber-300">
                          {act.potential_co2_opportunity_kg.toFixed(1)} kg CO₂e
                        </span>
                      </div>
                    )}

                    {isCompleted && act.verified_ewaste_prevented_kg > 0 && (
                      <div>
                        <span className="text-teal-600 dark:text-teal-400 block text-[10px] uppercase font-extrabold">
                          Diverted E-Waste
                        </span>
                        <span className="font-black text-teal-600 dark:text-teal-400">
                          {act.verified_ewaste_prevented_kg.toFixed(2)} kg
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2">
                    {act.can_complete && onConfirmCompletion && (
                      <Button
                        size="sm"
                        onClick={() => onConfirmCompletion(act)}
                        className="h-8 px-3 text-xs font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Confirm Completion
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedActivity(act)}
                      className="h-8 px-3 text-xs font-bold border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Audit Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onDownloadReport={() => {
            onDownloadReport(selectedActivity);
            setSelectedActivity(null);
          }}
          onRepeatAction={() => {
            onRepeatAction(selectedActivity);
            setSelectedActivity(null);
          }}
          onConfirmCompletion={onConfirmCompletion ? () => {
            const act = selectedActivity;
            setSelectedActivity(null);
            onConfirmCompletion(act);
          } : undefined}
        />
      )}
    </div>
  );
};
