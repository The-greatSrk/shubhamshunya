import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { LearningProgram, TalentCandidate } from '../types';
import { LEARNING_PROGRAMS } from '../data/mockData';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'student' | 'employer' | 'shunya';
  selectedProgram?: LearningProgram | null;
  selectedCandidate?: TalentCandidate | null;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  type,
  selectedProgram,
  selectedCandidate,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(
    selectedProgram ? selectedProgram.title : LEARNING_PROGRAMS[0].title
  );
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProgram) {
      setSelectedTrack(selectedProgram.title);
    }
  }, [selectedProgram]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type === 'employer' ? 'employer_inquiry' : 'student_application',
          data: {
            name,
            email,
            phone,
            trackOrRole: type === 'employer' ? (selectedCandidate ? `Candidate: ${selectedCandidate.name} (${selectedCandidate.role})` : 'General Hiring Pool') : selectedTrack,
            notes,
          },
        }),
      });
      const data = await res.json();
      if (data.id) {
        setSubmittedId(data.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setSubmittedId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0d0d12] border border-white/[0.1] rounded-2xl p-6 sm:p-8 space-y-6 text-neutral-200 shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#d4af37]">
              {type === 'student'
                ? 'Codagram Admissions'
                : type === 'employer'
                ? 'Employer Talent Desk'
                : 'Shunya Book Request'}
            </span>
            <h3 className="text-xl font-heading font-bold text-white">
              {type === 'student'
                ? 'Apply For Capability Cohort'
                : type === 'employer'
                ? 'Request Talent / Submit Role'
                : 'Pre-Order / Request Shunya'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedId ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-xl font-heading font-bold text-white">
                Application Successfully Logged
              </h4>
              <p className="text-xs font-mono-code text-[#d4af37]">
                Reference Token: {submittedId}
              </p>
            </div>
            <p className="text-xs text-neutral-300 font-light leading-relaxed max-w-sm mx-auto">
              {type === 'student'
                ? 'Our technical admissions team reviews your problem-solving statement and responds with preliminary onboarding evaluation.'
                : 'Our talent partnership team will review your requirement and share verified candidate portfolios within 24 hours.'}
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs font-mono-code hover:bg-neutral-200"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'student' && (
              <div className="space-y-1">
                <label className="text-xs font-mono-code text-neutral-400">
                  Select Engineering Track
                </label>
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {LEARNING_PROGRAMS.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title} ({p.domain})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {type === 'employer' && selectedCandidate && (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono-code flex items-center justify-between">
                <span>Requested Candidate:</span>
                <span className="text-[#d4af37] font-semibold">
                  {selectedCandidate.name} ({selectedCandidate.role})
                </span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-mono-code text-neutral-400">
                {type === 'employer' ? 'Contact Name & Company' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={type === 'employer' ? 'Neha / VP Engineering at Acme' : 'Your name'}
                className="w-full px-3.5 py-2 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono-code text-neutral-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@domain.com"
                  className="w-full px-3.5 py-2 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono-code text-neutral-400">Phone (Optional)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91..."
                  className="w-full px-3.5 py-2 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono-code text-neutral-400">
                {type === 'student'
                  ? 'Why Codagram? What have you built so far?'
                  : type === 'employer'
                  ? 'Role details, required tech stack, or headcount'
                  : 'Message or shipping city'}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share your technical context..."
                className="w-full px-3.5 py-2 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-full text-xs font-mono-code uppercase tracking-wider font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <span>
                    {type === 'student'
                      ? 'Submit Application'
                      : type === 'employer'
                      ? 'Submit Hiring Requirement'
                      : 'Request Shunya'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] font-mono-code text-neutral-500 text-center">
              Your details are never shared with third parties or advertisers.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
