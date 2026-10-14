import React, { useState } from 'react';
import { Camera, Download, Mic, Mail, Award, CheckCircle2, Copy } from 'lucide-react';
import { FOUNDER_FACTS } from '../data/mockData';

export const MediaPress: React.FC = () => {
  const [copiedBio, setCopiedBio] = useState<string | null>(null);

  const shortBio =
    "Shubham Kasar is an Indian entrepreneur, technology builder, author of 'Shunya', and the founder of Codagram. Based in Pune, he is working to rethink the intersection of technical education, sovereign capability, and human consciousness.";

  const longBio =
    "Shubham Kasar is the founder of Codagram and author of 'Shunya'. Beginning as a young self-taught technologist in Pune, Shubham stepped away from traditional educational paths after witnessing the widespread failure of degrees to prepare engineers for real work. He established Codagram as a capability-first technical ecosystem connecting learning directly to production architectures and career independence. In parallel, his philosophical work 'Shunya' explores radical self-inquiry, detachment from societal conditioning, and freedom beyond borrowed identities.";

  const speakingTopics = [
    'Rethinking Higher Technical Education for the Age of AI',
    'Consciousness & Ambition: Building Without Psychological Dependence',
    'The Death of the Resume: Engineering Capability as Sovereign Currency',
    'Shunya: What Remains When There Is Nothing Left to Prove?',
    'Building Production Engineering Instincts from Scratch',
  ];

  const handleCopyBio = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBio(type);
    setTimeout(() => setCopiedBio(null), 2500);
  };

  return (
    <section id="media" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
            <Camera className="w-3.5 h-3.5" />
            <span>MEDIA, PRESS & SPEAKING</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
            Press Kit & Institutional Assets.
          </h2>
          <p className="text-base text-neutral-300 font-light leading-relaxed">
            Verified biographies, brand materials, speaking topics, and official high-resolution assets for journalists, conference curators, and media publications.
          </p>
        </div>

        {/* Fact Matrix & Biography Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Official Bios */}
          <div className="lg:col-span-7 space-y-6">
            {/* Short Bio */}
            <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code uppercase tracking-wider text-[#d4af37]">
                  Official Bio (Concise / Program Notes)
                </span>
                <button
                  onClick={() => handleCopyBio(shortBio, 'short')}
                  className="flex items-center gap-1.5 text-xs font-mono-code text-neutral-400 hover:text-white transition-colors"
                >
                  {copiedBio === 'short' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                {shortBio}
              </p>
            </div>

            {/* Long Bio */}
            <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code uppercase tracking-wider text-[#d4af37]">
                  Extended Bio (Keynotes & Features)
                </span>
                <button
                  onClick={() => handleCopyBio(longBio, 'long')}
                  className="flex items-center gap-1.5 text-xs font-mono-code text-neutral-400 hover:text-white transition-colors"
                >
                  {copiedBio === 'long' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                {longBio}
              </p>
            </div>

            {/* Speaking Keynotes */}
            <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#d4af37]">
                <Mic className="w-4 h-4" />
                <span>Selected Speaking & Keynote Topics</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
                {speakingTopics.map((top, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                    <span>{top}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Verified Quick Facts & Contact */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.08] space-y-5">
              <span className="text-xs font-mono-code uppercase tracking-widest text-neutral-400">
                Verified Facts
              </span>
              <div className="space-y-3.5">
                {FOUNDER_FACTS.map((fact, idx) => (
                  <div key={idx} className="pb-3 border-b border-white/[0.06] last:border-b-0 last:pb-0">
                    <div className="text-[10px] font-mono-code uppercase text-[#d4af37]">
                      {fact.label}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-white mt-0.5">
                      {fact.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Press Contact Card */}
            <div className="p-6 rounded-2xl glass-panel-subtle border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-neutral-400">
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span>Media & Speaking Inquiries</span>
              </div>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                For podcast invitations, conference panels, or editorial features:
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] font-mono-code text-xs text-white">
                shubhamkasarsrk@gmail.com
              </div>
              <div className="text-[10px] font-mono-code text-neutral-500">
                Response typically within 48 hours for media requests.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
