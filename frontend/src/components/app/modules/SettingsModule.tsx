"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import {
  getUserSettings,
  updateUserSettings,
  exportUserData,
  clearUserHistory,
  deactivateAccount,
  deleteAccount,
  NotificationPreferences,
  PrivacyPreferences,
  AppPreferences,
  AiPreferences,
} from "@/lib/settingsApi";

import { getUserProfile, updateUserProfile, getUserStats, UserStatsResponse } from "@/lib/userApi";
import { AccountSettingsState, MOCK_FAQ_ITEMS } from "@/lib/mockSettingsData";

import { SettingsWorkspaceNav } from "../settings/SettingsWorkspaceNav";
import { AccountSettingsSection } from "../settings/AccountSettingsSection";
import { EcoPlanBillingSection } from "../settings/EcoPlanBillingSection";
import { SecuritySection } from "../settings/SecuritySection";
import { NotificationsSection } from "../settings/NotificationsSection";
import { PrivacySection } from "../settings/PrivacySection";
import { AppPreferencesSection } from "../settings/AppPreferencesSection";
import { ConnectedAccountsSection } from "../settings/ConnectedAccountsSection";
import { AiPreferencesSection } from "../settings/AiPreferencesSection";
import { DataManagementSection } from "../settings/DataManagementSection";
import { HelpSupportSection } from "../settings/HelpSupportSection";
import { DangerZoneSection } from "../settings/DangerZoneSection";

import {
  ChangePasswordModal,
  Enable2FAModal,
  CookiePreferencesModal,
  DeleteAccountModal,
  SupportFormModal,
} from "../settings/SettingsModals";

import { Settings, ShieldCheck, CheckCircle2, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

interface SettingsModuleProps {
  onNavigateTab?: (tabId: string) => void;
}

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  in_app: true,
  email_notifications: true,
  push_notifications: true,
  sms_notifications: false,
  marketplace_alerts: true,
  repair_status_updates: true,
  donation_impact_reports: true,
  promotional_newsletters: false,
};

const DEFAULT_PRIVACY: PrivacyPreferences = {
  profile_visibility: "Public",
  activity_visibility: "Public",
  stats_visibility: "Public Leaderboards",
  search_engine_indexing: true,
  ai_data_personalization: true,
  anonymized_analytics: true,
  cookies: {
    essential: true,
    analytics: true,
    marketing: false,
    functional: true,
  },
};

const DEFAULT_PREFERENCES: AppPreferences = {
  theme: "Dark",
  language: "English (US)",
  currency: "INR (₹)",
  distance_unit: "Kilometers (km)",
  date_format: "YYYY-MM-DD",
  accessibility: {
    high_contrast: false,
    reduced_motion: false,
  },
  animations: true,
  compact_mode: false,
};

const DEFAULT_AI: AiPreferences = {
  preferred_recommendation_style: "Balanced",
  enable_ai_learning: true,
  enable_personalized_suggestions: true,
  allow_ai_device_history: true,
};

export const SettingsModule: React.FC<SettingsModuleProps> = ({ onNavigateTab }) => {
  const { user, logout, getToken } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Real Persistent State from Database
  const [account, setAccount] = useState<AccountSettingsState>({
    profilePicture: "",
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    country: "India",
    language: "English (US)",
    timeZone: "Asia/Kolkata",
    bio: "",
  });

  const [notifications, setNotifications] = useState<NotificationPreferences>(DEFAULT_NOTIFICATIONS);
  const [privacy, setPrivacy] = useState<PrivacyPreferences>(DEFAULT_PRIVACY);
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [aiPreferences, setAiPreferences] = useState<AiPreferences>(DEFAULT_AI);

  const [stats, setStats] = useState<{
    devicesCount: number;
    valuationsCount: number;
    marketplaceListingsCount: number;
  }>({
    devicesCount: 0,
    valuationsCount: 0,
    marketplaceListingsCount: 0,
  });

  // Active section state for workspace nav
  const [activeSection, setActiveSection] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("section") || params.get("tab") || "account";
    }
    return "account";
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync activeSection if URL search params change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkParams = () => {
        const params = new URLSearchParams(window.location.search);
        const sec = params.get("section") || params.get("tab");
        if (sec && sec !== activeSection) {
          setActiveSection(sec);
        }
      };
      checkParams();
      window.addEventListener("popstate", checkParams);
      return () => window.removeEventListener("popstate", checkParams);
    }
  }, [activeSection]);

  // Modal Dialog States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [supportModalType, setSupportModalType] = useState<"contact" | "bug" | "feature" | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Fetch Real Data from FastAPI + MongoDB Atlas
  const loadAllSettings = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Parallel fetch of Profile, Settings, and User Activity Stats
      const [profileRes, settingsRes, statsRes] = await Promise.allSettled([
        getUserProfile(token),
        getUserSettings(token),
        getUserStats(token),
      ]);

      if (profileRes.status === "fulfilled") {
        const prof = profileRes.value;
        setAccount((prev) => ({
          ...prev,
          fullName: prof.full_name || prev.fullName,
          email: prof.email || prev.email,
          phone: prof.phone || "",
          bio: prof.bio || "",
          language: prof.language || prev.language,
          timeZone: prof.timezone || prev.timeZone,
          country: prof.country || prev.country,
        }));
      }

      if (settingsRes.status === "fulfilled") {
        const s = settingsRes.value;
        if (s.notifications) setNotifications(s.notifications);
        if (s.privacy) setPrivacy(s.privacy);
        if (s.preferences) setPreferences(s.preferences);
        if (s.ai) setAiPreferences(s.ai);
      }

      if (statsRes.status === "fulfilled") {
        const st: UserStatsResponse = statsRes.value;
        setStats({
          devicesCount: st.devices_count || 0,
          valuationsCount: st.valuations_count || 0,
          marketplaceListingsCount: st.marketplace_listings_count || 0,
        });
      }
    } catch (err: any) {
      console.error("Failed to load settings:", err);
      setLoadError("Unable to connect to backend database. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadAllSettings();
  }, [loadAllSettings]);

  // Section Save Handlers (Strict Backend Persistence)
  const handleSaveAccount = async (updated: AccountSettingsState) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication session expired.");

    await updateUserProfile(token, {
      full_name: updated.fullName,
      phone: updated.phone,
      bio: updated.bio,
      language: updated.language,
      timezone: updated.timeZone,
    });
    setAccount(updated);
    showToast("Account details saved successfully!");
  };

  const handleSaveNotifications = async (updated: NotificationPreferences) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication session expired.");

    await updateUserSettings(token, { notifications: updated });
    setNotifications(updated);
    showToast("Notification preferences updated!");
  };

  const handleSavePrivacy = async (updated: PrivacyPreferences) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication session expired.");

    await updateUserSettings(token, { privacy: updated });
    setPrivacy(updated);
    showToast("Privacy settings saved!");
  };

  const handleSaveAppPreferences = async (updated: AppPreferences) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication session expired.");

    await updateUserSettings(token, { preferences: updated });
    setPreferences(updated);
    showToast("Application preferences saved!");
  };

  const handleSaveAiPreferences = async (updated: AiPreferences) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication session expired.");

    await updateUserSettings(token, { ai: updated });
    setAiPreferences(updated);
    showToast("AI engine preferences saved!");
  };

  // Data Export Handler (Real Backend Streamed JSON Download)
  const handleDownloadData = async () => {
    const token = await getToken();
    if (!token) throw new Error("Authentication session expired.");

    const exportData = await exportUserData(token);
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `RevalueIQ_Data_Export_${(account.fullName || "User").replace(/\s+/g, "_")}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);

    showToast("Archive downloaded! Contains strictly your authorized account data.");
  };

  // Purge Notification / Activity Cache
  const handleClearHistory = async () => {
    const token = await getToken();
    if (!token) throw new Error("Authentication session expired.");

    const res = await clearUserHistory(token);
    showToast(`Cleared ${res.cleared_count} notification logs.`);
  };

  // Danger Zone Actions
  const handleDeactivateAccount = async () => {
    if (!window.confirm("Are you sure you want to deactivate your account? You will be logged out.")) {
      return;
    }
    const token = await getToken();
    if (!token) return;

    await deactivateAccount(token);
    showToast("Account deactivated. Logging out...");
    setTimeout(async () => {
      await logout();
      router.push("/login");
    }, 1500);
  };

  const handleDeleteAccountConfirmed = async () => {
    const token = await getToken();
    if (!token) throw new Error("Authentication token required.");

    await deleteAccount(token);
    showToast("Account deleted permanently. Goodbye.");
    setTimeout(async () => {
      await logout();
      router.push("/");
    }, 1500);
  };

  const handleGlobalSignOut = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading your RevalueIQ workspace settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> RevalueIQ Central Control Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-emerald-600 dark:text-emerald-400" /> Account Settings & Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Manage your account credentials, notifications, privacy visibility, connected accounts, AI preferences, and data exports.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab("dashboard")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {loadError && (
        <div className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Settings Layout Container */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Section Quick Nav */}
        <SettingsWorkspaceNav
          activeSection={activeSection}
          onSelectSection={(sec) => setActiveSection(sec)}
        />

        {/* Right Active Settings Section */}
        <div className="flex-1 w-full transition-all duration-200 animate-in fade-in">
          {/* SECTION 1: ACCOUNT SETTINGS */}
          {activeSection === "account" && (
            <AccountSettingsSection
              settings={account}
              onSave={handleSaveAccount}
            />
          )}

          {/* SECTION: ECO PLAN & BILLING */}
          {activeSection === "eco-plan" && (
            <EcoPlanBillingSection />
          )}

          {/* SECTION 2: SECURITY */}
          {activeSection === "security" && (
            <SecuritySection
              onChangePasswordClick={() => setIsPasswordModalOpen(true)}
              onEnable2FAClick={() => setIs2FAModalOpen(true)}
            />
          )}

          {/* SECTION 3: NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <NotificationsSection
              settings={notifications}
              onSave={handleSaveNotifications}
            />
          )}

          {/* SECTION 4: PRIVACY */}
          {activeSection === "privacy" && (
            <PrivacySection
              settings={privacy}
              onSave={handleSavePrivacy}
              onOpenCookiePreferences={() => setIsCookieModalOpen(true)}
            />
          )}

          {/* SECTION 5: APPLICATION PREFERENCES */}
          {activeSection === "preferences" && (
            <AppPreferencesSection
              settings={preferences}
              onSave={handleSaveAppPreferences}
            />
          )}

          {/* SECTION 6: CONNECTED ACCOUNTS */}
          {activeSection === "connected" && (
            <ConnectedAccountsSection />
          )}

          {/* SECTION 7: AI PREFERENCES */}
          {activeSection === "ai" && (
            <AiPreferencesSection
              settings={aiPreferences}
              onSave={handleSaveAiPreferences}
            />
          )}

          {/* SECTION 8: DATA MANAGEMENT */}
          {activeSection === "data" && (
            <DataManagementSection
              stats={stats}
              onDownloadData={handleDownloadData}
              onClearHistory={handleClearHistory}
            />
          )}

          {/* SECTION 9: HELP & SUPPORT */}
          {activeSection === "help" && (
            <HelpSupportSection
              faqItems={MOCK_FAQ_ITEMS}
              onOpenContactSupport={() => setSupportModalType("contact")}
              onOpenReportBug={() => setSupportModalType("bug")}
              onOpenFeatureRequest={() => setSupportModalType("feature")}
              onOpenPrivacyPolicy={() => router.push("/privacy")}
              onOpenTerms={() => router.push("/terms")}
            />
          )}

          {/* SECTION 10: DANGER ZONE */}
          {activeSection === "danger" && (
            <DangerZoneSection
              onDeactivateAccount={handleDeactivateAccount}
              onRemoveAllData={handleClearHistory}
              onDeleteAccount={() => setIsDeleteAccountModalOpen(true)}
              onSignOut={handleGlobalSignOut}
            />
          )}
        </div>
      </div>

      {/* Interactive Modals */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => showToast("Password updated successfully via Firebase!")}
      />

      <Enable2FAModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
      />

      <CookiePreferencesModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
        cookies={privacy.cookies}
        onSave={async (newCookies) => {
          await handleSavePrivacy({ ...privacy, cookies: newCookies });
        }}
      />

      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccountConfirmed}
      />

      {supportModalType && (
        <SupportFormModal
          isOpen={!!supportModalType}
          onClose={() => setSupportModalType(null)}
          type={supportModalType}
          onSubmitSuccess={(msg) => showToast(msg)}
        />
      )}
    </div>
  );
};
