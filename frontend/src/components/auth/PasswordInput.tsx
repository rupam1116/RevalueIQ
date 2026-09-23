"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id: string;
}

export default function PasswordInput({
  label = "Password",
  error,
  id,
  className = "",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />

        <input
          id={id}
          type={showPassword ? "text" : "password"}
          className={`w-full pl-10 pr-11 h-12 rounded-xl bg-slate-900/90 border ${
            error ? "border-red-500/70 focus:ring-red-500/40" : "border-slate-800 focus:border-blue-500/80 focus:ring-blue-500/30"
          } focus:outline-none focus:ring-2 text-sm font-medium text-white placeholder:text-slate-600 transition-all ${className}`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors p-1 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-blue-400" />
          ) : (
            <Eye className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs font-semibold text-red-400 mt-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
