"use client";

import React, { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle / Eco Network Node setup
    const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = ["#059669", "#0d9488", "#16a34a", "#34d399", "#10b981"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = p1.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p1.color;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 130) * 0.25;
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-[#06140e] overflow-hidden select-none">
      {/* Dynamic Canvas Nodes */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Radial Eco Gradient Glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px] mix-blend-screen animate-pulse" />
      <div className="absolute top-1/2 -right-40 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-[160px] mix-blend-screen" />
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[150px] mix-blend-screen" />

      {/* Grid Mesh Overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.04]"
        style={{ maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)" }}
      />

      {/* Floating Ambient Glowing Shapes */}
      <div className="absolute top-[15%] left-[8%] w-32 h-32 border border-emerald-500/20 rounded-3xl bg-emerald-500/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)] hidden md:block animate-pulse duration-1000" />
      <div className="absolute bottom-[20%] right-[10%] w-40 h-40 border border-teal-500/20 rounded-full bg-teal-500/5 backdrop-blur-3xl shadow-[0_0_60px_rgba(13,148,136,0.1)] hidden md:block animate-pulse duration-1000" />
      <div className="absolute top-[60%] left-[5%] w-24 h-24 border border-green-500/20 rounded-2xl bg-green-500/5 backdrop-blur-2xl shadow-[0_0_40px_rgba(34,197,94,0.1)] hidden lg:block animate-pulse duration-1000" />
    </div>
  );
}
