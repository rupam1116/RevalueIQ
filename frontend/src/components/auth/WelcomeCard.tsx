"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import LoadingButton from "@/components/auth/LoadingButton";
import AnimatedBackground from "@/components/auth/AnimatedBackground";

export default function WelcomeCard() {
  const [canProceed, setCanProceed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 2-second lock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanProceed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Canvas Particles & Confetti Celebration Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ["#059669", "#0d9488", "#16a34a", "#10b981", "#34d399"];
    const confettiCount = 140;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < confettiCount; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 300,
        y: height / 3 + (Math.random() - 0.5) * 150,
        vx: (Math.random() - 0.5) * 14,
        vy: Math.random() * -16 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // Gravity
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.004;

        if (p.opacity > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const checklistItems = [
    { label: "Account Created", desc: "Enterprise auth credentials established" },
    { label: "Email Verified", desc: "Identity & security clearance confirmed" },
    { label: "Everything Ready", desc: "AI appraisal engine & circular workspace active" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#06140e] text-slate-100 overflow-y-auto selection:bg-emerald-600 selection:text-white flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10 w-full h-full" />
      <AnimatedBackground />

      {/* Radial Atmosphere Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-emerald-600/20 via-teal-500/20 to-green-500/20 rounded-full blur-[180px] mix-blend-screen pointer-events-none" />

      {/* Glass Card Container */}
      <div className="relative w-full max-w-xl z-20 animate-in fade-in zoom-in-95 duration-300">
        {/* Glow border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/40 via-teal-500/40 to-green-500/40 rounded-[2.5rem] blur-2xl opacity-70 animate-pulse" />

        <div className="relative rounded-[2rem] bg-[#0b1a13]/90 backdrop-blur-2xl border border-emerald-900/90 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-8 sm:p-12 text-center space-y-8 overflow-hidden">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>Workspace Provisioned</span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              🎉 Welcome to <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">RevalueIQ</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed font-normal">
              Your AI Circular Economy Workspace is Ready.
            </p>
          </div>

          {/* Checklist */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#06140e]/90 border border-emerald-900/80 text-left space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-emerald-900/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Account Status
              </span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Active & Verified
              </span>
            </div>

            <div className="space-y-3">
              {checklistItems.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1">
                      <span>✔</span> {step.label}
                    </h4>
                    <p className="text-xs text-slate-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Action Button */}
          <div className="pt-2">
            <Link href="/app" className="block w-full">
              <LoadingButton
                variant="emerald"
                disabled={!canProceed}
                icon={<ArrowRight className="w-4 h-4" />}
                className="h-14 text-base tracking-wide font-extrabold"
              >
                {canProceed ? "Enter Eco Workspace" : `Initializing Workspace (${secondsLeft}s)...`}
              </LoadingButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
