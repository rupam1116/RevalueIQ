"use client";
import { getApiUrl } from "@/lib/api";


import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "./ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/v1/news/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Thank you! You have been subscribed to our newsletter.");
        setEmail(""); // Clear the input field
      } else {
        alert(data.error || "Server responded with error. Please try again.");
      }
    } catch (error) {
      alert("Server responded with error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md" suppressHydrationWarning>
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          suppressHydrationWarning
          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white shadow-md" suppressHydrationWarning>
        {isLoading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}
