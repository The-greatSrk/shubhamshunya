import React, { useState } from 'react';
import { MessageSquare, ArrowRight, CheckCircle2, ShieldAlert, Sparkles, Send } from 'lucide-react';

export const TalkToShubham: React.FC = () => {
  const categories = [
    'Career & Engineering Direction',
    'Entrepreneurship & Building From Zero',
    'Education Reform & Capability',
    'Consciousness & Inner Inquiry',
    'Creative & Systems Architecture',
    'Life & Facing Uncertainty',
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [context, setContext] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !context) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'talk_request',
          data: {
            name,
            email,
            category: selectedCategory,
            context,
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

  return (
    <section id="talk" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>COUNSELLING & PERSPECTIVE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
            TALK.
          </h2>
          <p className="text-xl sm:text-2xl font-serif-title text-neutral-300 font-normal">
            Sometimes you don't need another answer. You need another perspective.
          </p>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            Direct, unvarnished conversation. Whether you are grappling with building your first startup, feeling trapped in conventional college education, or confronting the deeper questions of consciousness and purpose.
          </p>
        </div>

        {/* Ethical boundary disclaimers */}
        <div className="p-4 rounded-xl glass-panel-subtle border border-white/[0.06] flex items-start gap-3 max-w-3xl text-xs text-neutral-400 font-light">
          <ShieldAlert className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
          <p>
            <strong className="text-neutral-300 font-medium">Important note:</strong> Shubham is not a licensed medical therapist, psychiatrist, or registered financial advisor. This is dedicated one-on-one dialogue, experiential insight, and philosophical perspective from a founder living the inquiry.
          </p>
        </div>

        {/* Interactive Request Form / Confirmation */}
        <div className="max-w-3xl p-6 sm:p-10 rounded-2xl glass-panel border border-white/[0.08] relative">
          {submittedId ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-heading font-bold text-white">
                  Conversation Request Received
                </h3>
                <p className="text-xs font-mono-code text-[#d4af37]">
                  Reference ID: {submittedId}
                </p>
              </div>
              <p className="text-sm text-neutral-300 font-light max-w-md mx-auto leading-relaxed">
                Thank you for your honesty, {name}. Shubham reads conversation requests directly. You will receive an email scheduling link if your request aligns with an upcoming conversation block.
              </p>
              <button
                onClick={() => {
                  setSubmittedId(null);
                  setContext('');
                }}
                className="text-xs font-mono-code text-neutral-400 hover:text-white underline pt-4"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category selection */}
              <div className="space-y-2">
                <label className="text-xs font-mono-code uppercase tracking-wider text-neutral-400">
                  Select Primary Focus:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`p-3 rounded-xl text-left text-xs font-mono-code transition-all border ${
                        selectedCategory === c
                          ? 'bg-white text-black font-semibold border-white'
                          : 'bg-white/[0.02] text-neutral-400 border-white/[0.06] hover:bg-white/[0.05]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono-code text-neutral-400">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aryan Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.08] text-white text-xs font-mono-code focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono-code text-neutral-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aryan@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.08] text-white text-xs font-mono-code focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Context textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono-code text-neutral-400">
                  What are you currently confronting? What perspective do you seek?
                </label>
                <textarea
                  rows={4}
                  required
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Share openly. What is the real dilemma or question beneath the surface?"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/[0.08] text-white text-xs font-mono-code focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full text-xs font-mono-code uppercase tracking-wider font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <span>Request A Conversation</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
