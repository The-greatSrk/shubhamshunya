import React, { useState } from 'react';
import { BookOpen, Sparkles, Volume2, ArrowRight, Check, Compass, Eye, HeartHandshake, Shield } from 'lucide-react';
import { SHUNYA_INQUIRIES } from '../data/mockData';

interface ShunyaSectionProps {
  onOpenOrderModal: () => void;
  onOpenAiPhilosophy: () => void;
  onBuyBook: (edition: { title: string; amount: number; description: string }) => void;
}

export const ShunyaSection: React.FC<ShunyaSectionProps> = ({ 
  onOpenOrderModal, 
  onOpenAiPhilosophy,
  onBuyBook 
}) => {
  const [activeInquiry, setActiveInquiry] = useState<number>(0);
  const [contemplationLevel, setContemplationLevel] = useState<number>(1);
  const [sampleChapterOpen, setSampleChapterOpen] = useState<boolean>(false);

  const corePillars = [
    { title: 'Questioning Borrowed Identities', desc: 'Peeling away the layers of who family, society, and media told you to be.' },
    { title: 'Freedom from Expectation', desc: 'Ending the perpetual anxiety of performing for an audience that does not truly see you.' },
    { title: 'Consciousness Over Ego', desc: 'The discovery of the silent observer behind your passing thoughts and emotions.' },
    { title: 'Action Without Attachment', desc: 'Pouring relentless devotion into your work without making the reward your master.' },
    { title: 'The True Meaning of Zero', desc: 'Shunya is not emptiness as absence; it is the infinite ground from which everything emerges.' },
  ];

  return (
    <section id="shunya" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      {/* Meditative backdrop glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#d4af37]/[0.025] blur-[150px] pointer-events-none rounded-full" />

      <div className="space-y-20 relative z-10">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PILLAR TWO — THE PHILOSOPHICAL DIMENSION</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-serif-title font-normal tracking-wide text-white uppercase">
            SHUNYA
          </h2>
          <p className="text-xl sm:text-2xl font-heading font-light text-neutral-300">
            What remains when there is nothing left to prove?
          </p>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            *Shunya* is not an academic paper, nor a religious doctrine. It is an honest inquiry emerging from Shubham Kasar's confrontation with existence, ambition, borrowed identities, and inner liberation.
          </p>
        </div>

        {/* Editorial Book Showcase and Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Book Presentation (Editorial & Quiet) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              {/* Subtle aura behind book */}
              <div className="absolute -inset-2 bg-gradient-to-b from-[#d4af37]/10 to-transparent blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />

              {/* Minimalist 3D-feel Book Cover */}
              <div className="relative bg-[#0d0d12] border border-[#d4af37]/30 rounded-xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between h-[480px] text-neutral-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono-code uppercase tracking-widest text-neutral-500">
                    <span>A Work by Shubham Kasar</span>
                    <span className="text-[#d4af37]">शून्य</span>
                  </div>
                  <div className="pt-8 space-y-1">
                    <h3 className="text-3xl sm:text-4xl font-serif-title tracking-widest text-white uppercase">
                      SHUNYA
                    </h3>
                    <p className="text-xs font-mono-code uppercase tracking-widest text-neutral-400">
                      The Ground of Existence
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full border border-white/[0.1] flex items-center justify-center text-xs font-mono-code text-[#d4af37]">
                    0
                  </div>
                  <p className="text-xs text-neutral-400 font-serif-title italic leading-relaxed">
                    “You are not searching for the self. The self is searching through you.”
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono-code text-neutral-500">
                  <span>TRUTH • CONSCIOUSNESS • FREEDOM</span>
                  <span className="text-neutral-400">First Edition</span>
                </div>
              </div>
            </div>
          </div>

          {/* Book Pillars & Reading Invitation */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono-code uppercase tracking-widest text-neutral-400">
                The Philosophical Direction
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                Not a Guru. Not a Religion. A Direct Inquiry.
              </h3>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                Most people spend their lives attempting to become "someone"—accumulating wealth, recognition, followers, and social validation to fill an inner void. *Shunya* explores what happens when you examine that void directly and discover it was never empty.
              </p>
            </div>

            <div className="space-y-3">
              {corePillars.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl glass-panel-subtle border border-white/[0.05] hover:border-[#d4af37]/20 transition-all flex items-start gap-3.5"
                >
                  <div className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0 mt-1.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-heading font-semibold text-white">
                      {p.title}
                    </h4>
                    <p className="text-xs text-neutral-400 font-light">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Editions & Direct Purchase Options */}
            <div className="space-y-3 pt-1">
              <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#d4af37]">
                Available Editions (Instant UPI Checkout):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => onBuyBook({
                    title: 'Shunya: Paperback Edition',
                    amount: 499,
                    description: 'Original paperback edition with author inscription and delivery across India.',
                  })}
                  className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#d4af37]/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code text-neutral-400">Paperback</span>
                    <span className="text-xs font-mono-code font-bold text-white group-hover:text-[#d4af37]">₹499</span>
                  </div>
                  <div className="text-xs font-heading font-medium text-white mt-1">Printed Copy</div>
                </button>

                <button
                  onClick={() => onBuyBook({
                    title: 'Shunya: Hardcover Collector Edition',
                    amount: 799,
                    description: 'Gold-foil embossed hardcover, special introduction, and signed founder note.',
                  })}
                  className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#d4af37]/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code text-neutral-400">Hardcover</span>
                    <span className="text-xs font-mono-code font-bold text-white group-hover:text-[#d4af37]">₹799</span>
                  </div>
                  <div className="text-xs font-heading font-medium text-white mt-1">Collector's Edition</div>
                </button>

                <button
                  onClick={() => onBuyBook({
                    title: 'Shunya: Digital & Audio Inquiry',
                    amount: 199,
                    description: 'Immediate PDF / ePub access and audio commentary on core inquiries.',
                  })}
                  className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#d4af37]/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code text-neutral-400">Digital</span>
                    <span className="text-xs font-mono-code font-bold text-white group-hover:text-[#d4af37]">₹199</span>
                  </div>
                  <div className="text-xs font-heading font-medium text-white mt-1">Instant Download</div>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setSampleChapterOpen(!sampleChapterOpen)}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-mono-code uppercase tracking-wider font-semibold text-black bg-white hover:bg-neutral-200 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>{sampleChapterOpen ? 'Close Excerpt' : 'Read Opening Excerpt'}</span>
              </button>

              <button
                onClick={onOpenOrderModal}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-mono-code uppercase tracking-wider text-neutral-200 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] transition-colors"
              >
                <span>Bulk / Library Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAiPhilosophy}
                className="flex items-center gap-2 text-xs font-mono-code text-[#d4af37] hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Discuss Shunya with AI Companion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Excerpt Viewer */}
        {sampleChapterOpen && (
          <div className="p-8 sm:p-12 rounded-2xl glass-panel border border-[#d4af37]/30 space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono-code text-[#d4af37] uppercase tracking-widest">
                  Excerpt From Shunya • Chapter 1
                </span>
                <h4 className="text-xl sm:text-2xl font-serif-title text-white">
                  The Fear of Being Nobody
                </h4>
              </div>
              <button
                onClick={() => setSampleChapterOpen(false)}
                className="text-xs font-mono-code text-neutral-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-light leading-relaxed font-serif">
              <p>
                From the moment you are named, you are taught that you are unfinished. Society gives you an identity and simultaneously convinces you that it is defective until you add titles, wealth, applause, and achievements to it.
              </p>
              <p>
                So you run. You work eighteen hours a day. You collect degrees, titles, and compliments. But late at night, when the room is silent and no one is watching, the same question taps on your shoulder: <em>Who is the one who wanted all of this?</em>
              </p>
              <p className="text-white font-medium italic pl-4 border-l-2 border-[#d4af37]">
                “Freedom does not begin when you successfully become someone. Freedom begins when you stop trying to become someone.”
              </p>
              <p>
                When you rest in Shunya, you do not stop building. You build with ferocious excellence—not to prove that you are worthy, but because creation is the natural celebration of being alive.
              </p>
            </div>
          </div>
        )}

        {/* Interactive Contemplative Inquiry Interface */}
        <div className="p-8 sm:p-12 rounded-2xl glass-panel border border-white/[0.08] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
                Contemplative Interface
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                Inquiries into the Self
              </h3>
            </div>
            <p className="text-xs font-mono-code text-neutral-400">
              Select an inquiry below. Observe what happens in your own mind.
            </p>
          </div>

          {/* Question selector tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SHUNYA_INQUIRIES.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveInquiry(idx)}
                className={`p-4 rounded-xl text-left border transition-all text-xs font-heading font-medium leading-snug flex flex-col justify-between min-h-[90px] ${
                  activeInquiry === idx
                    ? 'bg-white/[0.08] border-[#d4af37] text-white'
                    : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                }`}
              >
                <span>{item.question}</span>
                <span className="text-[10px] font-mono-code text-neutral-500 mt-2">
                  0{idx + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Active inquiry contemplative display */}
          <div className="p-8 sm:p-10 rounded-2xl bg-black/60 border border-white/[0.06] space-y-4">
            <span className="text-xs font-mono-code text-[#d4af37] uppercase tracking-widest">
              Direct Inquiry
            </span>
            <h4 className="text-2xl sm:text-3xl font-serif-title text-white">
              "{SHUNYA_INQUIRIES[activeInquiry].question}"
            </h4>
            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-3xl">
              {SHUNYA_INQUIRIES[activeInquiry].reflection}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
