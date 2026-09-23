"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  INITIAL_USER_PROFILE,
  INITIAL_PROFILE_STATS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_SAVED_MARKETPLACE,
  INITIAL_SAVED_REPAIR_CENTERS,
  INITIAL_SAVED_DONATION_ORGS,
  INITIAL_SAVED_POSTS,
  INITIAL_CERTIFICATES,
  INITIAL_USER_ACTIVITIES,
  INITIAL_SECURITY_STATUS,
  UserProfileDetails,
  ProfileStats,
  AchievementBadge,
  UserDeviceItem,
  SavedMarketplaceItem,
  SavedRepairCenter,
  SavedDonationOrg,
  ImpactCertificate,
  UserActivityItem,
  UserSecurityStatus,
} from "@/lib/mockProfileData";

import {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  getUserDevices,
  createUserDevice,
  updateUserDevice,
  deleteUserDevice,
  UserDeviceResponse,
  UserDeviceCreateRequest,
} from "@/lib/userApi";
import { fetchAuditReports, fetchHistoryTimeline } from "@/lib/historyApi";

import { ProfileHeroHeader } from "../profile/ProfileHeroHeader";
import { ProfileStatsSection } from "../profile/ProfileStatsSection";
import { ProfileNavTabs, ProfileTabId } from "../profile/ProfileNavTabs";
import { PersonalInfoSection } from "../profile/PersonalInfoSection";
import { AchievementsSection } from "../profile/AchievementsSection";
import { MyDevicesSection } from "../profile/MyDevicesSection";
import { SavedItemsSection } from "../profile/SavedItemsSection";
import { CertificatesSection } from "../profile/CertificatesSection";
import { ActivityTimelineSection } from "../profile/ActivityTimelineSection";
import { AccountSecuritySection } from "../profile/AccountSecuritySection";
import { EditProfileModal } from "../profile/EditProfileModal";

import {
  User,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Leaf,
  AlertCircle,
} from "lucide-react";

interface ProfileModuleProps {
  onNavigateTab?: (tabId: string) => void;
}

export const ProfileModule: React.FC<ProfileModuleProps> = ({ onNavigateTab }) => {
  const { user, getToken } = useAuth();

  // Real API State Management
  const [profile, setProfile] = useState<UserProfileDetails>(INITIAL_USER_PROFILE);
  const [stats, setStats] = useState<ProfileStats>(INITIAL_PROFILE_STATS);
  const [achievements, setAchievements] = useState<AchievementBadge[]>(INITIAL_ACHIEVEMENTS);
  const [devices, setDevices] = useState<UserDeviceItem[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  
  // Saved items state scoped to active user
  const [savedMarketplace, setSavedMarketplace] = useState<SavedMarketplaceItem[]>([]);
  const [savedRepair, setSavedRepair] = useState<SavedRepairCenter[]>([]);
  const [savedDonation, setSavedDonation] = useState<SavedDonationOrg[]>([]);

  const [certificates, setCertificates] = useState<ImpactCertificate[]>([]);
  const [activities, setActivities] = useState<UserActivityItem[]>([]);
  const [security, setSecurity] = useState<UserSecurityStatus>(INITIAL_SECURITY_STATUS);

  const [activeTab, setActiveTab] = useState<ProfileTabId>("personal");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const showNotification = (msg: string, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Restore saved items scoped to authenticated user ID
  useEffect(() => {
    if (!user?.uid) {
      setSavedMarketplace([]);
      setSavedRepair([]);
      setSavedDonation([]);
      return;
    }
    try {
      const mk = localStorage.getItem(`revalue_saved_marketplace_${user.uid}`);
      setSavedMarketplace(mk ? JSON.parse(mk) : []);

      const rp = localStorage.getItem(`revalue_saved_repair_${user.uid}`);
      setSavedRepair(rp ? JSON.parse(rp) : []);

      const dn = localStorage.getItem(`revalue_saved_donation_${user.uid}`);
      setSavedDonation(dn ? JSON.parse(dn) : []);
    } catch (e) {
      setSavedMarketplace([]);
      setSavedRepair([]);
      setSavedDonation([]);
    }
  }, [user?.uid]);

  // 1. Fetch real Profile, Stats, User Devices, Certificates, and Activities on mount/auth change
  useEffect(() => {
    async function loadRealData() {
      if (!user) {
        setProfile(INITIAL_USER_PROFILE);
        setStats(INITIAL_PROFILE_STATS);
        setAchievements(INITIAL_ACHIEVEMENTS);
        setDevices([]);
        setCertificates([]);
        setActivities([]);
        setLoadingData(false);
        return;
      }
      try {
        const token = await getToken();
        if (!token) {
          setLoadingData(false);
          return;
        }

        // Fetch parallel real data from MongoDB
        const [profRes, statsRes, devRes, repRes, histRes] = await Promise.allSettled([
          getUserProfile(token),
          getUserStats(token),
          getUserDevices(token),
          fetchAuditReports(token),
          fetchHistoryTimeline(token, { limit: 20 }),
        ]);

        if (profRes.status === "fulfilled") {
          const p = profRes.value;
          setProfile({
            fullName: p.full_name || user.displayName || "",
            email: p.email || user.email || "",
            avatarUrl: p.photo_url || user.photoURL || INITIAL_USER_PROFILE.avatarUrl,
            phone: p.phone || "",
            bio: p.bio || "",
            city: p.city || "",
            country: p.country || "",
            occupation: p.occupation || "",
            organization: p.organization || "",
            isVerified: p.status === "active",
            verificationBadge: p.circular_grade && p.circular_grade !== "New" ? `Grade ${p.circular_grade}` : "Member",
            memberSince: p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "2026",
            level: p.level || 1,
            levelTitle: p.circular_grade && p.circular_grade !== "New" ? `Eco Grade ${p.circular_grade}` : "Eco Explorer",
            currentXP: (p.karma_points || 0) * 10,
            nextLevelXP: 1000,
            socialLinks: {
              linkedin: p.social_links?.linkedin || "",
              github: p.social_links?.github || "",
              twitter: p.social_links?.twitter || "",
              website: p.social_links?.website || "",
            },
          });
        }

        if (statsRes.status === "fulfilled") {
          const s = statsRes.value;
          setStats({
            devicesAnalysed: s.valuations_count || 0,
            devicesSold: s.marketplace_listings_count || 0,
            repairsCompleted: s.repair_reports_count || 0,
            donationsMade: s.donations_count || 0,
            marketplacePurchases: 0,
            communityPosts: 0,
            followers: 0,
            following: 0,
            co2SavedKg: s.co2_saved_kg || 0,
            circularScore: s.circular_score || 0,
            circularGrade: s.circular_grade || "New",
          });

          // Dynamically compute badges based on user's real actions
          setAchievements([
            {
              id: "ach-1",
              title: "First Scan",
              description: "Successfully analyze and appraise your first electronic device.",
              category: "Verification",
              iconName: "ShieldCheck",
              unlocked: (s.valuations_count || 0) >= 1,
              unlockedDate: (s.valuations_count || 0) >= 1 ? "Completed" : undefined,
              progressPercent: Math.min(100, Math.round(((s.valuations_count || 0) / 1) * 100)),
              xpReward: 50,
            },
            {
              id: "ach-2",
              title: "Circularity Pioneer",
              description: "Prevent at least 50 kg of carbon dioxide emissions through lifecycle actions.",
              category: "Sustainability",
              iconName: "Leaf",
              unlocked: (s.co2_saved_kg || 0) >= 50,
              unlockedDate: (s.co2_saved_kg || 0) >= 50 ? "Completed" : undefined,
              progressPercent: Math.min(100, Math.round(((s.co2_saved_kg || 0) / 50) * 100)),
              xpReward: 150,
            },
            {
              id: "ach-3",
              title: "Repair Advocate",
              description: "Complete an electronics diagnostic and obtain repair advisory guidelines.",
              category: "Repair",
              iconName: "Wrench",
              unlocked: (s.repair_reports_count || 0) >= 1,
              unlockedDate: (s.repair_reports_count || 0) >= 1 ? "Completed" : undefined,
              progressPercent: Math.min(100, Math.round(((s.repair_reports_count || 0) / 1) * 100)),
              xpReward: 100,
            },
            {
              id: "ach-4",
              title: "Hardware Philanthropist",
              description: "Donate a functioning hardware device to an accredited e-learning or school charity.",
              category: "Donation",
              iconName: "Heart",
              unlocked: (s.donations_count || 0) >= 1,
              unlockedDate: (s.donations_count || 0) >= 1 ? "Completed" : undefined,
              progressPercent: Math.min(100, Math.round(((s.donations_count || 0) / 1) * 100)),
              xpReward: 200,
            },
            {
              id: "ach-5",
              title: "E-Waste Champion",
              description: "List a pre-loved device in the verified circular marketplace.",
              category: "Marketplace",
              iconName: "ShoppingBag",
              unlocked: (s.marketplace_listings_count || 0) >= 1,
              unlockedDate: (s.marketplace_listings_count || 0) >= 1 ? "Completed" : undefined,
              progressPercent: Math.min(100, Math.round(((s.marketplace_listings_count || 0) / 1) * 100)),
              xpReward: 100,
            },
            {
              id: "ach-6",
              title: "Certified Circular Citizen",
              description: "Reach an overall Circular Economy Score of 80 or higher.",
              category: "Sustainability",
              iconName: "Award",
              unlocked: (s.circular_score || 0) >= 80,
              unlockedDate: (s.circular_score || 0) >= 80 ? "Completed" : undefined,
              progressPercent: Math.min(100, Math.round(((s.circular_score || 0) / 80) * 100)),
              xpReward: 250,
            },
          ]);
        }

        if (devRes.status === "fulfilled") {
          const mappedDevices: UserDeviceItem[] = devRes.value.map((d: UserDeviceResponse) => ({
            id: d.id,
            deviceName: `${d.brand} ${d.model}`.trim(),
            category: d.category,
            imageUrl: d.primary_image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
            aiValue: 0,
            currency: "₹",
            status: (d.status as any) || "Active",
            recommendation: "Sell",
            analysedDate: d.created_at ? new Date(d.created_at).toLocaleDateString() : "Recently",
            aiGrade: d.condition || "Good",
            specsSnippet: [d.storage, d.ram, d.purchase_year ? `Purchased ${d.purchase_year}` : ""]
              .filter(Boolean)
              .join(" • ") || "Registered User Device",
            brand: d.brand,
            model: d.model,
            storage: d.storage,
            ram: d.ram,
            serialNumber: d.serial_number,
            purchaseYear: d.purchase_year,
            condition: d.condition,
            notes: d.notes,
          }));
          setDevices(mappedDevices);
        }

        if (repRes.status === "fulfilled" && Array.isArray(repRes.value)) {
          const mappedCerts: ImpactCertificate[] = repRes.value.map((r) => {
            const catType: ImpactCertificate["type"] =
              r.category === "Donation" ? "Donation"
              : r.category === "Repair" ? "Impact Report"
              : r.category === "Marketplace" ? "Circular Economy"
              : "AI Valuation";
            return {
              id: r.id,
              title: r.title,
              certificateId: `CERT-${r.id.slice(-6).toUpperCase()}`,
              issueDate: r.date,
              type: catType,
              metricsSummary: r.description,
              downloadUrl: "#",
              issuedBy: "RevalueIQ Environmental Engine",
              verified: true,
            };
          });
          setCertificates(mappedCerts);
        } else {
          setCertificates([]);
        }

        if (histRes.status === "fulfilled" && Array.isArray(histRes.value?.items)) {
          const mappedActs: UserActivityItem[] = histRes.value.items.map((it) => {
            const catFormatted = (
              it.type === "donation" ? "Donation"
              : it.type === "repair" ? "Repair"
              : it.type === "marketplace" ? "Marketplace"
              : "Valuation"
            ) as UserActivityItem["category"];
            return {
              id: it.id,
              title: it.title,
              category: catFormatted,
              description: it.description || `${it.device_name} — ${it.category}`,
              timestamp: it.date || new Date(it.timestamp).toLocaleDateString(),
              status: it.status || "Completed",
            };
          });
          setActivities(mappedActs);
        } else {
          setActivities([]);
        }
      } catch (err) {
        console.warn("Notice loading user profile data:", err);
      } finally {
        setLoadingData(false);
      }
    }

    loadRealData();
  }, [user, getToken]);

  // 2. Handle Profile Information Update
  const handleSaveProfileInfo = async (updated: UserProfileDetails) => {
    try {
      const token = await getToken();
      if (!token) {
        showNotification("Authentication token missing.", true);
        throw new Error("Authentication token missing.");
      }

      const res = await updateUserProfile(token, {
        full_name: updated.fullName,
        photo_url: updated.avatarUrl,
        phone: updated.phone,
        bio: updated.bio,
        city: updated.city,
        country: updated.country,
        occupation: updated.occupation,
        organization: updated.organization,
        social_links: updated.socialLinks,
      });

      setProfile((prev) => ({
        ...prev,
        fullName: res.full_name,
        email: res.email,
        avatarUrl: res.photo_url || prev.avatarUrl,
        phone: res.phone || "",
        bio: res.bio || "",
        city: res.city || "",
        country: res.country || "",
        occupation: res.occupation || "",
        organization: res.organization || "",
        socialLinks: {
          linkedin: res.social_links?.linkedin || "",
          github: res.social_links?.github || "",
          twitter: res.social_links?.twitter || "",
          website: res.social_links?.website || "",
        },
      }));
      showNotification("Profile updated successfully.");
    } catch (err: any) {
      showNotification(err.message || "Unable to update your profile. Please try again.", true);
      throw err;
    }
  };

  // 3. Device CRUD Handlers
  const handleAddDevice = async (deviceReq: UserDeviceCreateRequest) => {
    try {
      const token = await getToken();
      if (!token) {
        showNotification("Authentication required.", true);
        return;
      }

      const created = await createUserDevice(token, deviceReq);
      const newItem: UserDeviceItem = {
        id: created.id,
        deviceName: `${created.brand} ${created.model}`.trim(),
        category: created.category,
        imageUrl: created.primary_image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        aiValue: 0,
        currency: "₹",
        status: (created.status as any) || "Active",
        recommendation: "Sell",
        analysedDate: "Just now",
        aiGrade: created.condition || "Good",
        specsSnippet: [created.storage, created.ram, created.purchase_year ? `Purchased ${created.purchase_year}` : ""]
          .filter(Boolean)
          .join(" • ") || "Registered Device",
        brand: created.brand,
        model: created.model,
        storage: created.storage,
        ram: created.ram,
        serialNumber: created.serial_number,
        purchaseYear: created.purchase_year,
        condition: created.condition,
        notes: created.notes,
      };

      setDevices((prev) => [newItem, ...prev]);
      setStats((prev) => ({ ...prev, devicesAnalysed: prev.devicesAnalysed + 1 }));
      showNotification("Device added successfully.");
    } catch (err: any) {
      showNotification(err.message || "Unable to add the device. Please try again.", true);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      const token = await getToken();
      if (!token) {
        showNotification("Authentication required.", true);
        return;
      }
      await deleteUserDevice(token, deviceId);
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
      showNotification("Device deleted successfully.");
    } catch (err: any) {
      showNotification(err.message || "Unable to delete device.", true);
    }
  };

  const handleRemoveSavedItem = (
    category: "marketplace" | "repair" | "donation",
    id: string
  ) => {
    if (category === "marketplace") {
      setSavedMarketplace((prev) => {
        const next = prev.filter((item) => item.id !== id);
        if (user?.uid) {
          try {
            localStorage.setItem(`revalue_saved_marketplace_${user.uid}`, JSON.stringify(next));
          } catch (e) {}
        }
        return next;
      });
    } else if (category === "repair") {
      setSavedRepair((prev) => {
        const next = prev.filter((item) => item.id !== id);
        if (user?.uid) {
          try {
            localStorage.setItem(`revalue_saved_repair_${user.uid}`, JSON.stringify(next));
          } catch (e) {}
        }
        return next;
      });
    } else if (category === "donation") {
      setSavedDonation((prev) => {
        const next = prev.filter((item) => item.id !== id);
        if (user?.uid) {
          try {
            localStorage.setItem(`revalue_saved_donation_${user.uid}`, JSON.stringify(next));
          } catch (e) {}
        }
        return next;
      });
    }
    showNotification("Item removed from your saved list.");
  };

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showNotification("Profile URL copied to clipboard!");
    } else {
      showNotification("Sharing profile link...");
    }
  };

  const totalSavedCount =
    savedMarketplace.length +
    savedRepair.length +
    savedDonation.length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> RevalueIQ Sustainability Portfolio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            User Profile & Identity
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Manage your personal information, environmental accomplishments, circular score, registered devices, and account security.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab("dashboard")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Global Notification Toast */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-2xl ${
            toastMessage.isError
              ? "bg-rose-600 text-white"
              : "bg-emerald-500 text-slate-950"
          } font-extrabold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in`}
        >
          {toastMessage.isError ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Hero Profile Header */}
      <ProfileHeroHeader
        profile={profile}
        onEditProfile={() => setIsEditModalOpen(true)}
        onShareProfile={handleShareProfile}
        onAvatarChange={(newUrl) => {
          setProfile((prev) => ({ ...prev, avatarUrl: newUrl }));
          handleSaveProfileInfo({ ...profile, avatarUrl: newUrl });
        }}
      />

      {/* 2. Key Statistics Grid */}
      <ProfileStatsSection stats={stats} />

      {/* 3. Interactive Section Tabs Nav */}
      <div className="space-y-6 pt-4">
        <ProfileNavTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            devicesCount: devices.length,
            savedCount: totalSavedCount,
            certificatesCount: certificates.length,
            achievementsCount: achievements.length,
          }}
        />

        {/* 4. Tab Content Area */}
        <div className="transition-all duration-300">
          {activeTab === "personal" && (
            <PersonalInfoSection
              profile={profile}
              onSaveProfile={handleSaveProfileInfo}
            />
          )}

          {activeTab === "achievements" && (
            <AchievementsSection achievements={achievements} />
          )}

          {activeTab === "devices" && (
            <MyDevicesSection
              devices={devices}
              onNavigateTab={onNavigateTab}
              onAddDevice={handleAddDevice}
              onDeleteDevice={handleDeleteDevice}
            />
          )}

          {activeTab === "saved" && (
            <SavedItemsSection
              marketplaceItems={savedMarketplace}
              repairCenters={savedRepair}
              donationOrgs={savedDonation}
              onRemoveItem={handleRemoveSavedItem}
              onNavigateTab={onNavigateTab}
            />
          )}

          {activeTab === "certificates" && (
            <CertificatesSection certificates={certificates} />
          )}

          {activeTab === "activity" && (
            <ActivityTimelineSection
              activities={activities}
              onNavigateTab={onNavigateTab}
            />
          )}

          {activeTab === "security" && (
            <AccountSecuritySection
              securityStatus={security}
              onUpdateSecurity={(updated) => {
                setSecurity(updated);
                showNotification("Account security configuration updated!");
              }}
            />
          )}
        </div>
      </div>

      {/* 5. Dedicated Interactive Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfileInfo}
      />
    </div>
  );
};
