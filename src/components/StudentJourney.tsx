import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Flame, Compass, Sparkles } from 'lucide-react';

interface StudentJourneyProps {
  onOpenApply: () => void;
}

export const StudentJourney: React.FC<StudentJourneyProps> = ({ onOpenApply }) => {
  const milestones = [
    {
      time: 'DAY 01',
      title: 'You Enter Codagram',
      highlight: 'You don’t just receive a course. You enter a system.',
      description:
        'From the first morning, you are treated as an apprentice software engineer, not a customer in a classroom. Your developer environment is calibrated, git workflows are established, and the illusion of passive learning is shattered.',
      tags: ['System Setup', 'Mental Calibration', 'Zero Memorization'],
    },
    {
      time: 'MONTH 01',
      title: 'Deconstructing Technology & Yourself',
      highlight: 'Understanding how machines, systems, and your own mind actually work.',
      description:
        'You stop fearing syntax errors and ambiguous problem statements. You dissect protocols, memory models, network packets, and database execution plans. You begin to understand where your natural engineering instincts lie.',
      tags: ['First Principles', 'System Architecture', 'Debugging Instincts'],
    },
    {
      time: 'MONTH 02',
      title: 'The Production Crucible',
      highlight: 'Your work becomes undeniable evidence of your capability.',
      description:
        'No more tutorial cloning. You build, stress-test, and deploy real production applications. You configure load balancing, handle race conditions, and defend your technical choices in rigorous code reviews.',
      tags: ['Production Code', 'Load Testing', 'Peer Code Reviews'],
    },
    {
      time: 'NEXT',
      title: 'The Talent Network & Beyond',
      highlight: 'Companies don\'t review a resume; they inspect your living proof of work.',
      description:
        'You enter the verified Codagram Talent Network. Partner companies browse your deployed projects and assessment indicators. You interview not as an applicant begging for a chance, but as a verified builder ready to solve problems on day one.',
      tags: ['Direct Hiring Access', 'Technical Interviews', 'True Independence'],
    },
  ];

  return (
    <section className="py-24 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
            <Compass className="w-3.5 h-3.5" />
            <span>THE STUDENT JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
            How The Transformation Actually Happens.
          </h2>
          <p className="text-base text-neutral-300 font-light leading-relaxed">
            Real capability isn’t conferred by a graduation certificate. It is forged through progressive confrontation with real systems.
          </p>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.07] hover:border-[#d4af37]/30 transition-all flex flex-col justify-between gap-6 relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code text-[#d4af37] px-2.5 py-1 rounded bg-[#d4af37]/10 border border-[#d4af37]/20">
                    {m.time}
                  </span>
                  <span className="text-xs font-mono-code text-neutral-600">
                    Phase 0{idx + 1}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-[#d4af37] transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs font-heading font-medium text-neutral-300 italic">
                    "{m.highlight}"
                  </p>
                </div>

                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {m.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {m.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono-code text-neutral-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-[11px] font-mono-code text-neutral-500 pt-3 border-t border-white/[0.06]">
                Transformation checkpoint
              </div>
            </div>
          ))}
        </div>

        {/* The Deeper Outcome Statement Box */}
        <div className="p-8 sm:p-10 rounded-2xl glass-panel border border-l-4 border-l-[#d4af37] border-white/[0.08] relative space-y-4">
          <span className="text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
            The Non-Negotiable Truth
          </span>
          <blockquote className="text-lg sm:text-2xl font-heading font-semibold text-white leading-relaxed max-w-4xl">
            “Even if the job takes longer, you leave with something a job cannot give you: capability, confidence, direction, and independence.”
          </blockquote>
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-2xl">
            A job is a transaction. Capability is sovereign power. When you own the craft, companies compete for your time, and you never have to fear an unpredictable job market again.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenApply}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-mono-code uppercase tracking-wider font-semibold text-black bg-white hover:bg-neutral-200 transition-colors"
            >
              <span>Begin Your Journey At Codagram</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
