"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * ConditionalLayout — Renders the public Navbar and Footer ONLY for
 * non-protected routes. Protected routes under (protected) group
 * render their own ProtectedNavbar + ProtectedSidebar shell.
 */
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes that use the protected app shell (no public navbar/footer)
  const protectedPaths = [
    '/dashboard',
    '/valuation',
    '/repair',
    '/marketplace',
    '/repair-shops',
    '/donation',
    '/community',
    '/history',
    '/profile',
    '/settings',
    '/app',
  ];

  // Auth pages have their own layout (no navbar/footer)
  const authPaths = [
    '/login',
    '/signup',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/email-verification',
    '/welcome',
  ];

  const isProtected = protectedPaths.some(p => pathname.startsWith(p));
  const isAuth = authPaths.some(p => pathname.startsWith(p));
  const showPublicChrome = !isProtected && !isAuth;

  return (
    <>
      {showPublicChrome && <Navbar />}
      <main className={showPublicChrome ? "flex-1" : "flex-1"}>
        {children}
      </main>
      {showPublicChrome && <Footer />}
    </>
  );
}
