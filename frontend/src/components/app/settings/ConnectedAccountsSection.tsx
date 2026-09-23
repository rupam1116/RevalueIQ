"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";

export const ConnectedAccountsSection: React.FC = () => {
  const { user } = useAuth();

  // Read actual providers directly from Firebase Auth user context
  const providers = user?.providerData || [];
  const hasGoogle = providers.some((p) => p.providerId === "google.com");
  const hasPassword = providers.some((p) => p.providerId === "password");

  const googleProvider = providers.find((p) => p.providerId === "google.com");
  const passwordProvider = providers.find((p) => p.providerId === "password");

  return (
    <section id="connected" className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Link className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Connected Accounts & OAuth Providers
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Identity providers linked to your authenticated Firebase account.
        </p>
      </div>

      <div className="space-y-3">
        {/* Firebase Primary Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-black text-amber-600 dark:text-amber-400 text-sm shrink-0">
              FB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Firebase Authentication</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Authoritative System
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                UID: {user?.uid || "Authenticated User"} • Primary Session Active
              </p>
            </div>
          </div>

          <div className="self-end sm:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-semibold select-none">
              Primary System
            </span>
          </div>
        </div>

        {/* Email / Password Provider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-xs shrink-0">
              PASS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Email & Password</h3>
                {hasPassword ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700">
                    <AlertCircle className="w-3 h-3 text-slate-400" /> Not Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {hasPassword ? (passwordProvider?.email || user?.email) : "No password credentials attached to account"}
              </p>
            </div>
          </div>

          <div className="self-end sm:self-auto">
            {hasPassword ? (
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-semibold select-none">
                Active Method
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold select-none">
                Not Linked
              </span>
            )}
          </div>
        </div>

        {/* Google OAuth Provider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center font-extrabold text-amber-500 text-sm shrink-0">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Google Workspace SSO</h3>
                {hasGoogle ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700">
                    <AlertCircle className="w-3 h-3 text-slate-400" /> Not Linked
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {hasGoogle ? (googleProvider?.email || "Google account linked") : "Sign in directly with your Google account"}
              </p>
            </div>
          </div>

          <div className="self-end sm:self-auto">
            {hasGoogle ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold select-none">
                Linked Identity
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold select-none">
                Available at Login
              </span>
            )}
          </div>
        </div>

        {/* GitHub / Apple / Microsoft: Truthfully show not configured per Rule 8 & Step 10 */}
        <div className="p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Additional third-party providers (GitHub, Apple, Microsoft) are not configured for this workspace.</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Restricted</span>
        </div>
      </div>
    </section>
  );
};
