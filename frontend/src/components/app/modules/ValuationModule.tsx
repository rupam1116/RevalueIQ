"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  ArrowLeft,
  Play,
  Zap,
  Leaf,
  AlertCircle,
  RefreshCw,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { UploadedImage, DeviceDetails, DeviceCategory, CosmeticCondition, ValuationReport, ValuationHistoryItem } from "@/types/valuation";
import { DEMO_PRESETS, DemoPreset } from "@/lib/mockValuationData";

import { HeroSection } from "../valuation/HeroSection";
import { DeviceUploadZone } from "../valuation/DeviceUploadZone";
import { DeviceDetailsForm } from "../valuation/DeviceDetailsForm";
import { AIAnalysisAnimation } from "../valuation/AIAnalysisAnimation";
import { ValuationResultsDashboard } from "../valuation/ValuationResultsDashboard";
import { ValuationHistoryTable } from "../valuation/ValuationHistoryTable";
import { FloatingAIAssistant } from "../valuation/FloatingAIAssistant";
import { PDFReportModal } from "../valuation/PDFReportModal";

import { useAuth } from "@/context/AuthContext";
import { createValuation, analyzeValuation, getUserValuations, ValuationResponse, detectDevice } from "@/lib/valuationApi";
import { compressImage, fileToBase64 } from "@/lib/imageUtils";
import { calculateEnvironmentalMetrics } from "@/lib/environmentalMetrics";

interface ModuleProps {
  onNavigateTab: (tabId: string) => void;
}

export const ValuationModule: React.FC<ModuleProps> = ({ onNavigateTab }) => {
  const [stage, setStage] = useState<"idle" | "details" | "analyzing" | "results">("idle");
  const [error, setError] = useState<string | null>(null);

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetails>({
    category: "Smartphone",
    brand: "",
    model: "",
    storage: "Not detected",
    ram: "Not detected",
    purchaseYear: "Not detected",
    condition: "Minor Scratches",
    functionalStatus: "Not Detected / Unknown",
    hasOriginalBox: false,
    hasCharger: false,
    additionalNotes: "",
    aiDetectedFields: {},
  });

  const [isManuallyEdited, setIsManuallyEdited] = useState(false);
  const [showReanalyzeModal, setShowReanalyzeModal] = useState(false);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<"idle" | "analyzing" | "completed" | "partial" | "failed">("idle");
  const [detectionMessage, setDetectionMessage] = useState<string | null>(null);

  const [currentReport, setCurrentReport] = useState<ValuationReport | null>(null);
  const [history, setHistory] = useState<ValuationHistoryItem[]>([]);
  const [isPDFOpen, setIsPDFOpen] = useState(false);

  const { user, getToken, loading: authLoading } = useAuth();

  // Category mapping helper
  const mapCategory = (rawCat?: string | null): DeviceCategory => {
    if (!rawCat) return "Other";
    const c = rawCat.toLowerCase();
    if (c.includes("phone") || c.includes("mobile") || c.includes("smartphone") || c.includes("cellular")) return "Smartphone";
    if (c.includes("laptop") || c.includes("notebook") || c.includes("macbook")) return "Laptop";
    if (c.includes("tablet") || c.includes("ipad")) return "Tablet";
    if (c.includes("watch")) return "Smartwatch";
    if (c.includes("audio") || c.includes("headphone") || c.includes("earbud") || c.includes("speaker") || c.includes("headset")) return "Audio";
    if (c.includes("console") || c.includes("playstation") || c.includes("xbox") || c.includes("nintendo")) return "Gaming Console";
    return "Other";
  };

  // Condition mapping helper
  const mapCondition = (rawCond?: string | null): CosmeticCondition => {
    if (!rawCond) return "Minor Scratches";
    const cond = rawCond.toLowerCase();
    if (cond.includes("pristine") || cond.includes("like new") || cond.includes("mint") || cond.includes("excellent")) return "Pristine (Like New)";
    if (cond.includes("cracked") || cond.includes("broken glass") || cond.includes("display fault")) return "Cracked Screen / Glass";
    if (cond.includes("heavy") || cond.includes("severe") || cond.includes("damaged")) return "Heavy Damage";
    if (cond.includes("dent") || cond.includes("wear") || cond.includes("fair") || cond.includes("moderate")) return "Visible Dents / Wear";
    return "Minor Scratches";
  };

  // Functional status mapping helper
  const mapFunctionalStatus = (raw?: string | null): any => {
    if (!raw) return "Not Detected / Unknown";
    const r = raw.toLowerCase();
    if (r.includes("fully functional") || r.includes("functional") || r.includes("working")) return "Fully Functional";
    if (r.includes("battery")) return "Battery Degraded";
    if (r.includes("camera") || r.includes("sensor")) return "Camera / Sensor Issue";
    if (r.includes("port") || r.includes("charge")) return "Port / Charging Issue";
    if (r.includes("display") || r.includes("screen")) return "Display Fault";
    if (r.includes("dead") || r.includes("non-functional")) return "Non-Functional / Dead";
    return "Not Detected / Unknown";
  };

  // Load history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const userValuations = await getUserValuations(token);
        const mappedHistory: ValuationHistoryItem[] = userValuations.map((v) => {
          const val = v.valuation || {};
          const ai = v.ai_analysis || {};
          const inp = v.input || {};
          const estValue = val.estimated_resale_value ?? ai.estimated_resale_value ?? 0;
          return {
            id: v.id,
            deviceName: ai.device_name || inp.device_name || v.device_id || "Electronic Device",
            category: (ai.category || inp.category || "Smartphone") as any,
            thumbnail:
              inp.image_reference &&
              inp.image_reference !== "phase3-test-image" &&
              (inp.image_reference.startsWith("http") || inp.image_reference.startsWith("data:") || inp.image_reference.startsWith("blob:") || inp.image_reference.startsWith("/"))
                ? inp.image_reference
                : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
            date: new Date(v.created_at).toISOString().split("T")[0],
            condition: ai.visible_condition || "Fair",
            estimatedValue: estValue,
            circularScore: Math.min(98, Math.max(65, 82 + (estValue > 50000 ? 10 : 5))),
            status: v.status === "completed" ? "Completed" : "Pending Action",
          };
        });
        setHistory(mappedHistory);
      } catch (err) {
        console.warn("Could not load user valuation history:", err);
      }
    };

    if (!authLoading && user) {
      fetchHistory();
    }
  }, [user, authLoading, getToken]);

  // Convert blob / object URL / file / remote URL to compressed base64
  const processImageToBase64 = async (imgObj: UploadedImage): Promise<string> => {
    if (imgObj.file) {
      const compressed = await compressImage(imgObj.file, 1200);
      return await fileToBase64(compressed);
    }

    const inputUrl = imgObj.url || "";
    if (inputUrl.startsWith("data:image/")) {
      return inputUrl;
    }

    if (inputUrl.startsWith("blob:")) {
      try {
        const res = await fetch(inputUrl);
        const blob = await res.blob();
        const file = new File([blob], imgObj.name || "device_photo.jpg", { type: blob.type || "image/jpeg" });
        const compressed = await compressImage(file, 1200);
        return await fileToBase64(compressed);
      } catch (e) {
        console.warn("Failed to read blob URL:", e);
      }
    }

    if (inputUrl.startsWith("http://") || inputUrl.startsWith("https://")) {
      try {
        const res = await fetch(inputUrl);
        const blob = await res.blob();
        const file = new File([blob], "remote_device.jpg", { type: blob.type || "image/jpeg" });
        const compressed = await compressImage(file, 1200);
        return await fileToBase64(compressed);
      } catch (e) {
        return inputUrl;
      }
    }

    return inputUrl;
  };

  const normalizeStorage = (raw?: string | null): string => {
    if (!raw || raw.toLowerCase().includes("unknown") || raw.toLowerCase().includes("not detected")) return "Not detected";
    const cleaned = raw.replace(/\s+/g, "").toUpperCase();
    if (cleaned.includes("64")) return "64GB";
    if (cleaned.includes("128")) return "128GB";
    if (cleaned.includes("256")) return "256GB";
    if (cleaned.includes("512")) return "512GB";
    if (cleaned.includes("1TB")) return "1TB SSD";
    if (cleaned.includes("2TB")) return "2TB SSD";
    return raw;
  };

  const normalizeRam = (raw?: string | null): string => {
    if (!raw || raw.toLowerCase().includes("unknown") || raw.toLowerCase().includes("not detected")) return "Not detected";
    const cleaned = raw.replace(/\s+/g, "").toUpperCase();
    if (cleaned.includes("4GB")) return "4GB";
    if (cleaned.includes("8GB")) return "8GB";
    if (cleaned.includes("12GB")) return "12GB";
    if (cleaned.includes("16GB")) return "16GB";
    if (cleaned.includes("32GB")) return "32GB";
    if (cleaned.includes("64GB")) return "64GB";
    return raw;
  };

  const autoDetectingRef = useRef(false);
  const lastDetectedImgRef = useRef<string | null>(null);

  // Run AI Auto-Detection on upload
  const runAutoDetection = async (imagesToAnalyze: UploadedImage[], force: boolean = false) => {
    if (imagesToAnalyze.length === 0 || autoDetectingRef.current) return;

    const primaryImg = imagesToAnalyze[0];
    const imgKey = primaryImg.id || primaryImg.url || primaryImg.name;
    if (!force && lastDetectedImgRef.current === imgKey) {
      return;
    }

    autoDetectingRef.current = true;
    lastDetectedImgRef.current = imgKey;
    setError(null);
    setIsAutoDetecting(true);
    setDetectionStatus("analyzing");
    setDetectionMessage("Identifying device type, brand, model and condition...");

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication required. Please sign in to appraise a device.");
      }

      const base64DataUri = await processImageToBase64(primaryImg);

      if (!base64DataUri || base64DataUri === "phase3-test-image") {
        throw new Error("Please upload a valid device image.");
      }

      // Execute Gemini Vision detection flow via backend API endpoint
      const detectionRes = await detectDevice(token, base64DataUri);
      const det = detectionRes.device_detection || {};

      const detectedCategory = mapCategory(det.category);
      const detectedBrand = det.brand && det.brand.toLowerCase() !== "unknown" ? det.brand : "";
      const detectedModel = det.model && det.model.toLowerCase() !== "unknown" ? det.model : "";
      const detectedYear = det.purchase_year ? String(det.purchase_year) : "Not detected";
      const detectedStorage = normalizeStorage(det.storage_capacity);
      const detectedRam = normalizeRam(det.ram);
      const detectedFunctional = mapFunctionalStatus(det.functional_status);
      const detectedCondition = mapCondition(det.visible_condition);
      const detectedNotes = det.damage_detected
        ? (det.damage_description || "Visual damage detected from image.")
        : (det.damage_description || "None detected from image.");

      const detectedFieldsMap: Record<string, boolean> = {
        category: !!det.category && det.category.toLowerCase() !== "unknown",
        brand: !!detectedBrand,
        model: !!detectedModel,
        purchaseYear: !!det.purchase_year,
        storage: detectedStorage !== "Not detected",
        ram: detectedRam !== "Not detected",
        functionalStatus: !!det.functional_status && det.functional_status.toLowerCase() !== "unknown",
        condition: !!det.visible_condition && det.visible_condition.toLowerCase() !== "unknown",
        additionalNotes: !!det.damage_description,
      };

      setDeviceDetails((prev) => ({
        ...prev,
        category: detectedCategory,
        brand: detectedBrand,
        model: detectedModel,
        purchaseYear: detectedYear,
        storage: detectedStorage,
        ram: detectedRam,
        functionalStatus: detectedFunctional,
        condition: detectedCondition,
        additionalNotes: detectedNotes,
        aiDetectedFields: detectedFieldsMap,
      }));

      const hasIdentifiedMajorDetails = !!detectedCategory && (!!detectedBrand || !!detectedModel);
      if (hasIdentifiedMajorDetails) {
        setDetectionStatus("completed");
        setDetectionMessage("Device identified — please review the information below.");
      } else {
        setDetectionStatus("partial");
        setDetectionMessage("Some details could not be identified. Please review and complete them.");
      }

      setIsManuallyEdited(false);
      setStage("details");
    } catch (err: any) {
      console.warn("[AUTO-DETECT NOTICE]", err?.message || err);
      setDetectionStatus("failed");
      setDetectionMessage(err.message || "We couldn't identify this device from the image. Please enter the details manually.");
      setStage("details");
    } finally {
      setIsAutoDetecting(false);
      autoDetectingRef.current = false;
    }
  };


  // Add uploaded image & trigger auto-detect for first image
  const handleAddImage = (img: UploadedImage) => {
    setError(null);
    setUploadedImages((prevStack) => {
      const newStack = [...prevStack, img];
      if (prevStack.length === 0) {
        runAutoDetection(newStack);
      }
      return newStack;
    });

    if (stage === "idle") {
      setStage("details");
    }
  };

  // Remove image
  const handleRemoveImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Update image angle
  const handleUpdateImageAngle = (id: string, angle: UploadedImage["angle"]) => {
    setUploadedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, angle } : img))
    );
  };

  // Handle Demo Preset Selection
  const handleSelectPreset = (preset: DemoPreset) => {
    setError(null);
    const formattedImages: UploadedImage[] = preset.images.map((img, idx) => ({
      id: `img-preset-${idx}-${Date.now()}`,
      url: img.url,
      name: `${preset.name}_${img.angle}.jpg`,
      size: "3.1 MB",
      angle: img.angle,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    setUploadedImages(formattedImages);
    setDeviceDetails({
      ...preset.details,
      aiDetectedFields: {
        category: true,
        brand: true,
        model: true,
        condition: true,
        additionalNotes: true,
      },
    });
    setIsManuallyEdited(false);
    setStage("details");
  };

  // Map Backend Response to UI ValuationReport
  const mapResponseToReport = (resp: ValuationResponse, primaryImageUrl: string): ValuationReport => {
    const val = resp.valuation || {};
    const ai = resp.ai_analysis || {};
    const inp = resp.input || {};

    const estimatedVal = val.estimated_resale_value ?? ai.estimated_resale_value ?? 0;
    const repairEstimate = val.estimated_repair_cost ?? val.repair_estimate ?? ai.estimated_repair_cost ?? 0;
    const marketRec = val.market_recommendation ?? ai.market_recommendation ?? val.recommendation ?? "SELL";
    const circularRec = val.circular_recommendation ?? ai.circular_recommendation ?? "Extending the operational lifespan of this device minimizes electronic waste and recovers critical raw materials.";
    const circScore = val.circularity_score ?? ai.circularity_score ?? Math.min(98, Math.max(65, 82 + (estimatedVal > 50000 ? 10 : 5)));
    const aiReasoning = val.reasoning ?? ai.reasoning ?? "Valuation determined by RevalueIQ AI vision analysis and user-confirmed hardware specifications.";
    const confidence = Math.round((val.confidence ?? ai.confidence ?? 0.88) * 100);

    const devName = `${deviceDetails.brand} ${deviceDetails.model}`.trim() || ai.device_name || inp.device_name || "Electronic Device";
    const category = deviceDetails.category || ai.category || inp.category || "Other";
    const envMetrics = calculateEnvironmentalMetrics(category, devName);

    return {
      id: resp.id,
      deviceName: devName,
      brand: deviceDetails.brand || ai.brand || "Generic",
      category: category as any,
      model: deviceDetails.model || ai.model || "Device",
      storage: deviceDetails.storage,
      imageUrls: uploadedImages.map((i) => i.url),
      primaryImage: primaryImageUrl,

      estimatedValue: estimatedVal,
      estimatedValueMin: Math.round((estimatedVal * 0.9) / 100) * 100,
      estimatedValueMax: Math.round((estimatedVal * 1.1) / 100) * 100,
      recommendedListingPrice: estimatedVal,
      tradeInValue: Math.round(estimatedVal * 0.85),
      originalMSRP: Math.round(estimatedVal * 1.5),
      valueRetentionPercent: Math.min(95, Math.max(20, Math.round((estimatedVal / (estimatedVal * 1.5 || 1)) * 100))),
      priceTrend: "Stable",
      priceTrendPercent: 0,

      circularScore: circScore,
      ecoGrade: circScore >= 85 ? "A+" : circScore >= 75 ? "A" : circScore >= 60 ? "B" : "C",
      co2OffsetKg: envMetrics.co2OffsetKg,
      eWasteDivertedKg: envMetrics.eWasteDivertedKg,
      materialsRecovered: envMetrics.materialsRecovered,

      repairCost: repairEstimate,
      repairFeasibilityScore: repairEstimate > 0 ? 75 : 95,
      repairRecommendation: (val.repair_recommendation ?? ai.repair_recommendation ?? (repairEstimate > 0 ? "Minor Repair & Sell" : "Keep / Reuse")) as any,
      repairItems: repairEstimate > 0 ? [
        {
          component: ai.damage_detected ? (ai.damage_description || "Component Servicing") : "Servicing",
          estimatedCost: repairEstimate,
          urgency: "Immediate",
          valueAddition: Math.round(repairEstimate * 1.3),
        }
      ] : [],

      conditionGrade: deviceDetails.condition || ai.visible_condition || "Fair",
      aiInsights: [
        {
          id: "insight-1",
          category: "Cosmetic",
          title: ai.visible_condition ? `Visual Condition: ${ai.visible_condition}` : "Visual Scan Complete",
          description: deviceDetails.additionalNotes || ai.damage_description || "Gemini neural vision model analyzed device photo.",
          confidence: confidence,
          type: ai.damage_detected ? "warning" : "positive",
        },
        {
          id: "insight-2",
          category: "Market",
          title: "Resale & Circular Recommendation",
          description: aiReasoning,
          confidence: confidence,
          type: "info",
        }
      ],
      confidenceScore: confidence,
      scannedAt: new Date(resp.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      specsMatchIndex: 96,
      marketDemandLiquidity: "High",

      // Phase 3.5 Fields
      marketRecommendation: marketRec,
      circularRecommendation: circularRec,
      aiReasoning: aiReasoning,
      damageDescription: ai.damage_description || (deviceDetails.additionalNotes ? deviceDetails.additionalNotes : undefined),
    };
  };

  // Trigger Final Valuation Calculation
  const handleStartAnalysis = async () => {
    if (uploadedImages.length === 0) {
      setError("Please select or capture a device photo to start appraisal.");
      return;
    }

    setError(null);
    setStage("analyzing");

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication required. Please sign in to appraise a device.");
      }

      const primaryImg = uploadedImages[0];
      const base64DataUri = await processImageToBase64(primaryImg);

      if (!base64DataUri || base64DataUri === "phase3-test-image") {
        throw new Error("Please select a valid device image to analyze.");
      }

      const deviceFullName = `${deviceDetails.brand} ${deviceDetails.model}`.trim() || "Electronic Device";
      const parsedYear = deviceDetails.purchaseYear && deviceDetails.purchaseYear !== "Not detected" ? parseInt(deviceDetails.purchaseYear, 10) : undefined;

      const newValuation = await createValuation(token, {
        device_name: deviceFullName,
        category: deviceDetails.category,
        brand: deviceDetails.brand || "Generic",
        model: deviceDetails.model || "Device",
        image_reference: base64DataUri,
        input: {
          device_name: deviceFullName,
          category: deviceDetails.category,
          brand: deviceDetails.brand,
          model: deviceDetails.model,
          image_reference: base64DataUri,
          storage: deviceDetails.storage !== "Not detected" ? deviceDetails.storage : undefined,
          ram: deviceDetails.ram !== "Not detected" ? deviceDetails.ram : undefined,
          purchase_year: isNaN(parsedYear as number) ? undefined : parsedYear,
          condition: deviceDetails.condition,
          functional_status: deviceDetails.functionalStatus !== "Not Detected / Unknown" ? deviceDetails.functionalStatus : undefined,
          has_original_box: deviceDetails.hasOriginalBox,
          has_charger: deviceDetails.hasCharger,
          additional_notes: deviceDetails.additionalNotes || undefined,
        },
      });

      const analyzedResult = await analyzeValuation(token, newValuation.id);
      const report = mapResponseToReport(analyzedResult, primaryImg.url);

      setCurrentReport(report);
      setStage("results");
      handleSaveReport(report);
    } catch (err: any) {
      console.error("[VALUATION ERROR]", err);
      setError(err.message || "Failed to analyze device image.");
      setStage("details");
    }
  };

  // Re-analyze click handler
  const handleReanalyzeClick = () => {
    if (isManuallyEdited) {
      setShowReanalyzeModal(true);
    } else {
      runAutoDetection(uploadedImages);
    }
  };

  const confirmReanalyze = () => {
    setShowReanalyzeModal(false);
    runAutoDetection(uploadedImages);
  };

  // Reset to Idle
  const handleResetFlow = () => {
    setStage("idle");
    setUploadedImages([]);
    setCurrentReport(null);
    setError(null);
    setIsManuallyEdited(false);
    setDetectionStatus("idle");
    setDetectionMessage(null);
    setDeviceDetails({
      category: "Smartphone",
      brand: "",
      model: "",
      storage: "Not detected",
      ram: "Not detected",
      purchaseYear: "Not detected",
      condition: "Minor Scratches",
      functionalStatus: "Not Detected / Unknown",
      hasOriginalBox: false,
      hasCharger: false,
      additionalNotes: "",
      aiDetectedFields: {},
    });
  };

  // Save Valuation to History
  const handleSaveReport = (reportToSave: ValuationReport) => {
    const newHistoryItem: ValuationHistoryItem = {
      id: reportToSave.id,
      deviceName: reportToSave.deviceName,
      category: reportToSave.category,
      thumbnail: reportToSave.primaryImage,
      date: new Date().toISOString().split("T")[0],
      condition: reportToSave.conditionGrade,
      estimatedValue: reportToSave.recommendedListingPrice,
      circularScore: reportToSave.circularScore,
      status: "Completed",
    };

    setHistory((prev) => [newHistoryItem, ...prev.filter((h) => h.id !== newHistoryItem.id)]);
  };

  // View past valuation history entry
  const handleSelectHistoryItem = async (item: ValuationHistoryItem) => {
    try {
      const token = await getToken();
      if (token && item.id && !item.id.startsWith("app-")) {
        const { getValuation } = await import("@/lib/valuationApi");
        const backendValuation = await getValuation(token, item.id);
        const report = mapResponseToReport(backendValuation, item.thumbnail);
        setCurrentReport(report);
        setStage("results");
        return;
      }
    } catch (err) {
      console.warn("Could not fetch valuation detail from backend:", err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Sub-Stage Top Bar: Back to Valuation Home (Visible when in sub-stages) */}
      {stage !== "idle" && (
        <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/50 pb-4 animate-in fade-in transition-all">
          <button
            onClick={handleResetFlow}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Back to Valuation Home</span>
          </button>
          <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest hidden sm:inline">
            AI Valuation • {stage === "details" ? "Device Details" : stage === "analyzing" ? "AI Analysis" : "Appraisal Report"}
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-xs font-bold underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Hero Section Banner (Visible when idle at top of workspace) */}
      {stage === "idle" && (
        <HeroSection onStartValuation={() => setStage("details")} />
      )}
      
      {/* Main Interactive Scan Workflow Area */}
      <div>

        {/* Stage: AI Detection Loading State */}
        {isAutoDetecting && (
          <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-8 text-center space-y-4 shadow-xl animate-in fade-in">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Analyzing your device...
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Identifying device type, brand, model and condition...
            </p>
          </div>
        )}

        {/* Stage: Form & Details Editing */}
        {stage === "details" && !isAutoDetecting && (
          <div
            key="details-form"
            className="space-y-6 transition-all duration-300 animate-in fade-in"
          >
            <DeviceUploadZone
              images={uploadedImages}
              onAddImage={handleAddImage}
              onRemoveImage={handleRemoveImage}
              onSelectPreset={handleSelectPreset}
              onUpdateImageAngle={handleUpdateImageAngle}
            />

            <DeviceDetailsForm
              details={deviceDetails}
              onChange={setDeviceDetails}
              onFieldUserEdit={() => setIsManuallyEdited(true)}
              detectionStatus={detectionStatus}
              detectionMessage={detectionMessage}
            />


            {/* Launch Scan Bar */}
            <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFlow}
                  className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 hover:bg-slate-200 dark:hover:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Reset Form
                </button>

                {uploadedImages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleReanalyzeClick}
                    className="px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-analyze Image</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={isAutoDetecting}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:pointer-events-none text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-2 group border-0"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Confirm & Calculate Valuation</span>
                <Play className="w-4 h-4 fill-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Stage: AI Analysis Animation */}
        {stage === "analyzing" && (
          <AIAnalysisAnimation
            images={uploadedImages}
            details={deviceDetails}
            onComplete={() => {}}
          />
        )}

        {/* Stage: Results Dashboard */}
        {stage === "results" && currentReport && (
          <ValuationResultsDashboard
            key="results-dashboard"
            report={currentReport}
            onReset={handleResetFlow}
            onSaveReport={handleSaveReport}
            onOpenPDF={() => setIsPDFOpen(true)}
            onNavigateTab={onNavigateTab}
          />
        )}
      </div>

      {/* History Table */}
      <ValuationHistoryTable
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onNavigateTab={onNavigateTab}
      />

      {/* Floating AI Copilot Assistant */}
      <FloatingAIAssistant
        report={currentReport}
        onNavigateTab={onNavigateTab}
      />

      {/* Official PDF Valuation Certificate Modal */}
      <PDFReportModal
        isOpen={isPDFOpen}
        onClose={() => setIsPDFOpen(false)}
        report={currentReport}
      />

      {/* Re-analyze Confirmation Modal */}
      {showReanalyzeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Re-analyze Image with Eco AI Vision?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You have manually edited some fields. Re-analyzing will replace your manual edits with freshly detected AI values.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReanalyzeModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReanalyze}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md hover:scale-[1.02] cursor-pointer"
              >
                Re-analyze
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
