import LandingHero from "@/components/landing/Hero";
import MarketplacePreview from "@/components/landing/MarketplacePreview";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <div className="flex flex-col bg-slate-50 dark:bg-[#06140e] text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <LandingHero />

      {/* Refurbished Marketplace Preview */}
      <MarketplacePreview />

      {/* Call to Action */}
      <CTA />
    </div>
  );
}
