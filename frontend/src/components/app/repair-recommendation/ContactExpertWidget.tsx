"use client";

import React, { useState } from "react";
import { MessageSquare, PhoneCall, Phone, X, Send, Bot, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ContactExpertWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "callback">("chat");

  const [chatMessages, setChatMessages] = useState<Array<{ sender: "expert" | "user"; text: string }>>([
    {
      sender: "expert",
      text: "Hello! I am your RevalueIQ Hardware Advisor. Unsure whether to choose Apple Authorized or iCare Premium? Ask me anything!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("+91 ");
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const newMsgs = [...chatMessages, { sender: "user" as const, text: chatInput }];
    setChatMessages(newMsgs);
    setChatInput("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "expert" as const,
          text: "For iPhone 15 Pro, we strongly recommend Apple Authorized (Cyber Towers) for genuine TrueTone display calibration or iCare Premium (Jubilee Hills) for express 30-min battery replacement!",
        },
      ]);
    }, 500);
  };

  const handleRequestCallback = (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackSuccess(true);
    setTimeout(() => {
      setCallbackSuccess(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Sticky Bottom Bar Trigger */}
      {!isOpen && (
        <div className="bg-white border border-emerald-100 shadow-xl rounded-2xl p-3 flex items-center gap-3 transition-all hover:shadow-2xl hover:scale-105 border-l-4 border-l-emerald-600">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <Bot className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900">Need Help Choosing?</div>
            <div className="text-[10px] text-slate-500">Talk with a RevalueIQ Expert</div>
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <Button
              size="sm"
              onClick={() => {
                setActiveTab("chat");
                setIsOpen(true);
              }}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-8 px-3 shadow-xs"
            >
              Chat
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveTab("callback");
                setIsOpen(true);
              }}
              className="rounded-xl border-emerald-200 bg-white hover:bg-emerald-50 text-slate-800 font-bold text-xs h-8 px-3"
            >
              Call
            </Button>
          </div>
        </div>
      )}

      {/* Expanded Chat/Call Window */}
      {isOpen && (
        <div className="w-80 sm:w-88 bg-white border border-emerald-100 text-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[400px] animate-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-emerald-950 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-white">RevalueIQ Expert Assistant</h4>
                <p className="text-[10px] text-emerald-300">Certified Hardware Advisor</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full bg-emerald-900 hover:bg-emerald-800 text-emerald-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Bar */}
          <div className="bg-emerald-50/60 p-1.5 border-b border-emerald-100 flex items-center justify-around text-xs font-bold">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-1 rounded-lg text-center transition-all ${
                activeTab === "chat" ? "bg-emerald-600 text-white font-extrabold shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("callback")}
              className={`flex-1 py-1 rounded-lg text-center transition-all ${
                activeTab === "callback" ? "bg-emerald-600 text-white font-extrabold shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Request Callback
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-3.5 overflow-y-auto text-xs space-y-3 scrollbar-thin">
            {activeTab === "chat" ? (
              <div className="space-y-3 h-full flex flex-col justify-between">
                <div className="space-y-2.5 overflow-y-auto max-h-[240px]">
                  {chatMessages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] p-2.5 rounded-xl leading-relaxed text-xs ${
                          m.sender === "user"
                            ? "bg-emerald-600 text-white font-bold"
                            : "bg-slate-100 text-slate-800 border border-slate-200"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    placeholder="Ask expert..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendChat}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 px-3"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-2 text-xs text-slate-700">
                {!callbackSuccess ? (
                  <form onSubmit={handleRequestCallback} className="space-y-3">
                    <p className="text-slate-600">Enter your mobile number for a callback from a senior hardware engineer.</p>
                    <input
                      type="text"
                      value={callbackPhone}
                      onChange={(e) => setCallbackPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs"
                      required
                    />
                    <Button
                      type="submit"
                      className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-9 shadow-xs"
                    >
                      Request Call Now
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-2 py-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-slate-900">Callback Requested!</h4>
                    <p className="text-slate-500 text-[11px]">We will call {callbackPhone} shortly.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
