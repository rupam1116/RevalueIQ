"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Send, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const footerColumns = {
  company: {
    title: "Company",
    links: [
      { name: "About Us", path: "/about" },
      { name: "Our Mission", path: "/our-mission" },
      { name: "Careers", path: "/careers" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "AI Device Valuation", path: "/signup" },
      { name: "Repair Advisor", path: "/signup" },
      { name: "Marketplace", path: "/signup" },
      { name: "Repair Shops", path: "/signup" },
      { name: "Donation Centers", path: "/signup" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { name: "Help Center", path: "/support" },
      { name: "Contact Support", path: "/contact" },
      { name: "System Status", path: "/support" },
    ],
  },
};

const socialLinks = [
  {
    name: "GitHub",
    path: "https://github.com",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 4.4 5 4.8 5 4.8a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 3.4 12c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    path: "https://twitter.com",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12 3 10c1-1 2.4-1.2 3.8-1-2.1-1.3-3-4-2-6.5 2.8 3.5 7 5.7 11.2 6.1-1-3.6 1.8-6.1 4.7-5.5 1.4.3 2.7 1.1 3.6 2.3.9-.2 1.8-.7 2.6-1.2z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    path: "https://linkedin.com",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    path: "https://instagram.com",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Hide footer on auth and protected routes
  const hideRoutes = [
    '/login', '/register', '/signup', '/forgot-password',
    '/verify-email', '/email-verification', '/reset-password', '/welcome',
    '/dashboard', '/valuation', '/repair', '/marketplace',
    '/repair-shops', '/donation', '/community', '/history',
    '/profile', '/settings', '/app',
  ];
  if (hideRoutes.some(r => pathname.startsWith(r))) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  const columns = Object.values(footerColumns);

  return (
    <footer id="footer" className="relative bg-[#06140e] border-t border-emerald-900/50 text-slate-300 transition-colors duration-300">
      {/* Top Gradient Border Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="w-full px-4 sm:px-8 lg:px-12">
        {/* Main Content Grid */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Revalue<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">IQ</span>
              </span>
            </Link>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              The AI-powered Circular Economy Platform for intelligent device valuation, certified repair matching, pre-owned trading, and e-waste reduction.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Subscribe to Circular Insights
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm" suppressHydrationWarning>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="flex-1 h-11 px-4 rounded-xl bg-[#0b1a13] border border-emerald-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
                  required
                  suppressHydrationWarning
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-11 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl border-0 shadow-sm"
                  suppressHydrationWarning
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              {subscribed && (
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Subscribed successfully!
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#0b1a13] border border-emerald-900/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500 transition-all shadow-sm"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Columns: Company, Product, Support */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.path}
                        className="text-xs text-slate-300 hover:text-emerald-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p suppressHydrationWarning>© {new Date().getFullYear()} RevalueIQ Inc. All rights reserved. Building the future of sustainable electronics.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
