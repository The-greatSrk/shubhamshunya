import React, { useState } from 'react';
import { BookOpen, Sparkles, Volume2, ArrowRight, Check, Compass, Eye, HeartHandshake, Shield, ExternalLink, ShoppingBag } from 'lucide-react';
import { SHUNYA_INQUIRIES } from '../data/mockData';
import { ASSETS } from '../assets/branding';
import { ThreeDBookViewer } from './ThreeDBookViewer';

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
    { title: 'Questioning Borrowed Identities', desc: 'Peeling away the layers of who family, society, and media told you to be.', color: 'border-[#4285F4]' },
    { title: 'Freedom from Expectation', desc: 'Ending the perpetual anxiety of performing for an audience that does not truly see you.', color: 'border-[#EA4335]' },
    { title: 'Consciousness Over Ego', desc: 'The discovery of the silent observer behind your passing thoughts and emotions.', color: 'border-[#FBBC05]' },
    { title: 'Action Without Attachment (Samarpan)', desc: 'Pouring relentless devotion into your work without making the reward your master.', color: 'border-[#34A853]' },
    { title: 'The True Meaning of Zero', desc: 'Shunya is not emptiness as absence; it is the infinite ground from which everything emerges.', color: 'border-white/30' },
  ];

  return (
    <section id="shunya" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-[#1E293B] relative">
      {/* Meditative backdrop glow with Google Yellow and Blue accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#FBBC05]/[0.035] blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-[#4285F4]/[0.025] blur-[130px] pointer-events-none rounded-full" />

      <div className="space-y-20 relative z-10">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#FBBC05]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PILLAR TWO — THE PHILOSOPHICAL DIMENSION</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-serif-title font-normal tracking-wide text-white uppercase">
            SHUNYA: SAT CHIT ANAND
          </h2>
          <p className="text-xl sm:text-2xl font-heading font-light text-slate-300">
            What remains when there is nothing left to prove?
          </p>
          <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
            *Shunya* is not an academic paper, nor a religious doctrine. It is an honest inquiry emerging from Shubham Kasar's confrontation with existence, ambition, borrowed identities, and inner liberation.
          </p>
        </div>

        {/* Editorial Book Showcase and Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* 3D Dimensional Book Presentation */}
          <div className="lg:col-span-5 flex justify-center">
            <ThreeDBookViewer 
              onBuyBook={onBuyBook} 
              onOpenExcerpt={() => setSampleChapterOpen(true)} 
            />
          </div>

          {/* Book Pillars & Reading Invitation */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono-code uppercase tracking-widest text-[#4285F4]">
                The Philosophical Direction
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                Not a Guru. Not a Religion. A Direct Inquiry.
              </h3>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                Most people spend their lives attempting to become "someone"—accumulating wealth, recognition, followers, and social validation to fill an inner void. *Shunya: Sat Chit Anand* explores what happens when you examine that void directly and discover it was never empty.
              </p>
            </div>

            <div className="space-y-3">
              {corePillars.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl bg-[#0F1523] border ${p.color} hover:bg-[#141C2E] transition-all flex items-start gap-3.5`}
                >
                  <div className="w-2 h-2 rounded-full bg-[#FBBC05] shrink-0 mt-1.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-heading font-semibold text-white">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-light">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Editions & Direct Purchase Options with Instant UPI */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#34A853] font-semibold">
                  Official Purchase Options (Instant UPI & Amazon):
                </span>
                <span className="text-[10px] font-mono-code text-slate-400">
                  GPay • PhonePe • Paytm
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => onBuyBook({
                    title: 'Shunya: Paperback Edition',
                    amount: 499,
                    description: 'Original paperback edition of Shunya: Sat Chit Anand by Shubham Kasar with author inscription and delivery across India.',
                  })}
                  className="p-3.5 rounded-xl bg-[#0F1523] hover:bg-[#141C2E] border border-[#1E293B] hover:border-[#34A853] text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code text-slate-400">Paperback</span>
                    <span className="text-xs font-mono-code font-bold text-white group-hover:text-[#34A853]">₹499</span>
                  </div>
                  <div className="text-xs font-heading font-medium text-white mt-1">Printed Copy (UPI)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Free delivery in India</div>
                </button>

                <button
                  onClick={() => onBuyBook({
                    title: 'Shunya: Hardcover Collector Edition',
                    amount: 799,
                    description: 'Gold-foil embossed hardcover of Shunya: Sat Chit Anand with special introduction and signed founder note by Shubham Kasar.',
                  })}
                  className="p-3.5 rounded-xl bg-[#0F1523] hover:bg-[#141C2E] border border-[#1E293B] hover:border-[#FBBC05] text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code text-slate-400">Hardcover</span>
                    <span className="text-xs font-mono-code font-bold text-white group-hover:text-[#FBBC05]">₹799</span>
                  </div>
                  <div className="text-xs font-heading font-medium text-white mt-1">Collector's Edition</div>
                  <div className="text-[10px] text-[#FBBC05] mt-0.5">Gold-foil & signed</div>
                </button>

                <a
                  href="https://www.amazon.com/s?k=shunya+sat+chit+anand+shubham+kasar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#0F1523] hover:bg-[#141C2E] border border-[#1E293B] hover:border-[#FF9900] text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code text-[#FF9900]">Amazon Kindle</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                  </div>
                  <div className="text-xs font-heading font-medium text-white mt-1">Kindle / E-Book</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Instant Amazon Reader</div>
                </a>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setSampleChapterOpen(!sampleChapterOpen)}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-mono-code uppercase tracking-wider text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#FBBC05]" />
                <span>{sampleChapterOpen ? 'Close Excerpt' : 'Read Opening Chapter Excerpt'}</span>
              </button>

              <button
                onClick={onOpenAiPhilosophy}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-mono-code uppercase tracking-wider text-slate-300 hover:text-white bg-[#0F1523] border border-[#1E293B] hover:border-[#4285F4] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#4285F4]" />
                <span>Ask AI Philosophical Companion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sample Chapter Modal/Accordion */}
        {sampleChapterOpen && (
          <div className="p-8 sm:p-12 rounded-2xl bg-[#0F1523] border border-[#1E293B] space-y-6 max-w-4xl mx-auto shadow-2xl animate-in fade-in duration-300">
            <div className="border-b border-[#1E293B] pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono-code uppercase tracking-widest text-[#FBBC05]">
                  Chapter 01 Excerpt
                </span>
                <h4 className="text-2xl font-serif-title text-white uppercase mt-1">
                  The Illusion of Becoming
                </h4>
              </div>
              <button
                onClick={() => setSampleChapterOpen(false)}
                className="text-xs font-mono-code text-slate-400 hover:text-white"
              >
                [Close]
              </button>
            </div>

            <div className="space-y-4 text-slate-300 font-serif-title text-base sm:text-lg leading-relaxed italic">
              <p>
                “You were born without an identity. Within months, names, expectations, castes, religions, and career tracks were stamped onto your consciousness like labels on an empty container.”
              </p>
              <p>
                “For thirty years, you run so fast trying to make the container impressive that you never stop to ask what was inside before the labels were glued. Shunya is not the destruction of the container. It is the sudden, blinding realization of the space within it.”
              </p>
              <p>
                “When you realize you have nothing to prove, your work does not stop. It transforms. You no longer build out of fear; you build out of sheer wonder.”
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono-code text-slate-400">
              <span>— From "Shunya: Sat Chit Anand" by Shubham Kasar</span>
              <button
                onClick={() => onBuyBook({
                  title: 'Shunya: Hardcover Collector Edition',
                  amount: 799,
                  description: 'Hardcover edition of Shunya: Sat Chit Anand with signed inscription by Shubham Kasar.',
                })}
                className="text-[#FBBC05] hover:underline font-semibold"
              >
                Order Full Book via UPI →
              </button>
            </div>
          </div>
        )}

        {/* Interactive Contemplation Engine */}
        <div className="p-6 sm:p-10 rounded-2xl bg-[#0F1523] border border-[#1E293B] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
            <div>
              <span className="text-xs font-mono-code uppercase tracking-widest text-slate-400">
                Interactive Contemplation
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mt-1">
                Five Questions That Dissolve Borrowed Identities
              </h3>
            </div>
            <div className="flex items-center gap-1.5 bg-[#080B10] p-1.5 rounded-full border border-[#1E293B]">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setContemplationLevel(lvl)}
                  className={`px-3 py-1 rounded-full text-xs font-mono-code transition-colors ${
                    contemplationLevel === lvl
                      ? 'bg-[#FBBC05] text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Level 0{lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {SHUNYA_INQUIRIES.map((inquiry, idx) => (
              <button
                key={idx}
                onClick={() => setActiveInquiry(idx)}
                className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between gap-4 ${
                  activeInquiry === idx
                    ? 'bg-[#141C2E] border-[#FBBC05] shadow-lg shadow-[#FBBC05]/10'
                    : 'bg-[#080B10] border-[#1E293B] hover:border-white/20'
                }`}
              >
                <span className="text-[10px] font-mono-code text-slate-500">
                  INQUIRY 0{idx + 1}
                </span>
                <div className="text-xs font-heading font-medium text-white line-clamp-2">
                  {inquiry.question}
                </div>
              </button>
            ))}
          </div>

          {/* Active Inquiry Exploration */}
          <div className="p-6 rounded-xl bg-[#080B10] border border-[#1E293B] space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-mono-code uppercase text-[#FBBC05] tracking-wider">
                Contemplation 0{activeInquiry + 1}
              </span>
              <h4 className="text-lg sm:text-xl font-heading font-bold text-white">
                {SHUNYA_INQUIRIES[activeInquiry]?.question}
              </h4>
            </div>
            <p className="text-sm text-slate-300 font-serif-title italic leading-relaxed">
              "{SHUNYA_INQUIRIES[activeInquiry]?.reflection}"
            </p>
            <div className="pt-2 flex items-center justify-between text-xs font-mono-code text-slate-400">
              <span>Deepening: {contemplationLevel === 1 ? 'Surface Inquiry' : contemplationLevel === 2 ? 'Inner Reflection' : 'Non-Dual Realization'}</span>
              <button
                onClick={onOpenAiPhilosophy}
                className="text-[#4285F4] hover:underline"
              >
                Discuss with Shunya AI →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
