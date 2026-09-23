export type DeviceCategory =
  | "Smartphone"
  | "Laptop"
  | "Tablet"
  | "Smartwatch"
  | "Audio/Gaming"
  | "Monitor"
  | "Camera"
  | "TV"
  | "Printer"
  | "Other"
  | string;

export interface UploadedRepairImage {
  id: string;
  url: string;
  name?: string;
  size?: string;
  damageTag?: string;
  customDamageTag?: string;
  timestamp?: string;
  tag?: string;
}

export interface RepairDeviceSelection {
  deviceId?: string;
  valuationId?: string;
  category: DeviceCategory;
  brand: string;
  model: string;
  series?: string;
  year?: string | number;
  color?: string;
  ram?: string;
  storage?: string;
  condition?: string;
  functionalStatus?: string;
}

export interface RepairProblemForm {
  symptomCategory?: string;
  mainIssue?: string;
  issueHeadline?: string;
  description?: string;
  userDescription?: string;
  detailedDescription?: string;
  severityLevel?: "Low" | "Medium" | "High" | "Critical";
  severity?: string;
  powersOn?: boolean;
  liquidExposure?: boolean;
  previousRepairs?: boolean;
  symptoms?: string[];
  additionalNotes?: string;
}


export interface RequiredPartItem {
  id: string;
  name: string;
  oemPrice: number;
  aftermarketPrice: number;
  availability: "In Stock" | "Low Stock" | "Special Order";
  sourcingDifficulty: "Easy" | "Moderate" | "Hard";
  recommendedType: "OEM" | "Aftermarket";
  linkText: string;
}

export interface NearbyRepairShop {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  distance: string;
  estPriceRange: string;
  address: string;
  phone: string;
  turnaroundTime: string;
  verified: boolean;
  badge?: string;
}

export interface RepairReport {
  id: string;
  deviceName: string;
  category: DeviceCategory;
  date: string;
  primaryImage: string;
  images: string[];
  
  problemIdentified: {
    title: string;
    category: string;
    summary: string;
    detailedAnalysis: string;
    rootCause: string;
    affectedComponents: string[];
  };

  severity: {
    level: "Low" | "Medium" | "High" | "Critical";
    score: number; // out of 100
    color: string;
    riskNote: string;
  };

  estimatedRepairCost: {
    totalMin: number;
    totalMax: number;
    oemPartsCost: number;
    thirdPartyPartsCost: number;
    laborCostEst: number;
    diySavings: number;
  };

  requiredParts: RequiredPartItem[];

  estimatedRepairTime: string;

  repairDifficulty: {
    level: "Easy" | "Moderate" | "Hard" | "Expert";
    score: number; // 1-10
    skillsNeeded: string[];
    riskFactor: string;
  };

  diyRecommendation: {
    feasibility: "High" | "Medium" | "Low" | "Not Recommended";
    pros: string[];
    cons: string[];
    stepsOverview: string[];
    toolsRequired: string[];
    guideUrl?: string;
  };

  professionalRepairRecommendation: {
    recommended: boolean;
    reason: string;
    estTurnaround: string;
    warrantyDays: number;
  };

  nearbyRepairShops: NearbyRepairShop[];

  environmentalImpact: {
    eWastePreventedKg: number;
    co2SavedKg: number;
    repairabilityScore: number; // 1-10
    ecoBadge: string;
  };

  aiRecommendation: {
    action: "DIY Repair" | "Professional Repair" | "Replace & Sell";
    confidence: number; // percentage
    headline: string;
    rationale: string;
  };
  diySteps?: Array<{ stepNumber: number; title: string; instruction: string; warning?: string }>;
  safetyWarnings?: string[];
  reasoning?: string;
  advisoryCode?: string;
}


export interface RepairHistoryItem {
  id: string;
  advisoryCode?: string;
  deviceName: string;
  category: DeviceCategory;
  thumbnail?: string;
  date?: string;
  problemTitle?: string;
  severity?: "Low" | "Medium" | "High" | "Critical";
  estimatedCost?: number;
  recommendedAction?: "DIY Repair" | "Professional Repair" | "Replace & Sell";
  status?: "Completed" | "Pending Action" | "Booked" | "Saved";
  diagnosisTitle?: string;
  repairabilityScore?: number;
  createdAt?: string;
}

export interface DemoRepairPreset {
  id: string;
  name: string;
  subtitle: string;
  device: RepairDeviceSelection;
  problem: RepairProblemForm;
  images?: { url: string; tag?: any }[];
  sampleImages?: UploadedRepairImage[];
}
