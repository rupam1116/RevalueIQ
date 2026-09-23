"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Import module views
import { DashboardModule } from "@/components/app/modules/DashboardModule";
import { ValuationModule } from "@/components/app/modules/ValuationModule";
import { RepairModule } from "@/components/app/modules/RepairModule";
import { MarketplaceModule } from "@/components/app/modules/MarketplaceModule";
import { RepairShopsModule } from "@/components/app/modules/RepairShopsModule";
import { DonationModule } from "@/components/app/modules/DonationModule";
import { CommunityModule } from "@/components/app/modules/CommunityModule";
import { ProfileModule } from "@/components/app/modules/ProfileModule";

function MainAppContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab");

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "dashboard") {
      router.push("/app");
    } else {
      router.push(`/app/${tabId}`);
    }
  };

  const renderModuleContent = () => {
    switch (tabParam) {
      case "valuation":
      case "upload":
        return <ValuationModule onNavigateTab={handleNavigateTab} />;
      case "repair":
        return <RepairModule onNavigateTab={handleNavigateTab} />;
      case "marketplace":
        return <MarketplaceModule onNavigateTab={handleNavigateTab} />;
      case "repair-shops":
        return <RepairShopsModule onNavigateTab={handleNavigateTab} />;
      case "donation":
      case "donation-centers":
        return <DonationModule onNavigateTab={handleNavigateTab} />;
      case "community":
        return <CommunityModule onNavigateTab={handleNavigateTab} />;
      case "profile":
      case "settings":
        return <ProfileModule onNavigateTab={handleNavigateTab} />;
      case "dashboard":
      default:
        return <DashboardModule onNavigateTab={handleNavigateTab} />;
    }
  };

  return (
    <div
      key={tabParam || "dashboard"}
      className="transition-all duration-300 animate-in fade-in"
    >
      {renderModuleContent()}
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-emerald-600 animate-ping" />
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Loading RevalueIQ Workspace...
            </span>
          </div>
        </div>
      }
    >
      <MainAppContent />
    </Suspense>
  );
}
