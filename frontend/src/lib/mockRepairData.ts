import {
  RepairReport,
  RepairHistoryItem,
  DemoRepairPreset,
  RepairDeviceSelection,
  RepairProblemForm,
  DeviceCategory,
} from "@/types/repair";

export const DEMO_REPAIR_PRESETS: DemoRepairPreset[] = [
  {
    id: "preset-screen-battery",
    name: "iPhone 14 Pro - Cracked Display & Battery Drain",
    subtitle: "OLED digitizer spiderweb crack with 74% battery health degradation",
    device: {
      category: "Smartphone",
      brand: "Apple",
      model: "iPhone 14 Pro",
      series: "Pro Series",
      year: "2022",
    },
    problem: {
      symptomCategory: "Screen & Battery",
      mainIssue: "Cracked Screen Glass & Battery Drains Rapidly",
      issueHeadline: "Cracked Screen Glass & Battery Drains Rapidly",
      description: "Glass front panel shattered near top receiver speaker after a drop on asphalt. Touch functionality works intermittently. Battery drops from 100% to 20% in 3 hours.",
      userDescription: "Glass front panel shattered near top receiver speaker after a drop on asphalt. Touch functionality works intermittently. Battery drops from 100% to 20% in 3 hours.",
      detailedDescription: "Glass front panel shattered near top receiver speaker after a drop on asphalt. Touch functionality works intermittently. Battery drops from 100% to 20% in 3 hours.",
      severityLevel: "High",
      severity: "High",
      powersOn: true,
      liquidExposure: false,
      previousRepairs: false,
      symptoms: ["Cracked Screen / Glass", "Battery Draining Fast"],
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80",
        tag: "Cracked Screen",
      },
      {
        url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80",
        tag: "Battery Swell",
      },
    ],
  },
  {
    id: "preset-macbook-liquid",
    name: "MacBook Pro M1 - Liquid Spill & Keyboard Sticking",
    subtitle: "Coffee exposure near trackpad and spacebar with boot delays",
    device: {
      category: "Laptop",
      brand: "Apple",
      model: "MacBook Pro 14 (M1 Pro)",
      series: "Pro Laptop",
      year: "2021",
    },
    problem: {
      symptomCategory: "Motherboard & Liquid",
      mainIssue: "Liquid Contamination & Key Mechanism Sticky",
      issueHeadline: "Liquid Contamination & Key Mechanism Sticky",
      description: "Small coffee spill over spacebar and lower palm rest. Power button requires hard press. System fans spin up high during light tasks.",
      userDescription: "Small coffee spill over spacebar and lower palm rest. Power button requires hard press. System fans spin up high during light tasks.",
      detailedDescription: "Small coffee spill over spacebar and lower palm rest. Power button requires hard press. System fans spin up high during light tasks.",
      severityLevel: "Critical",
      severity: "Critical",
      powersOn: true,
      liquidExposure: true,
      previousRepairs: false,
      symptoms: ["Liquid Contact / Corrosion", "Stuck Power / Volume Button"],
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        tag: "Liquid Damage",
      },
    ],
  },
  {
    id: "preset-samsung-charging",
    name: "Samsung Galaxy S23 Ultra - Loose USB-C Port",
    subtitle: "Charging cable drops connection; moisture warning triggered",
    device: {
      category: "Smartphone",
      brand: "Samsung",
      model: "Galaxy S23 Ultra",
      series: "Galaxy S",
      year: "2023",
    },
    problem: {
      symptomCategory: "Charging & Power",
      mainIssue: "USB-C Connector Wear / Intermittent Fast Charge",
      issueHeadline: "USB-C Connector Wear / Intermittent Fast Charge",
      description: "Cable must be wiggled to trigger charging. Wireless charging works fine. False positive moisture sensor alert occasionally pops up.",
      userDescription: "Cable must be wiggled to trigger charging. Wireless charging works fine. False positive moisture sensor alert occasionally pops up.",
      detailedDescription: "Cable must be wiggled to trigger charging. Wireless charging works fine. False positive moisture sensor alert occasionally pops up.",
      severityLevel: "Medium",
      severity: "Medium",
      powersOn: true,
      liquidExposure: false,
      previousRepairs: true,
      symptoms: ["Loose Charging Port", "Not Charging"],
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
        tag: "Port Corrosion",
      },
    ],
  },
  {
    id: "preset-ipad-battery",
    name: "iPad Air (5th Gen) - Swollen Battery & Back Housing Bend",
    subtitle: "Glass lifting along left edge due to lithium pouch expansion",
    device: {
      category: "Tablet",
      brand: "Apple",
      model: "iPad Air 5th Gen",
      series: "Air Series",
      year: "2022",
    },
    problem: {
      symptomCategory: "Battery & Structural",
      mainIssue: "Expanded Li-Ion Battery Cell",
      issueHeadline: "Expanded Li-Ion Battery Cell",
      description: "Display glass panel is separating from aluminum frame. Screen shows light bleed along left margin. Unit gets hot when plugged in.",
      userDescription: "Display glass panel is separating from aluminum frame. Screen shows light bleed along left margin. Unit gets hot when plugged in.",
      detailedDescription: "Display glass panel is separating from aluminum frame. Screen shows light bleed along left margin. Unit gets hot when plugged in.",
      severityLevel: "Critical",
      severity: "Critical",
      powersOn: true,
      liquidExposure: false,
      previousRepairs: false,
      symptoms: ["Swollen Battery / Lifting Display", "Bent Metal Chassis"],
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
        tag: "Battery Swell",
      },
    ],
  },
];

export const INITIAL_REPAIR_HISTORY: RepairHistoryItem[] = [
  {
    id: "REP-98214",
    deviceName: "iPhone 14 Pro",
    category: "Smartphone",
    thumbnail: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=400&q=80",
    date: "2026-08-01",
    problemTitle: "Cracked OLED Screen Glass",
    severity: "High",
    estimatedCost: 115,
    recommendedAction: "DIY Repair",
    status: "Completed",
  },
  {
    id: "REP-87410",
    deviceName: "MacBook Pro 14 (M1 Pro)",
    category: "Laptop",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    date: "2026-07-28",
    problemTitle: "Liquid Exposure Logic Board",
    severity: "Critical",
    estimatedCost: 280,
    recommendedAction: "Professional Repair",
    status: "Booked",
  },
  {
    id: "REP-76129",
    deviceName: "Samsung Galaxy S22 Ultra",
    category: "Smartphone",
    thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80",
    date: "2026-07-15",
    problemTitle: "Degraded Battery Cell (71% Health)",
    severity: "Medium",
    estimatedCost: 45,
    recommendedAction: "DIY Repair",
    status: "Completed",
  },
  {
    id: "REP-61903",
    deviceName: "Sony WH-1000XM4",
    category: "Audio/Gaming",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    date: "2026-06-30",
    problemTitle: "Broken Hinge Clamp & Cushion",
    severity: "Low",
    estimatedCost: 22,
    recommendedAction: "DIY Repair",
    status: "Completed",
  },
];

export function generateMockRepairReport(
  device: RepairDeviceSelection,
  problem: RepairProblemForm,
  uploadedImages: any[]
): RepairReport {
  const isLaptop = device.category === "Laptop";
  const isTablet = device.category === "Tablet";
  const isHighSeverity = problem.severityLevel === "High" || problem.severityLevel === "Critical";
  const hasLiquid = problem.liquidExposure;

  const deviceName = `${device.brand} ${device.model}`.trim() || "Generic Device";

  // Dynamic pricing calculation
  let oemParts = isLaptop ? 180 : isTablet ? 110 : 75;
  let thirdPartyParts = Math.round(oemParts * 0.58);
  let laborCost = isLaptop ? 95 : 60;

  if (isHighSeverity) {
    oemParts += 60;
    thirdPartyParts += 35;
    laborCost += 30;
  }
  if (hasLiquid) {
    laborCost += 40;
  }

  const totalMin = thirdPartyParts + Math.round(laborCost * 0.7);
  const totalMax = oemParts + laborCost;

  const primaryImage =
    uploadedImages.length > 0
      ? uploadedImages[0]
      : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80";

  return {
    id: `REP-${Math.floor(10000 + Math.random() * 90000)}`,
    deviceName,
    category: device.category,
    date: new Date().toISOString().split("T")[0],
    primaryImage,
    images: uploadedImages.length > 0 ? uploadedImages : [primaryImage],

    problemIdentified: {
      title: problem.mainIssue || "Hardware Component Degradation",
      category: problem.symptomCategory || "General Hardware",
      summary: `AI diagnostic vision scan identified structural or electronic malfunction in ${deviceName}. ${problem.description || "Component shows symptoms consistent with standard mechanical stress or component wear."}`,
      detailedAnalysis: `Neural multi-layer inspection verified pattern anomalies. Primary failure point detected in key structural sub-assemblies. Voltage levels and sensor logs indicate non-linear signal variations. ${hasLiquid ? "Sub-surface corrosion markers detected near power distribution lines." : "Frame integrity remains intact."}`,
      rootCause: hasLiquid
        ? "Corrosive liquid oxidation short-circuiting trace buses on logic assembly"
        : isHighSeverity
        ? "Micro-fracture propagation across display digitizer glass matrix"
        : "Chemical degradation of lithium polymer electrolyte & contact mechanical fatigue",
      affectedComponents: [
        "Primary Display / Touch Digitizer",
        "Internal Lithium Battery Cell",
        "Charging Assembly Flex Cable",
        hasLiquid ? "Liquid Damage Indicator (LDI) Sensors" : "Structural Frame Gasket",
      ],
    },

    severity: {
      level: problem.severityLevel || "Medium",
      score: problem.severityLevel === "Critical" ? 92 : problem.severityLevel === "High" ? 78 : problem.severityLevel === "Medium" ? 54 : 30,
      color: problem.severityLevel === "Critical" ? "#ef4444" : problem.severityLevel === "High" ? "#f97316" : problem.severityLevel === "Medium" ? "#eab308" : "#10b981",
      riskNote: isHighSeverity
        ? "Immediate repair advised to prevent thermal runaway or cascade hardware failure."
        : "Standard maintenance required. Safe to use with minor performance degradation.",
    },

    estimatedRepairCost: {
      totalMin,
      totalMax,
      oemPartsCost: oemParts,
      thirdPartyPartsCost: thirdPartyParts,
      laborCostEst: laborCost,
      diySavings: Math.round(laborCost + (oemParts - thirdPartyParts)),
    },

    requiredParts: [
      {
        id: "part-1",
        name: `${device.model} OEM Front Screen Assembly`,
        oemPrice: oemParts,
        aftermarketPrice: thirdPartyParts,
        availability: "In Stock",
        sourcingDifficulty: "Easy",
        recommendedType: "OEM",
        linkText: "View Genuine Parts Depot",
      },
      {
        id: "part-2",
        name: `${device.model} High-Capacity Li-Ion Battery`,
        oemPrice: 45,
        aftermarketPrice: 25,
        availability: "In Stock",
        sourcingDifficulty: "Easy",
        recommendedType: "Aftermarket",
        linkText: "View Certified Battery Supplier",
      },
      {
        id: "part-3",
        name: "Precision Adhesive Waterproof Seal Kit",
        oemPrice: 12,
        aftermarketPrice: 6,
        availability: "In Stock",
        sourcingDifficulty: "Easy",
        recommendedType: "OEM",
        linkText: "View Gasket Bundles",
      },
    ],

    estimatedRepairTime: isLaptop ? "1.5 - 2.5 Hours" : isTablet ? "1 - 2 Hours" : "45 - 90 Minutes",

    repairDifficulty: {
      level: hasLiquid || isLaptop ? "Hard" : isHighSeverity ? "Moderate" : "Easy",
      score: hasLiquid ? 8.5 : isLaptop ? 7.2 : isHighSeverity ? 5.5 : 3.2,
      skillsNeeded: [
        "Precision Prying & Heat Gun Application",
        "Tiny Flex Cable Disconnection",
        "Waterproof Seal Re-application",
        "Torx / Pentalobe Screwdriver Handling",
      ],
      riskFactor: hasLiquid
        ? "High Risk: Liquid damage requires ultrasonic board cleaning before power supply testing."
        : "Moderate Risk: Glass shards require safety goggles & suction tools.",
    },

    diyRecommendation: {
      feasibility: hasLiquid ? "Not Recommended" : isLaptop ? "Medium" : "High",
      pros: [
        `Save up to $${Math.round(laborCost + 40)} in technician labor costs`,
        "Learn modular repair skills with step-by-step schematics",
        "Keep your device in your own hands (zero privacy/data exposure)",
      ],
      cons: [
        "Requires specialized opening toolkit (iOpener / Suction Pliers)",
        "Voiding official manufacturer warranty if still under contract",
        "Risk of damaging delicate ribbon flex connectors",
      ],
      stepsOverview: [
        "1. Power off device completely and discharge battery below 25%.",
        "2. Apply uniform heat along display edges to soften OEM adhesive seal.",
        "3. Lift glass panel with suction clamp and insert opening picks.",
        "4. Unscrew internal shielding bracket and disconnect battery flex cable first.",
        "5. Swap defective component, apply new adhesive gasket, and reassemble.",
      ],
      toolsRequired: [
        "Precision iFixit Driver Kit",
        "Heat Gun / iOpener Pad",
        "Heavy Duty Suction Clamp",
        "Spudger & Plastic Opening Picks",
        "ESD Safe Tweezers",
      ],
      guideUrl: "https://e-reuse.org/guides",
    },

    professionalRepairRecommendation: {
      recommended: hasLiquid || isLaptop || problem.severityLevel === "Critical",
      reason: hasLiquid
        ? "Liquid contamination requires diagnostic multimeter testing & ultrasonic chemical bath."
        : "Professional technician warranty guarantees water resistance seal and display calibration.",
      estTurnaround: "Same-Day Service (2-4 Hours)",
      warrantyDays: 90,
    },

    nearbyRepairShops: [
      {
        id: "shop-1",
        name: "RevalueIQ Certified Express Labs",
        rating: 4.9,
        reviewsCount: 342,
        distance: "0.8 miles away",
        estPriceRange: `$${totalMin} - $${totalMax}`,
        address: "142 Innovation Way, Tech District",
        phone: "(555) 234-8901",
        turnaroundTime: "45 min express turnaround",
        verified: true,
        badge: "Top Rated Partner",
      },
      {
        id: "shop-2",
        name: "iFix Pro Diagnostic Center",
        rating: 4.7,
        reviewsCount: 189,
        distance: "1.4 miles away",
        estPriceRange: `$${totalMin - 10} - $${totalMax - 15}`,
        address: "88 Main Street, Suite 102",
        phone: "(555) 876-5432",
        turnaroundTime: "Same day pickup",
        verified: true,
      },
      {
        id: "shop-3",
        name: "EcoTech Electronics Clinic",
        rating: 4.8,
        reviewsCount: 215,
        distance: "2.3 miles away",
        estPriceRange: `$${totalMin - 20} - $${totalMax - 30}`,
        address: "512 Green Boulevard",
        phone: "(555) 432-1098",
        turnaroundTime: "1-2 Business Days",
        verified: true,
        badge: "Zero Waste Partner",
      },
    ],

    environmentalImpact: {
      eWastePreventedKg: isLaptop ? 1.8 : 0.45,
      co2SavedKg: isLaptop ? 185 : 68,
      repairabilityScore: isLaptop ? 8.2 : 7.5,
      ecoBadge: "Circular Hero Rating: Platinum",
    },

    aiRecommendation: {
      action: hasLiquid
        ? "Professional Repair"
        : problem.severityLevel === "Low" || problem.severityLevel === "Medium"
        ? "DIY Repair"
        : "Professional Repair",
      confidence: 94,
      headline: hasLiquid
        ? "Professional Repair Recommended due to Liquid Moisture Risk"
        : "DIY Repair is Highly Recommended - High Cost Savings & Feasibility",
      rationale: hasLiquid
        ? "Because liquid contamination was reported, micro-corrosion can short circuit critical components if powered prematurely. A certified lab equipped with ultrasonic baths will salvage maximum hardware value."
        : "Your device has a high repairability index of 8.2/10. Performing a DIY repair using genuine parts saves over 50% compared to buying a replacement device or paying retail labor rates.",
    },
  };
}
