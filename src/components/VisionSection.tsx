import React, { useState } from 'react';
import { Eye, TrendingUp, Cpu, Globe, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export const VisionSection: React.FC = () => {
  const [investorDeckOpen, setInvestorDeckOpen] = useState(false);

  const pillars = [
    {
      num: '01',
      title: 'The Educational Bottleneck',
      desc: 'Over 1.5 million engineering students graduate annually in India alone, with fewer than 10% equipped to write production-ready code. Traditional academia has failed to evolve beyond syllabus memorization.',
    },
    {
      num: '02',
      title: 'The Codagram Solution',
      desc: 'An outcome-aligned capability foundry where students build production architectures, receive relentless mentorship, and connect directly to tech hiring teams—bypassing traditional gatekeepers.',
    },
    {
      num: '03',
      title: 'The Long-Term Flywheel',
      desc: 'Top students become mentors; mentors build proprietary open-source and frontier technologies; hiring partners tap into an unpolluted source of verified engineering talent.',
    },
    {
      num: '04',
      title: 'Human Potential & Freedom',
      desc: 'A distant philosophical vision for a society built around sovereign capability, freedom from psychological dependency, and true inner contentment.',
    },
  ];

  return (
    <section id="vision" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
            <Eye className="w-3.5 h-3.5" />
            <span>THE LONG-TERM HORIZON</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
            This Is Only The Beginning.
          </h2>
          <p className="text-base text-neutral-300 font-light leading-relaxed">
            Codagram is not simply building coding bootcamps. We are designing the substrate for a new model of human capability where technology outside is matched with consciousness within.
          </p>
        </div>

        {/* 4 Horizon Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => (
            <div
              key={p.num}
              className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.07] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-xs font-mono-code text-[#d4af37]">
                  Phase {p.num}
                </span>
                <h3 className="text-lg font-heading font-bold text-white">
                  {p.title}
                </h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono-code text-neutral-600 uppercase">
                Long-Term Substrate
              </div>
            </div>
          ))}
        </div>

        {/* Discreet Investor Discovery Area */}
        <div className="p-6 sm:p-8 rounded-2xl glass-panel-subtle border border-white/[0.08] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-400">
                Institutional & Venture Inquiry
              </span>
              <h4 className="text-base sm:text-lg font-heading font-bold text-white">
                Building an Enduring Capability Infrastructure
              </h4>
            </div>
            <button
              onClick={() => setInvestorDeckOpen(!investorDeckOpen)}
              className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#d4af37] hover:underline self-start sm:self-auto"
            >
              <span>{investorDeckOpen ? 'Hide Overview' : 'Review Institutional Thesis'}</span>
              {investorDeckOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {investorDeckOpen && (
            <div className="pt-6 border-t border-white/[0.08] space-y-6 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                  <div className="font-mono-code text-xs text-[#d4af37] uppercase">
                    TAM & Market Window
                  </div>
                  <p className="text-xs text-neutral-300">
                    A $40B+ global upskilling and engineering talent market where legacy players rely on low-completion recorded videos. Codagram captures value via outcome alignment and employer hiring access.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                  <div className="font-mono-code text-xs text-[#d4af37] uppercase">
                    Defensibility & Flywheel
                  </div>
                  <p className="text-xs text-neutral-300">
                    Proprietary candidate assessment indicators, real project telemetry, community allegiance, and zero dependence on credential inflation creates deep organic retention and brand distinction.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                  <div className="font-mono-code text-xs text-[#d4af37] uppercase">
                    Founder Commitment
                  </div>
                  <p className="text-xs text-neutral-300">
                    Zero speculative burn. Grounded in unit economics, extreme craft discipline, and long-term societal vision rather than quick exits.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-code">
                <span>Direct Investor Relations: shubhamkasarsrk@gmail.com</span>
                <span className="text-neutral-500">Subject: "Institutional Partnership / Codagram"</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
