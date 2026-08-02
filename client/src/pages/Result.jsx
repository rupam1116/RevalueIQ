import { useLocation, Link } from 'react-router-dom';
import { IndianRupee, AlertTriangle, ShieldCheck, MapPin, Wrench, Recycle, BarChart3, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

function Result() {
  const location = useLocation();
  const resultData = location.state?.resultData;
  const [shops, setShops] = useState([]);

  useEffect(() => {
    // Fetch mock shops
    fetch('http://localhost:5000/api/shops')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShops(data.data);
        }
      })
      .catch(err => console.error('Error fetching shops:', err));
  }, []);

  if (!resultData) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">No Analysis Data Found</h2>
        <Link to="/upload" className="text-primary-600 hover:underline">Go back to upload</Link>
      </div>
    );
  }

  const {
    productName,
    detectedCondition,
    estimatedPrice,
    repairCost,
    isFraud,
    circularityRecommendation,
    circularityScore
  } = resultData;

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Good': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Damaged': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Analysis Results</h1>
            <p className="text-xl text-gray-500">{productName}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-semibold">
            <BarChart3 size={20} />
            Circularity Score: {circularityScore}/100
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Estimated Value Card */}
          <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <IndianRupee size={100} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Estimated Resale Value</p>
              <h2 className="text-5xl font-extrabold text-gray-900">₹{estimatedPrice}</h2>
            </div>
            <div className="mt-6 flex items-center text-sm text-gray-500 gap-2">
              <ShieldCheck size={16} className="text-emerald-500" /> Based on current market data
            </div>
          </div>

          {/* Condition & Fraud Card */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Detected Condition</p>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${getConditionColor(detectedCondition)}`}>
                {detectedCondition}
              </span>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Authenticity Match</p>
              {isFraud ? (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                  <AlertTriangle size={20} />
                  <span className="font-semibold text-sm">Potential Mismatch Detected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <ShieldCheck size={20} />
                  <span className="font-semibold text-sm">Verified Match</span>
                </div>
              )}
            </div>
          </div>

          {/* Circularity Recommendation */}
          <div className="glass-card p-6 bg-gradient-hero text-white border-none">
            <div className="flex items-center gap-2 mb-4 opacity-80">
              <Recycle size={20} />
              <span className="text-sm font-medium uppercase tracking-wider">AI Recommendation</span>
            </div>
            <h3 className="text-4xl font-bold mb-4">{circularityRecommendation}</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              Based on the condition, current value, and estimated repair costs, the most sustainable and economically viable option is to {circularityRecommendation.toLowerCase()}.
            </p>
            <button className="w-full py-3 bg-white text-primary-600 font-bold rounded-xl shadow-md hover:bg-gray-50 transition-colors flex justify-between items-center px-4">
              Take Action <ChevronRight size={18} />
            </button>
          </div>

        </div>

        {/* Repair Section (Conditional) */}
        {repairCost && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <Wrench size={24} className="text-orange-500" />
              <h3 className="text-2xl font-bold text-gray-900">Repair Options (Est. ₹{repairCost})</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map(shop => (
                <div key={shop.id} className="glass-card p-6 hover:-translate-y-1 transition-transform">
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{shop.name}</h4>
                  <div className="flex items-center text-gray-500 text-sm mb-4 gap-1">
                    <MapPin size={14} />
                    {shop.location}
                  </div>
                  
                  <div className="flex justify-between items-center mb-6 text-sm">
                    <div>
                      <span className="text-gray-400 block text-xs uppercase font-medium">Est. Cost</span>
                      <span className="font-semibold text-gray-900">₹{shop.estimatedCost}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-xs uppercase font-medium">Rating</span>
                      <span className="font-semibold text-yellow-600">★ {shop.rating}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors text-sm">
                      Details
                    </button>
                    <button className="flex-1 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm shadow-sm">
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Result;
