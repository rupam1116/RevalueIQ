"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getApiUrl } from "@/lib/api";
import {
  Smartphone, Wrench, TrendingUp, Recycle, Camera,
  BarChart3, MapPin, Leaf, Plus, ShoppingBag, ArrowRight,
  TreePine, Heart, ShieldCheck
} from "lucide-react";

const initialSampleAppraisals = [
  {
    id: "app-101",
    deviceName: "iPhone 15 Pro (256GB)",
    category: "Smartphone",
    condition: "Like New",
    aiGrade: "A+",
    estimatedValue: 78500,
    repairCost: 0,
    status: "Verified",
    createdAt: new Date().toISOString(),
    timeGroup: "Today" as const,
    date: "Today, 10:45 AM",
  },
  {
    id: "app-102",
    deviceName: "MacBook Pro 14 M3 Pro",
    category: "Laptop",
    condition: "Excellent",
    aiGrade: "A",
    estimatedValue: 145000,
    repairCost: 3500,
    status: "Verified",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    timeGroup: "Yesterday" as const,
    date: "Yesterday, 3:15 PM",
  },
  {
    id: "app-103",
    deviceName: "Sony WH-1000XM5 Headphones",
    category: "Accessories",
    condition: "Good",
    aiGrade: "B+",
    estimatedValue: 22000,
    repairCost: 1800,
    status: "Completed",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    timeGroup: "Last Week" as const,
    date: "4 days ago",
  },
];

const quickActions = [
  {
    title: "AI Device Valuation",
    description: "Upload photos for instant AI grading & circular resale valuation.",
    href: "/valuation",
    icon: Camera,
    gradient: "from-emerald-600 to-teal-600",
    badge: "Eco Valuation",
  },
  {
    title: "Repair Advisor",
    description: "Get step-by-step repair guides & eliminate unnecessary e-waste.",
    href: "/repair",
    icon: Wrench,
    gradient: "from-teal-600 to-emerald-600",
    badge: "Repair > Replace",
  },
  {
    title: "Eco Marketplace",
    description: "Buy and sell verified pre-owned circular electronics.",
    href: "/marketplace",
    icon: ShoppingBag,
    gradient: "from-green-600 to-emerald-700",
    badge: "Pre-Owned Tech",
  },
  {
    title: "Certified Repair Shops",
    description: "Locate authorized repair and refurbishment centers near you.",
    href: "/repair-shops",
    icon: MapPin,
    gradient: "from-emerald-700 to-teal-700",
    badge: "Live Map",
  },
];

export default function ProtectedDashboardPage() {
  const { user, getToken, loading: authLoading } = useAuth();
  const [appraisals, setAppraisals] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const userName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    // Initialize appraisals state safely without requesting unrouted legacy paths
    setAppraisals(initialSampleAppraisals);
    setFetching(false);
  }, [user, authLoading]);

  if (authLoading || fetching) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 rounded-2xl bg-emerald-100/50 dark:bg-emerald-950/30" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-emerald-100/50 dark:bg-emerald-950/30" />)}
        </div>
      </div>
    );
  }

  const totalAnalyzed = appraisals.length;
  const totalValue = appraisals.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const totalSaved = appraisals.reduce((acc, curr) => acc + ((curr.estimatedValue || 0) - (curr.repairCost || 0)), 0);
  const circularScore = Math.min(98, Math.max(78, 84 + totalAnalyzed * 2));
  const co2Saved = (totalAnalyzed * 24.5).toFixed(1);
  const ewasteDiverted = (totalAnalyzed * 3.2).toFixed(1);
  const treesEquivalent = Math.max(1, Math.round(parseFloat(co2Saved) / 12));

  const statsCards = [
    { title: "CO₂ Saved", value: `${co2Saved} kg`, icon: Leaf, trend: "+14% this month", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { title: "E-Waste Diverted", value: `${ewasteDiverted} kg`, icon: Recycle, trend: `${treesEquivalent} Trees Equivalent`, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950" },
    { title: "Devices Restored", value: totalAnalyzed.toString(), icon: Smartphone, trend: "85% Repair Rate", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950" },
    { title: "Circular Score", value: `${circularScore}/100`, icon: ShieldCheck, trend: "Top 5% Eco Rank", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-900" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* ── Greeting Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" /> Circular Economy Platform Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {getGreetingTime()},{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">{userName}</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Welcome back to RevalueIQ. Track your environmental impact, appraise pre-owned electronics, connect with authorized repair centers, and reduce e-waste.
            </p>
          </div>

          <Link
            href="/valuation"
            className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Appraise & Value Device
          </Link>
        </div>
      </div>

      {/* ── Impact Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-md hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions ── */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Eco Actions & Services
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={i} href={action.href} className="block group h-full">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-sm hover:shadow-md hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {action.badge && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Recent Activity & Environmental Insights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Reports */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Eco Valuations</h3>
          {appraisals.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <Camera className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">No appraisals yet</h4>
              <p className="text-sm text-slate-500">Start by scanning your device for circular appraisal.</p>
              <Link href="/valuation" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/30">
                      <th className="text-left p-4 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Device</th>
                      <th className="text-left p-4 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider hidden sm:table-cell">Eco Grade</th>
                      <th className="text-left p-4 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Valuation</th>
                      <th className="text-left p-4 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                      <th className="text-left p-4 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900/30">
                    {appraisals.map((report) => (
                      <tr key={report.id} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
                        <td className="p-4">
                          <Link href={`/dashboard/${report.id}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            <p className="font-bold text-slate-900 dark:text-white">{report.deviceName}</p>
                            <p className="text-xs text-slate-500">{report.category}</p>
                          </Link>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {report.aiGrade}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900 dark:text-white">₹{report.estimatedValue.toLocaleString("en-IN")}</span>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                            {report.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-500 hidden lg:table-cell">{report.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Environmental Insights Panel */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Environmental Impact</h3>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40">
              <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Carbon Footprint Saved</p>
                <p className="text-[11px] text-slate-500">{co2Saved} kg CO₂ prevented from entering atmosphere</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-100 dark:border-teal-900/40">
              <TreePine className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Tree Planting Equivalent</p>
                <p className="text-[11px] text-slate-500">Equivalent to growing {treesEquivalent} mature trees</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-950/60 border border-green-100 dark:border-green-900/40">
              <Heart className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Community Contribution</p>
                <p className="text-[11px] text-slate-500">+180 Eco Credits earned</p>
              </div>
            </div>
          </div>

          {/* Circular Score Gauge */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-900 dark:text-white">Circular Economy Index</p>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{circularScore}/100</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden">
              <div
                style={{ width: `${circularScore}%` }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-500"
              />
            </div>
            <p className="text-[11px] text-slate-500">Grade A+ — Exemplary e-waste diversion and repair mindset.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
