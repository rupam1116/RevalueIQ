import Link from "next/link";
import { Sparkles, ArrowRight, Mail, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CareersPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-primary/20 via-accent/20 to-transparent blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-2 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Opportunities Evolving</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-poppins tracking-tight text-foreground">
            Build the Future of <span className="text-primary">Sustainability</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mt-4">
            Join our mission to eliminate e-waste and revolutionize the circular economy.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-3xl p-8 md:p-16 border border-slate-800 dark:border-slate-800 shadow-2xl mb-16 text-center">
          {/* Decorative gradients inside card */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/90 text-sm font-medium backdrop-blur-md">
              <span className="flex w-2 h-2 rounded-full bg-emerald-400 mr-2.5 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
              Portal Launching Soon
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              We're brewing something <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">extraordinary.</span>
            </h2>
            
            <p className="text-base md:text-lg text-slate-300 leading-relaxed">
              Our new careers hub is currently undergoing an exciting transformation. We are curating world-changing roles for developers, engineers, sustainability experts, and innovators ready to make a tangible global impact.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:scale-105 transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] border-0 px-8 h-12 text-base font-medium">
                  <Mail className="w-4 h-4 mr-2" />
                  Express Interest Early
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-800 hover:text-white transition-all px-8 h-12 text-base font-medium">
                  Explore RevauleIQ
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="pt-8 border-t border-slate-800 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>Want to be notified? Send your resume to our hiring team via the contact page.</span>
            </div>
          </div>
        </div>

        {/* Why work with us snippet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border/60 shadow-sm">
            <h3 className="font-bold text-lg text-foreground mb-2">Global Impact</h3>
            <p className="text-sm text-muted-foreground">Directly contribute to reducing global e-waste and building a sustainable circular economy.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border/60 shadow-sm">
            <h3 className="font-bold text-lg text-foreground mb-2">Remote-First Culture</h3>
            <p className="text-sm text-muted-foreground">Work from anywhere with an incredible team of mission-driven technologists and experts.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border/60 shadow-sm">
            <h3 className="font-bold text-lg text-foreground mb-2">Cutting-Edge Tech</h3>
            <p className="text-sm text-muted-foreground">Leverage advanced AI, computer vision, and modern web frameworks to solve real-world problems.</p>
          </div>
        </div>

      </div>
    </div>
  );
}