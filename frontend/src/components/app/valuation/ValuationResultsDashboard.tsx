"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Wrench,
  Leaf,
  Download,
  ShoppingBag,
  HeartHandshake,
  RotateCcw,
  Save,
  ChevronRight,
  Cpu,
  Check,
} from "lucide-react";
import { ValuationReport } from "@/types/valuation";
import { useAuth } from "@/context/AuthContext";
import { registerDeviceFromValuation } from "@/lib/valuationApi";

interface ValuationResultsDashboardProps {
  report: ValuationReport;
  onReset: () => void;
  onSaveReport: (report: ValuationReport) => void;
  onOpenPDF: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const ValuationResultsDashboard: React.FC<ValuationResultsDashboardProps> = ({
  report,
  onReset,
  onSaveReport,
  onOpenPDF,
  onNavigateTab,
}) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      if (report?.id && !report.id.startsWith("app-")) {
        const token = await getToken();
        if (token) {
          const res = await registerDeviceFromValuation(token, report.id);
          setSaveMessage(res.message || "Device successfully added to your portfolio.");
          setSavedSuccess(true);
        }
      } else {
        setSaveMessage("Valuation record saved to your workspace session.");
        setSavedSuccess(true);
      }
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("exists")) {
        setSaveMessage("This device is already registered in your portfolio.");
        setSavedSuccess(true);
      } else {
        setSaveMessage(msg || "Could not register device to user portfolio.");
      }
    } finally {
      setIsSaving(false);
      onSaveReport(report);
      setTimeout(() => {
        setSavedSuccess(false);
        setSaveMessage(null);
      }, 4000);
    }
  };

  const handleBookRepair = () => {
    const totalRepairCost = report.repairCost || report.repairItems?.reduce((sum, r) => sum + (r.estimatedCost || 0), 0) || 0;
    const repairContext = {
      category: report.category || "Smartphone",
      brand: report.brand || "",
      model: report.model || report.deviceName || "",
      problem: report.conditionGrade || "Hardware Diagnostic & Repair",
      severity: (report.conditionGrade && (report.conditionGrade.includes("Heavy") || report.conditionGrade.includes("Cracked"))) ? "HIGH" : "MEDIUM",
      recommended_action: "REPAIR",
      estimated_repair_cost: totalRepairCost,
      valuation_id: report.id,
    };
    if (typeof window !== "undefined") {
      sessionStorage.setItem("revalueiq_repair_context", JSON.stringify(repairContext));
    }
    const params = new URLSearchParams({
      category: repairContext.category,
      brand: repairContext.brand,
      model: repairContext.model,
      problem: repairContext.problem,
      severity: repairContext.severity,
      action: repairContext.recommended_action,
      estimated_cost: repairContext.estimated_repair_cost.toString(),
      valuation_id: report.id || "",
    });
    if (onNavigateTab) {
      onNavigateTab(`repair-shops?${params.toString()}`);
    }
  };

  const handleDonateDevice = () => {
    const donationContext = {
      productName: `${report.brand || ""} ${report.model || report.deviceName || ""}`.trim() || report.category || "Electronic Device",
      category: report.category || "Smartphone",
      brand: report.brand || "",
      model: report.deviceName || report.brand || "",
      condition: report.conditionGrade || "Operational / Pre-owned",
      estimatedValueINR: report.estimatedValueMax || report.estimatedValueMin || 0,
      valuationId: report.id || "",
    };
    if (typeof window !== "undefined") {
      sessionStorage.setItem("revalueiq_donation_context", JSON.stringify(donationContext));
    }
    const params = new URLSearchParams({
      product: donationContext.productName,
      category: donationContext.category,
      brand: donationContext.brand,
      model: donationContext.model,
      condition: donationContext.condition,
      valuation_id: donationContext.valuationId,
    });
    if (onNavigateTab) {
      onNavigateTab(`donation?${params.toString()}`);
    } else {
      router.push(`/app/donation?${params.toString()}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {saveMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <p className="text-sm font-semibold">{saveMessage}</p>
          </div>
          <button onClick={() => setSaveMessage(null)} className="text-xs font-bold underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Top Banner: Device Header & Scan Status */}
      <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Primary Thumbnail */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-xl shrink-0 bg-slate-950">
              <img
                src={
                  report.primaryImage &&
                    report.primaryImage !== "phase3-test-image" &&
                    (report.primaryImage.startsWith("http") || report.primaryImage.startsWith("data:") || report.primaryImage.startsWith("blob:") || report.primaryImage.startsWith("/"))
                    ? report.primaryImage
                    : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300"
                }
                alt={report.deviceName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {report.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" /> {report.confidenceScore}% Vision Confidence
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {report.deviceName}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span>Scanned {report.scannedAt}</span>
                <span>•</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">{report.conditionGrade}</span>
              </p>
            </div>
          </div>

          {/* Action Trigger Pills */}
          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Scan Another Device</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Valuation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Phase 3.5: Prominent Primary Recommendation Card */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/30 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                RECOMMENDED ACTION
              </span>
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Confidence: {report.confidenceScore}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">RevalueIQ Circularity Score:</span>
              <span className="px-3 py-1 rounded-xl bg-emerald-400/20 border border-emerald-400/40 font-black text-emerald-300 text-sm">
                {report.circularScore}/100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                {report.marketRecommendation === "REPAIR" && <Wrench className="w-8 h-8 text-amber-400 shrink-0" />}
                {report.marketRecommendation === "SELL" && <ShoppingBag className="w-8 h-8 text-emerald-400 shrink-0" />}
                {report.marketRecommendation === "KEEP" && <Check className="w-8 h-8 text-teal-400 shrink-0" />}
                {report.marketRecommendation === "REPLACE" && <RotateCcw className="w-8 h-8 text-rose-400 shrink-0" />}
                <span>
                  {report.marketRecommendation === "REPAIR" ? "Repair & Extend Lifespan" :
                    report.marketRecommendation === "SELL" ? "Resell for Maximum Value" :
                      report.marketRecommendation === "KEEP" ? "Keep & Continue Using" :
                        report.marketRecommendation === "REPLACE" ? "Replace / Recycle Device" :
                          report.marketRecommendation || "Repair & Continue Using"}
                </span>
              </div>

              {report.aiReasoning && (
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/20">
                  <span className="font-extrabold text-emerald-300 block mb-1">Why this action:</span>
                  "{report.aiReasoning}"
                </p>
              )}

              {report.circularRecommendation && (
                <p className="text-xs text-emerald-200/90 leading-relaxed flex items-start gap-2 pt-1">
                  <Leaf className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{report.circularRecommendation}</span>
                </p>
              )}
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3 bg-slate-950/50 p-4 rounded-2xl border border-emerald-500/20">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Resale Value</span>
                <span className="text-2xl font-black text-emerald-400">
                  ₹{(report.estimatedValue ?? report.recommendedListingPrice ?? 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="space-y-1 border-l border-slate-800 pl-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Repair Cost</span>
                <span className="text-2xl font-black text-amber-300">
                  {report.repairCost && report.repairCost > 0 ? `₹${report.repairCost.toLocaleString("en-IN")}` : "₹0 (No Repair)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 3 Core Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Card 1: Circular Economy Score Gauge */}
        <div className="md:col-span-4 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 space-y-5 shadow-xl relative overflow-hidden flex flex-col justify-between transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> RevalueIQ Circularity Score
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Grade {report.ecoGrade}
            </span>
          </div>

          {/* Gauge Visualization */}
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-emerald-100 dark:text-emerald-950"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  strokeDasharray={`${report.circularScore}, 100`}
                  className="text-emerald-600 dark:text-emerald-400"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{report.circularScore}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">out of 100</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold text-center">
              {report.circularScore >= 85 ? "High Circular Efficiency" : report.circularScore >= 70 ? "Moderate Circular Efficiency" : "Standard Efficiency"}
            </p>
          </div>

          {/* Sub-Metrics Breakdown */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-100 dark:border-emerald-900/40 text-xs">
            <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] text-slate-500 font-semibold block">CO2 Offset</span>
              <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">{report.co2OffsetKg} kg</span>
            </div>
            <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] text-slate-500 font-semibold block">e-Waste Saved</span>
              <span className="text-sm font-extrabold text-teal-700 dark:text-teal-400">{report.eWasteDivertedKg} kg</span>
            </div>
          </div>
        </div>

        {/* Card 2: Estimated Market Value Card */}
        <div className="md:col-span-4 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-200 dark:border-emerald-800/80 p-6 space-y-5 shadow-xl relative overflow-hidden flex flex-col justify-between transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Estimated Market Value
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Secondary Market Estimate
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimated Secondary Range</span>
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              ₹{report.estimatedValueMin.toLocaleString("en-IN")} – ₹{report.estimatedValueMax.toLocaleString("en-IN")}
            </div>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center justify-between bg-emerald-50/60 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Recommended Listing</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-300">₹{report.recommendedListingPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50/60 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Instant Trade-in Payout</span>
                <span className="font-extrabold text-slate-900 dark:text-white">₹{report.tradeInValue.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Retention Information */}
          <div className="space-y-1 pt-2 border-t border-emerald-100 dark:border-emerald-900/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Market Demand Assessment</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{report.marketDemandLiquidity || "High"} Liquidity</span>
          </div>
        </div>

        {/* Card 3: Repair Recommendation Card */}
        <div className="md:col-span-4 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 space-y-5 shadow-xl relative overflow-hidden flex flex-col justify-between transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Repair Recommendation
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {report.repairCost && report.repairCost > 0 ? "Servicing Suggested" : "No Repair Needed"}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300 tracking-wider">Suggested Action</span>
              <div className="text-lg font-black text-slate-900 dark:text-white">{report.repairRecommendation}</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                {report.repairCost && report.repairCost > 0
                  ? `Estimated servicing cost: ₹${report.repairCost.toLocaleString("en-IN")}`
                  : "Device hardware is intact and ready for continued usage or listing."}
              </p>
            </div>

            {/* Itemized Repair Table */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Servicing Estimate</span>
              {report.repairItems.length > 0 ? (
                report.repairItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-emerald-50/60 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-[11px]">
                    <span className="text-slate-700 dark:text-slate-300 truncate">{item.component}</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">₹{item.estimatedCost}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between bg-emerald-50/60 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-[11px]">
                  <span className="text-slate-600 dark:text-slate-400">No components requiring repair</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹0</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              const brandName = report.brand || (report.deviceName?.split(" ")[0] || "Apple");
              const problemSummary = report.repairItems?.length
                ? report.repairItems.map((i) => i.component).join(", ")
                : (report.damageDescription || "Screen / Hardware Repair");
              const repairContext = {
                category: report.category || "Smartphone",
                brand: brandName,
                model: report.deviceName || "iPhone 14 Pro",
                problem: problemSummary,
                severity: "HIGH",
                recommended_action: report.repairRecommendation || "REPAIR",
                estimated_repair_cost: report.repairCost || 0,
                valuation_id: report.id || "",
              };
              if (typeof window !== "undefined") {
                sessionStorage.setItem("revalueiq_repair_context", JSON.stringify(repairContext));
              }
              const params = new URLSearchParams({
                category: repairContext.category,
                brand: repairContext.brand,
                model: repairContext.model,
                problem: repairContext.problem,
                severity: repairContext.severity,
                action: repairContext.recommended_action,
                estimated_cost: repairContext.estimated_repair_cost.toString(),
                valuation_id: report.id || "",
              });
              if (onNavigateTab) {
                onNavigateTab(`repair-shops?${params.toString()}`);
              } else {
                router.push(`/app/repair-shops?${params.toString()}`);
              }
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Book Repair / Find Service Centers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 2: Environmental Impact & Precious Minerals Section */}
      <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 space-y-4 shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Environmental Impact & Mineral Recovery
          </h3>
          <span className="text-xs text-slate-500 font-medium italic">Estimated environmental impact based on category-level benchmark assumptions</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Gold (Au)</p>
            <p className="text-base font-black text-amber-600 dark:text-amber-400">{report.materialsRecovered.goldMg} mg</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Silver (Ag)</p>
            <p className="text-base font-black text-slate-700 dark:text-slate-200">{report.materialsRecovered.silverMg} mg</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Copper (Cu)</p>
            <p className="text-base font-black text-orange-600 dark:text-orange-400">{report.materialsRecovered.copperGrams} g</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Cobalt (Co)</p>
            <p className="text-base font-black text-teal-600 dark:text-teal-400">{report.materialsRecovered.cobaltGrams} g</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 col-span-2 sm:col-span-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Aluminum (Al)</p>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400">{report.materialsRecovered.aluminumGrams} g</p>
          </div>
        </div>
      </div>

      {/* Row 3: AI Diagnostic Insights & Vision Confidence */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 space-y-4 shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> AI Computer Vision Diagnostics
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Image Vision Inspection</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {report.aiInsights.map((ins) => (
              <div key={ins.id} className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white">{ins.title}</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">{ins.confidence}% Match</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{ins.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Score Summary Side Card */}
        <div className="md:col-span-4 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 space-y-4 shadow-xl flex flex-col justify-between transition-all duration-300">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Vision Model Confidence
            </span>
            <div className="text-4xl font-black text-slate-900 dark:text-white">{report.confidenceScore}%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Appraised via RevalueIQ AI Vision & secondary market valuation models.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-emerald-100 dark:border-emerald-900/40 text-xs">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span>Device Category</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{report.category}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span>Market Demand Liquidity</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">{report.marketDemandLiquidity || "High"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Primary Action Buttons Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPDF}
            className="px-6 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Download Official PDF Report</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab("marketplace")}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-2 border-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>List Device on Marketplace (Sell)</span>
          </button>

          <button
            onClick={handleBookRepair}
            className="px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Wrench className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Book Repair</span>
          </button>

          <button
            onClick={handleDonateDevice}
            className="px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <HeartHandshake className="w-4 h-4 text-rose-500" />
            <span>Donate Device</span>
          </button>
        </div>
      </div>
    </div>
  );
};
