"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppHeader } from "@/components/app/AppHeader";
import { AppSidebar } from "@/components/app/AppSidebar";
import { Loader2, Sparkles } from "lucide-react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Deduce active tab from pathname
  const getActiveTab = () => {
    if (pathname.includes("/valuation")) return "valuation";
    if (pathname.includes("/repair-shops")) return "repair-shops";
    if (pathname.includes("/repair")) return "repair";
    if (pathname.includes("/marketplace")) return "marketplace";
    if (pathname.includes("/donation")) return "donation";
    if (pathname.includes("/community")) return "community";
    if (pathname.includes("/history")) return "history";
    if (pathname.includes("/profile")) return "profile";
    if (pathname.includes("/settings")) return "settings";
    return "dashboard";
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tabId: string) => {
    if (tabId === "dashboard") router.push("/app");
    else router.push(`/app/${tabId}`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030712] text-white flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 animate-pulse flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Restoring Workspace Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-background text-foreground font-sans relative selection:bg-emerald-500/20 selection:text-emerald-600">
      {/* 1. Fixed Left Collapsible Enterprise Sidebar */}
      <AppSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onNavigateTab={handleTabChange}
        activeTab={activeTab}
      />

      {/* 2. Main Enterprise Workspace Body */}
      <div
        className={`flex-1 flex flex-col h-screen min-w-0 overflow-hidden transition-all duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-68"
        }`}
      >
        {/* Sticky Top Header */}
        <AppHeader
          onNavigateTab={handleTabChange}
          activeTab={activeTab}
          onToggleMobileSidebar={() => setMobileOpen((prev) => !prev)}
        />

        {/* Scrollable Main SaaS Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto w-full">
            <div
              key={pathname}
              className="transition-all duration-300 animate-in fade-in"
            >
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
