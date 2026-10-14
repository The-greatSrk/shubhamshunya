import React from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenApply: () => void;
  onOpenAi: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApply, onOpenAi, onOpenAdmin }) => {
  return (
    <footer className="bg-black border-t border-white/[0.08] relative overflow-hidden">
      {/* Cinematic Final Statement Experience */}
      <div className="py-32 px-5 sm:px-8 max-w-5xl mx-auto text-center space-y-12">
        <div className="space-y-6">
          <span className="text-xs font-mono-code uppercase tracking-[0.3em] text-[#d4af37]">
            THIS IS ONLY THE BEGINNING.
          </span>
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-tight max-w-3xl mx-auto leading-tight">
              I don't know exactly where this goes.
            </h2>
            <p className="text-2xl sm:text-4xl font-serif-title text-neutral-400 font-light italic">
              But I know I'm going.
            </p>
          </div>
        </div>

        {/* Identity Trinity */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm font-mono-code uppercase tracking-widest text-neutral-400 pt-4">
          <span className="text-white font-semibold">SHUBHAM KASAR</span>
          <span className="text-neutral-700">•</span>
          <span className="text-white font-semibold">CODAGRAM</span>
          <span className="text-neutral-700">•</span>
          <span className="text-[#d4af37] font-semibold">SHUNYA</span>
        </div>

        {/* Final Master CTA */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenApply}
            className="px-8 py-4 rounded-full text-xs sm:text-sm font-mono-code uppercase tracking-widest font-bold text-black bg-white hover:bg-neutral-200 transition-transform active:scale-95 shadow-2xl flex items-center gap-3"
          >
            <span>ENTER THE JOURNEY</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAi}
            className="px-6 py-4 rounded-full text-xs sm:text-sm font-mono-code uppercase tracking-wider text-neutral-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Consult Digital AI</span>
          </button>
        </div>
      </div>

      {/* Standard Bottom Meta Bar */}
      <div className="border-t border-white/[0.06] py-8 px-5 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-mono-code text-neutral-500 gap-4">
        <div>
          © {new Date().getFullYear()} Shubham Kasar. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href="#codagram" className="hover:text-neutral-300 transition-colors">
            Codagram
          </a>
          <a href="#shunya" className="hover:text-neutral-300 transition-colors">
            Shunya
          </a>
          <a href="#talent" className="hover:text-neutral-300 transition-colors">
            Talent
          </a>
          <a href="#science" className="hover:text-neutral-300 transition-colors">
            Science Lab
          </a>
          <a href="#talk" className="hover:text-neutral-300 transition-colors">
            Talk
          </a>
          <a href="#media" className="hover:text-neutral-300 transition-colors">
            Press
          </a>
          <button
            onClick={onOpenAdmin}
            className="text-neutral-500 hover:text-[#d4af37] transition-colors"
          >
            Admin Desk
          </button>
        </div>
        <div className="text-[11px] text-neutral-600">
          Pune, Maharashtra, India
        </div>
      </div>
    </footer>
  );
};
