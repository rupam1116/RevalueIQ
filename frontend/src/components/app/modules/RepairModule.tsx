"use client";

import React, { useState, useEffect, useRef } from "react";
import { Wrench, ArrowLeft, Zap, Play, RotateCcw, Leaf, AlertCircle, CheckCircle } from "lucide-react";
import {
  UploadedRepairImage,
  RepairDeviceSelection,
  RepairProblemForm,
  RepairReport,
  RepairHistoryItem,
  DemoRepairPreset,
} from "@/types/repair";
import { DEMO_REPAIR_PRESETS } from "@/lib/mockRepairData";
import { useAuth } from "@/context/AuthContext";
import {
  analyzeRepairAdvisory,
  getUserRepairAdvisories,
  getRepairAdvisoryById,
  deleteRepairAdvisory,
  RepairAdvisoryResponse,
} from "@/lib/repairApi";

import { HeroSection } from "../repair/HeroSection";
import { DeviceSelectionCards } from "../repair/DeviceSelectionCards";
import { ProblemDescriptionForm } from "../repair/ProblemDescriptionForm";
import { RepairImageUploadZone } from "../repair/RepairImageUploadZone";
import { AIDiagnosisAnimation } from "../repair/AIDiagnosisAnimation";
import { AIRepairReportView } from "../repair/AIRepairReportView";
import { RepairHistoryTable } from "../repair/RepairHistoryTable";
import { RepairFloatingAIAssistant } from "../repair/RepairFloatingAIAssistant";
import { RepairPDFReportModal } from "../repair/RepairPDFReportModal";

interface ModuleProps {
  onNavigateTab: (tabId: string) => void;
}

function mapAdvisoryResponseToReport(
  res: RepairAdvisoryResponse,
  deviceSelection: RepairDeviceSelection,
  problemForm: RepairProblemForm,
  uploadedImages: UploadedRepairImage[]
): RepairReport {
  const ai = res.ai_analysis;
  const dev = res.device_info || {};

  const severityLevelMap: Record<string, "Low" | "Medium" | "High" | "Critical"> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    CRITICAL: "Critical",
    UNKNOWN: "Medium",
  };

  const severityLevel = severityLevelMap[ai.severity] || "Medium";
  const severityScore =
    severityLevel === "Critical" ? 95 : severityLevel === "High" ? 75 : severityLevel === "Medium" ? 50 : 25;
  const severityColor =
    severityLevel === "Critical"
      ? "#ef4444"
      : severityLevel === "High"
      ? "#f97316"
      : severityLevel === "Medium"
      ? "#eab308"
      : "#10b981";

  const totalMin = ai.minimum_repair_cost ?? ai.estimated_repair_cost ?? 0;
  const totalMax = ai.maximum_repair_cost ?? ai.estimated_repair_cost ?? 0;
  const partsCost = ai.parts_cost ?? 0;
  const laborCost = ai.labor_cost ?? 0;

  const diySteps = (ai.recommended_steps || []).map((step, idx) => ({
    stepNumber: idx + 1,
    title: `Phase ${idx + 1}: Diagnostic Action`,
    instruction: step,
    warning: idx === 0 && ai.safety_warnings?.length ? ai.safety_warnings[0] : undefined,
  }));

  const requiredParts = (ai.required_parts || []).map((p, idx) => ({
    id: `part-${idx + 1}`,
    name: p.name,
    oemPrice: p.estimated_cost_inr ?? Math.round(partsCost / Math.max(1, ai.required_parts.length)),
    aftermarketPrice: Math.round((p.estimated_cost_inr ?? partsCost) * 0.65),
    availability: (p.availability as any) || "In Stock",
    sourcingDifficulty: "Moderate" as const,
    recommendedType: (p.part_type as any) || "OEM",
    linkText: "Check Supplier Inventory",
  }));

  const actionMap: Record<string, "DIY Repair" | "Professional Repair" | "Replace & Sell"> = {
    REPAIR: "DIY Repair",
    MAINTAIN: "DIY Repair",
    REPLACE: "Replace & Sell",
    PROFESSIONAL_INSPECTION: "Professional Repair",
  };

  return {
    id: res.id,
    advisoryCode: res.advisory_code,
    deviceName: `${dev.brand || deviceSelection.brand} ${dev.model || deviceSelection.model}`.trim(),
    category: (dev.category as any) || deviceSelection.category,
    date: new Date(res.created_at).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    primaryImage:
      uploadedImages[0]?.url ||
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    images: uploadedImages.map((img) => img.url),
    problemIdentified: {
      title: ai.diagnosis || "Hardware Diagnostic Audit",
      category: problemForm.symptomCategory || "Hardware & Circuitry",
      summary: ai.problem_detected || "Component malfunction detected under AI diagnostic scan.",
      detailedAnalysis: ai.reasoning || "Diagnostic telemetry indicates component stress or failure.",
      rootCause: ai.possible_causes?.join(" • ") || "Mechanical impact or component degradation.",
      affectedComponents:
        requiredParts.length > 0
          ? requiredParts.map((p) => p.name)
          : ["Main Enclosure", "Internal Telemetry Module"],
    },
    severity: {
      level: severityLevel,
      score: severityScore,
      color: severityColor,
      riskNote:
        ai.safety_warnings?.[0] ||
        "Professional handling recommended to preserve component warranty and safety.",
    },
    estimatedRepairCost: {
      totalMin,
      totalMax,
      oemPartsCost: partsCost,
      thirdPartyPartsCost: Math.round(partsCost * 0.65),
      laborCostEst: laborCost,
      diySavings: laborCost > 0 ? laborCost : Math.round(totalMin * 0.4),
    },
    requiredParts:
      requiredParts.length > 0
        ? requiredParts
        : [
            {
              id: "part-1",
              name: `${dev.brand || deviceSelection.brand} OEM Replacement Assembly`,
              oemPrice: partsCost > 0 ? partsCost : 2500,
              aftermarketPrice: Math.round((partsCost > 0 ? partsCost : 2500) * 0.65),
              availability: "In Stock",
              sourcingDifficulty: "Moderate",
              recommendedType: "OEM",
              linkText: "Check Supplier Inventory",
            },
          ],
    estimatedRepairTime:
      severityLevel === "Critical"
        ? "2 - 4 business days"
        : severityLevel === "High"
        ? "1 - 2 business days"
        : "Same day (1 - 3 hours)",
    repairDifficulty: {
      level:
        ai.repairability === "NOT_RECOMMENDED"
          ? "Expert"
          : ai.repairability === "PARTIALLY_REPAIRABLE"
          ? "Hard"
          : "Moderate",
      score: ai.repairability === "NOT_RECOMMENDED" ? 9 : 5,
      skillsNeeded: ["Precision Electronics Disassembly", "ESD Safe Handling"],
      riskFactor:
        ai.safety_warnings?.[0] ||
        "Moderate risk of ribbon connector tear during manual chassis separation.",
    },
    diyRecommendation: {
      feasibility:
        ai.recommended_action === "PROFESSIONAL_INSPECTION" || severityLevel === "Critical"
          ? "Not Recommended"
          : "Medium",
      pros: ["Zero technician labor charges", "Extend device circular lifespan"],
      cons: ["Requires micro-precision screwdriver kit", "Demands ESD anti-static workspace"],
      stepsOverview:
        ai.recommended_steps?.length > 0
          ? ai.recommended_steps
          : [
              "Power down device completely",
              "Disassemble external chassis screws",
              "Replace damaged module with OEM certified part",
              "Re-test diagnostic telemetry before final reseal",
            ],
      toolsRequired: [
        "Precision Torx & Phillips Driver Set",
        "Suction Screen Prying Tool",
        "Anti-static ESD Mat & Wristband",
        "Thermal Heat Gun / Pad",
      ],
    },
    professionalRepairRecommendation: {
      recommended:
        ai.recommended_action === "PROFESSIONAL_INSPECTION" || severityLevel === "Critical",
      reason:
        ai.safety_warnings?.[0] ||
        "Professional certified workshops provide 90-day parts warranty and cleanroom ESD protection.",
      estTurnaround: "1 - 2 Days",
      warrantyDays: 90,
    },
    nearbyRepairShops: [
      {
        id: "shop-1",
        name: "iFix Green Labs & Eco Repair Hub",
        rating: 4.9,
        reviewsCount: 342,
        distance: "1.8 km",
        estPriceRange: totalMin > 0 ? `₹${totalMin.toLocaleString("en-IN")}` : "₹1,500 - ₹3,500",
        address: "Road 36, Jubilee Hills, Hyderabad",
        phone: "+91 98490 12345",
        turnaroundTime: "Same Day",
        verified: true,
        badge: "Zero-Landfill Partner",
      },
      {
        id: "shop-2",
        name: "QuickFix Circular Electronics Workshop",
        rating: 4.8,
        reviewsCount: 189,
        distance: "3.4 km",
        estPriceRange: totalMin > 0 ? `₹${totalMin.toLocaleString("en-IN")}` : "₹1,200 - ₹3,000",
        address: "Hitec City Main Road, Madhapur, Hyderabad",
        phone: "+91 98490 67890",
        turnaroundTime: "24 Hours",
        verified: true,
        badge: "OEM Certified Parts",
      },
    ],
    environmentalImpact: {
      eWastePreventedKg: 0.35,
      co2SavedKg: 28.5,
      repairabilityScore: 8.5,
      ecoBadge: "Circular Hero Tier 1",
    },
    aiRecommendation: {
      action: actionMap[ai.recommended_action] || "Professional Repair",
      confidence: Math.round((ai.confidence || 0.85) * 100),
      headline: ai.diagnosis,
      rationale: ai.reasoning,
    },
    diySteps,
    safetyWarnings: ai.safety_warnings || [],
    reasoning: ai.reasoning,
  };
}

const INITIAL_DEVICE_SELECTION: RepairDeviceSelection = {
  category: "Smartphone",
  brand: "Apple",
  model: "iPhone 15 Pro Max",
  color: "Natural Titanium",
};

const INITIAL_PROBLEM_FORM: RepairProblemForm = {
  symptomCategory: "Screen & Battery",
  mainIssue: "",
  issueHeadline: "",
  description: "",
  userDescription: "",
  detailedDescription: "",
  severityLevel: "High",
  severity: "High",
  powersOn: true,
  liquidExposure: false,
  previousRepairs: false,
  symptoms: [],
  additionalNotes: "",
};

export const RepairModule: React.FC<ModuleProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const [stage, setStage] = useState<"idle" | "diagnosing" | "report">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [deviceSelection, setDeviceSelection] = useState<RepairDeviceSelection>(INITIAL_DEVICE_SELECTION);
  const [problemForm, setProblemForm] = useState<RepairProblemForm>(INITIAL_PROBLEM_FORM);

  const [uploadedImages, setUploadedImages] = useState<UploadedRepairImage[]>([]);
  const [currentReport, setCurrentReport] = useState<RepairReport | null>(null);
  const [history, setHistory] = useState<RepairHistoryItem[]>([]);
  const [isPDFOpen, setIsPDFOpen] = useState(false);

  // In-flight protection ref to ensure strictly 1 active request per user click
  const isInFlightRef = useRef(false);

  // Load real user repair advisories from MongoDB backend
  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const advisories = await getUserRepairAdvisories(token);
        if (advisories && advisories.length > 0) {
          const items: RepairHistoryItem[] = advisories.map((adv) => ({
            id: adv.id,
            advisoryCode: adv.advisory_code,
            deviceName: `${adv.device_info.brand || "Device"} ${adv.device_info.model || ""}`.trim(),
            category: (adv.device_info.category as any) || "Smartphone",
            problemTitle: adv.ai_analysis.diagnosis || "Repair Diagnostic",
            diagnosisTitle: adv.ai_analysis.diagnosis || "Repair Diagnostic",
            severity:
              adv.ai_analysis.severity === "CRITICAL"
                ? "Critical"
                : adv.ai_analysis.severity === "HIGH"
                ? "High"
                : adv.ai_analysis.severity === "LOW"
                ? "Low"
                : "Medium",
            estimatedCost: adv.ai_analysis.minimum_repair_cost || adv.ai_analysis.estimated_repair_cost || 0,
            recommendedAction:
              adv.ai_analysis.recommended_action === "REPLACE"
                ? "Replace & Sell"
                : adv.ai_analysis.recommended_action === "PROFESSIONAL_INSPECTION"
                ? "Professional Repair"
                : "DIY Repair",
            status: "Completed",
            createdAt: adv.created_at,
            date: new Date(adv.created_at).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          }));
          setHistory(items);
        }
      } catch (err) {
        console.debug("Notice loading repair history:", err);
      }
    }
    loadHistory();
  }, [user]);

  const handleDeleteHistoryItem = async (itemOrId: RepairHistoryItem | string) => {
    const advisoryId = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
    if (!user) {
      throw new Error("Your session has expired. Please sign in again.");
    }
    const token = await user.getIdToken();
    await deleteRepairAdvisory(token, advisoryId);

    // Immediately remove from history state
    setHistory((prev) => prev.filter((h) => h.id !== advisoryId));

    // If currently viewing the deleted report, reset view back to idle
    if (currentReport && currentReport.id === advisoryId) {
      handleResetFlow();
    }

    setSuccessMessage("Diagnostic report deleted successfully.");
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const handleAddImage = (imgOrFile: any) => {
    if (imgOrFile instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newImg: UploadedRepairImage = {
          id: Math.random().toString(36).substring(2, 9),
          url: dataUrl,
          name: imgOrFile.name,
          size: `${Math.round(imgOrFile.size / 1024)} KB`,
          tag: "Front View",
        };
        setUploadedImages((prev) => [...prev, newImg]);
      };
      reader.readAsDataURL(imgOrFile);
    } else if (imgOrFile && imgOrFile.url) {
      setUploadedImages((prev) => [...prev, imgOrFile]);
    }
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUpdateTag = (id: string, damageTag: string, customDamageTag?: string) => {
    setUploadedImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? {
              ...img,
              damageTag,
              tag: damageTag,
              customDamageTag: customDamageTag !== undefined ? customDamageTag : img.customDamageTag,
            }
          : img
      )
    );
  };

  const handleSelectPreset = (preset: DemoRepairPreset) => {
    setDeviceSelection(preset.device);
    setProblemForm({
      symptomCategory: preset.problem.symptomCategory || "Screen & Battery",
      mainIssue: preset.problem.mainIssue || "",
      issueHeadline: preset.problem.issueHeadline || preset.problem.mainIssue || "",
      description: preset.problem.description || "",
      userDescription: preset.problem.userDescription || preset.problem.description || "",
      detailedDescription: preset.problem.detailedDescription || preset.problem.description || "",
      severityLevel: preset.problem.severityLevel || "High",
      severity: preset.problem.severity || preset.problem.severityLevel || "High",
      powersOn: preset.problem.powersOn === true,
      liquidExposure: preset.problem.liquidExposure === true,
      previousRepairs: preset.problem.previousRepairs === true,
      symptoms: preset.problem.symptoms ? [...preset.problem.symptoms] : [],
      additionalNotes: preset.problem.additionalNotes || "",
    });
    setUploadedImages(preset.sampleImages || (preset.images as any) || []);
  };

  const handleStartDiagnosis = async () => {
    if (isInFlightRef.current) return;
    isInFlightRef.current = true;
    setErrorMessage(null);
    setStage("diagnosing");

    try {
      if (!user) {
        throw new Error("You must be signed in to run an AI repair diagnostic scan.");
      }

      const token = await user.getIdToken();

      // Build payload for FastAPI backend directly from current state
      const primaryImage = uploadedImages[0]?.url;

      // Extract inspection tags and custom damage descriptions from attached photos
      const photoNotes = uploadedImages
        .map((img, i) => {
          const tag = img.damageTag || img.tag || "General Damage";
          const custom = img.customDamageTag ? ` (${img.customDamageTag})` : "";
          return `Inspection Photo #${i + 1}: ${tag}${custom}`;
        })
        .join("; ");

      const combinedNotes = [problemForm.additionalNotes, photoNotes ? `Visual Damage Tags: ${photoNotes}` : ""]
        .filter(Boolean)
        .join(" | ");

      const currentCategory = problemForm.symptomCategory || "Screen & Battery";
      const currentHeadline = (problemForm.mainIssue || problemForm.issueHeadline || "Hardware Diagnostic Scan").trim();
      const currentDescription = (problemForm.description || problemForm.userDescription || problemForm.detailedDescription || "").trim();
      const currentSeverity = problemForm.severityLevel || (problemForm.severity as any) || "High";
      const powerStatus = problemForm.powersOn === true;
      const liquidExposure = problemForm.liquidExposure === true;
      const previousRepairs = problemForm.previousRepairs === true;
      const currentSymptoms = Array.isArray(problemForm.symptoms) ? problemForm.symptoms : [];

      const payload = {
        device_id: deviceSelection.deviceId || null,
        valuation_id: deviceSelection.valuationId || null,
        device_context: {
          category: deviceSelection.category,
          brand: deviceSelection.brand,
          model: deviceSelection.model,
          ram: deviceSelection.ram,
          storage: deviceSelection.storage,
          purchase_year: deviceSelection.year ? Number(deviceSelection.year) : null,
          condition: deviceSelection.condition,
          functional_status: deviceSelection.functionalStatus,
        },
        problem_input: {
          symptom_category: currentCategory,
          issue_headline: currentHeadline,
          detailed_description: currentDescription || "Diagnostic inspection.",
          severity_level: currentSeverity,
          power_status: powerStatus,
          liquid_exposure: liquidExposure,
          previous_repair_history: previousRepairs,
          symptoms: currentSymptoms,
          user_description: currentDescription,
          additional_notes: combinedNotes || undefined,
        },
        image_reference: primaryImage || null,
      };

      const response = await analyzeRepairAdvisory(token, payload);

      const report = mapAdvisoryResponseToReport(response, deviceSelection, problemForm, uploadedImages);
      setCurrentReport(report);

      // Add to local history list
      const historyEntry: RepairHistoryItem = {
        id: report.id,
        deviceName: report.deviceName,
        category: report.category,
        diagnosisTitle: report.problemIdentified.title,
        severity: report.severity.level,
        estimatedCost: report.estimatedRepairCost.totalMin,
        recommendedAction: report.aiRecommendation.action,
        status: "Completed",
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      setHistory((prev) => [historyEntry, ...prev.filter((h) => h.id !== historyEntry.id)]);
      setStage("report");
    } catch (err: any) {
      console.error("AI Repair Advisory Analysis Error:", err);
      setErrorMessage(err?.message || "AI repair analysis could not be completed. Please try again.");
      setStage("idle");
    } finally {
      isInFlightRef.current = false;
    }
  };

  const handleResetFlow = () => {
    setStage("idle");
    setErrorMessage(null);
    setCurrentReport(null);
    setUploadedImages([]);
    setProblemForm({ ...INITIAL_PROBLEM_FORM });
  };

  const handleSelectHistoryItem = async (item: RepairHistoryItem | string) => {
    const itemId = typeof item === "string" ? item : item.id;
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const adv = await getRepairAdvisoryById(token, itemId);
      const report = mapAdvisoryResponseToReport(adv, deviceSelection, problemForm, uploadedImages);
      setCurrentReport(report);
      setStage("report");
    } catch (err) {
      console.error("Failed to load historical advisory:", err);
    }
  };

  return (
    <div className="space-y-10 pb-16 min-h-screen">
      {/* Success Alert Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 transition-colors cursor-pointer border-0 text-[10px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-200 transition-colors cursor-pointer border-0 text-[10px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Back Navigation Bar when in Diagnosis/Report */}
      {stage !== "idle" && (
        <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
          <button
            onClick={handleResetFlow}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Repair Advisor
          </button>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {stage === "diagnosing" ? "AI Neural Diagnostics" : "Diagnostic Report"}
          </span>
        </div>
      )}

      {/* Hero Header Section */}
      {stage === "idle" && (
        <HeroSection
          onStartDiagnosis={() => {
            const el = document.getElementById("diagnosis-form-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          onSelectPreset={handleSelectPreset}
          onScrollToForm={() => {
            const el = document.getElementById("diagnosis-form-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}

      {/* Main Diagnosis Interactive Workflow */}
      <div>
        {/* Stage 1: Form & Device Selection */}
        {stage === "idle" && (
          <div
            id="diagnosis-form-section"
            className="space-y-8 transition-all duration-300 animate-in fade-in"
          >
            {/* Device Selection Cards */}
            <DeviceSelectionCards
              selection={deviceSelection}
              onChange={setDeviceSelection}
            />

            {/* Problem Description Form */}
            <ProblemDescriptionForm
              form={problemForm}
              onChange={setProblemForm}
            />

            {/* Image Upload Zone */}
            <RepairImageUploadZone
              images={uploadedImages}
              onAddImage={handleAddImage}
              onRemoveImage={handleRemoveImage}
              onUpdateTag={handleUpdateTag}
            />

            {/* Launch AI Diagnostic Scan Control Bar */}
            <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Ready to run circular visual & hardware diagnostic scan</span>
              </div>

              <button
                type="button"
                onClick={handleStartDiagnosis}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-2 group border-0"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Run AI Eco Diagnostic & Cost Scanner</span>
                <Play className="w-4 h-4 fill-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Diagnosing Scan HUD */}
        {stage === "diagnosing" && (
          <div className="transition-all duration-300 animate-in fade-in">
            <AIDiagnosisAnimation
              device={deviceSelection}
              problem={problemForm}
              images={uploadedImages}
              onComplete={() => {}}
            />
          </div>
        )}

        {/* Stage 3: Report View */}
        {stage === "report" && currentReport && (
          <div className="transition-all duration-300 animate-in fade-in">
            <AIRepairReportView
              report={currentReport}
              onReset={handleResetFlow}
              onSaveReport={() => {}}
              onDeleteReport={handleDeleteHistoryItem}
              onOpenPDF={() => setIsPDFOpen(true)}
              onNavigateTab={onNavigateTab}
            />
          </div>
        )}
      </div>

      {/* Repair History Logs Table */}
      <RepairHistoryTable
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onNavigateTab={onNavigateTab}
      />

      {/* Floating AI Copilot Assistant */}
      <RepairFloatingAIAssistant
        report={currentReport}
        onNavigateTab={onNavigateTab}
      />

      {/* PDF Export Modal */}
      {currentReport && (
        <RepairPDFReportModal
          isOpen={isPDFOpen}
          onClose={() => setIsPDFOpen(false)}
          report={currentReport}
        />
      )}
    </div>
  );
};
