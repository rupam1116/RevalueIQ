"use client";
import { getApiUrl } from "@/lib/api";

import { useRouter } from "next/navigation";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, CheckCircle, Smartphone, Camera, LineChart, Wrench, RefreshCw, X, ShieldCheck, AlertCircle, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createValuation, analyzeValuation } from "@/lib/valuationApi";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
};

type UploadState = "idle" | "uploading" | "analyzing" | "results";

const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
      return resolve(file);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const maxDimension = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        } else if (file.size < 1024 * 1024) {
          return resolve(file);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.82
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export default function UploadPage() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, getToken } = useAuth();

  useEffect(() => {
    router.replace("/app/valuation");
  }, [router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setUploadState("uploading");
      uploadAndAnalyze(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setUploadState("uploading");
      uploadAndAnalyze(file);
    }
  };



  const uploadAndAnalyze = async (file: File) => {
    try {
      const compressedFile = await compressImage(file);
      const base64DataUri = await fileToBase64(compressedFile);

      setUploadState("uploading");
      setProgress(30);

      const token = await getToken();
      if (!token) {
        throw new Error("User authentication is required to appraise a device.");
      }

      // Step 1: Create pending valuation record with real uploaded image Base64 data URI
      setProgress(50);
      const newValuation = await createValuation(token, {
        device_name: file.name,
        image_reference: base64DataUri,
        input: {
          device_name: file.name,
          image_reference: base64DataUri,
        },
      });

      setProgress(80);
      setUploadState("analyzing");
      startAnalyzingProgress();

      // Step 2: Trigger Gemini AI image analysis on the backend
      const analyzedValuation = await analyzeValuation(token, newValuation.id);

      setAnalysisResult({
        id: analyzedValuation.id,
        deviceName: analyzedValuation.ai_analysis?.device_name || analyzedValuation.input?.device_name || "Electronic Device",
        category: analyzedValuation.ai_analysis?.category || "Electronics",
        condition: analyzedValuation.ai_analysis?.visible_condition || "Fair",
        conditionDetails: analyzedValuation.ai_analysis?.damage_description || "No visible surface damage.",
        estimatedValue: analyzedValuation.valuation?.estimated_resale_value || 0,
        recommendation: analyzedValuation.valuation?.recommendation || "Resell / Recycle",
        recommendationReason: analyzedValuation.ai_analysis?.reasoning || "Analyzed via RevalueIQ Gemini AI.",
      });

    } catch (err: any) {
      console.error("Image appraisal error:", err);
      setError(err.message || "Failed to analyze image");
      setUploadState("idle");
      setProgress(0);
    }
  };

  let analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnalyzingProgress = () => {
    setProgress(0);
    analysisIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          return prev;
        }
        return prev + 2;
      });
    }, 150);
  };

  useEffect(() => {
    if (uploadState === "analyzing" && analysisResult) {
      setProgress(100);
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
      
      setTimeout(() => {
        if (analysisResult.id) {
          router.push(`/dashboard/${analysisResult.id}`);
        } else {
          setUploadState("results");
        }
      }, 500);
    }
  }, [uploadState, analysisResult, router]);

  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    }
  }, []);

  const resetFlow = () => {
    setUploadState("idle");
    setProgress(0);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden flex items-center justify-center bg-background">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background"></div>
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
      <div className="absolute top-1/3 -right-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] -z-10 mix-blend-multiply"></div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" /> Circular E-Waste Valuation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
            Analyze Your <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Device</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Upload a clear image of your electronics. Our AI will automatically verify the model, assess damage, calculate circular score, and predict resale value.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-100 dark:border-emerald-900/50 shadow-2xl bg-white dark:bg-[#0b1a13] backdrop-blur-2xl p-6 md:p-10 relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center transition-all duration-300">
          
          {/* IDLE STATE */}
          {uploadState === "idle" && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
              {error && (
                <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
              <div 
                className="w-full max-w-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 rounded-3xl p-12 hover:border-emerald-600 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center group"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Click or Drag & Drop Device Photo</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">SVG, PNG, JPG or GIF (max. 10MB)</p>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-semibold"><ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Enterprise Encrypted</span>
                  <span className="flex items-center gap-1 font-semibold"><Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Clear Lighting Preferred</span>
                </div>
              </div>
            </div>
          )}

          {/* UPLOADING STATE */}
          {uploadState === "uploading" && (
            <div className="w-full max-w-md flex flex-col items-center text-center animate-in fade-in duration-300">
              <div className="w-24 h-24 mb-6 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-lg relative">
                {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-white animate-spin" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Uploading Image...</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Transferring your device photo securely to AI analysis engine.</p>
              <Progress value={progress} className="w-full h-2 mb-2 bg-emerald-100 dark:bg-emerald-950" />
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{progress}%</p>
            </div>
          )}

          {/* ANALYZING STATE */}
          {uploadState === "analyzing" && (
            <div className="w-full max-w-md flex flex-col items-center text-center animate-in fade-in duration-300">
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 border-4 border-emerald-200 dark:border-emerald-900 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-600 dark:border-emerald-400 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              
              <h3 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Eco AI Analysis in Progress
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Analyzing condition & circular value...</p>
              
              <div className="space-y-3 w-full text-left mt-2 mb-8">
                <div className="flex items-center gap-3">
                  {progress > 20 ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />}
                  <span className={progress > 20 ? "text-slate-900 dark:text-white font-bold" : "text-slate-500"}>Verifying Device Model & Specs...</span>
                </div>
                <div className="flex items-center gap-3">
                  {progress > 50 ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : progress > 20 ? <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700" />}
                  <span className={progress > 50 ? "text-slate-900 dark:text-white font-bold" : progress > 20 ? "text-emerald-600 font-bold" : "text-slate-500"}>Detecting Surface Damage & Defects...</span>
                </div>
                <div className="flex items-center gap-3">
                  {progress > 90 ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : progress > 50 ? <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700" />}
                  <span className={progress > 90 ? "text-slate-900 dark:text-white font-bold" : progress > 50 ? "text-emerald-600 font-bold" : "text-slate-500"}>Calculating Circular Value & E-Waste Impact...</span>
                </div>
              </div>
              
              <Progress value={progress} className="w-full h-2 bg-emerald-100 dark:bg-emerald-950" />
            </div>
          )}

          {/* RESULTS STATE */}
          {uploadState === "results" && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-6 mb-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-md">
                      {previewUrl && <img src={previewUrl} alt="Analyzed Device" className="w-full h-full object-cover" />}
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-emerald-600 text-white rounded-full p-1.5 shadow-lg">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{analysisResult?.deviceName || 'Unknown Device'}</h2>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full font-bold">{analysisResult?.category || 'Electronics'}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={resetFlow} className="rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/60">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-emerald-50/50 dark:bg-[#06140e]/60 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-slate-500 mb-3">
                      <Camera className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold">Condition</span>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{analysisResult?.condition || 'N/A'}</div>
                    <p className="text-sm text-slate-500">{analysisResult?.conditionDetails}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-100 dark:border-emerald-900/40 text-sm font-bold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-4 h-4" /> Visual Check Complete
                  </div>
                </div>

                <div className="bg-emerald-50/50 dark:bg-[#06140e]/60 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-slate-500 mb-3">
                      <LineChart className="w-5 h-5 text-teal-600" />
                      <span className="font-bold">Est. Value</span>
                    </div>
                    <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-2">
                      ₹{analysisResult?.estimatedValue ? Number(analysisResult.estimatedValue).toLocaleString('en-IN') : '0'}
                    </div>
                    <p className="text-sm text-slate-500">Based on circular market index.</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-600/10 to-teal-600/10 p-6 rounded-2xl border border-emerald-500/30 flex flex-col justify-between relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold mb-3 uppercase tracking-wider text-sm">
                      Eco Recommendation
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{analysisResult?.recommendation || 'Unknown'}</div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {analysisResult?.recommendationReason}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Link href="/marketplace" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-600/20 hover:scale-[1.02] transition-transform h-14 px-8 text-base font-bold">
                    Proceed to Marketplace
                  </Button>
                </Link>
                <Link href="/repair" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full rounded-2xl h-14 px-8 text-base font-bold border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors">
                    View Repair Options
                  </Button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}