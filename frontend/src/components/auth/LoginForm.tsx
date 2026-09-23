"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowRight, Info, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import LoadingButton from "@/components/auth/LoadingButton";
import SocialLogin from "@/components/auth/SocialLogin";
import { getAuthErrorMessage } from "@/lib/authError";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noticeMessage = searchParams.get("message");
  const redirectTarget = searchParams.get("redirect") || "/app";

  const { login } = useAuth();
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError("");
    setLoading(true);

    try {
      await login(data.email, data.password);
      router.replace(redirectTarget);
    } catch (err: any) {
      setAuthError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard glowColor="emerald">
      {/* Card Header */}
      <div className="space-y-1.5 text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Access your AI device appraisal & circular workspace.
        </p>
      </div>

      {/* Notice Banner */}
      {noticeMessage && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {authError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-start gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <span>{authError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="login-email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
            <input
              id="login-email"
              type="email"
              placeholder="name@company.com"
              {...register("email")}
              className={`w-full pl-10 pr-4 h-12 rounded-xl bg-slate-950/90 border ${errors.email ? "border-red-500/70" : "border-slate-800 focus:border-cyan-500/80 focus:ring-cyan-500/30"
                } focus:outline-none focus:ring-2 text-sm font-medium text-white placeholder:text-slate-600 transition-all`}
            />
          </div>
          {errors.email && <p className="text-xs font-semibold text-red-400 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <PasswordInput
          id="login-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Options Row */}
        <div className="flex items-center justify-between pt-1">
          <Checkbox
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setValue("rememberMe", e.target.checked)}
          />

          <Link
            href="/forgot-password"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors focus:outline-none focus:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <LoadingButton
          type="submit"
          variant="emerald"
          loading={loading}
          icon={<ArrowRight className="w-4 h-4" />}
          className="mt-2"
        >
          Sign In to Workspace
        </LoadingButton>
      </form>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-800/80" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
          <span className="bg-[#0c1222] px-3 text-slate-500 rounded-full border border-slate-800/50">
            Or continue with
          </span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <SocialLogin
        onStartLoading={() => setLoading(true)}
        onEndLoading={() => setLoading(false)}
        onError={(msg) => setAuthError(msg)}
        redirectTarget={redirectTarget}
      />

      {/* Card Footer */}
      <div className="text-center pt-2 border-t border-slate-800/60">
        <p className="text-xs font-medium text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors focus:outline-none focus:underline ml-1"
          >
            Create Account
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
