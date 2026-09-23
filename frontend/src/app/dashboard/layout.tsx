"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";
import LoadingSkeleton from "@/components/dashboard/LoadingSkeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Protected Route Check
  useEffect(() => {
    if (!loading && !user) {
      const redirectMsg = encodeURIComponent("Please sign in to access your RevalueIQ dashboard.");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}&message=${redirectMsg}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#020617] p-8 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleTabChange = (tabId: string) => {
    if (tabId === "dashboard") {
      router.push("/app");
    } else {
      router.push(`/app/${tabId}`);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-background text-foreground font-sans relative selection:bg-primary/20 selection:text-primary">
      {/* 1. Fixed Left Collapsible Enterprise Sidebar */}
      <AppSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onNavigateTab={handleTabChange}
        activeTab="dashboard"
      />

      {/* 2. Main Workspace Body (Header + Independent Scrollable Viewport) */}
      <div
        className={`flex-1 flex flex-col h-screen min-w-0 overflow-hidden transition-all duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-68"
        }`}
      >
        {/* Sticky Top Header */}
        <AppHeader
          onNavigateTab={handleTabChange}
          activeTab="dashboard"
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-background scrollbar-thin">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
