import { HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How accurate is the AI price prediction?",
    answer: "Our ML models are trained on millions of secondary market transactions and update daily. We typically achieve a 95% accuracy rate for major electronics brands when the device's condition is accurately captured in the uploaded photos."
  },
  {
    question: "Does the AI work for any electronic device?",
    answer: "Currently, our models are highly optimized for Smartphones, Tablets, Laptops, and Smartwatches. We are continuously adding support for gaming consoles, cameras, and audio equipment."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. Images uploaded for appraisal are processed securely. We do not sell your personal data to third parties, and all transaction data is encrypted."
  },
  {
    question: "How do you detect internal damage?",
    answer: "While our computer vision primarily detects external physical damage (cracks, scratches, dents), our upcoming diagnostic app will allow you to run internal hardware checks (battery health, screen pixels, sensors) which syncs directly with our AI engine."
  },
  {
    question: "Is RevalueIQ free to use?",
    answer: "Yes! Individual users can get up to 5 AI appraisals per month completely free. For businesses, repair shops, and resellers needing high volume, we offer a Pro tier."
  }
];

export default function FAQsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-poppins tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mt-4">
            Everything you need to know about RevalueIQ and our AI technology.
          </p>
        </div>

        <div className="space-y-6 mb-20">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-3">{faq.question}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-3xl p-10 text-center border border-primary/20 shadow-sm flex flex-col items-center">
          <MessageCircle className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
          <Link href="/contact">
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-md">
              Get in touch
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}