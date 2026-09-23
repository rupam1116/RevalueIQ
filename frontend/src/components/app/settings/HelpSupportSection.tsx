"use client";

import React, { useState } from "react";
import { FaqItem } from "@/lib/mockSettingsData";
import {
  HelpCircle,
  Headphones,
  FileQuestion,
  Bug,
  Lightbulb,
  ShieldCheck,
  FileText,
  Info,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

interface HelpSupportSectionProps {
  faqItems: FaqItem[];
  onOpenContactSupport: () => void;
  onOpenReportBug: () => void;
  onOpenFeatureRequest: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
}

export const HelpSupportSection: React.FC<HelpSupportSectionProps> = ({
  faqItems,
  onOpenContactSupport,
  onOpenReportBug,
  onOpenFeatureRequest,
  onOpenPrivacyPolicy,
  onOpenTerms,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqItems[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="help" className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Help, Knowledge Base & Support
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Access customer assistance, report issues, suggest platform features, or review legal agreements.
        </p>
      </div>

      {/* Support Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Contact Support */}
        <button
          type="button"
          onClick={onOpenContactSupport}
          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit group-hover:scale-105 transition-transform">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
              Contact Support
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">24/7 dedicated assistance ticket</p>
          </div>
        </button>

        {/* Report a Bug */}
        <button
          type="button"
          onClick={onOpenReportBug}
          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit group-hover:scale-105 transition-transform">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
              Report a Bug
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Submit technical issue logs</p>
          </div>
        </button>

        {/* Feature Request */}
        <button
          type="button"
          onClick={onOpenFeatureRequest}
          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit group-hover:scale-105 transition-transform">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
              Feature Request
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Suggest circular tools</p>
          </div>
        </button>

        {/* About RevalueIQ */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 w-fit">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-200">About RevalueIQ</p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
              v2.4.0 Enterprise (Build 8941)
            </p>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Section */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <FileQuestion className="w-4 h-4" /> Frequently Asked Questions (FAQ)
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge base..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-slate-900 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-3.5 pt-0 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legal & Policy Links Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-slate-800 dark:text-slate-300 font-semibold">Legal & Compliance Documents</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenPrivacyPolicy}
            className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-colors cursor-pointer underline flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" /> Privacy Policy
          </button>
          <span className="text-slate-400 dark:text-slate-700">•</span>
          <button
            type="button"
            onClick={onOpenTerms}
            className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-colors cursor-pointer underline flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" /> Terms & Conditions
          </button>
        </div>
      </div>
    </section>
  );
};
