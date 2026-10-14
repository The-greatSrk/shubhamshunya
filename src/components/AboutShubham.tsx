import React from 'react';
import { Compass, Sparkles, Terminal, BookOpen, Layers, Target, ShieldCheck } from 'lucide-react';

export const AboutShubham: React.FC = () => {
  const narrativePillars = [
    {
      year: 'THE GENESIS',
      title: 'Building From Zero',
      desc: 'Starting young with limited resources in Pune. Facing the gap between textbook curriculum and real-world software engineering, the conviction emerged that education must be forged around actual capability, not passive rote memorization.',
    },
    {
      year: 'THE EXECUTION',
      title: 'Founding Codagram',
      desc: 'Creating an alternative technical environment where students don\'t merely sit through lectures—they write production code, deploy real architectures, and develop the instincts required by high-calibre tech teams.',
    },
    {
      year: 'THE INNER SHIFT',
      title: 'Discovering Shunya',
      desc: 'Experiencing that external success, praise, or struggle do not define human contentment. Stepping into radical self-inquiry: What remains when you remove borrowed identities, societal applause, and existential fear?',
    },
    {
      year: 'THE CONVERGENCE',
      title: 'Technology & Consciousness',
      desc: 'Refusing to separate outer craftsmanship from inner stillness. Working with relentless shiddat and samarpan—building systems of lasting impact while remaining detached from psychological craving.',
    },
  ];

  return (
    <section id="story" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
            <Compass className="w-3.5 h-3.5" />
            <span>FOUNDER STORY & WORLDVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
            I Didn't Have Everything.
            <br />
            <span className="text-neutral-400 font-light">I Decided To Build Anyway.</span>
          </h2>
          <p className="text-base text-neutral-300 font-light leading-relaxed">
            I don’t come with a fabricated corporate heritage or an inherited throne.
            I started with curiosity, an insistence on truth, and a refusal to waste years on systems that pretend to educate while leaving minds unprepared for life.
          </p>
        </div>

        {/* Long-form editorial story split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Story Narrative */}
          <div className="lg:col-span-7 space-y-6 text-neutral-300 font-light leading-relaxed text-sm sm:text-base">
            <p>
              When I stepped away from the conventional educational treadmill, many questioned the sanity of building from zero. But staying inside a machine that charges thousands of hours of youth in exchange for paper degrees that teach no real craft felt far riskier.
            </p>
            <p>
              I saw thousands of engineering peers graduating with certificates in hand, unable to build a basic production application, terrified of interviews, and disconnected from genuine problem-solving. That anger did not turn into cynicism; it turned into <strong className="text-white font-medium">Codagram</strong>.
            </p>
            <p>
              At the same time, life forced a deeper confrontation. Ambition alone is hollow if you are perpetually chasing tomorrow to fix an emptiness you feel today. Writing <strong className="text-white font-serif-title font-normal">Shunya</strong> was not an academic exercise—it was the recording of my own unraveling. It was seeing that true freedom does not begin when you finally become somebody; freedom begins when you realize you never needed to become anyone to exist.
            </p>

            {/* Pull Quote */}
            <div className="my-8 p-6 sm:p-8 rounded-2xl glass-panel border-l-2 border-l-[#d4af37] space-y-2">
              <blockquote className="text-lg sm:text-xl font-heading font-medium text-white italic">
                “The greatest achievement is not what I have built. It is knowing myself.”
              </blockquote>
              <p className="text-xs font-mono-code uppercase tracking-wider text-neutral-400">
                — Shubham Kasar
              </p>
            </div>

            <p>
              Today, I run Codagram with the same devotion. We don’t sell illusions or guarantee shortcuts. We teach people to build, to think, and to stand on their own feet.
            </p>
          </div>

          {/* Timeline / Worldview Matrix */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.08] space-y-6">
              <h3 className="text-sm font-mono-code uppercase tracking-widest text-neutral-400 flex items-center justify-between">
                <span>Core Posture</span>
                <span className="text-[#d4af37] text-xs">Authentic Record</span>
              </h3>

              <div className="space-y-6">
                {narrativePillars.map((pillar, idx) => (
                  <div key={idx} className="relative pl-6 border-l border-white/[0.1] space-y-1">
                    <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#d4af37]" />
                    <span className="text-[10px] font-mono-code text-[#d4af37] tracking-wider uppercase">
                      {pillar.year}
                    </span>
                    <h4 className="text-base font-heading font-bold text-white">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono-code text-neutral-400">
                <span>Identity:</span>
                <span className="text-white">Builder • Thinker • Author</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
