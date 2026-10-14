import React from 'react';

export const ZeroSection: React.FC = () => {
  const telemetry = [
    { label: 'Active Learning Tracks', value: '4' },
    { label: 'Verified Capstone Architectures', value: '18+' },
    { label: 'Hiring Partners Engaged', value: '12' },
    { label: 'Pune Engineering Campuses', value: 'BUILDING' },
    { label: 'Open Source Codebases', value: 'BUILDING' },
    { label: 'Philosophical Inquiries', value: 'INFINITE' },
  ];

  return (
    <section className="py-24 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Large Typographic Zero */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="text-[120px] sm:text-[180px] lg:text-[220px] font-heading font-black tracking-tighter text-white leading-none select-none">
            0
          </div>
          <p className="text-xl sm:text-2xl font-serif-title uppercase tracking-widest text-[#d4af37] -mt-4">
            SHUNYA
          </p>
        </div>

        {/* Narrative & Honest Telemetry */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-mono-code uppercase tracking-widest text-neutral-400">
              The Fundamental Baseline
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
              Everything Starts From Zero.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              We do not publish inflated numbers, fake alumni counts, or fabricated placement rates. Zero is not a deficiency; zero is the honest foundation upon which true capability is built.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {telemetry.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl glass-panel-subtle border border-white/[0.06] space-y-1"
              >
                <div className="text-lg sm:text-xl font-heading font-bold text-white">
                  {t.value}
                </div>
                <div className="text-[10px] font-mono-code uppercase tracking-wider text-neutral-400">
                  {t.label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs font-mono-code text-neutral-500 italic">
            *Metrics reflect active, verified cohort capacity. We never buy followers, manufacture testimonials, or license third-party badges.
          </p>
        </div>
      </div>
    </section>
  );
};
