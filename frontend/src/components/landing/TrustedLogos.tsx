"use client";

const companies = [
  "Apple", "Samsung", "Dell", "HP", "Lenovo", "Google",
  "Microsoft", "Sony", "LG", "Asus", "Acer", "OnePlus",
];

export default function TrustedLogos() {
  const doubled = [...companies, ...companies];

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden bg-[#06140e] border-y border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p
          className="text-center text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-10"
        >
          Trusted by teams at forward-thinking eco companies & recyclers
        </p>
      </div>

      {/* Infinite Marquee */}
      <div className="fade-mask-x">
        <div className="animate-marquee flex items-center">
          {doubled.map((company, i) => (
            <div
              key={`${company}-${i}`}
              className="flex items-center justify-center min-w-[160px] sm:min-w-[200px] px-8"
            >
              <span className="text-lg sm:text-xl font-bold text-slate-500 hover:text-emerald-400 transition-colors duration-300 whitespace-nowrap tracking-tight">
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
