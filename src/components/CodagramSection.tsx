import React, { useState } from 'react';
import { LEARNING_PROGRAMS } from '../data/mockData';
import { LearningProgram } from '../types';
import { 
  Terminal, 
  Cpu, 
  FolderGit2, 
  Users, 
  Briefcase, 
  Network, 
  BrainCircuit, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Layers, 
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface CodagramSectionProps {
  onSelectProgram: (program: LearningProgram) => void;
  onOpenApply: () => void;
  onEnrollWithUpi: (track: { itemName: string; amount: number; description: string }) => void;
}

export const CodagramSection: React.FC<CodagramSectionProps> = ({ 
  onSelectProgram, 
  onOpenApply,
  onEnrollWithUpi 
}) => {
  const [activeStep, setActiveStep] = useState<number>(3); // default highlight on REAL PROJECTS

  const flowSteps = [
    { label: 'STUDENT', desc: 'Arrives with intent and curiosity' },
    { label: 'LEARNING', desc: 'Foundations of systems & architecture' },
    { label: 'PRACTICE', desc: 'Writing code every day, breaking things' },
    { label: 'REAL PROJECTS', desc: 'Deploying multi-tenant, production apps' },
    { label: 'CAPABILITY', desc: 'Independent problem-solving instinct' },
    { label: 'OPPORTUNITY', desc: 'Direct visibility with hiring partners' },
    { label: 'EMPLOYMENT', desc: 'Placement matched on real proof of work' },
    { label: 'INDEPENDENCE', desc: 'The freedom to build your own destiny' },
  ];

  const whatYouGet = [
    {
      title: 'Real Learning',
      subtitle: 'Technical Rigor',
      icon: Terminal,
      desc: 'No superficial slides or outdated syllabi. Direct immersion in distributed systems, modern AI architectures, and resilient infrastructure.',
    },
    {
      title: 'Production Projects',
      subtitle: 'Proof of Work',
      icon: FolderGit2,
      desc: 'Build systems that handle actual traffic, concurrency, and failures. Your GitHub becomes an undeniable artifact of capability.',
    },
    {
      title: 'Human Guidance',
      subtitle: 'Daily Code Reviews',
      icon: Users,
      desc: 'Intense mentorship from active engineers who dissect your PRs, question your design choices, and show you how pros work.',
    },
    {
      title: 'Serious Community',
      subtitle: 'Ecosystem of Builders',
      icon: Network,
      desc: 'Work alongside peers who are equally hungry. An environment that eliminates excuses and makes relentless execution normal.',
    },
    {
      title: 'Career Preparation',
      subtitle: 'Engineering Interviews',
      icon: Briefcase,
      desc: 'Live mock system design, algorithmic problem solving, live debugging tests, and technical communication training.',
    },
    {
      title: 'Employer Access',
      subtitle: 'Hiring Network',
      icon: Layers,
      desc: 'Direct pipeline to fast-growing tech companies and startups looking for builders who can push code on day one.',
    },
    {
      title: 'First-Principles Thinking',
      subtitle: 'Beyond Memorization',
      icon: BrainCircuit,
      desc: 'Learn how to think, decompose ambiguous problems, and master any new framework or language without fear.',
    },
    {
      title: 'Independence',
      subtitle: 'The Ultimate Objective',
      icon: Flame,
      desc: 'Whether you join a unicorn, launch your own startup, or engineer frontier technology, you will never depend on someone else\'s approval to survive.',
    },
  ];

  return (
    <section id="codagram" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      <div className="space-y-20">
        {/* Section Header */}
        <div className="space-y-5 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
            <Cpu className="w-3.5 h-3.5" />
            <span>PILLAR ONE — THE EXECUTION LAYER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
            Education, Rebuilt Around Capability.
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
            Codagram is not another coaching institute. It is a system built to end the tragic gap where students spend years accumulating degrees only to discover they still don't know how to build or earn.
          </p>
        </div>

        {/* Interactive Capability Flow Diagram */}
        <div className="p-6 sm:p-8 rounded-2xl glass-panel space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div>
              <span className="text-xs font-mono-code uppercase tracking-widest text-neutral-400">
                The Codagram Pipeline
              </span>
              <h3 className="text-xl font-heading font-bold text-white">
                How Learning Transforms Into Independence
              </h3>
            </div>
            <span className="text-xs font-mono-code text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/20 self-start sm:self-auto">
              Interactive Flow
            </span>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {flowSteps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.label}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-3 ${
                    isActive
                      ? 'bg-white/[0.1] border-[#d4af37] shadow-sm'
                      : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code text-neutral-500">
                      0{idx + 1}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                    )}
                  </div>
                  <div>
                    <div className={`text-xs font-mono-code font-bold tracking-wider ${isActive ? 'text-[#d4af37]' : 'text-neutral-200'}`}>
                      {step.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active step explanation */}
          <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono-code uppercase text-[#d4af37] tracking-wider">
                Stage 0{activeStep + 1} Focus
              </span>
              <p className="text-sm sm:text-base font-heading font-medium text-white">
                {flowSteps[activeStep].label}: {flowSteps[activeStep].desc}
              </p>
            </div>
            <button
              onClick={onOpenApply}
              className="text-xs font-mono-code uppercase tracking-wider text-black bg-white px-4 py-2 rounded-full font-semibold hover:bg-neutral-200 transition-colors"
            >
              Start At Day 01
            </button>
          </div>
        </div>

        {/* "What You Get" 8 distinctive cards */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono-code uppercase tracking-widest text-neutral-400">
                Core System
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
                What Codagram Delivers
              </h3>
            </div>
            <p className="text-xs font-mono-code text-neutral-400 max-w-sm">
              Engineered for absolute capability, not passive memorization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whatYouGet.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl glass-panel border border-white/[0.06] hover:border-white/[0.15] transition-all flex flex-col justify-between gap-6 group"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-neutral-300 group-hover:text-[#d4af37] group-hover:border-[#d4af37]/30 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code uppercase tracking-wider text-neutral-500">
                        {item.subtitle}
                      </span>
                      <h4 className="text-base font-heading font-bold text-white">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono-code text-neutral-600 uppercase tracking-widest">
                    Pillar 0{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Programs / Tracks */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div>
              <span className="text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
                Intensive Programs
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
                Current & Frontier Learning Tracks
              </h3>
            </div>
            <span className="text-xs font-mono-code text-neutral-400">
              Low Initial Registration • Outcome-Aligned
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {LEARNING_PROGRAMS.map((prog) => (
              <div
                key={prog.id}
                className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/[0.08] hover:border-[#d4af37]/40 transition-all flex flex-col justify-between gap-6 relative"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-mono-code uppercase text-[#d4af37] px-2.5 py-1 rounded bg-[#d4af37]/10 border border-[#d4af37]/20">
                      {prog.domain}
                    </span>
                    <span className="text-xs font-mono-code text-neutral-400">
                      {prog.duration} • {prog.pace}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl sm:text-2xl font-heading font-bold text-white">
                      {prog.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1">
                      {prog.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {prog.description}
                  </p>

                  {/* Skills tags */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono-code uppercase tracking-wider text-neutral-500">
                      Core Technology Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {prog.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-mono-code text-neutral-300 bg-white/[0.04] px-2.5 py-1 rounded border border-white/[0.06]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sample real projects built */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono-code uppercase tracking-wider text-neutral-500">
                      Verified Capstone Projects:
                    </span>
                    <ul className="space-y-1 text-xs text-neutral-300">
                      {prog.projects.map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-mono-code text-neutral-400">
                    {prog.level}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEnrollWithUpi({
                        itemName: `Codagram Cohort Seat: ${prog.title}`,
                        amount: 999,
                        description: `Initial registration & verification token for ${prog.title}. Outcome-aligned balance upon onboarding.`,
                      })}
                      className="px-3.5 py-1.5 rounded-full text-xs font-mono-code text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 transition-colors"
                    >
                      Reserve Seat (₹999 UPI)
                    </button>
                    <button
                      onClick={() => {
                        onSelectProgram(prog);
                        onOpenApply();
                      }}
                      className="flex items-center gap-1.5 text-xs font-mono-code uppercase tracking-wider text-black bg-white hover:bg-neutral-200 px-3.5 py-1.5 rounded-full font-semibold transition-colors"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
