"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SettingsModule } from "@/components/app/modules/SettingsModule";

export default function ProtectedSettingsPage() {
  const router = useRouter();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "dashboard") {
      router.push("/app");
    } else {
      router.push(`/app/${tabId}`);
    }
  };

  return <SettingsModule onNavigateTab={handleNavigateTab} />;
}
