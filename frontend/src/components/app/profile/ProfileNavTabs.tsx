"use client";

import React from "react";
import {
  User,
  Award,
  Smartphone,
  Bookmark,
  FileCheck,
  History,
  ShieldCheck,
} from "lucide-react";

export type ProfileTabId =
  | "personal"
  | "achievements"
  | "devices"
  | "saved"
  | "certificates"
  | "activity"
  | "security";

interface ProfileNavTabsProps {
  activeTab: ProfileTabId;
  onTabChange: (tab: ProfileTabId) => void;
  counts?: {
    devicesCount?: number;
    savedCount?: number;
    certificatesCount?: number;
    achievementsCount?: number;
  };
}

export const ProfileNavTabs: React.FC<ProfileNavTabsProps> = ({
  activeTab,
  onTabChange,
  counts = {},
}) => {
  const tabs: { id: ProfileTabId; label: string; icon: any; count?: number }[] = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "achievements", label: "Achievements", icon: Award, count: counts.achievementsCount },
    { id: "devices", label: "My Devices", icon: Smartphone, count: counts.devicesCount },
    { id: "saved", label: "Saved Items", icon: Bookmark, count: counts.savedCount },
    { id: "certificates", label: "Certificates", icon: FileCheck, count: counts.certificatesCount },
    { id: "activity", label: "Activity Summary", icon: History },
    { id: "security", label: "Account Security", icon: ShieldCheck },
  ];

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none pb-0.5">
      <nav className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl font-bold text-xs transition-all cursor-pointer border-b-2 ${
                isActive
                  ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border-emerald-600 dark:border-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/40"
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`} />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`ml-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
