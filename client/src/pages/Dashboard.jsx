import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const mockHistory = [
    { id: 1, item: 'iPhone 13 Pro', date: '2023-10-15', status: 'Analyzed', value: '₹36,000', condition: 'Good' },
    { id: 2, item: 'MacBook Air M1', date: '2023-10-10', status: 'Repaired', value: '₹48,000', condition: 'Damaged' },
    { id: 3, item: 'Samsung Galaxy S21', date: '2023-09-28', status: 'Sold', value: '₹20,000', condition: 'Moderate' },
  ];

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, User! Track your sustainable impact.</p>
          </div>
          <Link to="/upload" className="bg-gradient-hero text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md">
            New Analysis
          </Link>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 bg-white">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Total Value Recovered</h3>
            <p className="text-3xl font-extrabold text-gray-900">₹1,04,000</p>
          </div>
          <div className="flex flex-col justify-center glass-card p-6 bg-emerald-50 border-emerald-100">
            <h3 className="text-emerald-700 text-sm font-medium uppercase tracking-wider mb-2">E-Waste Prevented</h3>
            <p className="text-3xl font-extrabold text-emerald-900">1.2 kg</p>
          </div>
          <div className="glass-card p-6 bg-white">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Items Processed</h3>
            <p className="text-3xl font-extrabold text-gray-900">3</p>
          </div>
        </div>

        {/* History Table */}
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1.5"><Clock size={14} />{item.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Analyzed' && <span className="flex items-center gap-1.5 text-sm text-indigo-600"><AlertCircle size={14} />{item.status}</span>}
                      {item.status === 'Repaired' && <span className="flex items-center gap-1.5 text-sm text-orange-600"><CheckCircle2 size={14} />{item.status}</span>}
                      {item.status === 'Sold' && <span className="flex items-center gap-1.5 text-sm text-emerald-600"><CheckCircle2 size={14} />{item.status}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
