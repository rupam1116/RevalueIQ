"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Leaf, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "AI Technology", path: "/ai-technology" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "Contact", path: "#footer", isScroll: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const pathname = usePathname();
  const { user } = useAuth();

  // Scroll header background detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (link.isScroll) {
      e.preventDefault();
      const footerElement = document.getElementById("footer") || document.querySelector("footer");
      if (footerElement) {
        footerElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    if (path === "#footer") return false;
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* ── Main Header ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-nav shadow-sm bg-white/90 border-b border-emerald-100 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* ── Left: Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group transition-all duration-300 hover:scale-[1.02]">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:shadow-emerald-600/40 transition-all duration-300">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight hidden sm:inline text-slate-900">
                Revalue
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">IQ</span>
              </span>
            </Link>

            {/* ── Center: Desktop Navigation Tabs ── */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map(link => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                      active
                        ? "text-emerald-700 bg-emerald-100/70 shadow-sm border border-emerald-200"
                        : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    {link.name}
                    {active && (
                      <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right: Auth Actions ── */}
            <div className="flex items-center gap-2">
              {!user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-sm font-semibold text-slate-700 hover:text-emerald-700">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-600/20 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300">
                      Sign Up Free
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href="/app">
                  <Button size="sm" className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-md shadow-emerald-600/20 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300">
                    Eco App
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                suppressHydrationWarning
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-emerald-50 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 xl:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white border-l border-emerald-100 shadow-2xl transition-transform duration-300 animate-in slide-in-from-right">
            <div className="flex flex-col h-full pt-20 p-6">
              <nav className="flex-1 space-y-1.5">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.name}
                      href={link.path}
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        handleNavClick(e, link);
                      }}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        active
                          ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Auth Buttons */}
              {!user && (
                <div className="space-y-3 pt-6 border-t border-emerald-100">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center border-emerald-200 text-slate-700 hover:bg-emerald-50">Log in</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 shadow-md">
                      Sign Up Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
