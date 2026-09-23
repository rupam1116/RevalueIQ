export interface AccountSettingsState {
  profilePicture: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  timeZone: string;
  bio?: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  deviceName?: string;
  browser: string;
  location: string;
  ip: string;
  ipAddress?: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface TrustedDevice {
  id: string;
  name: string;
  type: string;
  os: string;
  addedDate: string;
  status: "Active" | "Verified";
}

export interface SecuritySettingsState {
  passwordLastChanged: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorMethod: "Authenticator App (TOTP)" | "SMS Verification" | "Security Key (FIDO2)";
  activeSessions: ActiveSession[];
  lastLogin: {
    timestamp: string;
    ip: string;
    location: string;
    device: string;
  };
  trustedDevices: TrustedDevice[];
}

export interface NotificationSettingsState {
  marketplaceUpdates?: boolean;
  marketplaceAlerts?: boolean;
  repairStatus?: boolean;
  repairStatusUpdates?: boolean;
  donationUpdates?: boolean;
  donationImpactReports?: boolean;
  communityReplies?: boolean;
  announcements?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  promotionalNewsletters?: boolean;
}

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface PrivacySettingsState {
  profileVisibility: "Public" | "Members Only" | "Private";
  statsVisibility?: "Public" | "Members Only" | "Private";
  activityVisibility: "Public" | "Friends Only" | "Private";
  communityVisibility: "Public" | "Anonymous" | "Hidden";
  showDonationHistory: boolean;
  showMarketplaceActivity: boolean;
  allowAiPersonalization: boolean;
  aiDataPersonalization?: boolean;
  dataCollectionConsent: boolean;
  searchEngineIndexing?: boolean;
  anonymizedAnalytics?: boolean;
  cookiesPreferences: CookiePreferences;
}

export interface AccessibilityOptions {
  highContrast: boolean;
  reducedMotion: boolean;
  fontScaling: "Normal" | "Large" | "Extra Large";
}

export interface AppPreferencesState {
  theme: "Light" | "Dark" | "System Default";
  language: string;
  currency: string;
  distanceUnit: "Kilometers (km)" | "Miles (mi)";
  dateFormat: "YYYY-MM-DD" | "DD/MM/YYYY" | "MM/DD/YYYY";
  accessibility: AccessibilityOptions;
  animations: boolean;
  compactMode: boolean;
}

export interface ConnectedAccount {
  id: string;
  name: "Google" | "GitHub" | "Apple" | "Microsoft" | "Firebase Account";
  icon: string;
  connected: boolean;
  connectedEmail?: string;
  connectedDate?: string;
}

export interface AiPreferencesState {
  preferredRecommendationStyle: "Repair First" | "Sell First" | "Donation First" | "Balanced";
  enableAiLearning: boolean;
  enablePersonalizedSuggestions: boolean;
  allowAiDeviceHistory: boolean;
}

export interface DataManagementState {
  lastBackupDate: string;
  totalDataSizeMb: number;
  savedDevicesCount: number;
  activityHistoryCount: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Security" | "Valuation" | "Marketplace";
}

// Initial Mock States
export const INITIAL_ACCOUNT_SETTINGS: AccountSettingsState = {
  profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  fullName: "Rupam Das",
  email: "rupam.das@revalueiq.com",
  phone: "+1 (555) 234-5678",
  country: "United States",
  language: "English (US)",
  timeZone: "UTC-05:00 (Eastern Time)",
};

export const INITIAL_SECURITY_SETTINGS: SecuritySettingsState = {
  passwordLastChanged: "14 days ago (July 23, 2026)",
  emailVerified: true,
  phoneVerified: true,
  twoFactorEnabled: true,
  twoFactorMethod: "Authenticator App (TOTP)",
  activeSessions: [
    {
      id: "sess_1",
      device: "MacBook Pro 16\"",
      browser: "Chrome 127.0 (macOS)",
      location: "New York, USA",
      ip: "192.168.1.104",
      lastActive: "Active Now",
      isCurrent: true,
    },
    {
      id: "sess_2",
      device: "iPhone 15 Pro",
      browser: "RevalueIQ Mobile App",
      location: "New York, USA",
      ip: "172.56.21.89",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
    {
      id: "sess_3",
      device: "Dell XPS 15",
      browser: "Firefox 128.0 (Windows 11)",
      location: "Boston, USA",
      ip: "68.192.44.12",
      lastActive: "3 days ago",
      isCurrent: false,
    },
  ],
  lastLogin: {
    timestamp: "August 6, 2026 at 12:35 PM",
    ip: "192.168.1.104",
    location: "New York, NY, United States",
    device: "MacBook Pro 16\" (Chrome 127)",
  },
  trustedDevices: [
    {
      id: "dev_1",
      name: "Rupam's MacBook Pro",
      type: "Laptop",
      os: "macOS Sonoma 14.5",
      addedDate: "Jan 12, 2026",
      status: "Active",
    },
    {
      id: "dev_2",
      name: "iPhone 15 Pro Max",
      type: "Mobile",
      os: "iOS 17.5.1",
      addedDate: "Mar 04, 2026",
      status: "Verified",
    },
  ],
};

export const INITIAL_NOTIFICATION_SETTINGS: NotificationSettingsState = {
  marketplaceUpdates: true,
  repairStatus: true,
  donationUpdates: true,
  communityReplies: true,
  announcements: true,
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
};

export const INITIAL_PRIVACY_SETTINGS: PrivacySettingsState = {
  profileVisibility: "Public",
  activityVisibility: "Public",
  communityVisibility: "Public",
  showDonationHistory: true,
  showMarketplaceActivity: true,
  allowAiPersonalization: true,
  dataCollectionConsent: true,
  cookiesPreferences: {
    essential: true,
    analytics: true,
    marketing: false,
    functional: true,
  },
};

export const INITIAL_APP_PREFERENCES: AppPreferencesState = {
  theme: "Dark",
  language: "English (US)",
  currency: "USD ($)",
  distanceUnit: "Kilometers (km)",
  dateFormat: "YYYY-MM-DD",
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontScaling: "Normal",
  },
  animations: true,
  compactMode: false,
};

export const INITIAL_CONNECTED_ACCOUNTS: ConnectedAccount[] = [
  {
    id: "conn_1",
    name: "Google",
    icon: "google",
    connected: true,
    connectedEmail: "rupam.das@gmail.com",
    connectedDate: "Linked on Jan 10, 2026",
  },
  {
    id: "conn_2",
    name: "GitHub",
    icon: "github",
    connected: true,
    connectedEmail: "rupam1116",
    connectedDate: "Linked on Feb 02, 2026",
  },
  {
    id: "conn_3",
    name: "Apple",
    icon: "apple",
    connected: false,
  },
  {
    id: "conn_4",
    name: "Microsoft",
    icon: "microsoft",
    connected: false,
  },
  {
    id: "conn_5",
    name: "Firebase Account",
    icon: "firebase",
    connected: true,
    connectedEmail: "rupam.das@revalueiq.com",
    connectedDate: "Primary Auth System",
  },
];

export const INITIAL_AI_PREFERENCES: AiPreferencesState = {
  preferredRecommendationStyle: "Balanced",
  enableAiLearning: true,
  enablePersonalizedSuggestions: true,
  allowAiDeviceHistory: true,
};

export const INITIAL_DATA_MANAGEMENT: DataManagementState = {
  lastBackupDate: "August 5, 2026, 04:00 AM",
  totalDataSizeMb: 14.8,
  savedDevicesCount: 12,
  activityHistoryCount: 48,
};

export const MOCK_FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq_1",
    category: "Valuation",
    question: "How does RevalueIQ's AI calculate device resale and repair values?",
    answer: "RevalueIQ uses multi-angle computer vision and real-time market data across global secondary electronics platforms to estimate current residual market value and repair ROI.",
  },
  {
    id: "faq_2",
    category: "Security",
    question: "Is my personal device data and hardware history secure?",
    answer: "Yes. All hardware telemetry, images, and transaction histories are encrypted at rest with AES-256 and in transit via TLS 1.3. You can export or delete your data anytime in Settings.",
  },
  {
    id: "faq_3",
    category: "Marketplace",
    question: "What safety guarantees exist when buying or selling on RevalueIQ?",
    answer: "Every seller item undergoes AI hardware verification or manual inspection badge. Payments are escrowed until delivery confirmation and 7-day functionality verification.",
  },
  {
    id: "faq_4",
    category: "General",
    question: "How are Circular Economy Points and CO2 Reduction calculated?",
    answer: "CO2 savings follow lifecycle assessment (LCA) standards for electronics manufacturing avoidance. Repairing or donating a smartphone saves ~70kg CO2 e-emissions.",
  },
];
