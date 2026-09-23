"use client";

import React, { useState } from "react";
import { History, Search, Filter, ChevronRight, Wrench, ShieldAlert, CheckCircle2, ArrowUpRight, Trash2, AlertTriangle, AlertCircle, Loader2, X } from "lucide-react";
import { RepairHistoryItem } from "@/types/repair";

interface RepairHistoryTableProps {
  history: RepairHistoryItem[];
  onSelectHistoryItem: (item: RepairHistoryItem) => void;
  onDeleteHistoryItem?: (item: RepairHistoryItem) => Promise<void>;
  onNavigateTab: (tabId: string) => void;
}

export const RepairHistoryTable: React.FC<RepairHistoryTableProps> = ({
  history,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onNavigateTab,
}) => {
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [itemToDelete, setItemToDelete] = useState<RepairHistoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      (item.deviceName || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.problemTitle || item.diagnosisTitle || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.id || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.advisoryCode || "").toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = filterSeverity === "All" || item.severity === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !onDeleteHistoryItem) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDeleteHistoryItem(itemToDelete);
      setItemToDelete(null);
    } catch (err: any) {
      setDeleteError(err?.message || "Unable to delete the diagnostic report. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 space-y-6 shadow-xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-emerald-200 dark:border-emerald-800">
              <History className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Diagnostic History Logs
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Past Repair Advisor Scans
            </h2>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search diagnostic logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {/* History Table / Cards */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-emerald-100 dark:border-emerald-900/40 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Device & ID</th>
                <th className="py-3 px-4">Symptom / Problem</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Est. Cost</th>
                <th className="py-3 px-4">AI Rec Action</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100/60 dark:divide-emerald-900/40">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No diagnostic history records match your search query.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectHistoryItem(item)}
                    className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item.thumbnail &&
                            (item.thumbnail.startsWith("http") || item.thumbnail.startsWith("data:") || item.thumbnail.startsWith("blob:") || item.thumbnail.startsWith("/"))
                              ? item.thumbnail
                              : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300"
                          }
                          alt={item.deviceName}
                          className="w-10 h-10 rounded-xl object-cover border border-emerald-100 dark:border-emerald-900/50 shrink-0 bg-slate-950"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block">
                            {item.deviceName}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {item.advisoryCode || item.id} • {item.date}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {item.problemTitle || item.diagnosisTitle}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          item.severity === "Critical"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
                            : item.severity === "High"
                            ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30"
                            : item.severity === "Medium"
                            ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
                            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                      {item.estimatedCost && item.estimatedCost > 0 ? `₹${item.estimatedCost.toLocaleString("en-IN")}` : "TBD"}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {item.recommendedAction}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHistoryItem(item);
                          }}
                          className="p-1.5 px-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 transition-colors inline-flex items-center gap-1 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/60 cursor-pointer"
                          title="View Diagnostic Report"
                        >
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {onDeleteHistoryItem && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteError(null);
                              setItemToDelete(item);
                            }}
                            className="p-1.5 px-2.5 rounded-xl bg-red-50/70 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors inline-flex items-center gap-1 text-xs font-bold border border-red-200/60 dark:border-red-900/40 cursor-pointer"
                            title="Delete Diagnostic Report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0b1a13] border border-red-500/30 dark:border-red-500/40 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 relative">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => {
                setItemToDelete(null);
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
                  {itemToDelete.deviceName}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800 shrink-0">
                  {itemToDelete.advisoryCode || itemToDelete.id}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-1 font-medium">
                {itemToDelete.problemTitle || itemToDelete.diagnosisTitle}
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
                  setItemToDelete(null);
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
    </>
  );
};

