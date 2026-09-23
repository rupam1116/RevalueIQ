export type DeviceCategory = "Smartphone" | "Laptop" | "Tablet" | "Smartwatch" | "Audio" | "Gaming Console" | "Other";

export type CosmeticCondition = "Pristine (Like New)" | "Minor Scratches" | "Visible Dents / Wear" | "Cracked Screen / Glass" | "Heavy Damage";

export type FunctionalStatus = "Fully Functional" | "Battery Degraded" | "Camera / Sensor Issue" | "Port / Charging Issue" | "Display Fault" | "Non-Functional / Dead" | "Not Detected / Unknown";

export interface UploadedImage {
  id: string;
  url: string;
  name: string;
  size: string;
  angle: "Front" | "Back" | "Sides / Frame" | "Screen / Display" | "Ports / Serial";
  timestamp?: string;
  file?: File;
}

export interface DeviceDetails {
  category: DeviceCategory;
  brand: string;
  model: string;
  storage: string;
  ram: string;
  purchaseYear: string;
  condition: CosmeticCondition;
  functionalStatus: FunctionalStatus;
  hasOriginalBox: boolean;
  hasCharger: boolean;
  additionalNotes: string;
  aiDetectedFields?: Record<string, boolean>;
}

export interface MaterialBreakdown {
  goldMg: number;
  silverMg: number;
  copperGrams: number;
  cobaltGrams: number;
  aluminumGrams: number;
}

export interface AIInsightItem {
  id: string;
  category: "Cosmetic" | "Hardware" | "Market" | "Longevity";
  title: string;
  description: string;
  confidence: number;
  type: "positive" | "warning" | "neutral" | "info";
}

export interface RepairCostItem {
  component: string;
  estimatedCost: number;
  urgency: "Immediate" | "Optional" | "Preventative";
  valueAddition: number;
}

export interface ValuationReport {
  id: string;
  deviceName: string;
  brand: string;
  category: DeviceCategory;
  model: string;
  storage: string;
  imageUrls: string[];
  primaryImage: string;
  
  // Financial Metrics
  estimatedValue?: number;
  estimatedValueMin: number;
  estimatedValueMax: number;
  recommendedListingPrice: number;
  tradeInValue: number;
  originalMSRP: number;
  valueRetentionPercent: number;
  priceTrend: "Upward" | "Stable" | "Declining";
  priceTrendPercent: number;

  // Circular & Environmental
  circularScore: number; // 0 - 100
  ecoGrade: "A+" | "A" | "B" | "C" | "D";
  co2OffsetKg: number;
  eWasteDivertedKg: number;
  materialsRecovered: MaterialBreakdown;

  // Repair
  repairCost: number;
  repairFeasibilityScore: number; // 0 - 100
  repairRecommendation: "Resell Directly" | "Minor Repair & Sell" | "Keep / Reuse" | "Recycle / Donate";
  repairItems: RepairCostItem[];

  // AI & Diagnostics
  conditionGrade: string;
  aiGrade?: string;
  aiInsights: AIInsightItem[];
  confidenceScore: number; // 0 - 100
  scannedAt: string;
  specsMatchIndex: number;
  marketDemandLiquidity: "Ultra High" | "High" | "Moderate" | "Low";

  // Phase 3.5 Intelligent Recommendations
  marketRecommendation?: "SELL" | "REPAIR" | "KEEP" | "REPLACE" | string;
  circularRecommendation?: string;
  aiReasoning?: string;
  damageDescription?: string;
}

export interface ValuationHistoryItem {
  id: string;
  deviceName: string;
  category: DeviceCategory;
  thumbnail: string;
  date: string;
  condition: string;
  estimatedValue: number;
  circularScore: number;
  status: "Completed" | "Pending Action" | "Listed" | "Repaired" | "Donated";
}

export interface AIChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}
