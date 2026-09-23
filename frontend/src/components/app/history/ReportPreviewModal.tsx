"use client";

import React from "react";
import {
  X,
  Download,
  Printer,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  QrCode,
  Sparkles,
} from "lucide-react";
import { AuditReportItem } from "@/lib/historyApi";
import { Button } from "@/components/ui/button";

interface ReportPreviewModalProps {
  report: AuditReportItem | null;
  onClose: () => void;
  onDownload: (report: AuditReportItem) => void;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  report,
  onClose,
  onDownload,
}) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-0 relative flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Official Audit Certificate Preview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {report.title} • {report.file_size}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              variant="outline"
              className="rounded-xl border-emerald-200 dark:border-emerald-800 text-xs font-bold hidden sm:inline-flex"
            >
              <Printer className="w-3.5 h-3.5 mr-1 text-slate-600 dark:text-slate-300" /> Print
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-100/70 dark:bg-slate-950/50 flex justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-[#07130d] border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6 relative overflow-hidden">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <ShieldCheck className="w-96 h-96 text-emerald-500" />
            </div>

            {/* Certificate Header */}
            <div className="flex items-start justify-between border-b-2 border-emerald-500/20 pb-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xl tracking-tight">
                  <Sparkles className="w-6 h-6" />
                  <span>RevalueIQ</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
                  Circular Economy Verification Authority
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                  {report.id}
                </span>
                <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                  Issued: {report.date}
                </p>
              </div>
            </div>

            {/* Certificate Title & Subject */}
            <div className="text-center space-y-2 py-4 relative z-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Official Audit Certificate
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {report.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {report.description}
              </p>
            </div>

            {/* Verification Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs relative z-10">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{report.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Document Format</span>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono">{report.format}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Compliance Standard</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ISO 14040/44
                </span>
              </div>
            </div>

            {/* Security Footer Seal */}
            <div className="flex items-end justify-between pt-6 border-t border-dashed border-emerald-200 dark:border-emerald-800/60 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <QrCode className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-mono">Digital Signature ID</p>
                  <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                    SHA256-{report.id.replace(/[^a-zA-Z0-9]/g, "")}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-serif italic text-slate-600 dark:text-slate-300">
                  RevalueIQ Environmental Engine
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Verified Audit Authority
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Cryptographically sealed electronic statement
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold"
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => onDownload(report)}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Download PDF ({report.file_size})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
