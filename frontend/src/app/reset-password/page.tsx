"use client";

import { useState, useEffect, Suspense } from "react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import AuthContainer from "@/components/AuthContainer";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidCode, setIsValidCode] = useState<boolean | null>(null);

  const [pwdValidations, setPwdValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (!oobCode) {
      setIsValidCode(false);
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then(() => setIsValidCode(true))
      .catch(() => setIsValidCode(false));
  }, [oobCode]);

  useEffect(() => {
    setPwdValidations({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  }, [password]);

  const isPasswordValid = Object.values(pwdValidations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!oobCode) return;

    if (!isPasswordValid) {
      setError("Please ensure your password satisfies all strength requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage("Your password has been reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login?message=" + encodeURIComponent("Password reset successful. Please sign in with your new password."));
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The reset link might be expired.");
    } finally {
      setLoading(false);
    }
  };

  if (isValidCode === null) {
    return (
      <div className="text-center p-8 space-y-3 font-semibold text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
        <p>Verifying reset link...</p>
      </div>
    );
  }

  if (isValidCode === false) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold font-poppins text-red-400">
            Invalid or Expired Link
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            This password reset link is invalid or has expired. Please request a new link.
          </p>
        </div>
        <Button onClick={() => router.push("/forgot-password")} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold">
          Request New Reset Link
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white tracking-tight">
          Reset Password
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Create a new strong password for your RevalueIQ account
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Alert */}
      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            New Password
          </Label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || !!message}
              className="pl-10 pr-10 h-11 rounded-xl bg-slate-900/80 border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-medium text-white placeholder:text-slate-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live Password Strength Checklist */}
        {password.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
            <div className="font-bold text-slate-400 mb-1 text-[11px] uppercase tracking-wider">
              Password Requirements
            </div>
            <div className={`flex items-center gap-2 ${pwdValidations.length ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${pwdValidations.length ? "text-emerald-400" : "text-slate-700"}`} />
              <span>Minimum 8 characters</span>
            </div>
            <div className={`flex items-center gap-2 ${pwdValidations.upper ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${pwdValidations.upper ? "text-emerald-400" : "text-slate-700"}`} />
              <span>One uppercase letter</span>
            </div>
            <div className={`flex items-center gap-2 ${pwdValidations.lower ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${pwdValidations.lower ? "text-emerald-400" : "text-slate-700"}`} />
              <span>One lowercase letter</span>
            </div>
            <div className={`flex items-center gap-2 ${pwdValidations.number ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${pwdValidations.number ? "text-emerald-400" : "text-slate-700"}`} />
              <span>One number</span>
            </div>
            <div className={`flex items-center gap-2 ${pwdValidations.special ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${pwdValidations.special ? "text-emerald-400" : "text-slate-700"}`} />
              <span>One special character</span>
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Confirm New Password
          </Label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || !!message}
              className="pl-10 pr-10 h-11 rounded-xl bg-slate-900/80 border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-medium text-white placeholder:text-slate-600"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isPasswordValid || loading || !!message}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:opacity-95 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all mt-2 cursor-pointer border-0 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Saving Password...
            </span>
          ) : (
            <span>Save Password</span>
          )}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthContainer>
      <Suspense fallback={<div className="text-center p-8 text-sm font-semibold text-slate-400">Loading reset form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthContainer>
  );
}
