"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RepairShopsModule } from "@/components/app/modules/RepairShopsModule";

export default function AppRepairShopsPage() {
  const router = useRouter();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "dashboard") {
      router.push("/app");
    } else {
      router.push(`/app/${tabId}`);
    }
  };

  return <RepairShopsModule onNavigateTab={handleNavigateTab} />;
}
