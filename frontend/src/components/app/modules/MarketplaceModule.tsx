"use client";

import React from "react";
import ProtectedMarketplacePage from "@/app/(protected)/marketplace/page";

interface ModuleProps {
  onNavigateTab?: (tabId: string) => void;
}

export const MarketplaceModule: React.FC<ModuleProps> = () => {
  return <ProtectedMarketplacePage />;
};
