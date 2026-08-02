import { Leaf, Users, Globe2 } from 'lucide-react';

function About() {
  return (
    <div className="flex-grow py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-medium text-sm mb-6 border border-emerald-100">
            <Leaf size={16} />
            <span>Our Mission</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Building a Sustainable Future, Together.
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            At ReValueIQ, we believe that every electronic device deserves a second life. We are on a mission to reduce global e-waste by empowering consumers with AI-driven insights to repair, reuse, and recycle smartly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
          <div className="glass-card p-8 bg-white">
            <div className="w-12 h-12 bg-indigo-50 text-primary-600 rounded-xl flex items-center justify-center mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h3>
            <p className="text-gray-600 leading-relaxed">
              We are a team of technologists, environmentalists, and data scientists dedicated to building the infrastructure for the circular economy. Our AI models are trained on millions of data points to ensure you get the most accurate valuation and repair advice.
            </p>
          </div>

          <div className="glass-card p-8 bg-white">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Globe2 size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Impact</h3>
            <p className="text-gray-600 leading-relaxed">
              E-waste is the fastest-growing waste stream in the world. By choosing to repair or sell your devices instead of throwing them away, you are directly contributing to a reduction in carbon emissions and hazardous landfill waste.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
