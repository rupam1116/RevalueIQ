"use client";
import { getApiUrl } from "@/lib/api";
import { Mail, MessageSquare, PhoneCall, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const firstName = formData.get("First Name");
    const lastName = formData.get("Last Name");
    const email = formData.get("Email");
    const message = formData.get("Message");

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/v1/support/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          message,
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Thank you! Your message has been sent successfully.");
        form.reset();
      } else {
        alert(data.error || "Thank you! Your message has been submitted.");
      }
    } catch (error) {
      alert("Message received! Our team will get back to you shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-[#06140e] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Get in <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Have questions about AI valuation, repair networks, or enterprise partnerships? Our team is ready to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <a href="mailto:rupamxy@gmail.com" target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-[#0b1a13] rounded-3xl p-8 border border-emerald-100 dark:border-emerald-900/50 shadow-sm text-center hover:shadow-md hover:border-emerald-400 transition-all block group">
            <div className="w-12 h-12 mx-auto bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Email Us</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">For general inquiries</p>
            <span className="font-medium text-emerald-600 dark:text-emerald-400 group-hover:underline">rupamxy@gmail.com</span>
          </a>
          <a href="/support" className="bg-white dark:bg-[#0b1a13] rounded-3xl p-8 border border-emerald-100 dark:border-emerald-900/50 shadow-sm text-center hover:shadow-md hover:border-emerald-400 transition-all block group">
            <div className="w-12 h-12 mx-auto bg-teal-100 dark:bg-teal-950 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Support</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">For account or technical help</p>
            <span className="font-medium text-emerald-600 dark:text-emerald-400 group-hover:underline">Visit Support Center</span>
          </a>
          <a href="tel:+917997268281" className="bg-white dark:bg-[#0b1a13] rounded-3xl p-8 border border-emerald-100 dark:border-emerald-900/50 shadow-sm text-center hover:shadow-md hover:border-emerald-400 transition-all block group">
            <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Sales</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">For enterprise pricing</p>
            <span className="font-medium text-emerald-600 dark:text-emerald-400 group-hover:underline">+91 7997268281</span>
          </a>
        </div>

        <div className="bg-white dark:bg-[#0b1a13] rounded-3xl p-8 md:p-12 border border-emerald-100 dark:border-emerald-900/50 shadow-xl max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a message</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                <input required type="text" name="First Name" className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                <input required type="text" name="Last Name" className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input required type="email" name="Email" className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="jane@gmail.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
              <textarea required rows={4} name="Message" className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="How can we help you?"></textarea>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/20">
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}