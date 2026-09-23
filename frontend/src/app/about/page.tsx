import CircularBenefits from "@/components/landing/CircularBenefits";
import { Info, ShieldCheck, Heart, Sparkles, Building2, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-[#06140e] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        
        {/* About Us Hero */}
        <section className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-300 dark:border-emerald-500/20 shadow-sm">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> ABOUT REVALUEIQ
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Building the Infrastructure for <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">Sustainable Electronics</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            RevalueIQ is an AI-powered circular economy ecosystem designed to transform how individuals and organizations manage the full lifecycle of electronic devices.
          </p>
        </section>

        {/* Company Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Intelligence</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated visual condition assessment and algorithmic residual market pricing to unlock immediate device value.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verified Network</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Connecting users with certified repair centers and authorized e-waste donation hubs nationwide.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Eco Impact</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Diverting thousands of metric tons of toxic electronic waste from landfills while promoting affordable technology access.
            </p>
          </div>
        </div>

        {/* Circular Benefits Section */}
        <CircularBenefits />

      </div>
    </div>
  );
}