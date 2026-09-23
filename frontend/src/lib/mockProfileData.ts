export interface UserProfileDetails {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  bio: string;
  occupation: string;
  organization: string;
  avatarUrl: string;
  isVerified: boolean;
  verificationBadge: string;
  memberSince: string;
  level: number;
  levelTitle: string;
  currentXP: number;
  nextLevelXP: number;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

export interface ProfileStats {
  devicesAnalysed: number;
  devicesSold: number;
  repairsCompleted: number;
  donationsMade: number;
  marketplacePurchases: number;
  communityPosts: number;
  followers: number;
  following: number;
  co2SavedKg: number;
  circularScore: number;
  circularGrade: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  category: "Sustainability" | "Repair" | "Marketplace" | "Donation" | "Verification";
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedDate?: string;
  progressPercent: number;
  xpReward: number;
}

export interface UserDeviceItem {
  id: string;
  deviceName: string;
  category: string;
  imageUrl: string;
  aiValue: number;
  currency: string;
  status: "Active" | "Sold" | "Repaired" | "Donated";
  recommendation: "Sell" | "Repair" | "Donate" | "Recycle";
  analysedDate: string;
  aiGrade: string;
  specsSnippet: string;
  brand?: string;
  model?: string;
  storage?: string;
  ram?: string;
  serialNumber?: string;
  purchaseYear?: string;
  condition?: string;
  notes?: string;
}

export interface SavedMarketplaceItem {
  id: string;
  title: string;
  price: number;
  condition: string;
  location: string;
  imageUrl: string;
  sellerName: string;
  savedDate: string;
}

export interface SavedRepairCenter {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  specialty: string;
  location: string;
  distance: string;
  savedDate: string;
}

export interface SavedDonationOrg {
  id: string;
  name: string;
  cause: string;
  location: string;
  verified: boolean;
  devicesAccepted: string;
  savedDate: string;
}

export interface SavedCommunityPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  upvotes: number;
  commentsCount: number;
  category: string;
  readTime: string;
  savedDate: string;
}

export interface ImpactCertificate {
  id: string;
  title: string;
  type: "Donation" | "Circular Economy" | "AI Valuation" | "Impact Report";
  certificateId: string;
  issueDate: string;
  issuedBy: string;
  downloadUrl: string;
  metricsSummary: string;
  verified: boolean;
}

export interface UserActivityItem {
  id: string;
  category: "Valuation" | "Marketplace" | "Repair" | "Donation" | "History";
  title: string;
  description: string;
  timestamp: string;
  status: string;
  actionUrl?: string;
}

export interface SecuritySession {
  id: string;
  deviceName: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserSecurityStatus {
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  passwordLastChanged: string;
  lastLoginTimestamp: string;
  lastLoginIp: string;
  lastLoginLocation: string;
  activeSessions: SecuritySession[];
}

export const INITIAL_USER_PROFILE: UserProfileDetails = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  bio: "",
  occupation: "",
  organization: "",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  isVerified: false,
  verificationBadge: "Member",
  memberSince: "2026",
  level: 1,
  levelTitle: "Eco Explorer",
  currentXP: 100,
  nextLevelXP: 1000,
  socialLinks: {
    linkedin: "",
    github: "",
    twitter: "",
    website: "",
  },
};

export const INITIAL_PROFILE_STATS: ProfileStats = {
  devicesAnalysed: 0,
  devicesSold: 0,
  repairsCompleted: 0,
  donationsMade: 0,
  marketplacePurchases: 0,
  communityPosts: 0,
  followers: 0,
  following: 0,
  co2SavedKg: 0,
  circularScore: 0,
  circularGrade: "New",
};

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: "ach-1",
    title: "Eco Hero",
    category: "Sustainability",
    description: "Divert over 50 kg of electronic waste & CO₂ emissions.",
    iconName: "Leaf",
    unlocked: false,
    progressPercent: 0,
    xpReward: 1000,
  },
  {
    id: "ach-2",
    title: "Repair Champion",
    category: "Repair",
    description: "Successfully repair 3+ devices instead of replacing them.",
    iconName: "Wrench",
    unlocked: false,
    progressPercent: 0,
    xpReward: 750,
  },
  {
    id: "ach-3",
    title: "Marketplace Trader",
    category: "Marketplace",
    description: "List or sell verified refurbished devices to fellow members.",
    iconName: "ShoppingBag",
    unlocked: false,
    progressPercent: 0,
    xpReward: 600,
  },
  {
    id: "ach-4",
    title: "Lifecycle Extender",
    category: "Repair",
    description: "Extend the active lifespan of hardware assets through diagnosis.",
    iconName: "Wrench",
    unlocked: false,
    progressPercent: 0,
    xpReward: 500,
  },
  {
    id: "ach-5",
    title: "Donation Supporter",
    category: "Donation",
    description: "Donate working laptops/tablets to verified educational programs.",
    iconName: "Heart",
    unlocked: false,
    progressPercent: 0,
    xpReward: 800,
  },
  {
    id: "ach-6",
    title: "Circular Champion",
    category: "Sustainability",
    description: "Achieve a circular economy score of 85+ (Grade A+).",
    iconName: "Award",
    unlocked: false,
    progressPercent: 0,
    xpReward: 1200,
  },
  {
    id: "ach-7",
    title: "Verified Member",
    category: "Verification",
    description: "Complete email authentication and profile verification.",
    iconName: "ShieldCheck",
    unlocked: false,
    progressPercent: 0,
    xpReward: 300,
  },
  {
    id: "ach-8",
    title: "E-Waste Recycler Master",
    category: "Sustainability",
    description: "Safely recycle non-functional devices via certified hubs.",
    iconName: "Recycle",
    unlocked: false,
    progressPercent: 0,
    xpReward: 900,
  },
];

export const INITIAL_USER_DEVICES: UserDeviceItem[] = [];

export const INITIAL_SAVED_MARKETPLACE: SavedMarketplaceItem[] = [];

export const INITIAL_SAVED_REPAIR_CENTERS: SavedRepairCenter[] = [];

export const INITIAL_SAVED_DONATION_ORGS: SavedDonationOrg[] = [];

export const INITIAL_SAVED_POSTS: SavedCommunityPost[] = [];

export const INITIAL_CERTIFICATES: ImpactCertificate[] = [];

export const INITIAL_USER_ACTIVITIES: UserActivityItem[] = [];

export const INITIAL_SECURITY_STATUS: UserSecurityStatus = {
  emailVerified: false,
  phoneVerified: false,
  twoFactorEnabled: false,
  passwordLastChanged: "Not changed",
  lastLoginTimestamp: "Current Session",
  lastLoginIp: "Protected",
  lastLoginLocation: "Active Session",
  activeSessions: [
    {
      id: "sess-current",
      deviceName: "Current Browser Session",
      browser: "Active Web Browser",
      location: "Active Location",
      ipAddress: "Secure Session",
      lastActive: "Active Now",
      isCurrent: true,
    },
  ],
};
