"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HistoryHeroHeader } from "../history/HistoryHeroHeader";
import { HistorySearchAndFilters, FilterCategory, FilterTier, SortOption } from "../history/HistorySearchAndFilters";
import { ActivityTimelineSection } from "../history/ActivityTimelineSection";
import { AnalyticsDashboardWidget } from "../history/AnalyticsDashboardWidget";
import { PersonalImpactSection } from "../history/PersonalImpactSection";
import { DownloadReportsSection } from "../history/DownloadReportsSection";
import { RecentDevicesSection } from "../history/RecentDevicesSection";
import { AchievementsSection } from "../history/AchievementsSection";
import { ConfirmCompletionModal } from "../history/ConfirmCompletionModal";
import {
  fetchHistoryTimeline,
  fetchHistoryAnalytics,
  fetchRecentAuditedDevices,
  fetchAuditReports,
  confirmCompletion,
  ActivityItem,
  HistoryAnalyticsResponse,
  RecentAuditedDeviceItem,
  AuditReportItem,
  ConfirmCompletionPayload,
} from "@/lib/historyApi";
import { Sparkles, X, AlertCircle } from "lucide-react";

interface HistoryModuleProps {
  onNavigateTab?: (tabId: string) => void;
}

export const HistoryModule: React.FC<HistoryModuleProps> = ({ onNavigateTab }) => {
  const router = useRouter();
  const { user, getToken } = useAuth();

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("All");
  const [selectedTier, setSelectedTier] = useState<FilterTier>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Newest");

  // Real Data State (Strictly MongoDB persistent)
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [analytics, setAnalytics] = useState<HistoryAnalyticsResponse | null>(null);
  const [recentDevices, setRecentDevices] = useState<RecentAuditedDeviceItem[]>([]);
  const [reports, setReports] = useState<AuditReportItem[]>([]);

  // Loading and Error State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected Device Modal from Recent Devices
  const [selectedDevice, setSelectedDevice] = useState<RecentAuditedDeviceItem | null>(null);

  // Modal for confirming external completion
  const [completingActivity, setCompletingActivity] = useState<ActivityItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handler for navigation tabs
  const handleNavigate = (tabId: string) => {
    if (onNavigateTab) {
      onNavigateTab(tabId);
    } else {
      router.push(tabId === "dashboard" ? "/app" : `/app/${tabId}`);
    }
  };

  // Main data loader strictly from real backend
  const loadHistoryData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const [timelineRes, analyticsRes, devicesRes, reportsRes] = await Promise.all([
        fetchHistoryTimeline(token, {
          q: searchQuery,
          type: selectedCategory,
          tier: selectedTier,
        }),
        fetchHistoryAnalytics(token),
        fetchRecentAuditedDevices(token),
        fetchAuditReports(token),
      ]);

      setActivities(timelineRes.items || []);
      setAnalytics(analyticsRes);
      setRecentDevices(devicesRes || []);
      setReports(reportsRes || []);
    } catch (err: any) {
      console.error("Failed to load history data:", err);
      setError(err.message || "Failed to load your activity history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [getToken, searchQuery, selectedCategory, selectedTier]);

  useEffect(() => {
    if (user) {
      loadHistoryData();
    }
  }, [user, loadHistoryData]);

  // Handle External Completion Confirmation
  const handleConfirmCompletion = async (activity: ActivityItem, payload: ConfirmCompletionPayload) => {
    const token = await getToken();
    if (!token) {
      showToast("Authentication session expired. Please sign in again.");
      return;
    }

    try {
      const res = await confirmCompletion(token, activity.id, payload);
      showToast(`Action confirmed completed! +${res.verified_co2_saved_kg} kg CO₂ verified saved.`);
      await loadHistoryData();
    } catch (err: any) {
      throw new Error(err.message || "Unable to confirm action completion.");
    }
  };

  const handleDownloadReport = (item: ActivityItem | AuditReportItem) => {
    showToast(`Exporting official certificate: "${item.title}" (PDF)...`);
  };

  const handleRepeatAction = (activity: ActivityItem) => {
    switch (activity.type) {
      case "valuation":
        showToast(`Redirecting to AI Device Valuation for ${activity.device_name}...`);
        handleNavigate("valuation");
        break;
      case "repair":
        showToast(`Redirecting to Repair Advisor for ${activity.device_name}...`);
        handleNavigate("repair");
        break;
      case "marketplace":
        showToast(`Opening Circular Marketplace...`);
        handleNavigate("marketplace");
        break;
      case "donation":
        showToast(`Opening E-Waste Donation Hub...`);
        handleNavigate("donation");
        break;
      default:
        handleNavigate("valuation");
    }
  };

  // Header stats derived from real analytics response
  const headerStats = useMemo(() => {
    return {
      totalAnalyzed: analytics?.total_analyzed_units || 0,
      recommendationsCount: analytics?.recommendations_count || 0,
      actionsInitiatedCount: analytics?.actions_initiated_count || 0,
      externallyCompletedCount: analytics?.externally_completed_count || 0,
      repairsCompleted: analytics?.repairs_completed || 0,
      devicesSold: analytics?.devices_sold || 0,
      devicesDonated: analytics?.devices_donated || 0,
      circularScore: analytics?.circular_score || 75,
      verifiedCo2Saved: analytics?.verified_co2_saved_kg || 0.0,
      potentialCo2Opportunity: analytics?.potential_co2_opportunity_kg || 0.0,
      verifiedEwastePrevented: analytics?.verified_ewaste_prevented_kg || 0.0,
      moneyEarnedOrSaved: analytics?.verified_money_earned_or_saved || 0.0,
    };
  }, [analytics]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    return {
      All: activities.length,
      Valuations: activities.filter((a) => a.type === "valuation").length,
      Repairs: activities.filter((a) => a.type === "repair").length,
      Marketplace: activities.filter((a) => a.type === "marketplace").length,
      Donations: activities.filter((a) => a.type === "donation").length,
    };
  }, [activities]);

  // Compute tier counts
  const tierCounts = useMemo(() => {
    return {
      all: activities.length,
      recommendation_generated: activities.filter((a) => a.tier === "recommendation_generated").length,
      action_initiated: activities.filter((a) => a.tier === "action_initiated").length,
      externally_completed: activities.filter((a) => a.tier === "externally_completed").length,
    };
  }, [activities]);

  // Sort activities
  const sortedActivities = useMemo(() => {
    const list = [...activities];
    if (sortBy === "Newest") {
      list.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === "Oldest") {
      list.sort((a, b) => a.timestamp - b.timestamp);
    } else if (sortBy === "Highest Value") {
      list.sort((a, b) => b.value_inr - a.value_inr);
    }
    return list;
  }, [activities, sortBy]);

  // Calculate equivalent trees from verified CO2 saved
  const treesEquivalent = useMemo(() => {
    const vCo2 = analytics?.verified_co2_saved_kg || 0;
    return Math.floor(vCo2 / 21.0); // 1 mature tree absorbs ~21 kg CO2/year
  }, [analytics]);

  return (
    <div className="space-y-10 pb-16">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-emerald-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadHistoryData()}
            className="underline underline-offset-2 hover:text-rose-900 dark:hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* 1. Page Header with 8 Statistics Cards */}
      <HistoryHeroHeader stats={headerStats} />

      {/* 2. Search & Filter Bar with Tier Selector */}
      <HistorySearchAndFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedTier={selectedTier}
        onTierChange={setSelectedTier}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categoryCounts={categoryCounts}
        tierCounts={tierCounts}
      />

      {/* 3. Activity Timeline with 3-Tier Badges */}
      <ActivityTimelineSection
        activities={sortedActivities}
        onDownloadReport={handleDownloadReport}
        onRepeatAction={handleRepeatAction}
        onConfirmCompletion={(act) => setCompletingActivity(act)}
      />

      {/* 4. Analytics Dashboard Widgets */}
      <AnalyticsDashboardWidget
        analytics={analytics}
        isLoading={isLoading}
      />

      {/* 5. Personal Circular Impact (Verified vs. Potential) */}
      <PersonalImpactSection
        verifiedCo2Saved={headerStats.verifiedCo2Saved}
        potentialCo2Opportunity={headerStats.potentialCo2Opportunity}
        verifiedEwastePrevented={headerStats.verifiedEwastePrevented}
        potentialEwasteOpportunity={analytics?.potential_ewaste_opportunity_kg || 0.0}
        devicesRepaired={headerStats.repairsCompleted}
        devicesReused={headerStats.devicesSold}
        devicesDonated={headerStats.devicesDonated}
        moneySaved={headerStats.moneyEarnedOrSaved}
        treesEquivalent={treesEquivalent}
      />

      {/* 6. Download Reports & Real Audit Certificates */}
      <DownloadReportsSection
        reports={reports}
        onDownloadReport={handleDownloadReport}
      />

      {/* 7. Recently Audited Real Devices */}
      <RecentDevicesSection
        devices={recentDevices}
        onViewDeviceDetails={(dev) => setSelectedDevice(dev)}
        onNavigateToValuation={() => handleNavigate("valuation")}
      />

      {/* 8. Gamified Achievements based on Real Data */}
      <AchievementsSection analytics={analytics} />

      {/* Device Details Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedDevice.device_name}
                </h3>
                <p className="text-xs text-slate-500">{selectedDevice.category} • {selectedDevice.brand}</p>
              </div>
              <button onClick={() => setSelectedDevice(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 font-bold">
                <span>AI Resale Value</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  ₹{selectedDevice.estimated_value_inr.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span>Condition Grade</span>
                <span className="font-extrabold text-emerald-500">{selectedDevice.condition}</span>
              </div>
              <div className="flex justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span>Recommended Action</span>
                <span className="font-extrabold text-teal-500">{selectedDevice.recommended_action}</span>
              </div>
              <div className="flex justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span>Portfolio Status</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{selectedDevice.status}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedDevice(null);
                handleNavigate("valuation");
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md"
            >
              Re-Appraise Asset
            </button>
          </div>
        </div>
      )}

      {/* Confirm External Completion Modal */}
      {completingActivity && (
        <ConfirmCompletionModal
          activity={completingActivity}
          onClose={() => setCompletingActivity(null)}
          onConfirm={handleConfirmCompletion}
        />
      )}
    </div>
  );
};
