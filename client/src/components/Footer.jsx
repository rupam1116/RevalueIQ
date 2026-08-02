import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-hero p-1.5 rounded-lg text-white">
              <Leaf size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">ReValueIQ</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            Empowering sustainable choices through AI-driven insights for second-hand goods, repair advisory, and eco-impact analysis.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link to="/upload" className="hover:text-primary-600 transition-colors">Analyze Product</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary-600 transition-colors">Dashboard</Link></li>
            <li><Link to="/payment" className="hover:text-primary-600 transition-colors">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link to="/about" className="hover:text-primary-600 transition-colors">About Us</Link></li>
            <li><Link to="/" className="hover:text-primary-600 transition-colors">Sustainability</Link></li>
            <li><Link to="/" className="hover:text-primary-600 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Legal & Social</h4>
          <ul className="space-y-3 text-sm text-gray-500 mb-6">
            <li><Link to="/" className="hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/" className="hover:text-primary-600 transition-colors">Terms of Service</Link></li>
          </ul>
          <div className="flex gap-4">
            <Link to="/" className="text-gray-400 hover:text-primary-600 transition-colors">Social Links</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} ReValueIQ. All rights reserved. Promoting a circular economy.
      </div>
    </footer>
  );
}

export default Footer;
