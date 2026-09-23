import HowItWorks from "@/components/landing/HowItWorks";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-[#06140e] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <HowItWorks />

        <div className="mt-16 text-center">
          <Link href="/signup">
            <Button size="lg" className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold h-13 px-9 text-base shadow-xl shadow-emerald-600/20">
              Try AI Valuation Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}