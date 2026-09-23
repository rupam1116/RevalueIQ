"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/components/auth/AuthCard";
import LoadingButton from "@/components/auth/LoadingButton";
import { getAuthErrorMessage } from "@/lib/authError";

export default function ForgotPasswordForm() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setLoading(true);

    try {
      await sendPasswordReset(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard glowColor="emerald">
      {/* Lock Animation Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
          <Lock className="w-8 h-8 stroke-[2.2] animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Forgot Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto">
            Enter your registered email address and we'll send instructions to reset your password.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="space-y-5 text-center pt-2 animate-in fade-in zoom-in-95 duration-300">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 stroke-[2.5]" />
            <h4 className="font-bold text-base text-white">Reset Link Dispatched</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              We sent a password reset link to <strong className="text-emerald-400 font-semibold">{email}</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link href="/login">
              <LoadingButton variant="emerald" icon={<ArrowRight className="w-4 h-4" />}>
                Return to Login
              </LoadingButton>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#06140e] border border-emerald-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <Mail className="w-5 h-5 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <LoadingButton
            type="submit"
            loading={loading}
            variant="emerald"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Send Reset Instructions
          </LoadingButton>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
