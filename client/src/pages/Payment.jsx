import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

function Payment() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = (plan) => {
    setIsProcessing(true);
    fetch('http://localhost:5000/api/payment/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    })
      .then(res => res.json())
      .then(data => {
        setIsProcessing(false);
        if (data.success) {
          alert(data.data.message);
        }
      })
      .catch(err => {
        setIsProcessing(false);
        console.error(err);
      });
  };

  return (
    <div className="flex-grow py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Pricing Plans
        </h2>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Choose the right plan to get the most value out of your second-hand goods.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {/* Free Plan */}
          <div className="glass-card p-8 flex flex-col hover:-translate-y-1 transition-transform">
            <h3 className="text-2xl font-bold text-gray-900">Basic Evaluation</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold text-gray-900">
              ₹0
              <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
            </div>
            <p className="mt-4 text-gray-500">Perfect for quick, one-off valuations.</p>
            <ul className="mt-8 space-y-4 flex-grow text-gray-600">
              {['Basic AI condition detection', 'Standard value estimation', '1 free upload per day', 'Community support'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleCheckout('Free')}
              disabled={isProcessing}
              className="mt-8 block w-full py-3 px-6 border border-gray-300 rounded-xl text-center font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors"
            >
              Get Started for Free
            </button>
          </div>

          {/* Premium Plan */}
          <div className="glass-card p-8 flex flex-col border-primary-500 shadow-xl shadow-primary-500/10 relative overflow-hidden hover:-translate-y-1 transition-transform">
            <div className="absolute top-0 right-0 bg-gradient-hero text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold text-primary-600">Premium Pro</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold text-gray-900">
              ₹999
              <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
            </div>
            <p className="mt-4 text-gray-500">For power sellers and sustainable businesses.</p>
            <ul className="mt-8 space-y-4 flex-grow text-gray-600">
              {['Advanced AI damage detailing', 'Market-adjusted live pricing', 'Repair shop recommendations', 'Fraud & authenticity checks', 'Unlimited uploads', 'Priority support'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary-500" size={20} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleCheckout('Premium')}
              disabled={isProcessing}
              className="mt-8 block w-full py-3 px-6 border border-transparent rounded-xl text-center font-medium text-white bg-gradient-hero hover:opacity-90 shadow-lg transition-all"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
