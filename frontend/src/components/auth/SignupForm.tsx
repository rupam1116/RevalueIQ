"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import PasswordStrength from "@/components/auth/PasswordStrength";
import LoadingButton from "@/components/auth/LoadingButton";
import SocialLogin from "@/components/auth/SocialLogin";
import { getAuthErrorMessage } from "@/lib/authError";
import { Checkbox } from "@/components/ui/checkbox";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service & Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const passwordValue = watch("password") || "";
  const termsAccepted = watch("termsAccepted");

  const onSubmit = async (data: SignupFormValues) => {
    setAuthError("");
    setLoading(true);

    try {
      await signup(data.fullName, data.email, data.password);
      router.replace("/app");
    } catch (err: any) {
      setAuthError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard glowColor="emerald">
      {/* Header */}
      <div className="space-y-1 text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white tracking-tight">
          Create Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Join the enterprise AI circular economy platform.
        </p>
      </div>

      {/* Error Alert */}
      {authError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-start gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Full Name
          </label>
          <div className="relative group">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Alex Morgan"
              {...register("fullName")}
              className={`w-full pl-10 pr-4 h-11 rounded-xl bg-slate-950/90 border ${errors.fullName ? "border-red-500/70" : "border-slate-800 focus:border-cyan-500/80 focus:ring-cyan-500/30"
                } focus:outline-none focus:ring-2 text-sm font-medium text-white placeholder:text-slate-600 transition-all`}
            />
          </div>
          {errors.fullName && <p className="text-xs font-semibold text-red-400 mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
            <input
              type="email"
              placeholder="alex@enterprise.com"
              {...register("email")}
              className={`w-full pl-10 pr-4 h-11 rounded-xl bg-slate-950/90 border ${errors.email ? "border-red-500/70" : "border-slate-800 focus:border-cyan-500/80 focus:ring-cyan-500/30"
                } focus:outline-none focus:ring-2 text-sm font-medium text-white placeholder:text-slate-600 transition-all`}
            />
          </div>
          {errors.email && <p className="text-xs font-semibold text-red-400 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <PasswordInput
            id="signup-password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrength password={passwordValue} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <PasswordInput
            id="signup-confirm-password"
            label="Confirm Password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        {/* Accept Terms Checkbox */}
        <div className="pt-1">
          <Checkbox
            checked={termsAccepted}
            onChange={(e) => setValue("termsAccepted", e.target.checked)}
            error={errors.termsAccepted?.message}
            label={
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 font-semibold underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 font-semibold underline">
                  Privacy Policy
                </Link>
                .
              </span>
            }
          />
        </div>

        {/* Submit */}
        <LoadingButton
          type="submit"
          variant="emerald"
          loading={loading}
          icon={<ArrowRight className="w-4 h-4" />}
          className="mt-2"
        >
          Create Account
        </LoadingButton>
      </form>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-800/80" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
          <span className="bg-[#0c1222] px-3 text-slate-500 rounded-full border border-slate-800/50">
            Or signup with
          </span>
        </div>
      </div>

      {/* Social Logins */}
      <SocialLogin
        onStartLoading={() => setLoading(true)}
        onEndLoading={() => setLoading(false)}
        onError={(msg) => setAuthError(msg)}
        redirectTarget="/verify-email"
      />

      {/* Footer Link */}
      <div className="text-center pt-2 border-t border-slate-800/60">
        <p className="text-xs font-medium text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors focus:outline-none focus:underline ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
