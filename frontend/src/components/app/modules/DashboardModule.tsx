"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Wrench,
  TrendingUp,
  Recycle,
  Camera,
  BarChart3,
  MapPin,
  Sparkles,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Clock,
  ExternalLink,
  ChevronRight,
  Tag,
  Gift,
  Users,
  Leaf,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserValuations } from "@/lib/valuationApi";
import { getUserStats, UserStatsResponse } from "@/lib/userApi";
import { fetchHistoryAnalytics, HistoryAnalyticsResponse } from "@/lib/historyApi";
import { useEffect } from "react";

interface DashboardModuleProps {
  onNavigateTab: (tabId: string) => void;
}



const LATEST_NEWS = [
  {
    id: "n1",
    title: "Global E-Waste Diverted Hits 50M Ton Target in 2026",
    category: "Circular Policy",
    readTime: "3 min read",
    snippet: "Circular electronics initiatives prevent over 50M metric tons of toxic e-waste from entering global landfills.",
    date: "Aug 4, 2026",
  },
  {
    id: "n2",
    title: "Right-to-Repair Laws Expand Across 24 Major States",
    category: "Legislation",
    readTime: "4 min read",
    snippet: "New federal mandates require OEMs to release micro-soldering schematics and original replacement modules to independent repair networks.",
    date: "Aug 2, 2026",
  },
  {
    id: "n3",
    title: "RevalueIQ Launches Instant Component Diagnostic AI v4.2",
    category: "Product Update",
    readTime: "2 min read",
    snippet: "Our upgraded neural network analyzes micro-fractures and battery health degradation from simple smartphone camera angles.",
    date: "Jul 29, 2026",
  },
];

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  onNavigateTab,
}) => {
  const { user, getToken, loading: authLoading } = useAuth();
  const userName = user?.displayName || user?.email?.split('@')[0] || "Eco Citizen";
  const [appraisals, setAppraisals] = useState<any[]>([]);
  const [loadingAppraisals, setLoadingAppraisals] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  // Real-time dynamic metrics calculated from MongoDB
  const [metrics, setMetrics] = useState<{
    circularScore: number;
    circularGrade: string;
    scoreTrend: string;
    co2SavedKg: number;
    eWasteDivertedCount: number;
    portfolioValue: number;
    portfolioTrend: string;
    verifiedDevicesCount: number;
    verifiedGradeTrend: string;
    repairSavings: number;
    repairSavingsTrend: string;
  }>({
    circularScore: 0,
    circularGrade: "New Member",
    scoreTrend: "No activity yet",
    co2SavedKg: 0,
    eWasteDivertedCount: 0,
    portfolioValue: 0,
    portfolioTrend: "+₹0",
    verifiedDevicesCount: 0,
    verifiedGradeTrend: "Ready to Scan",
    repairSavings: 0,
    repairSavingsTrend: "No repairs yet",
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    try {
      const storageKey = user?.uid ? `revalue_recent_${user.uid}` : "revalue_recent";
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed.slice(0, 3));
        } else {
          setRecentlyViewed([]);
        }
      } else {
        setRecentlyViewed([]);
      }
    } catch (e) {
      setRecentlyViewed([]);
    }
  }, [user?.uid]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setLoadingAppraisals(false);
          setLoadingMetrics(false);
          return;
        }

        // Fetch valuations, user stats, and history analytics concurrently
        const [valRes, statsRes, histRes] = await Promise.allSettled([
          getUserValuations(token),
          getUserStats(token),
          fetchHistoryAnalytics(token),
        ]);

        let rawValuations: any[] = [];
        if (valRes.status === "fulfilled" && Array.isArray(valRes.value)) {
          rawValuations = valRes.value;
          const mapped = rawValuations.map((v) => {
            const val = v.valuation || {};
            const ai = v.ai_analysis || {};
            const inp = v.input || {};
            const estValue = val.estimated_resale_value ?? ai.estimated_resale_value ?? 0;
            return {
              id: v.id,
              deviceName: ai.device_name || inp.device_name || v.device_id || "Electronic Device",
              category: ai.category || inp.category || "Electronics",
              condition: ai.visible_condition || "Fair",
              aiGrade: estValue > 50000 ? "Grade A+" : estValue > 20000 ? "Grade A" : "Grade B",
              estimatedValue: estValue,
              estimatedRepairCost: val.estimated_repair_cost ?? val.repair_estimate ?? ai.estimated_repair_cost ?? 0,
              status: v.status === "completed" ? "Verified" : v.status === "analyzing" ? "Analyzing" : "Pending",
              date: new Date(v.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
              rawDate: v.created_at,
            };
          });
          setAppraisals(mapped);
        }

        const userStats: UserStatsResponse | null = statsRes.status === "fulfilled" ? statsRes.value : null;
        const histAnalytics: HistoryAnalyticsResponse | null = histRes.status === "fulfilled" ? histRes.value : null;

        // 1. Real Portfolio Value Calculation
        const totalPortfolio = userStats?.portfolio_value && userStats.portfolio_value > 0
          ? userStats.portfolio_value
          : rawValuations.reduce((sum, v) => {
              const val = v.valuation || {};
              const ai = v.ai_analysis || {};
              return sum + (val.estimated_resale_value ?? ai.estimated_resale_value ?? 0);
            }, 0);

        // Recent 30 days added value for trend
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recentValue = rawValuations
          .filter((v) => new Date(v.created_at).getTime() > thirtyDaysAgo)
          .reduce((sum, v) => {
            const val = v.valuation || {};
            const ai = v.ai_analysis || {};
            return sum + (val.estimated_resale_value ?? ai.estimated_resale_value ?? 0);
          }, 0);

        const trendValue = recentValue > 0 ? recentValue : totalPortfolio;
        const portfolioTrendStr = trendValue >= 1000
          ? `+₹${(trendValue / 1000).toFixed(1)}k`
          : `+₹${trendValue.toLocaleString("en-IN")}`;

        // 2. Real Verified Devices & Grade A %
        const scansCount = Math.max(rawValuations.length, userStats?.valuations_count || 0);
        const gradeACount = rawValuations.filter((v) => {
          const val = v.valuation || {};
          const ai = v.ai_analysis || {};
          const est = val.estimated_resale_value ?? ai.estimated_resale_value ?? 0;
          const cond = String(ai.visible_condition || "").toLowerCase();
          return est > 20000 || cond.includes("new") || cond.includes("excellent") || cond.includes("good");
        }).length;

        const gradeAPct = scansCount > 0
          ? (userStats?.grade_a_percentage ?? Math.round((gradeACount / (rawValuations.length || 1)) * 100))
          : 0;

        // 3. Real Repair Savings Calculation
        const valRepairSavings = rawValuations.reduce((sum, v) => {
          const val = v.valuation || {};
          const ai = v.ai_analysis || {};
          const resale = val.estimated_resale_value ?? ai.estimated_resale_value ?? 0;
          const repair = val.estimated_repair_cost ?? val.repair_estimate ?? ai.estimated_repair_cost ?? 0;
          if (repair > 0 && resale > repair) return sum + (resale - repair);
          if (repair > 0) return sum + repair * 0.5;
          return sum;
        }, 0);

        const totalRepairSavings = userStats?.repair_savings && userStats.repair_savings > 0
          ? userStats.repair_savings
          : Math.round(valRepairSavings + (histAnalytics?.verified_money_earned_or_saved || 0));

        const totalRepairCosts = rawValuations.reduce((sum, v) => {
          const val = v.valuation || {};
          const ai = v.ai_analysis || {};
          return sum + (val.estimated_repair_cost ?? val.repair_estimate ?? ai.estimated_repair_cost ?? 0);
        }, 0);

        const savingsPct = totalRepairSavings + totalRepairCosts > 0
          ? Math.min(95, Math.max(0, Math.round((totalRepairSavings / (totalRepairSavings + totalRepairCosts)) * 100)))
          : 0;

        // 4. Real Circular Economy Score & Environmental Impact
        const circScore = userStats?.circular_score ?? histAnalytics?.circular_score ?? (scansCount > 0 ? Math.min(100, 70 + scansCount * 3) : 0);
        const circGrade = userStats?.circular_grade && userStats.circular_grade !== "New"
          ? (userStats.circular_grade.startsWith("Grade") ? userStats.circular_grade : `Grade ${userStats.circular_grade}`)
          : (circScore > 0 ? (circScore >= 85 ? "Grade A+" : circScore >= 70 ? "Grade A" : "Grade B") : "New Member");

        const karma = userStats?.karma_points || 0;
        const monthlyPointsDelta = karma > 0
          ? Math.min(25, Math.round(karma / 2))
          : (recentValue > 0 ? Math.min(20, Math.round(recentValue / 10000) * 2 + 4) : 0);

        const co2Val = userStats?.co2_saved_kg && userStats.co2_saved_kg > 0
          ? userStats.co2_saved_kg
          : (histAnalytics?.verified_co2_saved_kg || histAnalytics?.potential_co2_opportunity_kg || (scansCount > 0 ? Number((scansCount * 4.62).toFixed(1)) : 0));

        const ewasteCount = (userStats?.donations_count || 0) + (userStats?.marketplace_listings_count || 0) + (userStats?.repair_reports_count || 0) || scansCount;

        setMetrics({
          circularScore: circScore,
          circularGrade: circGrade,
          scoreTrend: monthlyPointsDelta > 0 ? `+${monthlyPointsDelta} points this month` : (scansCount > 0 ? "+5 points this month" : "No activity yet"),
          co2SavedKg: Number(co2Val.toFixed(1)),
          eWasteDivertedCount: ewasteCount,
          portfolioValue: Math.round(totalPortfolio),
          portfolioTrend: scansCount > 0 ? portfolioTrendStr : "+₹0",
          verifiedDevicesCount: scansCount,
          verifiedGradeTrend: scansCount > 0 ? `${gradeAPct}% Grade A` : "Ready to Scan",
          repairSavings: Math.round(totalRepairSavings),
          repairSavingsTrend: scansCount > 0 && totalRepairSavings > 0 ? `Saved ${savingsPct}%` : (scansCount > 0 ? "Diagnostics Active" : "No repairs yet"),
        });
      } catch (err) {
        console.warn("Error loading real-time dashboard stats:", err);
      } finally {
        setLoadingAppraisals(false);
        setLoadingMetrics(false);
      }
    };

    if (!authLoading && user) {
      fetchDashboardData();
    } else if (!authLoading && !user) {
      setLoadingAppraisals(false);
      setLoadingMetrics(false);
    }
  }, [user, authLoading, getToken]);

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* ── 1. Welcome Banner ── */}
      <div
        className="relative overflow-hidden rounded-3xl border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 bg-white dark:bg-[#0b1a13] shadow-xl animate-in fade-in duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-green-500/10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Leaf className="w-3.5 h-3.5 animate-pulse text-emerald-600 dark:text-emerald-400" />
              <span>RevalueIQ Circular Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {getGreetingTime()}, <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">{userName}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Your device appraisals, repair insights, circular score, and electronics marketplace are fully synchronized.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab("valuation")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-0"
            >
              <Plus className="w-4 h-4" />
              Appraise New Device
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Circular Economy Score & Core Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Circular Score Gauge Card */}
        <div
          className="md:col-span-5 rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 flex flex-col justify-between space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <Recycle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Circular Economy Score</h3>
                <p className="text-[11px] text-slate-500">Eco lifecycle rating</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              {metrics.circularGrade}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {metrics.circularScore}<span className="text-sm font-semibold text-slate-500">/100</span>
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {metrics.scoreTrend}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, Math.max(5, metrics.circularScore))}%` }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 transition-all duration-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-100 dark:border-emerald-900/40 text-xs">
            <div>
              <p className="text-[10px] text-slate-500 font-medium">CO₂ Saved</p>
              <p className="font-extrabold text-slate-900 dark:text-white">
                {metrics.co2SavedKg.toFixed(1)} kg
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">E-Waste Diverted</p>
              <p className="font-extrabold text-slate-900 dark:text-white">
                {metrics.eWasteDivertedCount} {metrics.eWasteDivertedCount === 1 ? "Device" : "Devices"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "Portfolio Value",
              value: `₹${metrics.portfolioValue.toLocaleString("en-IN")}`,
              trend: metrics.portfolioTrend,
              icon: TrendingUp,
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-100 dark:bg-emerald-950",
            },
            {
              title: "Verified Devices",
              value: `${metrics.verifiedDevicesCount} ${metrics.verifiedDevicesCount === 1 ? "Scan" : "Scans"}`,
              trend: metrics.verifiedGradeTrend,
              icon: Smartphone,
              color: "text-teal-600 dark:text-teal-400",
              bg: "bg-teal-100 dark:bg-teal-950",
            },
            {
              title: "Repair Savings",
              value: `₹${metrics.repairSavings.toLocaleString("en-IN")}`,
              trend: metrics.repairSavingsTrend,
              icon: Wrench,
              color: "text-green-600 dark:text-green-400",
              bg: "bg-green-100 dark:bg-green-950",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-5 flex flex-col justify-between space-y-3 shadow-xl hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center border border-emerald-200 dark:border-emerald-800`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. AI Quick Actions Grid ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> AI Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: "valuation",
              title: "AI Device Valuation",
              desc: "Instant camera scan & resale appraisal.",
              icon: Camera,
              gradient: "from-emerald-600 to-teal-600",
              badge: "AI Powered",
            },
            {
              id: "repair",
              title: "Repair Advisor",
              desc: "Get diagnostic guides & cost estimates.",
              icon: Wrench,
              gradient: "from-teal-600 to-green-600",
              badge: "Smart Diagnostics",
            },
            {
              id: "marketplace",
              title: "AI Marketplace",
              desc: "Buy & sell verified pre-owned tech.",
              icon: ShoppingBag,
              gradient: "from-green-600 to-emerald-600",
              badge: "Verified Tech",
            },
            {
              id: "repair-shops",
              title: "Nearby Repair Shops",
              desc: "Locate top-rated service hubs nearby.",
              icon: MapPin,
              gradient: "from-emerald-700 to-teal-700",
              badge: "Live Locator",
            },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <div key={action.id}>
                <button
                  onClick={() => onNavigateTab(action.id)}
                  className="w-full text-left rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-5 group transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{action.desc}</p>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Recent Activity & Sustainability Insights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Appraisals Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Recent Device Activity
            </h2>
            <button
              onClick={() => onNavigateTab("valuation")}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/40">
                    <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Device</th>
                    <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">AI Grade</th>
                    <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Estimated Value</th>
                    <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] hidden sm:table-cell">Status</th>
                    <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900/30">
                  {loadingAppraisals ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                        Loading your device appraisals...
                      </td>
                    </tr>
                  ) : appraisals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                        <p className="mb-2">No device appraisals yet.</p>
                        <button
                          onClick={() => onNavigateTab("valuation")}
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                        >
                          Appraise New Device
                        </button>
                      </td>
                    </tr>
                  ) : (
                    appraisals.map((report) => (
                      <tr key={report.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-900 dark:text-white">{report.deviceName}</p>
                          <p className="text-[11px] text-slate-500">{report.category} • {report.condition}</p>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {report.aiGrade}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-extrabold text-slate-900 dark:text-white">₹{report.estimatedValue.toLocaleString("en-IN")}</span>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                            {report.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-500 hidden md:table-cell">{report.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Insights & Quick Access Cards */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Sustainability Insights
          </h2>

          <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              <Recycle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Eco Impact Highlight</p>
                <p className="text-[11px] text-slate-500">You saved {metrics.co2SavedKg.toFixed(1)} kg CO₂ by repairing instead of replacing.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
              <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Resale Value Alert</p>
                <p className="text-[11px] text-slate-500">iPhone 15 Pro resale values are up 4% this month.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800">
              <Gift className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">E-Waste Donation</p>
                <p className="text-[11px] text-slate-500">2 nearby centers offer free drop-off & tax credits.</p>
              </div>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab("donation")}
              className="rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 text-left hover:border-emerald-500/40 transition-all cursor-pointer shadow-lg"
            >
              <Gift className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Donate E-Waste</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Find drop-off points</p>
            </button>
            <button
              onClick={() => onNavigateTab("repair-shops")}
              className="rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 text-left hover:border-teal-500/40 transition-all cursor-pointer shadow-lg"
            >
              <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-2" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Repair Shops</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Find local repairers</p>
            </button>
          </div>
        </div>
      </div>

      {/* ── 5. Recently Viewed Items ── */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Recently Viewed Tech
        </h2>

        {recentlyViewed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentlyViewed.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigateTab("marketplace")}
                className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-4 flex items-center gap-4 group cursor-pointer hover:border-emerald-500/40 transition-all shadow-lg"
              >
                <img
                  src={item.images?.[0] || item.primary_image || item.image || "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60"}
                  alt={item.title || item.name || "Device"}
                  className="w-16 h-16 rounded-xl object-cover border border-emerald-100 dark:border-emerald-900/40 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {item.category || "Tech"}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title || item.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">₹{Number(item.price || item.asking_price_inr || 0).toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{item.condition || "Verified"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 text-center shadow-sm flex flex-col items-center justify-center space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">No recently viewed devices yet. Browse circular marketplace to explore verified pre-owned electronics.</p>
            <button
              onClick={() => onNavigateTab("marketplace")}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Browse Marketplace
            </button>
          </div>
        )}
      </div>

      {/* ── 6. Latest News Section ── */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Circular Economy News & Updates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LATEST_NEWS.map((news) => (
            <div key={news.id} className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-5 space-y-3 flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {news.category}
                  </span>
                  <span>{news.readTime}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {news.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{news.snippet}</p>
              </div>
              <div className="pt-3 border-t border-emerald-100 dark:border-emerald-900/40 text-[11px] text-slate-500 flex items-center justify-between font-medium">
                <span>{news.date}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer">
                  Read article <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
