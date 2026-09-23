"use client";

import React from "react";
import {
  User,
  Shield,
  Bell,
  Lock,
  Sliders,
  Link,
  Bot,
  Database,
  HelpCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";

export interface SettingsSectionNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isDanger?: boolean;
}

export const SETTINGS_SECTIONS: SettingsSectionNavItem[] = [
  { id: "account", label: "Account Settings", icon: User },
  { id: "eco-plan", label: "Eco Plan & Billing", icon: Zap },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "preferences", label: "Application Preferences", icon: Sliders },
  { id: "connected", label: "Connected Accounts", icon: Link },
  { id: "ai", label: "AI Preferences", icon: Bot },
  { id: "data", label: "Data Management", icon: Database },
  { id: "help", label: "Help & Support", icon: HelpCircle },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, isDanger: true },
];

interface SettingsWorkspaceNavProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

export const SettingsWorkspaceNav: React.FC<SettingsWorkspaceNavProps> = ({
  activeSection,
  onSelectSection,
}) => {
  return (
    <nav aria-label="Settings Workspace Navigation" className="w-full lg:w-64 shrink-0 space-y-1">
      {/* Desktop Sticky Panel / Mobile Horizontal Scroll Container */}
      <div className="sticky top-6 bg-white dark:bg-[#0c1924]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl p-2.5 space-y-1 shadow-lg overflow-x-auto flex lg:flex-col gap-1 lg:gap-1 scrollbar-none">
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={`
                flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold
                transition-all duration-200 cursor-pointer whitespace-nowrap lg:whitespace-normal
                w-full text-left
                ${
                  isActive
                    ? section.isDanger
                      ? "bg-rose-100 dark:bg-rose-500/15 border border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 font-bold shadow-xs"
                      : "bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs"
                    : section.isDanger
                    ? "text-rose-600 dark:text-rose-400/80 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"
                }
              `}
            >
              <div
                className={`
                  p-1.5 rounded-lg shrink-0 transition-colors
                  ${
                    isActive
                      ? section.isDanger
                        ? "bg-rose-200 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300"
                        : "bg-emerald-200 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      : section.isDanger
                      ? "bg-rose-100 dark:bg-rose-500/5 text-rose-600 dark:text-rose-400"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span className="truncate flex-1 tracking-tight">{section.label}</span>

              {isActive && (
                <span
                  className={`hidden lg:block w-1.5 h-1.5 rounded-full ${
                    section.isDanger ? "bg-rose-500 dark:bg-rose-400" : "bg-emerald-500 dark:bg-emerald-400"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
