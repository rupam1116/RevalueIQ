"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Laptop,
  Mail,
  Send,
  Lock,
} from "lucide-react";

interface SecuritySectionProps {
  onChangePasswordClick: () => void;
  onEnable2FAClick?: () => void;
  onLogoutOtherDevices?: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  onChangePasswordClick,
  onEnable2FAClick,
}) => {
  const { user, verifyEmail } = useAuth();
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Derive client browser details safely
  const [browserInfo, setBrowserInfo] = useState<string>("Modern Web Browser");
  const [osInfo, setOsInfo] = useState<string>("Current Operating System");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      if (ua.includes("Chrome") && !ua.includes("Edg")) setBrowserInfo("Google Chrome");
      else if (ua.includes("Edg")) setBrowserInfo("Microsoft Edge");
      else if (ua.includes("Firefox")) setBrowserInfo("Mozilla Firefox");
      else if (ua.includes("Safari") && !ua.includes("Chrome")) setBrowserInfo("Apple Safari");

      if (ua.includes("Windows")) setOsInfo("Windows PC");
      else if (ua.includes("Macintosh")) setOsInfo("macOS Device");
      else if (ua.includes("Linux")) setOsInfo("Linux Machine");
      else if (ua.includes("iPhone") || ua.includes("iPad")) setOsInfo("Apple iOS");
      else if (ua.includes("Android")) setOsInfo("Android Device");
    }
  }, []);

  const handleResendEmail = async () => {
    if (isSendingVerification) return;
    setIsSendingVerification(true);
    setVerificationError(null);
    try {
      await verifyEmail();
      setVerificationSent(true);
      setTimeout(() => setVerificationSent(false), 5000);
    } catch (err: any) {
      setVerificationError(err.message || "Failed to send verification email. Please try again later.");
    } finally {
      setIsSendingVerification(false);
    }
  };

  const isEmailVerified = Boolean(user?.emailVerified);

  return (
    <section id="security" className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Security & Authentication
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Manage your credentials, email verification status, and active session security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onChangePasswordClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Key className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Change Password
          </button>
          {onEnable2FAClick && (
            <button
              type="button"
              onClick={onEnable2FAClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold text-xs transition-colors cursor-pointer border border-purple-200 dark:border-purple-800"
            >
              <Smartphone className="w-3.5 h-3.5" /> 2FA Status
            </button>
          )}
        </div>
      </div>

      {/* Security Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Email Verification Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Email Verification
              </span>
              {isEmailVerified ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Email Verified
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-500/30 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Not Verified
                </span>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1">
              Account: <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email || "No email"}</span>
            </p>
          </div>

          {!isEmailVerified && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              {verificationSent ? (
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verification link dispatched to your inbox.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isSendingVerification}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-500/25 transition-colors cursor-pointer border border-amber-400/30 disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  {isSendingVerification ? "Sending..." : "Resend Verification Email"}
                </button>
              )}
              {verificationError && (
                <p className="text-rose-500 text-[10px] mt-1">{verificationError}</p>
              )}
            </div>
          )}
        </div>

        {/* Password Security Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Password Security
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-500/30">
                Encrypted
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1">
              Secured with Firebase Authentication cryptographic hashing (scrypt). Passwords are never stored on RevalueIQ database servers.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Minimum 8 chars with uppercase & symbol</span>
            <button
              type="button"
              onClick={onChangePasswordClick}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold cursor-pointer"
            >
              Update
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication Status Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Multi-Factor Authentication (MFA)
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
              Standard Protection
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
            Your session is protected by OAuth 2.0 / Firebase ID tokens. Enterprise hardware key (FIDO2) and TOTP SMS verification are available on Enterprise plans.
          </p>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Project tier requirement: Google Cloud Identity Platform</span>
            {onEnable2FAClick && (
              <button
                type="button"
                onClick={onEnable2FAClick}
                className="text-purple-600 dark:text-purple-400 hover:underline font-bold cursor-pointer"
              >
                Inspect 2FA Configuration
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Real Active Session */}
      <div className="space-y-3 pt-2">
        <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm flex items-center gap-2">
          <Laptop className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Current Authenticated Session
        </h3>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Laptop className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-200">{browserInfo} on {osInfo}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold">
                  This Active Device
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Session verified via Firebase Bearer Token • <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Now</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
