"use client";

import React from "react";
import { AlertTriangle, Trash2, PowerOff, Database, LogOut } from "lucide-react";

interface DangerZoneSectionProps {
  onDeactivateAccount: () => void;
  onRemoveAllData: () => void;
  onDeleteAccount: () => void;
  onSignOut: () => void;
}

export const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({
  onDeactivateAccount,
  onRemoveAllData,
  onDeleteAccount,
  onSignOut,
}) => {
  return (
    <section
      id="danger"
      className="bg-rose-50/60 dark:bg-[#181016] border-2 border-rose-300 dark:border-rose-500/40 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xl"
    >
      <div className="border-b border-rose-200 dark:border-rose-500/20 pb-4">
        <h2 className="text-lg font-black text-rose-700 dark:text-rose-400 flex items-center gap-2 tracking-tight">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" /> Danger Zone
        </h2>
        <p className="text-xs text-rose-700/80 dark:text-rose-300/70 mt-1">
          Irreversible actions and critical account termination triggers. Proceed with extreme caution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Deactivate Account */}
        <div className="p-4 rounded-xl bg-white dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PowerOff className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-rose-200">Deactivate Account</h3>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Temporarily freeze your profile, hidden listings, and notifications. You can reactivate anytime by logging in.
            </p>
          </div>

          <button
            type="button"
            onClick={onDeactivateAccount}
            className="w-full py-2 rounded-xl bg-rose-100 dark:bg-slate-900 hover:bg-rose-200 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-xs transition-colors border border-rose-300 dark:border-rose-500/30 cursor-pointer"
          >
            Deactivate Account
          </button>
        </div>

        {/* Remove All Data */}
        <div className="p-4 rounded-xl bg-white dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-rose-200">Remove All Data</h3>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Wipe device telemetry, history logs, and saved items while keeping your authentication profile intact.
            </p>
          </div>

          <button
            type="button"
            onClick={onRemoveAllData}
            className="w-full py-2 rounded-xl bg-rose-100 dark:bg-slate-900 hover:bg-rose-200 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-xs transition-colors border border-rose-300 dark:border-rose-500/30 cursor-pointer"
          >
            Purge Workspace Data
          </button>
        </div>

        {/* Sign Out Global Session */}
        <div className="p-4 rounded-xl bg-white dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-rose-200">Sign Out Everywhere</h3>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Invalidate active refresh tokens and log out of all active web and mobile client sessions.
            </p>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="w-full py-2 rounded-xl bg-rose-100 dark:bg-slate-900 hover:bg-rose-200 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-xs transition-colors border border-rose-300 dark:border-rose-500/30 cursor-pointer"
          >
            Global Sign Out
          </button>
        </div>

        {/* Delete Account */}
        <div className="p-4 rounded-xl bg-rose-100/50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/40 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-500" />
              <h3 className="text-xs font-black text-rose-800 dark:text-rose-300">Delete Account Permanently</h3>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Permanently destroy profile, certificates, marketplace listings, and circular scores. This cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={onDeleteAccount}
            className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-lg active:scale-95 border-0"
          >
            Delete Account
          </button>
        </div>
      </div>
    </section>
  );
};
