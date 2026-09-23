"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Leaf,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Zap,
  HelpCircle,
  TrendingUp,
  Wrench,
  Minimize2,
} from "lucide-react";
import { AIChatMessage, ValuationReport } from "@/types/valuation";
import { COPILOT_INITIAL_MESSAGES } from "@/lib/mockValuationData";

interface FloatingAIAssistantProps {
  report: ValuationReport | null;
  onNavigateTab?: (tabId: string) => void;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  report,
  onNavigateTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>(COPILOT_INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "Based on market analytics and device condition data, your device is in strong demand. I recommend listing it directly on the RevalueIQ P2P Eco Marketplace for maximum value retention.";
      
      const lower = text.toLowerCase();
      if (lower.includes("repair") || lower.includes("sell")) {
        if (report) {
          replyText = `For your ${report.deviceName}, direct resale is recommended. Estimated repair cost is ₹${report.repairCost.toLocaleString('en-IN')}, which yields a net ROI of +₹${(report.recommendedListingPrice - report.repairCost).toLocaleString('en-IN')}.`;
        } else {
          replyText = "If your device has minor cosmetic wear, selling as-is on the RevalueIQ Marketplace usually yields 85-90% of MSRP. For cracked glass or battery degradation under 80%, performing a minor repair before listing increases final payout by up to 30%.";
        }
      } else if (lower.includes("score") || lower.includes("circular")) {
        if (report) {
          replyText = `Your Circular Economy Score is ${report.circularScore}/100 (${report.ecoGrade}). It reflects ${report.co2OffsetKg}kg of CO2 offset, ${report.eWasteDivertedKg}kg of e-waste diverted, and high hardware recyclability.`;
        } else {
          replyText = "The Circular Economy Score (0-100) measures hardware integrity, modular repairability, carbon offset potential, and secondary market demand. Scores above 85 rank in the top 5% of eco-friendly electronics.";
        }
      } else if (lower.includes("price") || lower.includes("list")) {
        if (report) {
          replyText = `We recommend listing your ${report.deviceName} at ₹${report.recommendedListingPrice.toLocaleString('en-IN')}. The estimated secondary buyer range is ₹${report.estimatedValueMin.toLocaleString('en-IN')} – ₹${report.estimatedValueMax.toLocaleString('en-IN')}.`;
        } else {
          replyText = "Our market valuation engine cross-references over 50,000 live secondary market listings across India. It factors in cosmetic grade, NAND health, battery cycles, and regional demand trends.";
        }
      }

      const copilotMsg: AIChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "copilot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: "Check Marketplace Listings", action: "go_marketplace" },
          { label: "Find Nearby Repair Shops", action: "go_repair" },
        ],
      };

      setMessages((prev) => [...prev, copilotMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleQuickAction = (action: string, label: string) => {
    if (action === "go_marketplace" && onNavigateTab) {
      onNavigateTab("marketplace");
    } else if (action === "go_repair" && onNavigateTab) {
      onNavigateTab("repair");
    } else {
      handleSendMessage(label);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-2xl shadow-emerald-600/30 border border-emerald-400/30 cursor-pointer flex items-center gap-2.5 group hover:scale-[1.02] transition-transform duration-300 border-0"
        title="Open Eco Valuation Copilot"
      >
        <div className="relative">
          <Leaf className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-slate-950" />
        </div>
        <span className="font-extrabold text-xs tracking-tight hidden sm:inline">
          Eco Valuation Copilot
        </span>
      </button>

      {/* Slide-over Drawer Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[520px] max-h-[80vh] bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95"
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Eco Valuation Copilot
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h4>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Circular Economy Assistant</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Chat History Viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="space-y-2 max-w-[82%]">
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md"
                          : "bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Quick Action Chips */}
                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.quickActions.map((qa, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickAction(qa.action, qa.label)}
                            className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#0b1a13] border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold transition-all cursor-pointer hover:scale-105"
                          >
                            {qa.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <p className={`text-[9px] font-mono text-slate-400 ${isUser ? "text-right" : "text-left"}`}>
                      {msg.timestamp}
                    </p>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono p-2">
                <Bot className="w-4 h-4 animate-spin" />
                <span>Copilot analyzing circular parameters...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about pricing, repair vs sell..."
              className="flex-1 bg-white dark:bg-[#0b1a13] border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white disabled:opacity-40 transition-opacity cursor-pointer border-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
