"use client";

import React, { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      variant="split"
      title="Welcome Back"
      subtitle="Continue your AI-powered circular economy journey."
    >
      <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-slate-400">Loading auth workspace...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
