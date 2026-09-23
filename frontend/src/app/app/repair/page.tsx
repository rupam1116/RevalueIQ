"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RepairModule } from "@/components/app/modules/RepairModule";

export default function AppRepairPage() {
  const router = useRouter();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "dashboard") {
      router.push("/app");
    } else {
      router.push(`/app/${tabId}`);
    }
  };

  return <RepairModule onNavigateTab={handleNavigateTab} />;
}
