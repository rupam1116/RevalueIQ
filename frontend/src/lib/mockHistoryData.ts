export interface ActivityItem {
  id: string;
  type: 'valuation' | 'repair' | 'marketplace' | 'donation';
  title: string;
  deviceName: string;
  category: string;
  date: string;
  timestamp: number;
  status: 'Verified' | 'Completed' | 'In Progress' | 'Delivered' | 'Published';
  value: number;
  description: string;
  co2Saved: number;
  eWastePrevented: number;
  reportId: string;
  details: {
    conditionGrade?: string;
    repairShop?: string;
    buyerOrNgo?: string;
    repairCost?: number;
    location?: string;
    likesCount?: number;
  };
}

export interface ChartDataMonthly {
  month: string;
  valuations: number;
  repairs: number;
  sales: number;
  donations: number;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
  color: string;
  count: number;
}

export interface RevenueSavings {
  month: string;
  revenue: number;
  savings: number;
}

export interface RepairSavingsBreakdown {
  category: string;
  diy: number;
  authorizedShop: number;
  replacementCost: number;
}

export interface DonationImpactData {
  month: string;
  devicesDonated: number;
  beneficiaries: number;
}

export interface CarbonReductionData {
  month: string;
  co2: number;
  cumulativeCo2: number;
}

export interface ReportItem {
  id: string;
  title: string;
  category: 'Valuation' | 'Repair' | 'Donation' | 'Activity';
  date: string;
  fileSize: string;
  format: 'PDF';
  deviceCount?: number;
  certificateId?: string;
  description: string;
}

export interface RecentDeviceItem {
  id: string;
  deviceName: string;
  category: string;
  aiValue: number;
  recommendation: 'Sell on Marketplace' | 'Book Repair' | 'Donate to NGO' | 'Keep & Maintain';
  status: 'Verified' | 'Listed' | 'Repaired' | 'Donated';
  aiGrade: string;
  lastUpdated: string;
  iconType: 'smartphone' | 'laptop' | 'audio' | 'tablet' | 'watch';
}

export interface AchievementItem {
  id: string;
  title: string;
  category: 'Valuation' | 'Impact' | 'Repair' | 'Donation' | 'Marketplace';
  description: string;
  badgeCode: string;
  progress: number; // 0 to 100
  unlocked: boolean;
  unlockedDate?: string;
  points: number;
  iconName: string;
  colorGradient: string;
}

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-101",
    type: "valuation",
    title: "AI Valuation Completed",
    deviceName: "iPhone 15 Pro (256GB)",
    category: "Smartphones",
    date: "Aug 06, 2026 • 10:45 AM",
    timestamp: Date.now() - 3600000 * 2,
    status: "Verified",
    value: 78500,
    description: "Instant AI scan confirmed Grade A+ condition. Zero functional flaws detected.",
    co2Saved: 28.5,
    eWastePrevented: 0.22,
    reportId: "REP-VAL-101",
    details: {
      conditionGrade: "Grade A+",
      repairCost: 0,
      location: "Bengaluru Hub",
    },
  },
  {
    id: "act-102",
    type: "marketplace",
    title: "Device Sold",
    deviceName: "MacBook Pro 14 M3 Pro",
    category: "Laptops",
    date: "Aug 04, 2026 • 03:15 PM",
    timestamp: Date.now() - 86400000 * 2,
    status: "Completed",
    value: 145000,
    description: "Verified sale on Eco Marketplace to an enterprise refurbisher. Escrow payment released.",
    co2Saved: 120.0,
    eWastePrevented: 1.6,
    reportId: "REP-MKT-102",
    details: {
      conditionGrade: "Grade A",
      buyerOrNgo: "GreenTech Refurbishers",
      location: "Mumbai",
    },
  },
  {
    id: "act-103",
    type: "repair",
    title: "Repair Booked",
    deviceName: "Sony WH-1000XM5 Headphones",
    category: "Audio",
    date: "Aug 02, 2026 • 11:20 AM",
    timestamp: Date.now() - 86400000 * 4,
    status: "Completed",
    value: 22000,
    description: "Ear pad & headband cushion replacement completed at GreenCare Certified Workshop.",
    co2Saved: 14.2,
    eWastePrevented: 0.25,
    reportId: "REP-RPR-103",
    details: {
      repairShop: "GreenCare Certified Workshop",
      repairCost: 1800,
      location: "Indiranagar, Bengaluru",
    },
  },
  {
    id: "act-104",
    type: "donation",
    title: "Donation Completed",
    deviceName: "iPad Air 4th Gen (64GB)",
    category: "Tablets",
    date: "Jul 28, 2026 • 02:00 PM",
    timestamp: Date.now() - 86400000 * 9,
    status: "Delivered",
    value: 32000,
    description: "Donated to Digital Empowerment Foundation for rural classroom education.",
    co2Saved: 68.0,
    eWastePrevented: 0.46,
    reportId: "REP-DON-104",
    details: {
      buyerOrNgo: "Digital Empowerment Foundation",
      location: "Delhi NCR",
    },
  },
  {
    id: "act-105",
    type: "marketplace",
    title: "Marketplace Purchase",
    deviceName: "Dell XPS 15 OLED",
    category: "Laptops",
    date: "Jul 22, 2026 • 05:40 PM",
    timestamp: Date.now() - 86400000 * 15,
    status: "Delivered",
    value: 98000,
    description: "Purchased certified pre-owned laptop with 1-Year RevalueIQ Warranty & carbon certificate.",
    co2Saved: 110.0,
    eWastePrevented: 1.8,
    reportId: "REP-MKT-105",
    details: {
      conditionGrade: "Grade A+",
      buyerOrNgo: "Verified Seller #892",
      location: "Hyderabad",
    },
  },
  {
    id: "act-107",
    type: "valuation",
    title: "AI Valuation Completed",
    deviceName: "Apple Watch Series 8",
    category: "Wearables",
    date: "Jul 10, 2026 • 04:30 PM",
    timestamp: Date.now() - 86400000 * 27,
    status: "Verified",
    value: 24500,
    description: "AI optical sensor scan verified screen condition Grade A with 92% battery health.",
    co2Saved: 12.8,
    eWastePrevented: 0.08,
    reportId: "REP-VAL-107",
    details: {
      conditionGrade: "Grade A",
      repairCost: 0,
    },
  },
  {
    id: "act-108",
    type: "repair",
    title: "Repair Booked",
    deviceName: "MacBook Air M1",
    category: "Laptops",
    date: "Jun 28, 2026 • 01:15 PM",
    timestamp: Date.now() - 86400000 * 39,
    status: "Completed",
    value: 65000,
    description: "Display glass panel re-bonding performed at iFix Precision Lab.",
    co2Saved: 89.0,
    eWastePrevented: 1.29,
    reportId: "REP-RPR-108",
    details: {
      repairShop: "iFix Precision Lab",
      repairCost: 4500,
      location: "Koramangala, Bengaluru",
    },
  },
];

export const MOCK_MONTHLY_ACTIVITY: ChartDataMonthly[] = [
  { month: "Mar", valuations: 4, repairs: 2, sales: 1, donations: 0 },
  { month: "Apr", valuations: 6, repairs: 3, sales: 2, donations: 1 },
  { month: "May", valuations: 8, repairs: 5, sales: 3, donations: 1 },
  { month: "Jun", valuations: 11, repairs: 6, sales: 3, donations: 2 },
  { month: "Jul", valuations: 15, repairs: 8, sales: 4, donations: 2 },
  { month: "Aug", valuations: 18, repairs: 10, sales: 5, donations: 3 },
];

export const MOCK_DEVICE_CATEGORIES: CategoryBreakdown[] = [
  { name: "Smartphones", value: 38, color: "#10b981", count: 8 },
  { name: "Laptops", value: 28, color: "#14b8a6", count: 5 },
  { name: "Audio", value: 16, color: "#06b6d4", count: 3 },
  { name: "Tablets", value: 12, color: "#3b82f6", count: 2 },
  { name: "Wearables", value: 6, color: "#8b5cf6", count: 1 },
];

export const MOCK_REVENUE_SAVINGS: RevenueSavings[] = [
  { month: "Mar", revenue: 22000, savings: 14500 },
  { month: "Apr", revenue: 45000, savings: 28000 },
  { month: "May", revenue: 78000, savings: 42000 },
  { month: "Jun", revenue: 110000, savings: 68000 },
  { month: "Jul", revenue: 135000, savings: 95000 },
  { month: "Aug", revenue: 145000, savings: 148500 },
];

export const MOCK_REPAIR_SAVINGS_BREAKDOWN: RepairSavingsBreakdown[] = [
  { category: "Smartphones", diy: 4500, authorizedShop: 12000, replacementCost: 45000 },
  { category: "Laptops", diy: 8500, authorizedShop: 24000, replacementCost: 95000 },
  { category: "Audio", diy: 1800, authorizedShop: 5500, replacementCost: 22000 },
  { category: "Tablets", diy: 3200, authorizedShop: 9800, replacementCost: 38000 },
];

export const MOCK_DONATION_IMPACT: DonationImpactData[] = [
  { month: "Mar", devicesDonated: 0, beneficiaries: 0 },
  { month: "Apr", devicesDonated: 1, beneficiaries: 12 },
  { month: "May", devicesDonated: 1, beneficiaries: 28 },
  { month: "Jun", devicesDonated: 2, beneficiaries: 45 },
  { month: "Jul", devicesDonated: 2, beneficiaries: 62 },
  { month: "Aug", devicesDonated: 3, beneficiaries: 85 },
];

export const MOCK_CARBON_REDUCTION: CarbonReductionData[] = [
  { month: "Mar", co2: 24.5, cumulativeCo2: 24.5 },
  { month: "Apr", co2: 48.2, cumulativeCo2: 72.7 },
  { month: "May", co2: 65.0, cumulativeCo2: 137.7 },
  { month: "Jun", co2: 82.3, cumulativeCo2: 220.0 },
  { month: "Jul", co2: 64.5, cumulativeCo2: 284.5 },
  { month: "Aug", co2: 58.0, cumulativeCo2: 342.5 },
];

export const MOCK_CIRCULAR_SCORE_METRICS = {
  overallScore: 94,
  ewasteDiversion: 98,
  deviceLongevity: 92,
  communityKarma: 89,
  refurbishRate: 96,
};

export const MOCK_REPORTS: ReportItem[] = [
  {
    id: "REP-VAL-2026",
    title: "AI Device Valuation Summary Report",
    category: "Valuation",
    date: "Aug 06, 2026",
    fileSize: "2.4 MB",
    format: "PDF",
    deviceCount: 14,
    description: "Complete AI appraisal audit trail containing condition grades, camera scan breakdown, resale pricing matrix, and functional test logs.",
  },
  {
    id: "REP-RPR-2026",
    title: "Certified Repair & Service History",
    category: "Repair",
    date: "Aug 02, 2026",
    fileSize: "1.8 MB",
    format: "PDF",
    deviceCount: 8,
    description: "Verification certificates for all 8 refurbished & repaired devices including component repair invoices and shop technician notes.",
  },
  {
    id: "REP-DON-2026",
    title: "Official CSR Carbon Offset & Donation Certificate",
    category: "Donation",
    date: "Jul 28, 2026",
    fileSize: "1.2 MB",
    format: "PDF",
    certificateId: "CSR-89241-CERT",
    description: "Tax-deductible donation voucher and carbon offset verification issued by Digital Empowerment Foundation.",
  },
  {
    id: "REP-ACT-2026",
    title: "Annual Personal Circular Economy Statement",
    category: "Activity",
    date: "Jul 01, 2026",
    fileSize: "4.1 MB",
    format: "PDF",
    description: "Comprehensive 2026 personal sustainability report detailing 342.5 kg CO₂ prevented, 44.8 kg e-waste diverted, and ₹1,48,500 saved.",
  },
];

export const MOCK_RECENT_DEVICES: RecentDeviceItem[] = [
  {
    id: "dev-1",
    deviceName: "iPhone 15 Pro (256GB)",
    category: "Smartphones",
    aiValue: 78500,
    recommendation: "Sell on Marketplace",
    status: "Verified",
    aiGrade: "Grade A+",
    lastUpdated: "Today",
    iconType: "smartphone",
  },
  {
    id: "dev-2",
    deviceName: "MacBook Pro 14 M3 Pro",
    category: "Laptops",
    aiValue: 145000,
    recommendation: "Sell on Marketplace",
    status: "Listed",
    aiGrade: "Grade A",
    lastUpdated: "2 days ago",
    iconType: "laptop",
  },
  {
    id: "dev-3",
    deviceName: "Sony WH-1000XM5 Headphones",
    category: "Audio",
    aiValue: 22000,
    recommendation: "Book Repair",
    status: "Repaired",
    aiGrade: "Grade B+",
    lastUpdated: "4 days ago",
    iconType: "audio",
  },
  {
    id: "dev-4",
    deviceName: "iPad Air 4th Gen (64GB)",
    category: "Tablets",
    aiValue: 32000,
    recommendation: "Donate to NGO",
    status: "Donated",
    aiGrade: "Grade B",
    lastUpdated: "1 week ago",
    iconType: "tablet",
  },
];

export const MOCK_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "ach-1",
    title: "First Valuation",
    category: "Valuation",
    description: "Completed your first AI optical device condition scan.",
    badgeCode: "FIRST_VAL",
    progress: 100,
    unlocked: true,
    unlockedDate: "Mar 12, 2026",
    points: 100,
    iconName: "Sparkles",
    colorGradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "ach-2",
    title: "Eco Hero",
    category: "Impact",
    description: "Prevented over 100 kg of carbon emissions through device longevity.",
    badgeCode: "ECO_HERO",
    progress: 100,
    unlocked: true,
    unlockedDate: "May 20, 2026",
    points: 500,
    iconName: "Leaf",
    colorGradient: "from-teal-500 to-emerald-600",
  },
  {
    id: "ach-3",
    title: "Repair Champion",
    category: "Repair",
    description: "Successfully repaired 5+ devices instead of buying new ones.",
    badgeCode: "RPR_CHAMP",
    progress: 100,
    unlocked: true,
    unlockedDate: "Jun 15, 2026",
    points: 350,
    iconName: "Wrench",
    colorGradient: "from-blue-500 to-teal-600",
  },
  {
    id: "ach-4",
    title: "Donation Supporter",
    category: "Donation",
    description: "Donated pre-owned electronics to verified non-profit partners.",
    badgeCode: "DON_SUPP",
    progress: 100,
    unlocked: true,
    unlockedDate: "Jul 28, 2026",
    points: 400,
    iconName: "Heart",
    colorGradient: "from-pink-500 to-rose-600",
  },
  {
    id: "ach-5",
    title: "Marketplace Seller",
    category: "Marketplace",
    description: "Listed and successfully sold circular pre-owned tech.",
    badgeCode: "MKT_SELL",
    progress: 100,
    unlocked: true,
    unlockedDate: "Aug 04, 2026",
    points: 250,
    iconName: "ShoppingBag",
    colorGradient: "from-green-500 to-emerald-700",
  },
  {
    id: "ach-6",
    title: "Eco Diagnostics Expert",
    category: "Repair",
    description: "Completed 5+ device repair feasibility assessments.",
    badgeCode: "REPAIR_EXP",
    progress: 100,
    unlocked: true,
    unlockedDate: "Jul 18, 2026",
    points: 300,
    iconName: "Wrench",
    colorGradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "ach-7",
    title: "Zero Waste Master",
    category: "Impact",
    description: "Achieve a personal Circular Score of 90+.",
    badgeCode: "ZERO_WASTE",
    progress: 94,
    unlocked: true,
    unlockedDate: "Aug 01, 2026",
    points: 750,
    iconName: "ShieldCheck",
    colorGradient: "from-emerald-600 to-cyan-600",
  },
  {
    id: "ach-8",
    title: "Carbon Neutral Pioneer",
    category: "Impact",
    description: "Reach 500 kg total CO₂ offset through circular activities.",
    badgeCode: "CARBON_PIONEER",
    progress: 68,
    unlocked: false,
    points: 1000,
    iconName: "Globe",
    colorGradient: "from-cyan-600 to-blue-700",
  },
];
