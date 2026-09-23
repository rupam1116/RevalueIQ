"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProfileModule } from "@/components/app/modules/ProfileModule";

export default function AppProfilePage() {
  const router = useRouter();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "dashboard") {
      router.push("/app");
    } else {
      router.push(`/app/${tabId}`);
    }
  };

  return <ProfileModule onNavigateTab={handleNavigateTab} />;
}
