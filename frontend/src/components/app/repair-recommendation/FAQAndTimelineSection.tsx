"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Clock, CheckCircle2, Wrench } from "lucide-react";

export const FAQAndTimelineSection: React.FC = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const FAQS = [
    {
      q: "Will repairing my iPhone void manufacturer warranty?",
      a: "No! All repair centers listed in our Authorized category are certified OEM partners, meaning your factory warranty remains 100% intact.",
    },
    {
      q: "How does Doorstep Express Courier Pickup work?",
      a: "Once booked, a certified courier rider picks up your device in a tamper-proof eco-box. Diagnostic updates are pushed to your dashboard in real time.",
    },
    {
      q: "What if my repair takes longer than estimated?",
      a: "Our RevalueIQ Guarantee covers loaner device dispatch or diagnostic credit if a repair exceeds the estimated turnaround time.",
    },
  ];

  const TIMELINE_STEPS = [
    { step: 1, title: "Book Appointment", desc: "Select slot or doorstep pickup" },
    { step: 2, title: "AI Diagnostic Scan", desc: "Hardware audit & serial check" },
    { step: 3, title: "Genuine OEM Repair", desc: "Display / battery installation" },
    { step: 4, title: "QC & E-Waste Logging", desc: "TrueTone & battery cycle test" },
    { step: 5, title: "Ready for Pickup", desc: "Sanitized & ready for handoff" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
      {/* Left: FAQs Accordion (7 Columns) */}
      <div className="lg:col-span-7 bg-[#162433] border border-white/[0.06] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <HelpCircle className="w-5 h-5 text-[#38BDF8]" />
          <h3 className="text-base font-extrabold text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#101C28]/80 border border-white/[0.06] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-[#00D084] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#00D084]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#94A3B8] leading-relaxed border-t border-white/[0.04] pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Repair Process Timeline (5 Columns) */}
      <div className="lg:col-span-5 bg-[#162433] border border-white/[0.06] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <Clock className="w-5 h-5 text-[#00D084]" />
          <h3 className="text-base font-extrabold text-white">Repair Lifecycle Timeline</h3>
        </div>

        <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.08]">
          {TIMELINE_STEPS.map((s) => (
            <div key={s.step} className="relative flex items-start gap-3 pl-7">
              <div className="absolute left-1.5 top-0.5 w-3.5 h-3.5 rounded-full bg-[#101C28] border-2 border-[#00D084] text-[9px] font-bold text-[#00D084] flex items-center justify-center -translate-x-1/2">
                {s.step}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">{s.title}</h4>
                <p className="text-[11px] text-[#94A3B8]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
