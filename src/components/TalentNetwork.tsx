import React, { useState } from 'react';
import { TALENT_POOL } from '../data/mockData';
import { TalentCandidate } from '../types';
import { Briefcase, Code, CheckCircle, ExternalLink, Filter, Search, ArrowRight, ShieldCheck } from 'lucide-react';

interface TalentNetworkProps {
  onRequestCandidate: (candidate?: TalentCandidate) => void;
  onSubmitHiringReq: () => void;
}

export const TalentNetwork: React.FC<TalentNetworkProps> = ({ onRequestCandidate, onSubmitHiringReq }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const domains = ['All', 'Distributed Systems', 'Applied AI', 'DevOps & Reliability', 'Scientific Computing'];

  const filteredTalent = TALENT_POOL.filter((t) => {
    const matchesDomain = selectedDomain === 'All' || t.domain === selectedDomain;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  return (
    <section id="talent" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
              <Briefcase className="w-3.5 h-3.5" />
              <span>THE CODAGRAM TALENT NETWORK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
              Don't Hire a Resume.
              <br />
              <span className="text-neutral-400 font-light">Hire Capability.</span>
            </h2>
            <p className="text-base text-neutral-300 font-light leading-relaxed">
              Resumes can be embellished. Certifications can be memorized. Production systems cannot be faked.
              Every Codagram candidate has built, deployed, and stress-tested living architectures.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onSubmitHiringReq}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono-code uppercase tracking-wider font-semibold text-black bg-white hover:bg-neutral-200 transition-colors shadow-sm"
            >
              <span>Submit Hiring Requirement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-500 mr-2 shrink-0 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Domain:</span>
            </span>
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`text-xs font-mono-code px-3 py-1.5 rounded-full shrink-0 transition-colors ${
                  selectedDomain === d
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white bg-white/[0.04]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills, role, stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-mono-code bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTalent.map((candidate) => (
            <div
              key={candidate.id}
              className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/[0.08] hover:border-[#d4af37]/40 transition-all flex flex-col justify-between gap-6 relative group"
            >
              <div className="space-y-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-heading font-bold text-white group-hover:text-[#d4af37] transition-colors">
                        {candidate.name}
                      </h3>
                      <span className="text-[10px] font-mono-code text-neutral-400 bg-white/[0.05] px-2 py-0.5 rounded">
                        {candidate.id}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-neutral-300">
                      {candidate.role}
                    </p>
                    <p className="text-[11px] font-mono-code text-neutral-500">
                      {candidate.location}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono-code px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shrink-0">
                    {candidate.availability}
                  </span>
                </div>

                {/* Featured Capstone Project */}
                <div className="p-4 rounded-xl bg-black/50 border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono-code text-[#d4af37]">
                    <span>Verified Project</span>
                    <span className="text-neutral-500">{candidate.featuredProject.metrics}</span>
                  </div>
                  <h4 className="text-sm font-heading font-semibold text-white">
                    {candidate.featuredProject.title}
                  </h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {candidate.featuredProject.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {candidate.featuredProject.techStack.map((stk) => (
                      <span
                        key={stk}
                        className="text-[10px] font-mono-code text-neutral-300 bg-white/[0.06] px-2 py-0.5 rounded"
                      >
                        {stk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verified Assessment Scores */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono-code uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Codagram Assessment Indicators</span>
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-xs font-mono-code text-white font-bold">
                        {candidate.verifiedAssessment.codeQuality}%
                      </div>
                      <div className="text-[10px] text-neutral-500 uppercase font-mono-code">
                        Code Quality
                      </div>
                    </div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-xs font-mono-code text-white font-bold">
                        {candidate.verifiedAssessment.systemDesign}%
                      </div>
                      <div className="text-[10px] text-neutral-500 uppercase font-mono-code">
                        System Design
                      </div>
                    </div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-xs font-mono-code text-white font-bold">
                        {candidate.verifiedAssessment.problemSolving}%
                      </div>
                      <div className="text-[10px] text-neutral-500 uppercase font-mono-code">
                        Problem Solving
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-mono-code text-neutral-300 bg-white/[0.03] px-2.5 py-1 rounded border border-white/[0.06]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-mono-code text-neutral-400">
                  {candidate.experienceLevel}
                </span>
                <button
                  onClick={() => onRequestCandidate(candidate)}
                  className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-black bg-white hover:bg-neutral-200 px-4 py-2 rounded-full font-semibold transition-colors"
                >
                  <span>Request Candidate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Company Assurance Notice */}
        <div className="p-6 rounded-2xl glass-panel-subtle border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Zero recruitment commissions for vetted hiring partners during current cohort.</span>
          </div>
          <button
            onClick={onSubmitHiringReq}
            className="text-white hover:text-[#d4af37] underline transition-colors"
          >
            Schedule a 15-minute engineering talent briefing →
          </button>
        </div>
      </div>
    </section>
  );
};
