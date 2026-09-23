"use client";

import React, { useState } from "react";
import {
  UserProfileDetails,
} from "@/lib/mockProfileData";
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Edit3,
  Camera,
  Award,
  Sparkles,
  CheckCircle2,
  X,
  ChevronRight,
  TrendingUp,
  Share2,
} from "lucide-react";

interface ProfileHeroHeaderProps {
  profile: UserProfileDetails;
  onEditProfile: () => void;
  onShareProfile: () => void;
  onAvatarChange?: (newUrl: string) => void;
}

export const ProfileHeroHeader: React.FC<ProfileHeroHeaderProps> = ({
  profile,
  onEditProfile,
  onShareProfile,
  onAvatarChange,
}) => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Profile completion calculation
  const completionItems = [
    { label: "Account Email Verified", done: true, points: 20 },
    { label: "Phone Number Verified", done: true, points: 15 },
    { label: "Detailed Bio & Occupation Added", done: !!profile.bio && !!profile.occupation, points: 15 },
    { label: "Social Media Handles Linked", done: !!(profile.socialLinks.linkedin || profile.socialLinks.github), points: 15 },
    { label: "First AI Device Valuation Completed", done: true, points: 20 },
    { label: "Two-Factor Authentication (2FA) Active", done: true, points: 15 },
  ];

  const totalPoints = completionItems.reduce((acc, curr) => acc + curr.points, 0);
  const earnedPoints = completionItems
    .filter((item) => item.done)
    .reduce((acc, curr) => acc + curr.points, 0);
  const completionPercent = Math.round((earnedPoints / totalPoints) * 100);

  const levelProgress = Math.round(
    (profile.currentXP / profile.nextLevelXP) * 100
  );

  const handleAvatarClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file && onAvatarChange) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            onAvatarChange(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="relative rounded-3xl bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
      {/* Background Gradient Decorative Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Avatar & Main Identity */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar Container with Upload Overlay & Indicator */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/10 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Avatar Change Overlay Button */}
            <button
              onClick={handleAvatarClick}
              title="Change Profile Picture"
              className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer border-0"
            >
              <Camera className="w-6 h-6 text-emerald-400 mb-1" />
              <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">
                Upload
              </span>
            </button>
            {/* Online/Verified Status Indicator */}
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md"
              title="Active & Verified Account"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-950 font-bold" />
            </div>
          </div>

          {/* User Information Details */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {profile.fullName}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                {profile.verificationBadge}
              </span>
            </div>

            {(profile.occupation || profile.organization) ? (
              <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400 flex flex-wrap items-center gap-2">
                {profile.occupation && <span>{profile.occupation}</span>}
                {profile.occupation && profile.organization && <span className="text-slate-400 dark:text-slate-600">•</span>}
                {profile.organization && <span className="text-slate-700 dark:text-slate-300">{profile.organization}</span>}
              </p>
            ) : (
              <p className="text-xs font-medium text-slate-500 italic">
                Role & organization not specified
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                {(profile.city || profile.country) ? [profile.city, profile.country].filter(Boolean).join(", ") : "Location not specified"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Member since {profile.memberSince}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-xl line-clamp-2 leading-relaxed pt-1">
              {profile.bio ? `"${profile.bio}"` : "No bio added yet. Click 'Edit Profile' to introduce yourself."}
            </p>
          </div>
        </div>

        {/* Right Column: Level Progress & Quick Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 border-slate-200 dark:border-slate-800/80 pt-4 lg:pt-0 shrink-0">
          {/* Circular Economy Level Widget */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/90 space-y-2.5 w-full sm:w-72">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Level {profile.level} • {profile.levelTitle}</span>
              </div>
              <span className="text-[11px] font-extrabold text-cyan-600 dark:text-cyan-400">
                {profile.currentXP.toLocaleString()} / {profile.nextLevelXP.toLocaleString()} XP
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span>{levelProgress}% to Level {profile.level + 1}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Top 2% Platform Rating
              </span>
            </div>
          </div>

          {/* Action Buttons & Profile Completion Widget */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Interactive Profile Completion Pill */}
            <button
              onClick={() => setShowCompletionModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-300 dark:text-slate-800 stroke-current"
                    strokeWidth="4"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 dark:text-emerald-400 stroke-current"
                    strokeDasharray={`${completionPercent}, 100`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-200">{completionPercent}% Complete</span>
            </button>

            {/* Share Profile Button */}
            <button
              onClick={onShareProfile}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Share Portfolio"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Edit Profile Button */}
            <button
              onClick={onEditProfile}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-0"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Completion Checklist Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Profile Completion Status
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {earnedPoints} of {totalPoints} completion points earned
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {completionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-3">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700 shrink-0" />
                    )}
                    <span className={item.done ? "text-slate-800 dark:text-slate-200 font-medium" : "text-slate-500 dark:text-slate-400"}>
                      {item.label}
                    </span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+{item.points} XP</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCompletionModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border-0"
            >
              Close Checklist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
