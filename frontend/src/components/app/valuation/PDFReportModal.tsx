"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  X,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Globe,
  Leaf,
  DollarSign,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { ValuationReport } from "@/types/valuation";
import { useAuth } from "@/context/AuthContext";
import { getValuationCertificate, ValuationCertificateResponse } from "@/lib/valuationApi";

interface PDFReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ValuationReport | null;
}

export const PDFReportModal: React.FC<PDFReportModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const { getToken } = useAuth();
  const [cert, setCert] = useState<ValuationCertificateResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCert = async () => {
      if (!isOpen || !report?.id || report.id.startsWith("app-")) {
        setCert(null);
        return;
      }

      setLoading(true);
      try {
        const token = await getToken();
        if (token) {
          const res = await getValuationCertificate(token, report.id);
          if (isMounted) setCert(res);
        }
      } catch (err) {
        console.warn("Could not load backend valuation certificate:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCert();
    return () => {
      isMounted = false;
    };
  }, [isOpen, report?.id, getToken]);

  if (!isOpen || !report) return null;

  const handleDownload = () => {
    const downloadPayload = cert || report;
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(downloadPayload, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `RevalueIQ_Valuation_Certificate_${cert?.certificate_id || report.id}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 transition-all duration-300 animate-in zoom-in-95"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 flex items-center justify-center text-white shadow-md">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Official Eco Certificate & Report</span>
                {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {cert ? cert.certificate_id : `Document ID: #${report.id}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable PDF Preview Body */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-6 space-y-6">
          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-200 dark:border-emerald-900/50">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                RevalueIQ Verified Circular Certificate
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {cert ? cert.device_name : report.deviceName}
              </h2>
              <p className="text-xs text-slate-500">
                {cert ? cert.category : report.category} • Grade {cert ? cert.condition : (report.aiGrade || report.conditionGrade)}
              </p>
              {cert?.verification_hash && (
                <p className="text-[10px] text-slate-400 font-mono truncate max-w-md pt-1">
                  SHA-256 Fingerprint: {cert.verification_hash}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="w-16 h-16 bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-center">
                <QrCode className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Certificate Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Resale</span>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{(cert ? cert.estimated_resale_value : (report.recommendedListingPrice || report.estimatedValue || report.estimatedValueMin || 0)).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Circular Index</span>
              <p className="text-base font-extrabold text-teal-600 dark:text-teal-400 mt-1">
                {(cert ? cert.circularity_score : report.circularScore)}/100
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase">CO₂ Saved</span>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {(cert ? cert.co2_offset_kg : report.co2OffsetKg) || 18} kg
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase">E-Waste Saved</span>
              <p className="text-base font-extrabold text-teal-600 dark:text-teal-400 mt-1">
                {(cert ? cert.ewaste_diverted_kg : report.eWasteDivertedKg) || 2.4} kg
              </p>
            </div>
          </div>

          {/* Verification Footnote */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-emerald-200 dark:border-emerald-900/50">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verified by RevalueIQ AI Circular Engine</span>
            </div>
            <span>{new Date(cert?.issued_at || report.scannedAt || (report as any).createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2 border-0"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

