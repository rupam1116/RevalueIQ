"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { HistoryAnalyticsResponse } from "@/lib/historyApi";

interface AnalyticsDashboardWidgetProps {
  analytics: HistoryAnalyticsResponse | null;
  isLoading?: boolean;
}

const CATEGORY_COLORS = ["#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#64748b"];

export const AnalyticsDashboardWidget: React.FC<AnalyticsDashboardWidgetProps> = ({
  analytics,
  isLoading,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 animate-pulse">
        <div className="lg:col-span-7 h-80 rounded-3xl bg-emerald-100/50 dark:bg-emerald-950/30" />
        <div className="lg:col-span-5 h-80 rounded-3xl bg-emerald-100/50 dark:bg-emerald-950/30" />
      </div>
    );
  }

  const hasMonthlyTrends = (analytics?.monthly_trends?.length || 0) > 0;
  const hasCategoryBreakdown = (analytics?.category_breakdown?.length || 0) > 0;

  // Real environmental comparison data
  const impactComparisonData = [
    {
      name: "CO₂ Impact (kg)",
      Verified: analytics?.verified_co2_saved_kg || 0,
      Potential: analytics?.potential_co2_opportunity_kg || 0,
    },
    {
      name: "E-Waste (kg)",
      Verified: analytics?.verified_ewaste_prevented_kg || 0,
      Potential: analytics?.potential_ewaste_opportunity_kg || 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Persistent Analytics Dashboard</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time trends, category allocations, and verified environmental savings strictly calculated from your MongoDB records.
          </p>
        </div>
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Zero Mock Data Enforced
        </span>
      </div>

      {/* Grid 1: Monthly Activity & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Widget 1: Real Monthly Activity Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Monthly Activity Trend
              </h3>
              <p className="text-xs text-slate-500">Volume of valuations, repairs, sales, and donations over recorded time</p>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {hasMonthlyTrends ? `${analytics?.monthly_trends.length} Active Periods` : "0 Periods"}
            </span>
          </div>

          {hasMonthlyTrends ? (
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.monthly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorRep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorSal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#64748b" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#64748b" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(11, 26, 19, 0.95)",
                      borderRadius: "16px",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Area type="monotone" dataKey="valuations" name="Valuations" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" />
                  <Area type="monotone" dataKey="repairs" name="Repairs" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRep)" />
                  <Area type="monotone" dataKey="sales" name="Sales" stroke="#06b6d4" fillOpacity={1} fill="url(#colorSal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 w-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <AlertCircle className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Historical Trends Recorded</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Trends are dynamically generated once device valuations, repairs, or marketplace actions are logged in your account.
              </p>
            </div>
          )}
        </div>

        {/* Widget 2: Real Category Distribution */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-500" />
                Asset Distribution
              </h3>
              <p className="text-xs text-slate-500">Real proportion of devices analyzed & managed</p>
            </div>
          </div>

          {hasCategoryBreakdown ? (
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.category_breakdown}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {analytics?.category_breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(11, 26, 19, 0.95)",
                      borderRadius: "16px",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 w-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <PieIcon className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Asset Data</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Category allocation will render after your first device is scanned or registered.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Grid 2: Verified vs. Potential Environmental Impact */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-500" />
              Environmental Impact: Verified Realized vs. Potential Opportunity
            </h3>
            <p className="text-xs text-slate-500">
              Strict truthfulness: Verified impact requires physical completion confirmation. Potential reflects opportunities from AI recommendations.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Verified Realized
            </span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Potential Opportunity
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={impactComparisonData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(11, 26, 19, 0.95)",
                  borderRadius: "16px",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="Verified" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
              <Bar dataKey="Potential" fill="#f59e0b" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
