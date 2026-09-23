"use client";

import React, { useState } from "react";
import { ImpactCertificate } from "@/lib/mockProfileData";
import {
  FileCheck,
  Download,
  Eye,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  FileText,
  Award,
  Share2,
} from "lucide-react";

interface CertificatesSectionProps {
  certificates: ImpactCertificate[];
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates }) => {
  const [selectedCert, setSelectedCert] = useState<ImpactCertificate | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleDownload = (cert: ImpactCertificate) => {
    setDownloadingId(cert.id);
    setTimeout(() => {
      setDownloadingId(null);
      setToastMsg(`Downloaded "${cert.title}.pdf" successfully!`);
      setTimeout(() => setToastMsg(null), 3500);
    }, 1000);
  };

  const getBadgeColor = (type: ImpactCertificate["type"]) => {
    switch (type) {
      case "Donation":
        return "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30";
      case "Circular Economy":
        return "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30";
      case "AI Valuation":
        return "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30";
      case "Impact Report":
        return "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Verified Sustainability Certificates & Audit Reports
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Download cryptographic proof of your environmental impact, donated hardware, and circular scores.
          </p>
        </div>
        {toastMsg && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {toastMsg}
          </div>
        )}
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <FileCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
              No Sustainability Certificates Yet
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Complete device valuations, verified repairs, or accredited hardware donations to generate official circular audit certificates.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getBadgeColor(cert.type)}`}>
                    {cert.type}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {cert.certificateId}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">{cert.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Issued by {cert.issuedBy} • {cert.issueDate}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Impact Metrics Summary</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {cert.metricsSummary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border-0 flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Preview Certificate
                </button>

                <button
                  onClick={() => handleDownload(cert)}
                  disabled={downloadingId === cert.id}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer border-0 flex items-center gap-1.5"
                >
                  {downloadingId === cert.id ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Official Certificate Preview
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{selectedCert.certificateId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Canvas Simulation */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-amber-500/40 relative overflow-hidden text-center space-y-5 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 inline-flex">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Certificate of Sustainability Excellence
                </p>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {selectedCert.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">Presented to RevalueIQ Circular Member</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
                <p className="text-slate-800 dark:text-slate-300 font-medium">
                  <strong>Verification Statement:</strong> This document certifies that the bearer has completed circular economy actions logged under ID <code className="text-emerald-600 dark:text-emerald-400">{selectedCert.certificateId}</code>.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <strong>Impact Details:</strong> {selectedCert.metricsSummary}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-slate-200">{selectedCert.issuedBy}</p>
                  <p className="text-slate-500">Issuer Authority</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{selectedCert.issueDate}</p>
                  <p className="text-slate-500">Date Verified</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border-0"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  const cert = selectedCert;
                  setSelectedCert(null);
                  handleDownload(cert);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-extrabold text-xs shadow-md cursor-pointer border-0 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Full PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
