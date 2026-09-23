"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { RepairRecommendationModule } from "@/components/app/modules/RepairRecommendationModule";
import { Loader2 } from "lucide-react";

export default function AppRepairRecommendationPage() {
  const router = useRouter();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "dashboard") {
      router.push("/app");
    } else {
      router.push(`/app/${tabId}`);
    }
  };

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-emerald-600">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <RepairRecommendationModule onNavigateTab={handleNavigateTab} />
    </Suspense>
  );
}
