import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConditionalLayout } from "@/components/ConditionalLayout";

export const metadata: Metadata = {
  title: "RevalueIQ | AI-Powered Circular Economy Platform",
  description: "The intelligent platform for device valuation, repair, resale, and recycling. Powered by AI to extend the lifecycle of every device.",
  keywords: ["AI", "device valuation", "circular economy", "e-waste", "repair", "marketplace", "sustainability"],
  openGraph: {
    title: "RevalueIQ | AI-Powered Circular Economy Platform",
    description: "The intelligent platform for device valuation, repair, resale, and recycling.",
    type: "website",
    siteName: "RevalueIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "RevalueIQ | AI-Powered Circular Economy Platform",
    description: "The intelligent platform for device valuation, repair, resale, and recycling.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ConditionalLayout>{children}</ConditionalLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
