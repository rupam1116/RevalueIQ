import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Basic",
    price: "Free",
    description: "Perfect for individuals evaluating a few devices before selling or donating.",
    features: [
      "Up to 5 AI Appraisals per month",
      "Basic Category & Make Verification",
      "Estimated Resale Value Range",
      "Standard Repair Guidance",
      "Donation Center Matching",
    ],
    missing: [
      "Computer Vision Damage Detection",
      "API Access",
      "Bulk Uploads",
    ],
    cta: "Get Started for Free",
    link: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "Ideal for tech enthusiasts, small repair shops, and resellers.",
    features: [
      "Unlimited AI Appraisals",
      "Computer Vision Damage Detection",
      "Precise Market Value Trend Charts",
      "PDF Report Exports",
      "Advanced Generative AI Repair Manuals",
      "Priority Customer Support",
    ],
    missing: [
      "API Access",
    ],
    cta: "Upgrade to Pro",
    link: "/signup",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For e-waste management facilities and large-scale refurbishers.",
    features: [
      "Everything in Pro",
      "Full API Access",
      "Bulk Inventory Uploads (CSV/Excel)",
      "Custom Valuation Models",
      "White-labeled PDF Reports",
      "Dedicated Account Manager",
    ],
    missing: [],
    cta: "Contact Sales",
    link: "/contact",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-poppins tracking-tight text-foreground">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mt-6">
            Choose the plan that fits your needs. Whether you are an individual or an enterprise, we have you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border ${
                tier.highlight 
                  ? 'border-primary shadow-xl relative scale-105 md:-translate-y-4 z-10' 
                  : 'border-border shadow-sm mt-4'
              } flex flex-col h-full`}
            >
              {tier.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                <p className="text-muted-foreground h-12 text-sm">{tier.description}</p>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-foreground">{tier.price}</span>
                {tier.period && <span className="text-muted-foreground font-medium"> {tier.period}</span>}
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
                {tier.missing.map((feature, i) => (
                  <li key={i} className="flex items-start opacity-50">
                    <X className="w-5 h-5 text-muted-foreground mr-3 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 line-through">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href={tier.link} className="w-full mt-auto">
                <Button 
                  size="lg" 
                  variant={tier.highlight ? "default" : "outline"} 
                  className={`w-full rounded-full h-12 ${
                    tier.highlight ? 'bg-primary hover:bg-primary/90 text-white shadow-lg' : ''
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}