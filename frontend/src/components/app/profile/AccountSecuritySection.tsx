"use client";

import React, { useState } from "react";
import { UserSecurityStatus, SecuritySession } from "@/lib/mockProfileData";
import {
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  KeyRound,
  Laptop,
  Globe,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  RefreshCw,
  LogOut,
} from "lucide-react";

interface AccountSecuritySectionProps {
  securityStatus: UserSecurityStatus;
  onUpdateSecurity?: (updated: UserSecurityStatus) => void;
}

export const AccountSecuritySection: React.FC<AccountSecuritySectionProps> = ({
  securityStatus,
  onUpdateSecurity,
}) => {
  const [status, setStatus] = useState<UserSecurityStatus>({ ...securityStatus });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordToast, setPasswordToast] = useState<string | null>(null);

  const handleToggle2FA = () => {
    const nextState = !status.twoFactorEnabled;
    const updated = { ...status, twoFactorEnabled: nextState };
    setStatus(updated);
    if (onUpdateSecurity) onUpdateSecurity(updated);
  };

  const handleRevokeSession = (sessionId: string) => {
    const updatedSessions = status.activeSessions.filter((s) => s.id !== sessionId);
    const updated = { ...status, activeSessions: updatedSessions };
    setStatus(updated);
    if (onUpdateSecurity) onUpdateSecurity(updated);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordToast("New passwords do not match!");
      return;
    }
    const updated = {
      ...status,
      passwordLastChanged: "Just now (Aug 06, 2026)",
    };
    setStatus(updated);
    if (onUpdateSecurity) onUpdateSecurity(updated);
    setShowPasswordModal(false);
    setPasswordForm({ current: "", newPass: "", confirm: "" });
    setPasswordToast("Password updated successfully!");
    setTimeout(() => setPasswordToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {passwordToast && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{passwordToast}</span>
          </div>
          <button
            onClick={() => setPasswordToast(null)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer border-0 bg-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Core Security Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Verification Statuses */}
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Identity Verification Status
          </h4>

          <div className="space-y-3">
            {/* Email Verification */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-200">Email Address</p>
                  <p className="text-slate-500 text-[11px]">Primary Authentication Channel</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            </div>

            {/* Phone Verification */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-200">Mobile Phone</p>
                  <p className="text-slate-500 text-[11px]">SMS Security Alerts</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            </div>
          </div>
        </div>

        {/* 2FA & Password Controls */}
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Authentication & Password
          </h4>

          <div className="space-y-3">
            {/* 2FA Toggle Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-200">Two-Factor Auth (2FA)</p>
                  <p className="text-slate-500 text-[11px]">
                    {status.twoFactorEnabled ? "Authenticator App Active" : "Disabled"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`px-3 py-1 rounded-full font-extrabold text-[11px] border transition-colors cursor-pointer ${
                  status.twoFactorEnabled
                    ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                }`}
              >
                {status.twoFactorEnabled ? "Enabled" : "Enable 2FA"}
              </button>
            </div>

            {/* Password Status Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200">Password Status</p>
                <p className="text-slate-500 text-[11px]">
                  Last changed: {status.passwordLastChanged}
                </p>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px] transition-colors cursor-pointer border-0"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Last Login Info & Active Sessions List */}
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <Laptop className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Active Sessions & Device Security
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Devices currently authorized and logged into your RevalueIQ portfolio account.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-500">Most Recent Login</span>
            <p className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> {status.lastLoginIp} ({status.lastLoginLocation})
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{status.lastLoginTimestamp}</p>
          </div>
        </div>

        {/* Active Sessions List */}
        <div className="space-y-3">
          {status.activeSessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <Laptop className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h5 className="font-extrabold text-slate-900 dark:text-slate-100">{session.deviceName}</h5>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px]">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {session.browser} • {session.location} ({session.ipAddress})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  {session.lastActive}
                </span>
                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
                    title="Revoke Session"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Change Security Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                  placeholder="••••••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                  placeholder="••••••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                  placeholder="••••••••••••"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-extrabold text-xs shadow-md cursor-pointer border-0"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
