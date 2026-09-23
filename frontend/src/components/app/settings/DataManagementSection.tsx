"use client";

import React, { useState } from "react";
import { Database, Download, FileText, Trash2, CheckCircle2, ShieldAlert } from "lucide-react";

interface DataManagementSectionProps {
  stats: {
    devicesCount: number;
    valuationsCount: number;
    marketplaceListingsCount: number;
  };
  onDownloadData: () => Promise<void> | void;
  onClearHistory: () => Promise<void> | void;
}

export const DataManagementSection: React.FC<DataManagementSectionProps> = ({
  stats,
  onDownloadData,
  onClearHistory,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onDownloadData();
      setToast("Data export initiated! Check your browser downloads.");
      setTimeout(() => setToast(null), 4000);
    } catch (e: any) {
      setToast(e.message || "Failed to download data archive.");
      setTimeout(() => setToast(null), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear your notification history and activity cache?")) {
      return;
    }
    setIsClearing(true);
    try {
      await onClearHistory();
      setToast("Notification cache cleared successfully.");
      setTimeout(() => setToast(null), 4000);
    } catch (e: any) {
      setToast(e.message || "Failed to clear activity history.");
      setTimeout(() => setToast(null), 4000);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <section id="data" className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Data Management & Exports
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Export full JSON archives of your profile, devices, and orders or manage telemetry data.
          </p>
        </div>

        {toast && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" /> {toast}
          </span>
        )}
      </div>

      {/* Real Account Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Registered Devices</p>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">{stats.devicesCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">AI Valuations</p>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">{stats.valuationsCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Marketplace Listings</p>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">{stats.marketplaceListingsCount}</p>
        </div>
      </div>

      {/* Data Export Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Download My Data (GDPR / User Ownership) */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Download My Data (JSON)</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Exports all profile information, valuations, listings, orders, and certificates.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExport}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> {isExporting ? "Generating JSON Archive..." : "Export My Data"}
          </button>
        </div>

        {/* Clear Notification / Activity Cache */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Clear Notification Cache</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Purges in-app notification records and activity history cache.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isClearing}
            onClick={handleClear}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" /> {isClearing ? "Clearing..." : "Purge Notification Cache"}
          </button>
        </div>
      </div>
    </section>
  );
};
