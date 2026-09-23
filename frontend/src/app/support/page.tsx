import Link from "next/link";
import { LifeBuoy, FileText, MessageCircle, AlertCircle } from "lucide-react";

const options = [
  {
    title: "Knowledge Base",
    description: "Browse our articles, tutorials, and guides to find answers quickly.",
    icon: FileText,
    link: "/docs",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Frequently Asked Questions",
    description: "Find instant answers to common questions about valuations, repairs, and recycling.",
    icon: LifeBuoy,
    link: "/faqs",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Report an Issue",
    description: "Found a bug or an incorrect appraisal? Let our engineering team know.",
    icon: AlertCircle,
    link: "/contact",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  }
];

export default function SupportPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
            <LifeBuoy className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-poppins tracking-tight text-foreground">
            Support Center
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mt-4">
            We are here to help. Choose an option below to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {options.map((option, index) => (
            <Link key={index} href={option.link}>
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all group h-full">
                <div className={`w-14 h-14 rounded-xl ${option.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <option.icon className={`w-7 h-7 ${option.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{option.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}