"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CommunityModule } from "@/components/app/modules/CommunityModule";

export default function ProtectedCommunityPage() {
  const router = useRouter();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "dashboard") {
      router.push("/app");
    } else {
      router.push(`/app/${tabId}`);
    }
  };

  return <CommunityModule onNavigateTab={handleNavigateTab} />;
}
