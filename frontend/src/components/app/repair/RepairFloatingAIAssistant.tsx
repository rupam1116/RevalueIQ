"use client";

import React, { useState } from "react";
import { MessageSquare, Sparkles, X, Send, Bot, User, ArrowRight, Wrench, ShieldCheck, Leaf } from "lucide-react";
import { RepairReport } from "@/types/repair";

interface RepairFloatingAIAssistantProps {
  report: RepairReport | null;
  onNavigateTab: (tabId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Is DIY repair safe for my device?",
  "Where is the nearest repair shop?",
  "Should I repair or sell after diagnosis?",
  "What precision tools do I need?",
];

export const RepairFloatingAIAssistant: React.FC<RepairFloatingAIAssistantProps> = ({
  report,
  onNavigateTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-msg",
      sender: "ai",
      text: report
        ? `Hello! I've loaded your diagnostic report for ${report.deviceName}. Ask me anything about part costs, DIY steps, or local repair shops!`
        : "Hello! I am your RevalueIQ Eco Repair Copilot. Select a device or ask me hardware repair diagnostic questions anytime!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    setTimeout(() => {
      let aiText = "Based on our neural diagnostic database, performing this hardware repair using OEM parts is highly recommended.";
      const lower = query.toLowerCase();

      if (lower.includes("diy") || lower.includes("safe")) {
        aiText = report
          ? `For your ${report.deviceName}, DIY repair feasibility is rated as ${report.diyRecommendation.feasibility}. You can save $${report.estimatedRepairCost.diySavings} in labor fees!`
          : "DIY repair is safe if you use proper heat guns and suction pliers. Make sure to disconnect the battery flex cable first.";
      } else if (lower.includes("shop") || lower.includes("nearest") || lower.includes("where")) {
        aiText = report
          ? `The top-rated nearby lab is ${report.nearbyRepairShops[0]?.name} (${report.nearbyRepairShops[0]?.distance}) offering same-day express turnaround!`
          : "We have certified repair partners within 2 miles with ratings over 4.8 stars. Check out the Repair Shops tab for direct booking.";
      } else if (lower.includes("sell") || lower.includes("worth") || lower.includes("trade")) {
        aiText = "Repairing your device before selling increases resale value by up to 45%. You can list it immediately on our RevalueIQ Marketplace!";
      } else if (lower.includes("tool")) {
        aiText = "Essential tools include: Precision iFixit Pentalobe/Torx screwdriver set, ESD tweezers, suction opening clamp, and heat pad.";
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <div
          className="w-80 sm:w-96 bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[460px] relative transition-all duration-300 animate-in fade-in zoom-in-95"
        >
          {/* Drawer Header */}
          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Eco Repair Copilot <Leaf className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">● Online & Ready</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold"
                      : "bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-emerald-50/30 dark:bg-emerald-950/20 border-t border-emerald-100 dark:border-emerald-900/40 flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#0b1a13] border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold whitespace-nowrap hover:scale-105 transition-transform"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/40 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a diagnostic question..."
              className="flex-1 bg-white dark:bg-[#0b1a13] border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white disabled:opacity-40 transition-opacity cursor-pointer border-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-600/30 border border-emerald-400/30 cursor-pointer flex items-center gap-2.5 group hover:scale-[1.02] transition-transform duration-300 border-0"
          title="Open Repair Copilot AI"
        >
          <Wrench className="w-5 h-5" />
          <span className="font-extrabold text-xs tracking-tight hidden sm:inline">
            Eco Repair Copilot
          </span>
        </button>
      )}
    </div>
  );
};
