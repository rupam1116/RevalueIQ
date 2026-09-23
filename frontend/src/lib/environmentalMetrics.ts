/**
 * Environmental Impact & Material Recovery Calculation Module
 * 
 * METHODOLOGY & ASSUMPTIONS TRANSPARENCY AUDIT:
 * 
 * 1. Nature of Values:
 *    All values returned by this module are CATEGORY-LEVEL BENCHMARK ESTIMATES.
 *    They are calculated using deterministic formulas and hardware mass averages.
 *    They represent projected environmental savings achieved by extending hardware lifespan
 *    and diverting devices from landfills.
 * 
 * 2. Metric Breakdown & Units:
 *    - co2OffsetKg (Unit: kg CO2e): Projected carbon dioxide equivalent avoided by delaying new device manufacturing.
 *      Formula: Device_Category_Mass_kg * Carbon_Intensity_Factor (kg CO2e / kg mass).
 *      Basis: Standard Life-Cycle Assessment (LCA) data indicating 70-85% of electronics carbon footprint occurs in production.
 *    - eWasteDivertedKg (Unit: kg): Total physical mass of electronic waste diverted from disposal.
 *      Formula: Average physical mass of intact unit in target hardware category.
 *    - Gold (Unit: mg): Elemental gold recovered from PCB contact pins and IC wire bonds.
 *    - Silver (Unit: mg): Elemental silver recovered from lead-free solder alloys and connector plating.
 *    - Copper (Unit: g): Elemental copper recovered from PCB traces, heat pipes, and wiring.
 *    - Cobalt (Unit: g): Elemental cobalt recovered from Lithium-ion battery cathode formulations.
 *    - Aluminum (Unit: g): Elemental aluminum recovered from structural chassis enclosures.
 */

export interface EnvironmentalMetrics {
  co2OffsetKg: number;
  eWasteDivertedKg: number;
  materialsRecovered: {
    goldMg: number;
    silverMg: number;
    copperGrams: number;
    cobaltGrams: number;
    aluminumGrams: number;
  };
}

export interface CategoryBenchmarkDefinition {
  categoryName: string;
  co2OffsetKg: number;
  eWasteDivertedKg: number;
  materialsRecovered: {
    goldMg: number;
    silverMg: number;
    copperGrams: number;
    cobaltGrams: number;
    aluminumGrams: number;
  };
  notes: string;
}

/**
 * Category-Level Benchmark Constants
 * Documented estimates based on standard e-waste lifecycle averages.
 */
export const CATEGORY_ENVIRONMENTAL_BENCHMARKS: Record<string, CategoryBenchmarkDefinition> = {
  laptop: {
    categoryName: "Laptop / Computer",
    co2OffsetKg: 215.0,
    eWasteDivertedKg: 1.8,
    materialsRecovered: {
      goldMg: 120,
      silverMg: 1200,
      copperGrams: 180,
      cobaltGrams: 45,
      aluminumGrams: 350,
    },
    notes: "Based on 1.8kg average laptop mass and ~120 kg CO2e/kg manufacturing carbon footprint benchmark.",
  },
  tablet: {
    categoryName: "Tablet / iPad",
    co2OffsetKg: 62.0,
    eWasteDivertedKg: 0.5,
    materialsRecovered: {
      goldMg: 45,
      silverMg: 450,
      copperGrams: 35,
      cobaltGrams: 15,
      aluminumGrams: 85,
    },
    notes: "Based on 0.5kg average tablet mass and ~124 kg CO2e/kg manufacturing carbon footprint benchmark.",
  },
  smartwatch: {
    categoryName: "Smartwatch / Wearable",
    co2OffsetKg: 14.0,
    eWasteDivertedKg: 0.08,
    materialsRecovered: {
      goldMg: 12,
      silverMg: 110,
      copperGrams: 8,
      cobaltGrams: 4,
      aluminumGrams: 15,
    },
    notes: "Based on 80g average wearable mass.",
  },
  audio: {
    categoryName: "Audio / Headphones",
    co2OffsetKg: 18.0,
    eWasteDivertedKg: 0.15,
    materialsRecovered: {
      goldMg: 8,
      silverMg: 85,
      copperGrams: 12,
      cobaltGrams: 5,
      aluminumGrams: 20,
    },
    notes: "Based on 150g average headphones/speaker mass.",
  },
  console: {
    categoryName: "Gaming Console",
    co2OffsetKg: 180.0,
    eWasteDivertedKg: 3.2,
    materialsRecovered: {
      goldMg: 140,
      silverMg: 1450,
      copperGrams: 220,
      cobaltGrams: 30,
      aluminumGrams: 420,
    },
    notes: "Based on 3.2kg average gaming console mass.",
  },
  display: {
    categoryName: "Monitor / TV",
    co2OffsetKg: 240.0,
    eWasteDivertedKg: 5.5,
    materialsRecovered: {
      goldMg: 90,
      silverMg: 950,
      copperGrams: 310,
      cobaltGrams: 20,
      aluminumGrams: 650,
    },
    notes: "Based on 5.5kg average display mass.",
  },
  camera: {
    categoryName: "Camera / Optics",
    co2OffsetKg: 95.0,
    eWasteDivertedKg: 0.7,
    materialsRecovered: {
      goldMg: 55,
      silverMg: 520,
      copperGrams: 45,
      cobaltGrams: 12,
      aluminumGrams: 140,
    },
    notes: "Based on 0.7kg average camera/lens mass.",
  },
  smartphone: {
    categoryName: "Smartphone / Mobile",
    co2OffsetKg: 28.5,
    eWasteDivertedKg: 0.2,
    materialsRecovered: {
      goldMg: 24,
      silverMg: 250,
      copperGrams: 14,
      cobaltGrams: 6,
      aluminumGrams: 22,
    },
    notes: "Based on 200g average smartphone mass and ~140 kg CO2e/kg manufacturing carbon footprint benchmark.",
  },
};

/**
 * Calculates category-level environmental benchmark metrics.
 */
export function calculateEnvironmentalMetrics(
  categoryRaw?: string | null,
  deviceNameRaw?: string | null
): EnvironmentalMetrics {
  const cat = (categoryRaw || "").toLowerCase();
  const name = (deviceNameRaw || "").toLowerCase();

  let selectedKey = "smartphone";

  if (cat.includes("laptop") || cat.includes("computer") || name.includes("macbook") || name.includes("thinkpad") || name.includes("xps")) {
    selectedKey = "laptop";
  } else if (cat.includes("tablet") || name.includes("ipad") || name.includes("tab")) {
    selectedKey = "tablet";
  } else if (cat.includes("watch") || cat.includes("wearable") || name.includes("apple watch") || name.includes("galaxy watch")) {
    selectedKey = "smartwatch";
  } else if (cat.includes("audio") || cat.includes("headphone") || cat.includes("speaker") || name.includes("airpods")) {
    selectedKey = "audio";
  } else if (cat.includes("console") || cat.includes("gaming") || name.includes("playstation") || name.includes("xbox")) {
    selectedKey = "console";
  } else if (cat.includes("monitor") || cat.includes("tv") || cat.includes("display")) {
    selectedKey = "display";
  } else if (cat.includes("camera") || name.includes("canon") || name.includes("sony alpha")) {
    selectedKey = "camera";
  }

  const benchmark = CATEGORY_ENVIRONMENTAL_BENCHMARKS[selectedKey] || CATEGORY_ENVIRONMENTAL_BENCHMARKS.smartphone;

  return {
    co2OffsetKg: benchmark.co2OffsetKg,
    eWasteDivertedKg: benchmark.eWasteDivertedKg,
    materialsRecovered: benchmark.materialsRecovered,
  };
}
