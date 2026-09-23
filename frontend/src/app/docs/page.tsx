import { BookOpen, Code, Image as ImageIcon, Zap } from "lucide-react";

const sections = [
  {
    icon: Code,
    title: "REST API Reference",
    description: "Integrate our AI appraisal engine directly into your own applications, CRM, or POS system.",
    link: "#api",
  },
  {
    icon: ImageIcon,
    title: "Image Upload Guidelines",
    description: "Learn how to capture the perfect photos to maximize the accuracy of the Computer Vision grading.",
    link: "#images",
  },
  {
    icon: Zap,
    title: "Webhook Integrations",
    description: "Set up real-time notifications for when an appraisal finishes processing asynchronously.",
    link: "#webhooks",
  },
  {
    icon: BookOpen,
    title: "Valuation Methodology",
    description: "Understand the data sources and logic behind our market depreciation models.",
    link: "#methodology",
  }
];

export default function DocsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4">
            Developer Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-poppins tracking-tight text-foreground mb-4">
            Documentation
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to build, integrate, and scale with RevalueIQ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sections.map((section, index) => (
            <a 
              href={section.link}
              key={index} 
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                <section.icon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{section.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {section.description}
              </p>
            </a>
          ))}
        </div>

        <div className="bg-slate-900 dark:bg-black rounded-3xl p-8 md:p-12 border border-slate-800 text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Start: API</h2>
          <p className="text-slate-400 mb-6">Create a new appraisal request using cURL.</p>
          <div className="bg-black/50 dark:bg-slate-900 rounded-xl p-6 overflow-x-auto border border-slate-800 font-mono text-sm">
<pre><code>{`curl -X POST https://api.revalueiq.com/v1/appraise \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "device_type": "smartphone",
    "images": [
      "https://example.com/front.jpg",
      "https://example.com/back.jpg"
    ]
  }'`}</code></pre>
          </div>
        </div>

        {/* Anchor Sections */}
        <div className="mt-20 space-y-24">
          <section id="api" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-foreground mb-6">REST API Reference</h2>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-sm prose prose-slate dark:prose-invert max-w-none">
              <p>Our REST API allows you to programmatically trigger appraisals, fetch results, and manage your inventory. The API is organized around REST, has predictable resource-oriented URLs, returns JSON-encoded responses, and uses standard HTTP response codes.</p>
              <h3>Authentication</h3>
              <p>Authenticate your account by including your secret API key in the Authorization header of every request.</p>
              <code>Authorization: Bearer YOUR_API_KEY</code>
            </div>
          </section>

          <section id="images" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-foreground mb-6">Image Upload Guidelines</h2>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-sm prose prose-slate dark:prose-invert max-w-none">
              <p>The accuracy of our Computer Vision models depends heavily on the quality of the images provided. Please follow these guidelines to ensure the best results:</p>
              <ul>
                <li><strong>Lighting:</strong> Ensure the device is well-lit, preferably with natural or bright white light to avoid glare on screens.</li>
                <li><strong>Angles:</strong> Provide at least one direct shot of the front screen and one of the back casing. Include additional photos of any visible scratches or dents.</li>
                <li><strong>Background:</strong> Place the device on a clean, solid-colored background (like a white table or cloth).</li>
                <li><strong>Resolution:</strong> Images should be at least 1080x1080 pixels. We support JPEG, PNG, and WebP formats.</li>
              </ul>
            </div>
          </section>

          <section id="webhooks" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-foreground mb-6">Webhook Integrations</h2>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-sm prose prose-slate dark:prose-invert max-w-none">
              <p>Appraisals involving Generative AI repair manuals can take up to 15 seconds. Instead of polling our API, you can set up webhooks to be notified asynchronously when an appraisal is complete.</p>
              <h3>Setting up a Webhook</h3>
              <p>Configure a webhook endpoint in your Developer Dashboard. We will send a <code>POST</code> request to your URL containing the full appraisal payload once it finishes processing.</p>
            </div>
          </section>

          <section id="methodology" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-foreground mb-6">Valuation Methodology</h2>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-sm prose prose-slate dark:prose-invert max-w-none">
              <p>Our pricing engine does not rely on static spreadsheets. We dynamically scrape and aggregate data from major secondary marketplaces (eBay, Swappa, BackMarket) every 24 hours.</p>
              <p>We apply a proprietary depreciation algorithm that factors in the device's age, original MSRP, historical price drops for that specific model family, and the objective condition grade determined by our Computer Vision models.</p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}