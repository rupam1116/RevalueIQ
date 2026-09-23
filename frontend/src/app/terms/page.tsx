export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-poppins tracking-tight text-foreground mb-4">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground">Last Updated: July 24, 2026</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-border shadow-sm prose prose-slate dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using RevalueIQ (the "Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            RevalueIQ provides artificial intelligence-powered evaluations of electronic devices, including but not limited to condition grading, market value estimation, and repair recommendations. The Service is provided "as is" and the accuracy of the AI models is not guaranteed.
          </p>

          <h2>3. User Responsibilities</h2>
          <p>
            Users are solely responsible for the images and data they upload to the Service. You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the service.
          </p>

          <h2>4. Accuracy of Valuations</h2>
          <p>
            The estimated resale values provided by RevalueIQ are predictions based on current secondary market data and our AI condition assessment. These values are strictly estimates and do not constitute a guaranteed offer to purchase your device at that price.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by RevalueIQ and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          
          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall RevalueIQ, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </div>

      </div>
    </div>
  );
}