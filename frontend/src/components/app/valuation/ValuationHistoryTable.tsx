"use client";

import React, { useState } from "react";
import {
  Search,
  History,
  Eye,
  ExternalLink,
} from "lucide-react";
import { ValuationHistoryItem } from "@/types/valuation";

interface ValuationHistoryTableProps {
  history: ValuationHistoryItem[];
  onSelectHistoryItem: (item: ValuationHistoryItem) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const ValuationHistoryTable: React.FC<ValuationHistoryTableProps> = ({
  history,
  onSelectHistoryItem,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Smartphone", "Laptop", "Tablet", "Smartwatch", "Audio"];

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 space-y-6 shadow-xl transition-all duration-300">
      {/* Header & Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 dark:border-emerald-900/40 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Recent Valuation History
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Archived appraisal reports, circular economy scores, and secondary market listings
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs"
                  : "bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-900/40 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by device model or appraisal ID..."
          className="w-full bg-slate-50 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-emerald-50/70 dark:bg-emerald-950/60 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-emerald-100 dark:border-emerald-900/40">
            <tr>
              <th className="py-3.5 px-4">Device & Details</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Condition</th>
              <th className="py-3.5 px-4">Est. Market Value</th>
              <th className="py-3.5 px-4 text-center">Circular Score</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900/40 font-medium">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-900/30 transition-colors group">
                  {/* Thumbnail & Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.thumbnail &&
                          item.thumbnail !== "phase3-test-image" &&
                          (item.thumbnail.startsWith("http") || item.thumbnail.startsWith("data:") || item.thumbnail.startsWith("blob:") || item.thumbnail.startsWith("/"))
                            ? item.thumbnail
                            : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300"
                        }
                        alt={item.deviceName}
                        className="w-10 h-10 rounded-xl object-cover border border-emerald-100 dark:border-emerald-900/50 shrink-0 bg-slate-950"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {item.deviceName}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {item.date}
                  </td>

                  {/* Condition */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300">
                      {item.condition}
                    </span>
                  </td>

                  {/* Market Value */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-black text-emerald-700 dark:text-emerald-400 text-sm">
                    ₹{item.estimatedValue.toLocaleString("en-IN")}
                  </td>

                  {/* Circular Score Gauge */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-mono font-black text-xs">
                      {item.circularScore}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        item.status === "Completed"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : item.status === "Listed"
                          ? "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                          : item.status === "Repaired"
                          ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSelectHistoryItem(item)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {onNavigateTab && (
                        <button
                          onClick={() => onNavigateTab("marketplace")}
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                          title="List on Marketplace"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                  No valuation history entries found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
