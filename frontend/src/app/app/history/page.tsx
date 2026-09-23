"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HistoryModule } from "@/components/app/modules/HistoryModule";

export default function AppHistoryPage() {
  const router = useRouter();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "dashboard") {
      router.push("/app");
    } else {
      router.push(`/app/${tabId}`);
    }
  };

  return <HistoryModule onNavigateTab={handleNavigateTab} />;
}
