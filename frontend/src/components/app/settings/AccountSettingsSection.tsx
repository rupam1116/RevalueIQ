"use client";

import React, { useState, useEffect } from "react";
import { AccountSettingsState } from "@/lib/mockSettingsData";
import { User, Mail, Phone, Globe, Clock, Save, RotateCcw, Check, ShieldCheck, AlertCircle } from "lucide-react";

interface AccountSettingsSectionProps {
  settings: AccountSettingsState;
  onSave: (updated: AccountSettingsState) => Promise<void> | void;
}

export const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<AccountSettingsState>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (field: keyof AccountSettingsState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);
  };

  const handleReset = () => {
    setFormData(settings);
    setValidationError(null);
  };

  const getInitials = (name: string) => {
    if (!name || !name.trim()) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      setValidationError("Full Name must be at least 2 characters long.");
      return;
    }
    if (formData.bio && formData.bio.length > 500) {
      setValidationError("Short Bio must not exceed 500 characters.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio?.trim() || "",
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setValidationError(err.message || "Failed to update account settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="account" className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Account Settings
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Update your primary personal profile, contact information, locale, and timezone.
          </p>
        </div>

        {isSaved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 animate-in fade-in">
            <Check className="w-3.5 h-3.5" /> Saved to Database!
          </span>
        )}
      </div>

      {validationError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Avatar Area (Initials Based - No photo upload per rule) */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg shrink-0 border-2 border-emerald-400/40 select-none">
            {getInitials(formData.fullName)}
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm">{formData.fullName || "Authenticated User"}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">{formData.email}</p>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/20 mt-0.5">
              <ShieldCheck className="w-3 h-3" /> Initials Avatar Active (Privacy Protected)
            </div>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3.5 py-2.5 text-slate-500 dark:text-slate-400 cursor-not-allowed select-none"
              title="Email is managed via Firebase Authentication in the Security tab"
            />
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Primary authentication email verified with Firebase.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Phone Number
              </label>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                Phone not verified
              </span>
            </div>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+91 9876543210"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              maxLength={30}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Primary Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="English (US)">English (US)</option>
              <option value="English (UK)">English (UK)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="German">German (Deutsch)</option>
            </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Timezone (IANA)
            </label>
            <select
              value={formData.timeZone}
              onChange={(e) => handleChange("timeZone", e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
              <option value="UTC">UTC (Greenwich Mean Time)</option>
              <option value="America/New_York">America/New_York (EST -5:00)</option>
              <option value="Europe/London">Europe/London (GMT +0:00)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST +9:00)</option>
              <option value="Europe/Paris">Europe/Paris (CET +1:00)</option>
            </select>
          </div>
        </div>

        {/* Bio Input */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <label className="text-slate-700 dark:text-slate-300 font-semibold">Short Bio</label>
            <span className="text-[10px] text-slate-400">
              {(formData.bio || "").length}/500 chars
            </span>
          </div>
          <textarea
            rows={3}
            value={formData.bio || ""}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            placeholder="Share your sustainability and electronics repair journey..."
            maxLength={500}
          />
        </div>

        {/* Submit / Reset Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer border-0 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md cursor-pointer border-0 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
};
