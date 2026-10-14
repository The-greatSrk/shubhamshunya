import React, { useState } from 'react';
import { PHILOSOPHY_ESSAYS } from '../data/mockData';
import { Essay } from '../types';
import { BookOpen, Sparkles, Clock, ArrowRight, X } from 'lucide-react';

export const PhilosophyEssays: React.FC = () => {
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);

  return (
    <section id="philosophy" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>WRITING & ESSAYS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
            Ideas That Refuse To Sit Quietly.
          </h2>
          <p className="text-base text-neutral-300 font-light leading-relaxed">
            Essays, inquiries, and working theses on consciousness, sovereign capability, freedom from borrowed identities, and the future of human development.
          </p>
        </div>

        {/* Essay Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PHILOSOPHY_ESSAYS.map((essay) => (
            <div
              key={essay.id}
              onClick={() => setSelectedEssay(essay)}
              className="p-7 rounded-2xl glass-panel border border-white/[0.07] hover:border-[#d4af37]/40 transition-all cursor-pointer flex flex-col justify-between gap-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="text-[#d4af37] uppercase tracking-wider">
                    {essay.theme}
                  </span>
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{essay.readingTime}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-white group-hover:text-[#d4af37] transition-colors">
                    {essay.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light">
                    {essay.subtitle}
                  </p>
                </div>

                <p className="text-xs text-neutral-300 font-light leading-relaxed line-clamp-3">
                  {essay.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-mono-code text-neutral-400 group-hover:text-white transition-colors">
                  Read complete essay
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Essay Reading Modal */}
      {selectedEssay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0d0d12] border border-[#d4af37]/30 rounded-2xl p-6 sm:p-10 space-y-6 text-neutral-200 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono-code text-[#d4af37] uppercase">
                  <span>{selectedEssay.theme}</span>
                  <span>•</span>
                  <span>{selectedEssay.readingTime}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  {selectedEssay.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400">
                  {selectedEssay.subtitle}
                </p>
              </div>

              <button
                onClick={() => setSelectedEssay(null)}
                className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors"
                aria-label="Close essay"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Featured Quote */}
            <div className="p-5 rounded-xl bg-black/50 border-l-2 border-l-[#d4af37] text-sm sm:text-base font-serif italic text-white leading-relaxed">
              “{selectedEssay.quote}”
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              {selectedEssay.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono-code text-neutral-500">
              <span>Author: Shubham Kasar</span>
              <button
                onClick={() => setSelectedEssay(null)}
                className="px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-colors"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
