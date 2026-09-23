"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 4.4 5 4.8 5 4.8a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 3.4 12c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function LandingFooter() {
  const footerLinks = {
    quickLinks: [
      { name: "Features", path: "#features" },
      { name: "How It Works", path: "#how-it-works" },
      { name: "Pricing", path: "/pricing" },
      { name: "Marketplace", path: "/marketplace" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Our Mission", path: "/our-mission" },
      { name: "Careers", path: "/careers" },
    ],
  };

  return (
    <footer className="bg-[#020617] border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <div className="bg-blue-600/15 p-2.5 rounded-2xl group-hover:bg-blue-600/25 transition-all border border-blue-500/30">
                <Leaf className="w-6 h-6 text-blue-500" />
              </div>
              <span className="font-poppins font-extrabold text-2xl tracking-tight text-white">
                Revalue<span className="text-blue-500">IQ</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              AI-Powered Circular Economy Platform giving pre-owned electronics a second life through intelligent valuation, repair advisory, and sustainable resale.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All Platform Services Operational
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-3 text-xs">
              {footerLinks.quickLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="hover:text-blue-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-xs">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="hover:text-blue-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} RevalueIQ Inc. All Rights Reserved.</p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-blue-500/40 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-blue-500/40 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
