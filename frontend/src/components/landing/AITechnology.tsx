"use client";

import { useState } from "react";
import {
  Eye, Brain, TrendingUp, Sparkles, Database, Cpu, CheckCircle2, ScanLine
} from "lucide-react";

const aiTechItems = [
  {
    id: "vision",
    icon: Eye,
    title: "Computer Vision",
    headline: "Sub-millimeter Cosmetic Surface Inspection",
    description: "Multi-angle convolutional neural networks inspect upload photos for hairline display cracks, aluminum bezel scuffs, port corrosion, and pixel burn.",
    stats: "99.4% Grading Accuracy",
    codeSample: "model.predict_surface_defect(img_tensor)",
  },
  {
    id: "genai",
    icon: Brain,
    title: "Generative AI",
    headline: "Automated Device Inspection & Condition Reports",
    description: "Generates human-readable condition audit summaries, buyer transparent disclosures, and custom repair step-by-step instructions.",
    stats: "Instant Report Generation",
    codeSample: "genai.summarize_hardware_health(diagnostic_logs)",
  },
  {
    id: "pricing",
    icon: TrendingUp,
    title: "Price Prediction",
    headline: "Real-time Resale Market Valuation Models",
    description: "Time-series machine learning models analyze 50M+ historical marketplace transactions to forecast optimal listing price and depreciation curve.",
    stats: "Updated Every 15 Minutes",
    codeSample: "price_engine.predict_fair_value(model, grade)",
  },
  {
    id: "analysis",
    icon: ScanLine,
    title: "Image Analysis",
    headline: "OEM Part Authentication & Serial OCR",
    description: "Optical Character Recognition extracts IMEI, serial numbers, screen panel identifiers, and flags counterfeit or altered hardware components.",
    stats: "500+ Device Schemas",
    codeSample: "ocr.extract_serial_and_verify_oem(images)",
  },
  {
    id: "intelligence",
    icon: Database,
    title: "Market Intelligence",
    headline: "Global Electronics Demand Aggregation",
    description: "Aggregates secondary market demand, refurbish supply chains, component shortage indices, and e-waste recycling commodity values.",
    stats: "Global Regional Index",
    codeSample: "market_stream.fetch_liquidity_depth(part_id)",
  },
];

export default function AITechnology() {
  const [activeTab, setActiveTab] = useState("vision");

  const currentItem = aiTechItems.find((item) => item.id === activeTab) || aiTechItems[0];

  return (
    <section id="ai-technology" className="py-24 sm:py-32 bg-slate-50 dark:bg-[#06140e] relative overflow-hidden border-t border-emerald-100 dark:border-emerald-900/40 transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
            <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Proprietary Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Powered by{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
              Advanced AI Engines
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Our multi-modal neural network combines computer vision, generative AI, optical analysis, and time-series market intelligence.
          </p>
        </div>

        {/* Split Layout: Selector Left, Interactive AI Playground Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: 5 AI Capabilities Buttons */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-center">
            {aiTechItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeTab;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                    isActive
                      ? "bg-white dark:bg-[#0b1a13] border-emerald-500 shadow-lg shadow-emerald-500/10"
                      : "bg-white/60 dark:bg-[#0b1a13]/60 border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-white dark:hover:bg-[#0b1a13]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-md"
                        : "bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-slate-300 group-hover:text-emerald-800 dark:group-hover:text-white"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-base font-bold transition-colors ${isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {item.stats}
                      </p>
                    </div>
                  </div>

                  <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isActive ? "bg-emerald-500 scale-125 shadow-[0_0_8px_#10b981]" : "bg-slate-300 dark:bg-slate-700 opacity-40"
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic AI Engine Code & Inspection Viewport */}
          <div className="lg:col-span-7">
            <div className="h-full rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all duration-300">
              {/* Accent top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500" />

              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between pb-6 border-b border-emerald-100 dark:border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      {currentItem.title} Engine
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60">
                    LIVE INFERENCE ACTIVE
                  </span>
                </div>

                {/* Headline & Description */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {currentItem.headline}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  {currentItem.description}
                </p>
              </div>

              {/* Simulated Code & Execution Console */}
              <div className="rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span>revalue-ai-core.ts</span>
                </div>
                <p className="text-emerald-400 pt-1">&gt; Initializing neural model...</p>
                <p className="text-slate-200">&gt; Executing: <span className="text-teal-300 font-bold">{currentItem.codeSample}</span></p>
                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Latency: 14ms
                  </span>
                  <span className="text-emerald-400 font-bold">{currentItem.stats}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
