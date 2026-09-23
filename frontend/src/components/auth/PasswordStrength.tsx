"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = [
    { label: "8+ Characters", test: (p: string) => p.length >= 8 },
    { label: "One Uppercase", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One Lowercase", test: (p: string) => /[a-z]/.test(p) },
    { label: "One Number", test: (p: string) => /[0-9]/.test(p) },
    { label: "One Special Character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const passedCount = requirements.filter((r) => r.test(password)).length;

  const getStrengthLabel = () => {
    if (!password) return { text: "Enter password", color: "text-slate-500", barColor: "bg-slate-800" };
    if (passedCount <= 2) return { text: "Weak", color: "text-red-400", barColor: "bg-red-500" };
    if (passedCount <= 3) return { text: "Fair", color: "text-amber-400", barColor: "bg-amber-500" };
    if (passedCount <= 4) return { text: "Strong", color: "text-teal-400", barColor: "bg-teal-500" };
    return { text: "Enterprise-grade", color: "text-emerald-400", barColor: "bg-emerald-500" };
  };

  const strength = getStrengthLabel();

  return (
    <div className="space-y-3 pt-1">
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-semibold">Password Strength</span>
          <span className={`font-bold transition-colors ${strength.color}`}>
            {strength.text}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 h-1.5">
          {[1, 2, 3, 4].map((step) => {
            const activeThreshold = Math.ceil((passedCount / 5) * 4);
            const isActive = password && step <= activeThreshold;
            return (
              <div key={step} className="h-full bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  style={{ width: isActive ? "100%" : "0%" }}
                  className={`h-full transition-all duration-300 ${strength.barColor}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {requirements.map((req, idx) => {
          const isPassed = req.test(password);
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                isPassed ? "text-emerald-400" : "text-slate-500"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                  isPassed
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "border-slate-800 text-slate-600 bg-slate-900"
                }`}
              >
                {isPassed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <X className="w-2.5 h-2.5 stroke-[2]" />}
              </div>
              <span>{req.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
