"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";

const faqItems = [
  {
    question: "How accurate is the AI device valuation engine?",
    answer: "Our computer vision neural networks achieve over 99% agreement with certified hardware engineers. Models analyze cosmetic scratches, display panel integrity, port wear, and real-time market sales across 50+ secondary marketplaces.",
  },
  {
    question: "How are local repair shops verified on RevalueIQ?",
    answer: "Every repair shop undergoes strict vetting including IPC micro-soldering certification, OEM parts sourcing verification, minimum 4.5-star customer rating requirements, and proof of ESD-compliant laboratory standards.",
  },
  {
    question: "Is data sanitized before selling or donating a device?",
    answer: "Yes. RevalueIQ provides step-by-step DoD 5220.22-M compliant data wiping guides. Additionally, all certified marketplace buyers and donation hubs guarantee hardware cryptographic erasure prior to redistribution.",
  },
  {
    question: "How does RevalueIQ calculate CO₂ emissions saved?",
    answer: "We utilize official Life Cycle Assessment (LCA) data from hardware manufacturers (e.g. Apple, Dell, Lenovo) tracking raw material extraction, assembly energy, and transport footprint. Extending a smartphone lifespan by 2 years offsets ~55kg CO₂.",
  },
  {
    question: "Can I get a tax deduction receipt for donated electronics?",
    answer: "Absolutly. When donating through accredited non-profit hubs listed on RevalueIQ, you receive a digital 501(c)(3) tax-deductible donation receipt upon device check-in.",
  },
  {
    question: "Is there any cost to use the RevalueIQ valuation engine?",
    answer: "Device valuation, condition diagnostic scans, repair cost comparisons, and donation location searches are 100% free for individual consumers.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [searchFilter, setSearchFilter] = useState("");

  const filteredFaqs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <section className="py-24 sm:py-32 bg-slate-50 dark:bg-[#06140e] relative overflow-hidden border-t border-emerald-100 dark:border-emerald-900/40 transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Everything you need to know about our AI valuation engine, repair network, and sustainability reporting.
          </p>
        </div>

        {/* Search Input Filter */}
        <div className="relative mb-8">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search questions or topics..."
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-white dark:bg-[#0b1a13] border border-emerald-200 dark:border-emerald-900/40 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
          />
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-8">
              No matching questions found for &quot;{searchFilter}&quot;
            </p>
          ) : (
            filteredFaqs.map((faq, i) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={faq.question}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-white dark:bg-[#0b1a13] border-emerald-400 dark:border-emerald-500/50 shadow-md"
                      : "bg-white/80 dark:bg-[#0b1a13]/60 border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-700"
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className={`text-base font-bold transition-colors ${isOpen ? "text-emerald-700 dark:text-emerald-300" : "text-slate-900 dark:text-white"}`}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-emerald-100 dark:border-slate-800/60 mt-1 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
