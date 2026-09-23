"use client";

import React, { useState } from "react";
import { Bot, Sparkles, X, Send, HelpCircle, ArrowRight } from "lucide-react";
import { MOCK_AI_RESPONSES } from "@/lib/mockRepairShopData";

export const FloatingRepairAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Hello! I am your RevalueIQ Repair Concierge. Ask me about estimated repair costs, turn-around times, or whether repairing your device is worth it!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const QUICK_PROMPTS = [
    "Is screen repair worth it?",
    "Which shop is fastest?",
    "Pickup option details",
    "What is trust score?",
  ];

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    // Add user message
    const newMsgs = [...messages, { sender: "user" as const, text: promptText }];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    // Simulate AI response lookup
    setTimeout(() => {
      let reply = "Based on our AI diagnostics engine, repairing your device saves over 70% compared to purchasing a new replacement while keeping e-waste out of landfills!";
      const lower = promptText.toLowerCase();

      if (lower.includes("screen")) reply = MOCK_AI_RESPONSES["screen repair worth it"];
      else if (lower.includes("fastest")) reply = MOCK_AI_RESPONSES["fastest repair shop"];
      else if (lower.includes("trust")) reply = MOCK_AI_RESPONSES["what is trust score"];
      else if (lower.includes("pickup")) reply = MOCK_AI_RESPONSES["pickup option"];
      else if (lower.includes("warranty")) reply = MOCK_AI_RESPONSES["warranty coverage"];

      setMessages((prev) => [...prev, { sender: "ai" as const, text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all duration-200 cursor-pointer border border-emerald-400/40"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <span>Repair Bot Advisor</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-extrabold uppercase">
            AI Active
          </span>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white dark:bg-[#0b1a13] border border-emerald-300 dark:border-emerald-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[460px] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold">RevalueIQ Repair AI Advisor</h4>
                <p className="text-[10px] text-emerald-200">Instant Diagnostic & Cost Concierge</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs scrollbar-thin">
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

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 p-3 rounded-2xl text-[11px] text-emerald-600 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Advisor is analyzing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-[#07130c] border-t border-emerald-100 dark:border-emerald-900/40">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSendPrompt(p)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 shrink-0 cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white dark:bg-[#0b1a13] border-t border-emerald-100 dark:border-emerald-900/60 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendPrompt(input)}
              placeholder="Ask AI about repair options..."
              className="flex-1 px-3 py-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
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
  );
};
