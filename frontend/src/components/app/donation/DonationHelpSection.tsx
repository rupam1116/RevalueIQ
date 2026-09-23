"use client";

import React, { useState } from "react";
import { Heart, Globe, RefreshCw, Receipt, CheckCircle2, Sparkles, Bot, X, MessageSquare, PhoneCall, Headphones, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DonationHelpSection: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Hello! Need help choosing the best verified NGO or school for your electronics donation? Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [supportFeedback, setSupportFeedback] = useState<string | null>(null);

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: promptText }]);
    setInput("");

    setTimeout(() => {
      let reply = "Based on your location and device type, TechForGood Foundation and GreenByte Rural Education Trust are highest impact recipient NGOs!";
      const lower = promptText.toLowerCase();
      if (lower.includes("tax") || lower.includes("80g")) {
        reply = "Yes! All verified NGOs in our directory issue instant 80G tax exemption certificates right after pickup.";
      } else if (lower.includes("pickup") || lower.includes("home")) {
        reply = "Free doorstep pickup is available in 1-click through the RevalueIQ donation workflow across major cities.";
      }
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 500);
  };

  const handleCallbackRequest = () => {
    setSupportFeedback("Callback requested! Our CSR advisor will call you within 15 minutes.");
    setTimeout(() => setSupportFeedback(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* 4 Key Pillar Grid matching Marketplace card design */}
      <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> Circular CSR Guide
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Why Donate Your Electronics?</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Extending the lifecycle of usable technology is one of the highest-impact ways to preserve resources and empower human potential.
          </p>
        </div>

        {/* 4 Key Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Benefits to Society */}
          <div className="bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Benefits to Society</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Bridge the digital divide by equipping rural schools, orphanages, and digital literacy labs with functional technology for STEM education.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
              <li className="flex items-center gap-1.5 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Empower student learning</li>
              <li className="flex items-center gap-1.5 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Support community centers</li>
            </ul>
          </div>

          {/* Benefits to Environment */}
          <div className="bg-teal-50/40 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 hover:border-teal-300 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Benefits to Environment</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Prevent toxic heavy metals from polluting groundwater while dramatically reducing mining for rare earth elements.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-teal-100 dark:border-teal-900/40">
              <li className="flex items-center gap-1.5 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Divert toxic landfill waste</li>
              <li className="flex items-center gap-1.5 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Lower carbon footprint</li>
            </ul>
          </div>

          {/* Circular Economy Impact */}
          <div className="bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Circular Economy Impact</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Transition from linear "take-make-dispose" to sustainable circularity. Every device donated delays new manufacturing cycles.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
              <li className="flex items-center gap-1.5 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Extend product lifecycle</li>
              <li className="flex items-center gap-1.5 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Boost Eco Credit score</li>
            </ul>
          </div>

          {/* Tax Benefits */}
          <div className="bg-amber-50/40 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 hover:border-amber-300 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Tax Benefits & Receipts</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Donations made to 80G certified partner NGOs qualify for tax deductions and official corporate CSR compliance certificates.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-amber-100 dark:border-amber-900/40">
              <li className="flex items-center gap-1.5 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> 80G Tax Certificates</li>
              <li className="flex items-center gap-1.5 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Instant digital receipt</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Floating Support Assistant Widget matching RevalueIQ Assistant style */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isAssistantOpen && (
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all duration-200 cursor-pointer border border-emerald-400/40"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span>Need Help Choosing Org?</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-300 text-slate-950 text-[10px] font-extrabold uppercase">
              Support
            </span>
          </button>
        )}

        {isAssistantOpen && (
          <div className="w-80 sm:w-96 bg-white dark:bg-[#0b1a13] border border-emerald-300 dark:border-emerald-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[460px] animate-in slide-in-from-bottom-5 duration-200">
            {/* Widget Header */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold">Need Help Choosing an Org?</h4>
                  <p className="text-[10px] text-emerald-200">RevalueIQ CSR Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsAssistantOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Support Actions Bar */}
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/40 grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSendPrompt("Which NGO should I choose?")}
                className="rounded-xl border-emerald-200 text-[10px] font-bold h-8"
              >
                <MessageSquare className="w-3 h-3 mr-1 text-emerald-600" /> Chat
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCallbackRequest}
                className="rounded-xl border-emerald-200 text-[10px] font-bold h-8"
              >
                <PhoneCall className="w-3 h-3 mr-1 text-teal-600" /> Callback
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSendPrompt("Connect to human support")}
                className="rounded-xl border-emerald-200 text-[10px] font-bold h-8"
              >
                <Headphones className="w-3 h-3 mr-1 text-emerald-600" /> Support
              </Button>
            </div>

            {/* Notification Toast */}
            {supportFeedback && (
              <div className="px-4 py-2 bg-emerald-600 text-white text-[11px] font-bold text-center animate-in fade-in">
                {supportFeedback}
              </div>
            )}

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      m.sender === "user"
                        ? "bg-emerald-600 text-white font-medium rounded-br-none"
                        : "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-slate-800 dark:text-slate-200 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-[#0b1a13] border-t border-emerald-100 dark:border-emerald-900/60 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendPrompt(input)}
                placeholder="Ask about donation options..."
                className="flex-1 px-3 py-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                onClick={() => handleSendPrompt(input)}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
