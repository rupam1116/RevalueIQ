"use client";

import React from "react";
import {
  Smartphone,
  Laptop,
  Headphones,
  Tablet,
  Watch,
  Eye,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  AlertCircle,
} from "lucide-react";
import { RecentAuditedDeviceItem } from "@/lib/historyApi";
import { Button } from "@/components/ui/button";

interface RecentDevicesSectionProps {
  devices: RecentAuditedDeviceItem[];
  onViewDeviceDetails?: (device: RecentAuditedDeviceItem) => void;
  onNavigateToValuation?: () => void;
}

export const RecentDevicesSection: React.FC<RecentDevicesSectionProps> = ({
  devices,
  onViewDeviceDetails,
  onNavigateToValuation,
}) => {
  const getDeviceIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("laptop") || cat.includes("computer") || cat.includes("pc")) {
      return <Laptop className="w-6 h-6 text-teal-500" />;
    }
    if (cat.includes("audio") || cat.includes("headphone") || cat.includes("earbud")) {
      return <Headphones className="w-6 h-6 text-blue-500" />;
    }
    if (cat.includes("tablet") || cat.includes("ipad")) {
      return <Tablet className="w-6 h-6 text-purple-500" />;
    }
    if (cat.includes("watch")) {
      return <Watch className="w-6 h-6 text-pink-500" />;
    }
    return <Smartphone className="w-6 h-6 text-emerald-500" />;
  };

  const getRecommendationBadge = (recommendation: string) => {
    const rec = recommendation.toUpperCase();
    if (rec.includes("SELL")) {
      return "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    }
    if (rec.includes("REPAIR")) {
      return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    }
    if (rec.includes("DONATE")) {
      return "bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800";
    }
    return "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Recently Audited Devices</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real hardware assets appraised or registered by your account with current market estimates and recommended circular pathways.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
          {devices.length} Registered Units
        </span>
      </div>

      {devices.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100/60 dark:bg-emerald-950/60 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <Smartphone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            No Audited Devices Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Scan your phone, laptop, or other electronics with Google Gemini Vision to inspect damage and calculate fair residual value.
          </p>
          {onNavigateToValuation && (
            <Button
              onClick={onNavigateToValuation}
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs"
            >
              Start AI Valuation
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header: Icon badge & Status */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm group-hover:scale-105 transition-transform">
                    {getDeviceIcon(device.category)}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                      {device.status}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {device.condition}
                    </span>
                  </div>
                </div>

                {/* Device Title & Category */}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {device.device_name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {device.category} • Updated {device.last_updated}
                  </p>
                </div>

                {/* Valuation & Recommendation Pill */}
                <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100/60 dark:border-emerald-900/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">AI Resale Estimate</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                      {device.estimated_value_inr > 0 ? `₹${device.estimated_value_inr.toLocaleString("en-IN")}` : "Scanned"}
                    </span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${getRecommendationBadge(device.recommended_action)}`}>
                    {device.recommended_action}
                  </span>
                </div>
              </div>

              {/* Bottom Action */}
              {onViewDeviceDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDeviceDetails(device)}
                  className="w-full h-8 text-xs font-bold border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Inspect Audit</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
