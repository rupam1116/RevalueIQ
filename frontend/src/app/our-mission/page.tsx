import { Leaf, Globe, Zap, HeartHandshake } from "lucide-react";

export default function OurMissionPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-[#06140e] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        
        {/* Mission Hero */}
        <section className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-300 dark:border-emerald-500/20 shadow-sm">
            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> OUR MISSION
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Pioneering the <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">Circular Economy</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            At RevalueIQ, we believe that technology shouldn&apos;t cost the Earth. We are building the intelligence layer for global e-waste management, empowering consumers and businesses to make sustainable decisions.
          </p>
        </section>

        {/* Impact Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">50M+ Tons</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Annual global e-waste created worldwide</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">AI Powered</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Instant condition grading & valuation</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">100% Zero-Waste</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Connecting repair, resale & eco donation</p>
          </div>
        </div>

      </div>
    </div>
  );
}
