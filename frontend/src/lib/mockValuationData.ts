import {
  ValuationReport,
  ValuationHistoryItem,
  DeviceDetails,
  AIChatMessage,
} from "@/types/valuation";

export interface DemoPreset {
  id: string;
  name: string;
  brand: string;
  category: "Smartphone" | "Laptop" | "Tablet" | "Smartwatch" | "Audio" | "Gaming Console";
  storage: string;
  ram: string;
  images: { url: string; angle: "Front" | "Back" | "Sides / Frame" | "Screen / Display" | "Ports / Serial" }[];
  details: DeviceDetails;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "preset-iphone-15-pro",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Smartphone",
    storage: "256GB",
    ram: "8GB",
    images: [
      {
        url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
        angle: "Front",
      },
      {
        url: "https://images.unsplash.com/photo-1695048133021-dbe293f0b2f0?q=80&w=800&auto=format&fit=crop",
        angle: "Back",
      },
    ],
    details: {
      category: "Smartphone",
      brand: "Apple",
      model: "iPhone 15 Pro Max",
      storage: "256GB",
      ram: "8GB",
      purchaseYear: "2023",
      condition: "Minor Scratches",
      functionalStatus: "Fully Functional",
      hasOriginalBox: true,
      hasCharger: true,
      additionalNotes: "Minor micro-scratches on side titanium frame. Screen pristine with protector.",
    },
  },
  {
    id: "preset-macbook-pro",
    name: "MacBook Pro 16\" M2 Max",
    brand: "Apple",
    category: "Laptop",
    storage: "1TB SSD",
    ram: "32GB",
    images: [
      {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
        angle: "Front",
      },
      {
        url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop",
        angle: "Sides / Frame",
      },
    ],
    details: {
      category: "Laptop",
      brand: "Apple",
      model: "MacBook Pro 16-inch M2 Max",
      storage: "1TB SSD",
      ram: "32GB",
      purchaseYear: "2023",
      condition: "Pristine (Like New)",
      functionalStatus: "Fully Functional",
      hasOriginalBox: true,
      hasCharger: true,
      additionalNotes: "Battery count 48 cycles. Flawless space black metal casing.",
    },
  },
  {
    id: "preset-galaxy-s24",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphone",
    storage: "512GB",
    ram: "12GB",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop",
        angle: "Front",
      },
    ],
    details: {
      category: "Smartphone",
      brand: "Samsung",
      model: "Galaxy S24 Ultra",
      storage: "512GB",
      ram: "12GB",
      purchaseYear: "2024",
      condition: "Pristine (Like New)",
      functionalStatus: "Fully Functional",
      hasOriginalBox: true,
      hasCharger: true,
      additionalNotes: "Includes original S-Pen. Clean IMEI and factory unlocked.",
    },
  },
  {
    id: "preset-sony-headphones",
    name: "Sony WH-1000XM5 Wireless",
    brand: "Sony",
    category: "Audio",
    storage: "N/A",
    ram: "N/A",
    images: [
      {
        url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
        angle: "Front",
      },
    ],
    details: {
      category: "Audio",
      brand: "Sony",
      model: "WH-1000XM5 ANC Headphones",
      storage: "N/A",
      ram: "N/A",
      purchaseYear: "2023",
      condition: "Minor Scratches",
      functionalStatus: "Battery Degraded",
      hasOriginalBox: false,
      hasCharger: true,
      additionalNotes: "Leather ear cushions slightly worn. Active Noise Cancellation perfect.",
    },
  },
];

export const INITIAL_VALUATION_HISTORY: ValuationHistoryItem[] = [
  {
    id: "val-1092",
    deviceName: "iPhone 14 Pro 128GB - Deep Purple",
    category: "Smartphone",
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=300&auto=format&fit=crop",
    date: "2026-08-01",
    condition: "Pristine (Like New)",
    estimatedValue: 68500,
    circularScore: 94,
    status: "Completed",
  },
  {
    id: "val-1088",
    deviceName: "MacBook Air M1 256GB - Space Gray",
    category: "Laptop",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300&auto=format&fit=crop",
    date: "2026-07-25",
    condition: "Minor Scratches",
    estimatedValue: 48000,
    circularScore: 88,
    status: "Listed",
  },
  {
    id: "val-1074",
    deviceName: "iPad Pro 11-inch M2 256GB WiFi",
    category: "Tablet",
    thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=300&auto=format&fit=crop",
    date: "2026-07-14",
    condition: "Visible Dents / Wear",
    estimatedValue: 39500,
    circularScore: 82,
    status: "Repaired",
  },
  {
    id: "val-1061",
    deviceName: "Dell XPS 15 9520 Core i7 16GB",
    category: "Laptop",
    thumbnail: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=300&auto=format&fit=crop",
    date: "2026-06-29",
    condition: "Cracked Screen / Glass",
    estimatedValue: 52000,
    circularScore: 76,
    status: "Pending Action",
  },
  {
    id: "val-1043",
    deviceName: "Apple Watch Series 8 45mm GPS",
    category: "Smartwatch",
    thumbnail: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=300&auto=format&fit=crop",
    date: "2026-06-10",
    condition: "Pristine (Like New)",
    estimatedValue: 21500,
    circularScore: 91,
    status: "Donated",
  },
];

export function generateMockValuationReport(
  details: DeviceDetails,
  customImages: string[] = []
): ValuationReport {
  const isApple = details.brand.toLowerCase().includes("apple");
  const isLaptop = details.category === "Laptop";

  let baseVal = 45000;
  if (isLaptop) baseVal = 75000;
  if (details.model.includes("Pro Max") || details.model.includes("Ultra") || details.model.includes("M2 Max")) {
    baseVal += 35000;
  }

  // Deductions based on condition
  let conditionMultiplier = 0.95;
  if (details.condition === "Pristine (Like New)") conditionMultiplier = 1.0;
  if (details.condition === "Minor Scratches") conditionMultiplier = 0.88;
  if (details.condition === "Visible Dents / Wear") conditionMultiplier = 0.75;
  if (details.condition === "Cracked Screen / Glass") conditionMultiplier = 0.58;
  if (details.condition === "Heavy Damage") conditionMultiplier = 0.35;

  const estimatedValue = Math.round((baseVal * conditionMultiplier) / 500) * 500;
  const estimatedValueMin = Math.round(estimatedValue * 0.92 / 500) * 500;
  const estimatedValueMax = Math.round(estimatedValue * 1.08 / 500) * 500;
  const recommendedListingPrice = Math.round(estimatedValue * 1.04 / 500) * 500;
  const tradeInValue = Math.round(estimatedValue * 0.85 / 500) * 500;
  const originalMSRP = Math.round(baseVal * 1.4 / 1000) * 1000;
  const valueRetentionPercent = Math.round((estimatedValue / originalMSRP) * 100);

  // Circular Score calculation
  let circularScore = 86;
  if (details.condition === "Pristine (Like New)") circularScore += 8;
  if (details.functionalStatus === "Fully Functional") circularScore += 4;
  if (details.hasOriginalBox) circularScore += 2;
  if (circularScore > 98) circularScore = 98;

  let ecoGrade: "A+" | "A" | "B" | "C" | "D" = "A";
  if (circularScore >= 92) ecoGrade = "A+";
  else if (circularScore >= 84) ecoGrade = "A";
  else if (circularScore >= 75) ecoGrade = "B";
  else if (circularScore >= 60) ecoGrade = "C";
  else ecoGrade = "D";

  const primaryImage =
    customImages.length > 0
      ? customImages[0]
      : isLaptop
      ? "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop";

  return {
    id: `VAL-${Math.floor(100000 + Math.random() * 900000)}`,
    deviceName: `${details.brand} ${details.model} ${details.storage !== "N/A" ? details.storage : ""}`.trim(),
    brand: details.brand,
    category: details.category,
    model: details.model,
    storage: details.storage,
    imageUrls: customImages.length > 0 ? customImages : [primaryImage],
    primaryImage,

    estimatedValueMin,
    estimatedValueMax,
    recommendedListingPrice,
    tradeInValue,
    originalMSRP,
    valueRetentionPercent,
    priceTrend: "Upward",
    priceTrendPercent: 4.8,

    circularScore,
    ecoGrade,
    co2OffsetKg: isLaptop ? 142 : 48,
    eWasteDivertedKg: isLaptop ? 2.1 : 0.24,
    materialsRecovered: {
      goldMg: isLaptop ? 120 : 35,
      silverMg: isLaptop ? 450 : 180,
      copperGrams: isLaptop ? 85 : 22,
      cobaltGrams: isLaptop ? 140 : 45,
      aluminumGrams: isLaptop ? 850 : 120,
    },

    repairCost: details.condition === "Cracked Screen / Glass" ? 7500 : 2200,
    repairFeasibilityScore: 92,
    repairRecommendation:
      details.condition === "Cracked Screen / Glass"
        ? "Minor Repair & Sell"
        : "Resell Directly",
    repairItems: [
      {
        component: isLaptop ? "Thermal Paste & Dust Cleanout" : "Battery Calibration",
        estimatedCost: 1200,
        urgency: "Preventative",
        valueAddition: 3500,
      },
      {
        component: "Cosmetic Buffing & Oleophobic Coating",
        estimatedCost: 800,
        urgency: "Optional",
        valueAddition: 2000,
      },
    ],

    conditionGrade:
      details.condition === "Pristine (Like New)"
        ? "Grade A+ Pristine"
        : details.condition === "Minor Scratches"
        ? "Grade A Excellent"
        : "Grade B Good",
    aiInsights: [
      {
        id: "ins-1",
        category: "Cosmetic",
        title: "Surface Topology Verification",
        description: "97.4% glass and enclosure purity confirmed. Zero deep micro-fractures detected under computer vision scan.",
        confidence: 98.2,
        type: "positive",
      },
      {
        id: "ins-2",
        category: "Hardware",
        title: "Model & Spec Benchmark",
        description: `Verified authentic ${details.brand} serial profile with ${details.storage} NAND flash configuration.`,
        confidence: 99.1,
        type: "positive",
      },
      {
        id: "ins-3",
        category: "Market",
        title: "Resale Liquidity Index",
        description: "High demand across Indian refurbished marketplace. Projected sell time: 48 - 72 hours.",
        confidence: 94.5,
        type: "info",
      },
      {
        id: "ins-4",
        category: "Longevity",
        title: "Useful Lifecycle Remaining",
        description: "Estimated 3.5 additional operating years before hardware deprecation.",
        confidence: 91.0,
        type: "neutral",
      },
    ],
    confidenceScore: 97.8,
    scannedAt: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    specsMatchIndex: 99.4,
    marketDemandLiquidity: "Ultra High",
  };
}

export const COPILOT_INITIAL_MESSAGES: AIChatMessage[] = [
  {
    id: "msg-welcome",
    sender: "copilot",
    text: "Hello! I'm your RevalueIQ Valuation Copilot. I can answer questions about your device's market valuation, repair ROI, circular economy score, or how to maximize resale value.",
    timestamp: "Just now",
    quickActions: [
      { label: "Should I repair or sell as-is?", action: "repair_vs_sell" },
      { label: "How was my Circular Score calculated?", action: "score_breakdown" },
      { label: "What's the best price to list at?", action: "listing_price" },
    ],
  },
];
