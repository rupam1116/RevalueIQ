import { Link } from 'react-router-dom';
import { Leaf, UserCircle } from 'lucide-react';

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass-card mx-4 mt-4 px-6 py-4 flex justify-between items-center rounded-2xl">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-gradient-hero p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
          <Leaf size={24} />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          ReValueIQ
        </span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <Link to="/upload" className="hover:text-primary-600 transition-colors">Analyze</Link>
        <Link to="/dashboard" className="hover:text-primary-600 transition-colors">Dashboard</Link>
        <Link to="/about" className="hover:text-primary-600 transition-colors">About</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/auth" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
          <UserCircle size={24} />
          <span className="hidden sm:inline font-medium">Login</span>
        </Link>
        <Link to="/upload" className="bg-gradient-hero text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/30">
          Start Analysis
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
