import Features from "@/components/landing/Features";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-[#06140e] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <Features />

        <div className="mt-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-slate-900 dark:via-[#0b1a13] dark:to-slate-950 rounded-3xl p-10 md:p-14 text-center border border-emerald-200 dark:border-emerald-900/50 shadow-xl max-w-4xl mx-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Ready to experience these features?</h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Stop guessing device value. Upload your first electronics photo today and let our AI handle valuation, repair advice, and recycling.
            </p>
            <Link href="/signup" className="inline-block pt-2">
              <Button size="lg" className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold h-13 px-8 text-base shadow-lg shadow-emerald-600/20">
                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}