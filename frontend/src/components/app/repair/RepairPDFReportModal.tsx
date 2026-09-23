"use client";

import React, { useRef } from "react";
import { X, Printer, Download, ShieldCheck, Sparkles, Wrench, CheckCircle2, QrCode } from "lucide-react";
import { RepairReport } from "@/types/repair";

interface RepairPDFReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: RepairReport | null;
}

export const RepairPDFReportModal: React.FC<RepairPDFReportModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full my-8 shadow-2xl overflow-hidden relative">
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200">
              Official AI Repair Diagnostic Certificate #{report.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={modalContentRef} className="p-8 space-y-8 bg-slate-950 text-slate-100 print:bg-white print:text-black">
          {/* Certificate Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-6 print:border-black">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wrench className="w-6 h-6 text-cyan-400 print:text-cyan-600" />
                <h1 className="text-2xl font-black tracking-tight">RevalueIQ Neural Advisor</h1>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Official Hardware Diagnostic & Repairability Certificate
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-cyan-400 print:text-cyan-700 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                Verified Report
              </span>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-1 font-mono">
                Date: {report.date}
              </p>
              <p className="text-xs text-slate-400 print:text-gray-600 font-mono">
                ID: {report.id}
              </p>
            </div>
          </div>

          {/* Device Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 print:bg-gray-100 print:border-gray-300 print:text-black">
            <div>
              <span className="text-[10px] text-slate-400 print:text-gray-600 block">Device Name</span>
              <span className="text-sm font-bold">{report.deviceName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-gray-600 block">Category</span>
              <span className="text-sm font-bold">{report.category}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-gray-600 block">Assessed Severity</span>
              <span className="text-sm font-bold text-orange-400 print:text-orange-600">{report.severity.level} ({report.severity.score}/100)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-gray-600 block">Est. Cost Range</span>
              <span className="text-sm font-bold text-cyan-400 print:text-cyan-700">${report.estimatedRepairCost.totalMin} - ${report.estimatedRepairCost.totalMax}</span>
            </div>
          </div>

          {/* Diagnostics Detail */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-gray-700">
              AI Diagnostic Problem Identification
            </h3>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 print:bg-gray-50 print:border-gray-300 text-xs leading-relaxed space-y-2">
              <p className="font-bold text-slate-200 print:text-black">{report.problemIdentified.title}</p>
              <p className="text-slate-300 print:text-gray-800">{report.problemIdentified.summary}</p>
              <p className="text-slate-400 print:text-gray-600 font-mono text-[11px]">
                Root Cause: {report.problemIdentified.rootCause}
              </p>
            </div>
          </div>

          {/* Required Parts List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-gray-700">
              Required Parts & Sourcing Pricing
            </h3>
            <div className="border border-slate-800 rounded-2xl overflow-hidden print:border-gray-300">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 print:bg-gray-200 print:text-gray-700">
                  <tr>
                    <th className="p-3">Component Name</th>
                    <th className="p-3">Rec. Type</th>
                    <th className="p-3">OEM Price</th>
                    <th className="p-3">3rd Party</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                  {report.requiredParts.map((part) => (
                    <tr key={part.id}>
                      <td className="p-3 font-semibold text-slate-200 print:text-black">{part.name}</td>
                      <td className="p-3 text-cyan-400 print:text-cyan-700 font-bold">{part.recommendedType}</td>
                      <td className="p-3 text-slate-300 print:text-gray-800">${part.oemPrice}</td>
                      <td className="p-3 text-slate-300 print:text-gray-800">${part.aftermarketPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Executive Verdict */}
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 print:bg-cyan-50 print:border-cyan-400 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400 print:text-cyan-800">
                Official Recommendation
              </span>
              <p className="text-sm font-black text-slate-100 print:text-black">
                {report.aiRecommendation.headline}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <QrCode className="w-12 h-12 text-cyan-400 print:text-cyan-700 opacity-80" />
            </div>
          </div>

          {/* Footer Validation Stamp */}
          <div className="pt-4 border-t border-slate-800 print:border-gray-300 flex items-center justify-between text-[10px] text-slate-500 print:text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
              <span>Certified by RevalueIQ Neural Diagnostic Engine</span>
            </div>
            <span className="font-mono">BARCODE: *REP-{report.id}-2026*</span>
          </div>
        </div>
      </div>
    </div>
  );
};
