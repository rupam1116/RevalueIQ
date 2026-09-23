"use client";

import React, { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import VerifyEmailCard from "@/components/auth/VerifyEmailCard";

export default function EmailVerificationPage() {
  return (
    <AuthLayout variant="centered">
      <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-slate-400">Loading email verification...</div>}>
        <VerifyEmailCard />
      </Suspense>
    </AuthLayout>
  );
}
