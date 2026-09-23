"use client";

import { Star, Quote, Leaf } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Senior Hardware Lead @ TechScale",
    avatar: "AR",
    rating: 5,
    quote: "RevalueIQ's vision AI condition grading was accurate within 1.5% of our manual technician appraisal. We processed over 350 devices this month effortlessly.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Dr. Sarah Chen",
    role: "Director of Sustainability @ EcoLoop",
    avatar: "SC",
    rating: 5,
    quote: "Finding certified local repair shops used to take hours of vetting. RevalueIQ gives us instant access to reliable technicians and tracks our e-waste carbon offsets automatically.",
    gradient: "from-teal-500 to-green-500",
  },
  {
    name: "Marcus Vance",
    role: "Founder @ ReFix Solutions Network",
    avatar: "MV",
    rating: 5,
    quote: "As a repair shop owner, joining the RevalueIQ network brought us over 80 verified repair orders in our first month. The customer flow and parts tracking are seamless.",
    gradient: "from-green-500 to-emerald-600",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-[#06140e] relative overflow-hidden border-t border-emerald-100 dark:border-emerald-900/40 transition-colors duration-300">
      {/* Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-emerald-500/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
            <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            User Stories & Feedback
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Trusted by Leaders in{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
              Sustainable Tech
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            See how individuals, sustainability directors, and repair networks rely on RevalueIQ to extend device lifecycles.
          </p>
        </div>

        {/* 3 Premium Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0b1a13]/80 backdrop-blur-xl border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between group hover:-translate-y-1 relative"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-300 dark:text-slate-700 group-hover:text-emerald-500/40 transition-colors" />
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-8">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-emerald-100 dark:border-slate-800/80">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.gradient} font-extrabold text-white text-sm flex items-center justify-center shadow-md shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
