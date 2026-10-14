import React, { useState } from 'react';
import { Building2, GraduationCap, CheckCircle2, ArrowRight, Send, Layers } from 'lucide-react';

export const PartnerSection: React.FC = () => {
  const [partnerType, setPartnerType] = useState<'college' | 'company'>('college');
  const [institutionName, setInstitutionName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName || !email) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'college_partner',
          data: {
            partnerType,
            institutionName,
            contactPerson,
            email,
            message,
          },
        }),
      });
      const data = await res.json();
      if (data.id) {
        setSubmittedId(data.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="partner" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
            <Building2 className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
            Partner With Codagram.
          </h2>
          <p className="text-base text-neutral-300 font-light leading-relaxed">
            We partner with forward-thinking colleges, university departments, and engineering incubators to bring genuine production capability directly to campus students.
          </p>
        </div>

        {/* Partnership tracks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.07] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#d4af37]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">
              Campus Immersion Labs
            </h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Intensive multi-day bootcamp modules replacing theoretical syllabus with distributed systems, modern AI engineering, and Git-first development.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.07] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#d4af37]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">
              Faculty Synergy
            </h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Equipping educators with modern cloud architectures, agentic AI frameworks, and contemporary industry tooling for capstone student evaluations.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.07] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#d4af37]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">
              Direct Placement Pipeline
            </h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Connecting high-performing campus candidates with Codagram’s hiring partner ecosystem across Pune, Bangalore, and remote startups.
            </p>
          </div>
        </div>

        {/* Interactive Partnership Form */}
        <div className="max-w-3xl p-6 sm:p-10 rounded-2xl glass-panel border border-white/[0.08] space-y-6">
          <h3 className="text-xl font-heading font-bold text-white">
            Initiate Institutional Partnership
          </h3>

          {submittedId ? (
            <div className="py-8 text-center space-y-3 animate-in fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-heading font-bold text-white">
                Partnership Request Logged
              </h4>
              <p className="text-xs font-mono-code text-[#d4af37]">
                Reference: {submittedId}
              </p>
              <p className="text-xs text-neutral-300 font-light max-w-sm mx-auto">
                Our team will review your institution's profile and schedule a technical roadmap briefing.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPartnerType('college')}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono-code ${
                    partnerType === 'college'
                      ? 'bg-white text-black font-semibold'
                      : 'bg-white/[0.05] text-neutral-400'
                  }`}
                >
                  Engineering College / University
                </button>
                <button
                  type="button"
                  onClick={() => setPartnerType('company')}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono-code ${
                    partnerType === 'company'
                      ? 'bg-white text-black font-semibold'
                      : 'bg-white/[0.05] text-neutral-400'
                  }`}
                >
                  Tech Enterprise / Startup
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono-code text-neutral-400">
                    Institution / Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="e.g. Pune Institute of Computer Technology"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/[0.08] text-white text-xs font-mono-code focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono-code text-neutral-400">
                    Official Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dean@institution.ac.in"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/[0.08] text-white text-xs font-mono-code focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono-code text-neutral-400">
                  Proposed Scope / Programs of Interest
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about student numbers, department focus, or specific technical domains..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.08] text-white text-xs font-mono-code focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-full text-xs font-mono-code uppercase tracking-wider font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? <span>Logging Inquiry...</span> : <span>Submit Partnership Proposal</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
