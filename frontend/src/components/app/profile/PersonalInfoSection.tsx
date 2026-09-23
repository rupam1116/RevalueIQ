"use client";

import React, { useState, useEffect } from "react";
import { UserProfileDetails } from "@/lib/mockProfileData";
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  Save,
  RotateCcw,
} from "lucide-react";

interface PersonalInfoSectionProps {
  profile: UserProfileDetails;
  onSaveProfile: (updatedProfile: UserProfileDetails) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<UserProfileDetails>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handleChange = (
    field: keyof UserProfileDetails,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (
    network: keyof UserProfileDetails["socialLinks"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSaveProfile(formData);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  const handleReset = () => {
    setFormData({ ...profile });
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Professional & Personal Information
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Update your identity credentials, organization affiliations, and public portfolio links.
          </p>
        </div>
        {saveSuccess && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Information Saved Successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Identity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Occupation / Role
            </label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => handleChange("occupation", e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Organization / Company
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => handleChange("organization", e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> City & Region
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
            <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Bio Text Area */}
        <div className="space-y-1.5 text-xs">
          <label className="text-slate-700 dark:text-slate-300 font-semibold">Short Professional Bio</label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Tell the RevalueIQ community about your background and sustainability interests..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium resize-none"
          />
        </div>

        {/* Social Links Section */}
        <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
            Social Media & Professional Profiles
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* LinkedIn */}
            <div className="space-y-1.5">
              <label className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9Z"/>
                </svg>
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.linkedin || ""}
                onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
              />
            </div>

            {/* GitHub */}
            <div className="space-y-1.5">
              <label className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/>
                </svg>
                GitHub Profile
              </label>
              <input
                type="url"
                value={formData.socialLinks.github || ""}
                onChange={(e) => handleSocialChange("github", e.target.value)}
                placeholder="https://github.com/username"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
              />
            </div>

            {/* Twitter / X */}
            <div className="space-y-1.5">
              <label className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter / X Profile
              </label>
              <input
                type="url"
                value={formData.socialLinks.twitter || ""}
                onChange={(e) => handleSocialChange("twitter", e.target.value)}
                placeholder="https://twitter.com/username"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
              />
            </div>

            {/* Personal Website */}
            <div className="space-y-1.5">
              <label className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Personal Portfolio Website
              </label>
              <input
                type="url"
                value={formData.socialLinks.website || ""}
                onChange={(e) => handleSocialChange("website", e.target.value)}
                placeholder="https://yourwebsite.dev"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer border-0 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Changes
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer border-0 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Information
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
