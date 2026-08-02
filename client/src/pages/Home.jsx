import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, ScanSearch, Recycle, IndianRupee, Wrench } from 'lucide-react';

function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-medium text-sm mb-8 border border-emerald-100 shadow-sm">
          <Recycle size={16} />
          <span>Promoting a Circular Economy</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900 max-w-4xl">
          AI-Powered <span className="text-gradient">Resale & Repair</span> Intelligence
        </h1>
        
        <p className="text-xl text-gray-500 mb-12 max-w-2xl leading-relaxed">
          Reduce e-waste and make intelligent decisions about your used products. 
          Upload an image to get instant valuation, condition analysis, and repair advisory.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/upload" className="bg-gradient-hero text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2 group">
            Analyze Product Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/payment" className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-gradient-to-r from-gray-900 to-indigo-950 py-20 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-700">
          <div className="flex flex-col items-center pt-8 md:pt-0">
            <span className="text-5xl font-bold text-accent-300 mb-2">5M+</span>
            <span className="text-gray-400 font-medium">Items Evaluated</span>
          </div>
          <div className="flex flex-col items-center pt-8 md:pt-0">
            <span className="text-5xl font-bold text-accent-300 mb-2">2M kg</span>
            <span className="text-gray-400 font-medium">E-Waste Prevented</span>
          </div>
          <div className="flex flex-col items-center pt-8 md:pt-0">
            <span className="text-5xl font-bold text-accent-300 mb-2">₹400Cr</span>
            <span className="text-gray-400 font-medium">Value Recovered</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Intelligent Decisions at Scale</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Our AI models analyze your devices in seconds to give you actionable insights.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <ScanSearch size={32} className="text-primary-500" />, title: 'AI Condition Detection', desc: 'State-of-the-art computer vision accurately identifies scratches, cracks, and wear.' },
            { icon: <IndianRupee size={32} className="text-emerald-500" />, title: 'Instant Valuation', desc: 'Real-time market data provides the most accurate resale value for your specific model.' },
            { icon: <Wrench size={32} className="text-orange-500" />, title: 'Repair Advisory', desc: 'Find nearby trusted repair shops with estimated costs for fixing damaged devices.' }
          ].map((feature, idx) => (
            <Link to="/upload" key={idx} className="block glass-card p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-32">
        <div className="bg-gradient-hero rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Cpu size={200} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to unlock your product's value?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">Join thousands of users making sustainable and profitable choices with ReValueIQ.</p>
          <Link to="/upload" className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors relative z-10 shadow-lg">
            Start Free Analysis
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
