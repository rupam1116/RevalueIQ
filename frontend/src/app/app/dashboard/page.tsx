"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DashboardModule } from "@/components/app/modules/DashboardModule";

export default function AppDashboardPage() {
  const router = useRouter();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "dashboard") {
      router.push("/app");
    } else {
      router.push(`/app/${tabId}`);
    }
  };

  return <DashboardModule onNavigateTab={handleNavigateTab} />;
}
