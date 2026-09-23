"use client";

import React from "react";
import { X, Award, ShieldCheck, Printer, CheckCircle2, Leaf, Globe, Sparkles, QrCode } from "lucide-react";
import { DonationRecord } from "@/lib/mockDonationData";
import { Button } from "@/components/ui/button";

interface CertificateModalProps {
  record: DonationRecord | null;
  onClose: () => void;
}

export const DonationCertificateModal: React.FC<CertificateModalProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in transition-all">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header Control Toolbar matching Marketplace modals */}
        <div className="p-4 border-b border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">Official RevalueIQ Digital Donation Certificate</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              variant="outline"
              className="rounded-2xl border-emerald-200 text-xs font-bold"
            >
              <Printer className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-8 sm:p-12 space-y-8 bg-gradient-to-b from-white via-emerald-50/20 to-teal-50/30 dark:from-[#0b1a13] dark:via-[#0b1a13] dark:to-[#08150f] relative border-8 border-emerald-100 dark:border-emerald-950 m-4 rounded-2xl print:m-0 print:border-none">
          {/* Watermark Logo Accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <Leaf className="w-96 h-96 text-emerald-600" />
          </div>

          {/* Top Seal Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left border-b border-emerald-100 dark:border-emerald-900/40 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" /> RevalueIQ Circular Standard
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Certificate of Environmental Contribution
              </h1>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Certificate ID:</span>
              <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 tracking-wider font-mono">{record.certificateId}</p>
              <span className="text-[10px] text-slate-400">{record.date}</span>
            </div>
          </div>

          {/* Recipient Statement */}
          <div className="text-center space-y-4 max-w-xl mx-auto py-2">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">This certifies that</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent underline decoration-emerald-500/40 decoration-wavy">
              {record.userName}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              has successfully extended the lifecycle of electronics and diverted e-waste by donating their{" "}
              <strong className="text-slate-900 dark:text-white font-extrabold">{record.deviceName}</strong> to{" "}
              <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">{record.organizationName}</strong>.
            </p>
          </div>

          {/* Impact Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Estimated CO2 Saved */}
            <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-2xl text-center space-y-1 shadow-xs">
              <Globe className="w-5 h-5 text-teal-600 mx-auto" />
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">CO₂ Avoided</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">{record.estimatedCo2SavedKg} <span className="text-xs text-slate-400 font-normal">kg</span></p>
              <p className="text-[9px] text-teal-600 dark:text-teal-400 font-semibold">Direct atmospheric offset</p>
            </div>

            {/* Circular Economy Score */}
            <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-2xl text-center space-y-1 shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-600 mx-auto" />
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Circular Score</p>
              <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">+{record.circularScoreBonus} Points</p>
              <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">CSR Tier Upgrade</p>
            </div>

            {/* Trees Equivalent */}
            <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-2xl text-center space-y-1 shadow-xs">
              <Leaf className="w-5 h-5 text-emerald-600 mx-auto" />
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Tree Equivalent</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">{record.treesEquivalent} Trees</p>
              <p className="text-[9px] text-slate-400 font-semibold">Annual carbon absorption</p>
            </div>
          </div>

          {/* Bottom Signatures & QR Code */}
          <div className="pt-6 border-t border-emerald-100 dark:border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                <QrCode className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-left space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verification Hash</p>
                <p className="text-[10px] text-slate-500 font-mono">0x8f2a...e491c</p>
                <p className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Certified Circular Ledger
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <div className="font-serif italic text-lg text-emerald-700 dark:text-emerald-400 font-bold">RevalueIQ Platform Board</div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Certified CSR Ecosystem</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
