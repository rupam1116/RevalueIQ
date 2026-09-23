export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-poppins tracking-tight text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last Updated: July 24, 2026</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-border shadow-sm prose prose-slate dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            At RevalueIQ, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect includes:
          </p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic information.</li>
            <li><strong>Device Images:</strong> Photographs of electronic devices that you upload for AI appraisal. These images are processed securely and do not contain personal data unless explicitly visible in the photograph.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the application, such as your IP address, your browser type, your operating system, and your access times.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:
          </p>
          <ul>
            <li>Provide AI-powered appraisals and condition grading.</li>
            <li>Create and manage your account.</li>
            <li>Improve our computer vision and machine learning models (anonymized data only).</li>
            <li>Process transactions and send you related information.</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:rupamxy@gmail.com">rupamxy@gmail.com</a>
          </p>
        </div>

      </div>
    </div>
  );
}