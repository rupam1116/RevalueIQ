"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wrench,
  AlertTriangle,
  DollarSign,
  Clock,
  ShieldCheck,
  MapPin,
  Leaf,
  Sparkles,
  Share2,
  Download,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  RotateCcw,
  ShoppingBag,
  Star,
  Phone,
  Layers,
  ChevronDown,
  ChevronUp,
  Trash2,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";

import { RepairReport } from "@/types/repair";

interface AIRepairReportViewProps {
  report: RepairReport;
  onReset: () => void;
  onSaveReport: (report: RepairReport) => void;
  onDeleteReport?: (reportId: string) => Promise<void>;
  onOpenPDF: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const AIRepairReportView: React.FC<AIRepairReportViewProps> = ({
  report,
  onReset,
  onSaveReport,
  onDeleteReport,
  onOpenPDF,
  onNavigateTab,
}) => {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [bookedShopId, setBookedShopId] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSave = () => {
    onSaveReport(report);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleBookRepair = (shopId?: string) => {
    setBookedShopId(shopId || "shop-1");
    const nameParts = (report.deviceName || "").trim().split(" ");
    const inferredBrand = nameParts[0] || "";
    const inferredModel = nameParts.slice(1).join(" ") || report.deviceName || "";

    const repairContext = {
      category: report.category || "Smartphone",
      brand: inferredBrand,
      model: inferredModel,
      problem: report.problemIdentified?.title || report.problemIdentified?.summary || "Hardware Fault",
      severity: report.severity?.level?.toUpperCase() || "HIGH",
      recommended_action: "REPAIR",
      estimated_repair_cost: report.estimatedRepairCost?.totalMax || report.estimatedRepairCost?.totalMin || 0,
      advisory_id: report.id,
      advisory_code: report.advisoryCode,
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
      advisory_id: report.id || "",
    });
    if (onNavigateTab) {
      onNavigateTab(`repair-shops?${params.toString()}`);
    } else {
      router.push(`/app/repair-shops?${params.toString()}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!onDeleteReport) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDeleteReport(report.id);
      setShowDeleteModal(false);
    } catch (err: any) {
      setDeleteError(err?.message || "Unable to delete the diagnostic report. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl backdrop-blur-xl transition-all duration-300">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Diagnostic Certificate #{report.advisoryCode || report.id}
            </span>
            <span className="px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold">
              Scan Complete • {report.date}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {report.deviceName} Diagnostic Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Primary Issue Identified: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{report.problemIdentified.title}</span>
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleBookRepair()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg cursor-pointer flex items-center gap-2 border-0"
          >
            <Wrench className="w-4 h-4 fill-white" />
            <span>Book Repair</span>
          </button>

          <button
            onClick={handleSave}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
              isSaved
                ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300"
                : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Bookmark className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{isSaved ? "Saved to History!" : "Save Report"}</span>
          </button>

          <button
            onClick={onOpenPDF}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer flex items-center gap-2"
          >
            <Share2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{copiedShare ? "Link Copied!" : "Share"}</span>
          </button>

          <button
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>New Diagnosis</span>
          </button>

          {onDeleteReport && (
            <button
              onClick={() => {
                setDeleteError(null);
                setShowDeleteModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 font-bold text-xs cursor-pointer flex items-center gap-2 transition-colors"
              title="Delete Diagnostic Report"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab("valuation")}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg cursor-pointer flex items-center gap-2 border-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sell After Repair</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0b1a13] border border-red-500/30 dark:border-red-500/40 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 relative">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteError(null);
              }}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Delete Diagnostic Report?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Are you sure you want to permanently delete this repair advisory? This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Advisory Info Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {report.deviceName}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800 shrink-0">
                  {report.advisoryCode || report.id}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-1 font-medium">
                {report.problemIdentified.title}
              </p>
            </div>

            {/* Error Message Alert */}
            {deleteError && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{deleteError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-extrabold shadow-lg shadow-red-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-0"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Safety Warnings Critical Alert Banner */}
      {report.safetyWarnings && report.safetyWarnings.length > 0 && (
        <div className="rounded-3xl bg-red-500/10 border-2 border-red-500/50 p-6 space-y-3 shadow-xl backdrop-blur-xl animate-in fade-in">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <div className="p-2 rounded-xl bg-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-red-700 dark:text-red-300">
                Safety-Critical Advisory Warning
              </h3>
              <p className="text-xs text-red-600/90 dark:text-red-400/90 font-medium">
                Professional handling required to avoid thermal or electrical safety hazards.
              </p>
            </div>
          </div>
          <div className="space-y-1.5 pl-11">
            {report.safetyWarnings.map((warn, i) => (
              <p key={i} className="text-xs text-red-800 dark:text-red-200 font-semibold flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>{warn}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Executive AI Recommendation Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-cyan-200 dark:border-cyan-500/30 p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
                AI Executive Directive • {report.aiRecommendation.confidence}% Confidence
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {report.aiRecommendation.headline}
              </h2>
            </div>
          </div>

          <span className="px-4 py-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-300 font-extrabold text-xs self-start sm:self-auto">
            Action: {report.aiRecommendation.action}
          </span>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          {report.aiRecommendation.rationale}
        </p>
      </div>

      {/* 2x2 Grid of Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 2: Severity */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Hardware Severity</span>
            <AlertTriangle className="w-4 h-4" style={{ color: report.severity.color }} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black" style={{ color: report.severity.color }}>
              {report.severity.level}
            </span>
            <span className="text-xs text-slate-500 font-mono">({report.severity.score}/100)</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{report.severity.riskNote}</p>
        </div>

        {/* Metric 3: Estimated Cost */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Est. Total Repair Cost</span>
            <span className="text-xs font-bold text-emerald-600">INR (₹)</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {report.estimatedRepairCost.totalMin > 0
                ? `₹${report.estimatedRepairCost.totalMin.toLocaleString("en-IN")} - ₹${report.estimatedRepairCost.totalMax.toLocaleString("en-IN")}`
                : "TBD upon inspection"}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            {report.estimatedRepairCost.diySavings > 0
              ? `DIY Savings: Up to ₹${report.estimatedRepairCost.diySavings.toLocaleString("en-IN")}`
              : "Professional Repair Recommended"}
          </p>
        </div>


        {/* Metric 5: Estimated Time */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Estimated Repair Time</span>
            <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 block">
            {report.estimatedRepairTime}
          </span>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">Standard disassembly & assembly</p>
        </div>

        {/* Metric 6: Repair Difficulty */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Repair Difficulty</span>
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {report.repairDifficulty.level}
            </span>
            <span className="text-xs text-slate-500 font-mono">({report.repairDifficulty.score}/10)</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{report.repairDifficulty.riskFactor}</p>
        </div>
      </div>

      {/* Main Breakdown Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Detailed Diagnosis & Parts */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: Problem Identified Breakdown */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Diagnostic Problem Analysis
              </h3>
              <span className="text-xs text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/20 font-mono">
                Root Cause Isolated
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {report.problemIdentified.summary}
            </p>

            {/* Affected Subcomponents */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Affected Subcomponents:
              </span>
              <div className="flex flex-wrap gap-2">
                {(report.problemIdentified.affectedComponents || []).map((part) => (
                  <span
                    key={part}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-300"
                  >
                    {part}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: Required Parts & Tools List */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Wrench className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Required Replacement Parts & Tools
            </h3>

            <div className="space-y-3">
              {report.requiredParts.map((item) => (
                <div
                  key={item.name}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-slate-200">{item.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.recommendedType || "Part"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Availability: {item.availability}</p>
                  </div>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                    {item.oemPrice > 0 ? `₹${item.oemPrice.toLocaleString("en-IN")}` : "Estimated on Inspection"}
                  </span>

                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: Step-by-Step DIY Repair Guide */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Step-by-Step DIY Repair Instructions
              </h3>
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0"
              >
                {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showSteps ? "Collapse Guide" : "Expand Guide"}
              </button>
            </div>

            {showSteps && report.diySteps && (
              <div className="space-y-4 pt-2">
                {report.diySteps.map((step) => (
                  <div key={step.stepNumber} className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-extrabold text-xs flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-500/30">
                      {step.stepNumber}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-200 text-sm">{step.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.instruction}</p>
                      {step.warning && (
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" /> {step.warning}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Nearby Shops & Environmental Impact */}
        <div className="lg:col-span-5 space-y-6">
          {/* SECTION 8: Nearby Smart Repair Hubs */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Nearby Certified Repair Shops
              </h3>
              <button
                onClick={() => onNavigateTab("repair-shops")}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-0"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {report.nearbyRepairShops.map((shop) => (
                <div
                  key={shop.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{shop.name}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" /> {shop.distance} • {shop.turnaroundTime}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {shop.rating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Est. {shop.estPriceRange}</span>
                    <button
                      onClick={() => handleBookRepair(shop.id)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs cursor-pointer border-0 shadow-sm"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 9: Environmental Impact Metrics */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Circular Environmental Offset
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-100/50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">Carbon Avoidance</span>
                <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                  {report.environmentalImpact.co2SavedKg} kg CO₂
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-100/50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1">
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">E-Waste Saved</span>
                <p className="text-lg font-black text-teal-700 dark:text-teal-400">
                  {report.environmentalImpact.eWastePreventedKg} kg
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-slate-200">Trees Equivalent Saved</p>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Repairing this device is equivalent to planting {Math.max(1, Math.round(report.environmentalImpact.co2SavedKg / 20))} mature trees over 1 year!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
