"use client";

import React, { useState, useEffect } from "react";
import { NotificationPreferences } from "@/lib/settingsApi";
import { Bell, Mail, Smartphone, ShoppingBag, Wrench, HeartHandshake, Megaphone, Check } from "lucide-react";

interface NotificationsSectionProps {
  settings: NotificationPreferences;
  onSave: (updated: NotificationPreferences) => Promise<void> | void;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<NotificationPreferences>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleToggle = async (key: keyof NotificationPreferences) => {
    const updated = { ...formData, [key]: !formData[key] };
    setFormData(updated);
    setIsSaving(true);
    try {
      await onSave(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="notifications" className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Notifications & Communications
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Choose which platform activities send real-time alerts via in-app and email channels.
          </p>
        </div>

        {isSaved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 animate-in fade-in">
            <Check className="w-3.5 h-3.5" /> Saved to Database!
          </span>
        )}
      </div>

      {/* Global Channel Toggles */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Delivery Channels
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* In-App Notifications */}
          <div
            onClick={() => !isSaving && handleToggle("in_app")}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200 text-xs">In-App Alerts</p>
                <p className="text-[10px] text-slate-500 font-medium">Header bell badge</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.in_app}
              onChange={() => {}}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Email Notifications */}
          <div
            onClick={() => !isSaving && handleToggle("email_notifications")}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200 text-xs">Email Alerts</p>
                <p className="text-[10px] text-slate-500 font-medium">Important transaction emails</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.email_notifications}
              onChange={() => {}}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* SMS Notifications (Truthfully noted) */}
          <div
            onClick={() => !isSaving && handleToggle("sms_notifications")}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200 text-xs">SMS Alerts</p>
                <p className="text-[10px] text-slate-500 font-medium">Critical trade OTPs</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.sms_notifications}
              onChange={() => {}}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Module Activity Notifications */}
      <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
          Module Notifications
        </h3>

        <div className="space-y-2">
          {/* Marketplace */}
          <div
            onClick={() => !isSaving && handleToggle("marketplace_alerts")}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer text-xs"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200">Marketplace & Resale Offers</p>
                <p className="text-[11px] text-slate-500">Alerts when buyers submit offers or message on listed items.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.marketplace_alerts}
              onChange={() => {}}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Repair Shops */}
          <div
            onClick={() => !isSaving && handleToggle("repair_status_updates")}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer text-xs"
          >
            <div className="flex items-center gap-3">
              <Wrench className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200">Repair Status Updates</p>
                <p className="text-[11px] text-slate-500">Real-time status changes when a technician inspects or updates your device.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.repair_status_updates}
              onChange={() => {}}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Donation Progress */}
          <div
            onClick={() => !isSaving && handleToggle("donation_impact_reports")}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer text-xs"
          >
            <div className="flex items-center gap-3">
              <HeartHandshake className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200">Donation Impact Reports</p>
                <p className="text-[11px] text-slate-500">Confirmation certificates when donated hardware reaches NGOs.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.donation_impact_reports}
              onChange={() => {}}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Marketing & Newsletter */}
          <div
            onClick={() => !isSaving && handleToggle("promotional_newsletters")}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer text-xs"
          >
            <div className="flex items-center gap-3">
              <Megaphone className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200">Eco Tech Trends & Announcements</p>
                <p className="text-[11px] text-slate-500">Weekly e-waste reduction analytics and feature updates.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.promotional_newsletters}
              onChange={() => {}}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
