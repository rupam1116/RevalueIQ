"use client";

import React, { Suspense } from "react";
import { RepairRecommendationModule } from "./RepairRecommendationModule";
import { Loader2 } from "lucide-react";

interface ModuleProps {
  onNavigateTab?: (tabId: string) => void;
}

export const RepairShopsModule: React.FC<ModuleProps> = ({ onNavigateTab }) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-emerald-600">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <RepairRecommendationModule onNavigateTab={onNavigateTab} />
    </Suspense>
  );
};
