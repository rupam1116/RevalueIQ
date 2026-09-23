"use client";

import React, { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      variant="split"
      title="Create Account"
      subtitle="Join enterprise users unlocking AI device valuation, repair dispatch, and circular technology value."
    >
      <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-slate-400">Loading signup workspace...</div>}>
        <SignupForm />
      </Suspense>
    </AuthLayout>
  );
}
