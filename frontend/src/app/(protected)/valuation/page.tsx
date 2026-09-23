"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ValuationModule } from "@/components/app/modules/ValuationModule";

export default function ProtectedValuationPage() {
  const router = useRouter();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "dashboard") {
      router.push("/app");
    } else {
      router.push(`/app/${tabId}`);
    }
  };

  return <ValuationModule onNavigateTab={handleNavigateTab} />;
}
