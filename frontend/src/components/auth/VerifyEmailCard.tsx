"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail, RefreshCw, ExternalLink, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import LoadingButton from "@/components/auth/LoadingButton";

export default function VerifyEmailCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, verifyEmail } = useAuth();

  const userEmail = searchParams.get("email") || user?.email || "your registered email";

  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  // 60-second Countdown Timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setResendMessage("");

    try {
      await new Promise((res) => setTimeout(res, 800));
      setResendMessage("Verification email resent successfully!");
      setCountdown(60);
    } catch (err: any) {
      setResendMessage("Failed to resend email. Try again later.");
    } finally {
      setResending(false);
    }
  };

  const handleManualVerificationCheck = async () => {
    setChecking(true);
    try {
      await verifyEmail();
      setVerifiedSuccess(true);
      setTimeout(() => {
        router.push("/welcome");
      }, 1200);
    } catch (err) {
      setResendMessage("Email verification failed. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <AuthCard glowColor="emerald">
      {/* Floating Email Graphic */}
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <Mail className="w-8 h-8 stroke-[2.2] animate-bounce" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto">
            We sent a verification link to <strong className="text-emerald-400">{userEmail}</strong>. Please check your inbox.
          </p>
        </div>
      </div>

      {verifiedSuccess ? (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 stroke-[2.5]" />
          <h4 className="font-bold text-sm text-white">Email Confirmed! Redirecting...</h4>
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          {resendMessage && (
            <p className="text-xs text-center text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
              {resendMessage}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <LoadingButton
              onClick={handleManualVerificationCheck}
              loading={checking}
              variant="emerald"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              I Have Verified My Email
            </LoadingButton>

            <button
              onClick={handleResend}
              disabled={countdown > 0 || resending}
              className="w-full h-11 rounded-xl bg-[#06140e] border border-emerald-900/60 text-slate-300 hover:text-white hover:border-emerald-500/40 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
              {countdown > 0 ? `Resend Email in ${countdown}s` : "Resend Verification Email"}
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
            </Link>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
