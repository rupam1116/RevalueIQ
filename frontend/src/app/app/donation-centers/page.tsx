"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DonationModule } from "@/components/app/modules/DonationModule";

export default function AppDonationCentersPage() {
  const router = useRouter();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "dashboard") {
      router.push("/app");
    } else {
      router.push(`/app/${tabId}`);
    }
  };

  return <DonationModule onNavigateTab={handleNavigateTab} />;
}
