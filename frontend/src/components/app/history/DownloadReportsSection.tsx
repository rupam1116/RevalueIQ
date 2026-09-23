"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  ShieldCheck,
  Award,
  Calendar,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { AuditReportItem } from "@/lib/historyApi";
import { Button } from "@/components/ui/button";
import { ReportPreviewModal } from "./ReportPreviewModal";

interface DownloadReportsSectionProps {
  reports: AuditReportItem[];
  onDownloadReport: (report: AuditReportItem) => void;
}

export const DownloadReportsSection: React.FC<DownloadReportsSectionProps> = ({
  reports,
  onDownloadReport,
}) => {
  const [selectedReport, setSelectedReport] = useState<AuditReportItem | null>(null);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Valuation":
        return "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Repair":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Donation":
        return "bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800";
      default:
        return "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Download Audit Certificates & Reports</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Export genuine digital audit certificates for device valuations, repair history, tax-deductible CSR donations, and circular transactions.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
          {reports.length} Verified Documents
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100/60 dark:bg-emerald-950/60 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            No Audit Certificates Generated Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Certificates are automatically generated when you perform an AI Device Valuation, confirm a verified repair, or complete an e-waste donation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${getCategoryBadge(report.category)}`}>
                    {report.category} Audit
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {report.format} • {report.file_size}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Generated: {report.date}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                  {report.description}
                </p>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between pt-3 border-t border-emerald-100 dark:border-emerald-900/30">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ISO/ITU Certified
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setSelectedReport(report)}
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-emerald-200 dark:border-emerald-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" /> Preview
                  </Button>

                  <Button
                    onClick={() => onDownloadReport(report)}
                    size="sm"
                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> PDF Export
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Preview Modal */}
      {selectedReport && (
        <ReportPreviewModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onDownload={onDownloadReport}
        />
      )}
    </div>
  );
};
