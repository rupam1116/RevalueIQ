"use client";

import React, { Suspense } from "react";
import WelcomeCard from "@/components/auth/WelcomeCard";

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-slate-400">Loading welcome screen...</div>}>
      <WelcomeCard />
    </Suspense>
  );
}
