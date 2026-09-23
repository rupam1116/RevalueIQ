"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, TrendingUp, AlertCircle, ShoppingBag, Wrench, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/PrintButton";
import { PriceChart } from "@/components/PriceChart";

import { useAuth } from "@/context/AuthContext";
import { getValuation } from "@/lib/valuationApi";

export default function AppraisalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, getToken, loading } = useAuth();
  const [appraisal, setAppraisal] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppraisal = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setErrorMsg("Your session has expired. Please sign in again.");
          setFetching(false);
          return;
        }
        const data = await getValuation(token, resolvedParams.id);
        const val = data.valuation || {};
        const ai = data.ai_analysis || {};
        const inp = data.input || {};
        const estVal = val.estimated_resale_value ?? ai.estimated_resale_value ?? 0;
        const repEst = val.estimated_repair_cost ?? val.repair_estimate ?? ai.estimated_repair_cost ?? 0;

        setAppraisal({
          id: data.id,
          valuationCode: data.valuation_code,
          userId: data.user_id,
          deviceName: ai.device_name || inp.device_name || "Electronic Device",
          category: ai.category || inp.category || "Electronics",
          condition: ai.visible_condition || "Fair",
          conditionDetails: ai.damage_description || (inp.additional_notes ? inp.additional_notes : "Analyzed via RevalueIQ Gemini AI vision."),
          estimatedValue: estVal,
          repairCost: repEst,
          circularityScore: val.circularity_score ?? ai.circularity_score ?? 82,
          confidence: Math.round((val.confidence ?? ai.confidence ?? 0.88) * 100),
          lowEstimate: Math.round(estVal * 0.9),
          highEstimate: Math.round(estVal * 1.1),
          recommendation: val.market_recommendation || val.recommendation || ai.repair_recommendation || "Resell / Recycle",
          circularRecommendation: val.circular_recommendation || ai.circular_recommendation || "Extending operational lifespan minimizes e-waste.",
          recommendationReason: val.reasoning || ai.reasoning || "Based on circular resale market analysis.",
          imageUrl: inp.image_reference || null,
          createdAt: data.created_at,
          completedAt: data.completed_at || data.updated_at,
        });
      } catch (error: any) {
        console.error("Failed to fetch valuation detail:", error);
        setErrorMsg(error.message || "This valuation could not be found.");
        setAppraisal(null);
      } finally {
        setFetching(false);
      }
    };

    if (!loading) {
      fetchAppraisal();
    }
  }, [loading, resolvedParams.id, getToken]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center container mx-auto px-4">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-emerald-600 animate-ping" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Loading appraisal details...</span>
        </div>
      </div>
    );
  }

  if (!appraisal) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center container mx-auto px-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Appraisal Detail</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          {errorMsg || "This valuation record could not be found or access is unauthorized."}
        </p>
        <Link href="/app">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Format the dates and values
  const dateStr = new Date(appraisal.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  
  const formattedValue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(appraisal.estimatedValue);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link href="/app" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Workspace
          </Link>
          <PrintButton />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Image & Primary Value */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-1 border border-border shadow-sm overflow-hidden">
              <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-[1.4rem] overflow-hidden flex items-center justify-center relative">
                {appraisal.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={appraisal.imageUrl} alt={appraisal.deviceName} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 flex flex-col items-center text-muted-foreground">
                    <span className="text-4xl mb-2">📸</span>
                    <p className="text-sm font-medium">Image not saved</p>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-border">
                  {appraisal.category}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-border shadow-sm text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <p className="text-sm font-medium text-muted-foreground mb-1 relative z-10">Estimated AI Value</p>
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 mb-2 relative z-10">
                {formattedValue}
              </h2>
              {appraisal.lowEstimate && appraisal.highEstimate && (
                <p className="text-sm text-slate-500 dark:text-slate-400 relative z-10">
                  Range: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(appraisal.lowEstimate)} - {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(appraisal.highEstimate)}
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Details & Action */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-sm">
              <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{appraisal.deviceName}</h1>
                  <p className="text-muted-foreground flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                    Appraised on {dateStr}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  appraisal.condition.toLowerCase().includes('excellent') || appraisal.condition.toLowerCase().includes('pristine') ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800' :
                  appraisal.condition.toLowerCase().includes('good') || appraisal.condition.toLowerCase().includes('fair') ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800' :
                  'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800'
                }`}>
                  {appraisal.condition} Condition
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center text-foreground mb-3">
                    <AlertCircle className="w-5 h-5 mr-2 text-emerald-600" /> AI Condition Assessment
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-slate-700 dark:text-slate-300 leading-relaxed border border-border">
                    "{appraisal.conditionDetails}"
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold flex items-center text-foreground mb-3">
                    <TrendingUp className="w-5 h-5 mr-2 text-teal-600" /> Recommendation: {appraisal.recommendation}
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-slate-700 dark:text-slate-300 leading-relaxed border border-border">
                    {appraisal.recommendationReason}
                  </div>
                </div>

                {/* Price Trend Chart */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-lg font-semibold flex items-center text-foreground mb-3">
                    <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" /> Market Value Trend (6 Months)
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-border">
                    <PriceChart currentValue={appraisal.estimatedValue} />
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps CTA */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/10 rounded-3xl p-8 border border-emerald-500/20 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-foreground mb-2">Ready for the next step?</h3>
                <p className="text-muted-foreground mb-6">Based on the {appraisal.recommendation.toLowerCase()} recommendation, here are your best options.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Link href="/marketplace">
                    <Button className="w-full rounded-2xl h-14 bg-white dark:bg-slate-800 text-foreground border border-border hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm flex flex-col items-center justify-center gap-1 group">
                      <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Sell on Marketplace</span>
                    </Button>
                  </Link>
                  <Link href={`/repair-shops?product=${encodeURIComponent(appraisal.deviceName || appraisal.category || '')}`}>
                    <Button className="w-full rounded-2xl h-14 bg-white dark:bg-slate-800 text-foreground border border-border hover:border-teal-500 hover:text-teal-600 transition-all shadow-sm flex flex-col items-center justify-center gap-1 group">
                      <Wrench className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Find Repair Shop</span>
                    </Button>
                  </Link>
                  <Link href={`/app/donation?product=${encodeURIComponent(appraisal.deviceName || appraisal.category || '')}&category=${encodeURIComponent(appraisal.category || '')}&brand=${encodeURIComponent(appraisal.brand || '')}`}>
                    <Button className="w-full rounded-2xl h-14 bg-white dark:bg-slate-800 text-foreground border border-border hover:border-green-500 hover:text-green-500 transition-all shadow-sm flex flex-col items-center justify-center gap-1 group">
                      <HeartHandshake className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Donate Device</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
