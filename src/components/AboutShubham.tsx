import React, { useState, useRef } from 'react';
import { Compass, Sparkles, Terminal, BookOpen, Layers, Target, ShieldCheck, ExternalLink, Award, Code2, Camera, Upload, Check, RefreshCw } from 'lucide-react';
import { ASSETS } from '../assets/branding';
import { useLiveAssets } from '../utils/customAssets';

export const AboutShubham: React.FC = () => {
  const { founderPhoto, hasCustomFounder, saveFounderPhoto, resetFounderPhoto } = useLiveAssets();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        saveFounderPhoto(dataUrl);
        setUploadNotice(`Updated founder photo to "${file.name}"!`);
        setTimeout(() => setUploadNotice(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };
  const narrativePillars = [
    {
      year: 'THE GENESIS',
      title: 'Building From Zero',
      desc: 'Starting young with limited resources in Pune. Facing the gap between textbook curriculum and real-world software engineering, the conviction emerged that education must be forged around actual capability, not passive rote memorization.',
      accent: 'border-[#4285F4]',
      dot: 'bg-[#4285F4]',
    },
    {
      year: 'THE EXECUTION',
      title: 'Founding Codagram',
      desc: 'Creating an alternative technical environment where students don\'t merely sit through lectures—they write production code, deploy real architectures, and develop the instincts required by high-calibre tech teams.',
      accent: 'border-[#34A853]',
      dot: 'bg-[#34A853]',
    },
    {
      year: 'THE INNER SHIFT',
      title: 'Discovering Shunya: Sat Chit Anand',
      desc: 'Experiencing that external success, praise, or struggle do not define human contentment. Stepping into radical self-inquiry: What remains when you remove borrowed identities, societal applause, and existential fear?',
      accent: 'border-[#FBBC05]',
      dot: 'bg-[#FBBC05]',
    },
    {
      year: 'THE CONVERGENCE',
      title: 'Technology & Consciousness',
      desc: 'Refusing to separate outer craftsmanship from inner stillness. Working with relentless shiddat and samarpan—building systems of lasting impact while remaining detached from psychological craving.',
      accent: 'border-[#EA4335]',
      dot: 'bg-[#EA4335]',
    },
  ];

  return (
    <section id="story" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-[#1E293B] relative">
      {/* Google Ambient Multi-Color Radial Backdrops */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[300px] bg-[#4285F4]/[0.035] blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[300px] bg-[#34A853]/[0.03] blur-[130px] pointer-events-none rounded-full" />

      <div className="space-y-16 relative z-10">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#4285F4]">
            <Compass className="w-3.5 h-3.5" />
            <span>FOUNDER STORY & WORLDVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
            I Didn't Have Everything.
            <br />
            <span className="text-google-gradient font-light">I Decided To Build Anyway.</span>
          </h2>
          <p className="text-base text-slate-300 font-light leading-relaxed">
            I don’t come with a fabricated corporate heritage or an inherited throne.
            I started with curiosity, an insistence on truth, and a refusal to waste years on systems that pretend to educate while leaving minds unprepared for life.
          </p>
        </div>

        {/* Founder Portrait & Long-form Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Story Narrative */}
          <div className="lg:col-span-7 space-y-6 text-slate-300 font-light leading-relaxed text-sm sm:text-base">
            <p>
              When I stepped away from the conventional educational treadmill in Pune, many questioned the sanity of building from zero. But staying inside a machine that charges thousands of hours of youth in exchange for paper degrees that teach no real craft felt far riskier.
            </p>
            <p>
              I saw thousands of engineering peers graduating with certificates in hand, unable to build a basic production application, terrified of interviews, and disconnected from genuine problem-solving. That anger did not turn into cynicism; it turned into <strong className="text-white font-medium">Codagram</strong>.
            </p>
            <p>
              At the same time, life forced a deeper confrontation. Ambition alone is hollow if you are perpetually chasing tomorrow to fix an emptiness you feel today. Writing <strong className="text-white font-serif-title font-normal">Shunya: Sat Chit Anand</strong> was not an academic exercise—it was the recording of my own unraveling. It was seeing that true freedom does not begin when you finally become somebody; freedom begins when you realize you never needed to become anyone to exist.
            </p>

            {/* Pull Quote with Google Colors */}
            <div className="my-8 p-6 sm:p-8 rounded-2xl bg-[#0F1523] border-l-4 border-l-[#4285F4] border-t border-r border-b border-[#1E293B] space-y-2 glow-google-blue">
              <blockquote className="text-lg sm:text-xl font-heading font-medium text-white italic">
                “The greatest achievement is not what I have built. It is knowing myself.”
              </blockquote>
              <div className="flex items-center justify-between text-xs font-mono-code pt-1">
                <span className="text-[#FBBC05] uppercase tracking-wider">— Shubham Kasar</span>
                <span className="text-slate-400">Founder, Codagram • Author, Shunya</span>
              </div>
            </div>

            <p>
              Today, I run Codagram with the same devotion. We don’t sell illusions or guarantee shortcuts. We teach people to build, to think, and to stand on their own feet.
            </p>

            {/* Verified Google Search & LinkedIn Proof Badge */}
            <div className="p-4 rounded-xl bg-[#0F1523] border border-[#1E293B] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#4285F4]/10 border border-[#4285F4]/30 flex items-center justify-center text-[#4285F4]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono-code text-white font-bold flex items-center gap-2">
                    <span>Rank #1 on Google for Shubham Kasar Codagram</span>
                    <span className="w-2 h-2 rounded-full bg-[#34A853]" />
                  </div>
                  <div className="text-[11px] font-mono-code text-slate-400">
                    Verified LinkedIn Profile • Knowledge Graph Connected
                  </div>
                </div>
              </div>

              <a
                href="https://www.linkedin.com/in/shubhamkasar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077B5]/15 hover:bg-[#0077B5]/25 border border-[#0077B5]/40 text-[#0077B5] text-xs font-mono-code font-semibold transition-colors"
              >
                <span>View LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Founder Portrait & Worldview Matrix */}
          <div className="lg:col-span-5 space-y-6">
            {/* Hidden file input for founder photo upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            {/* Founder Portrait Card with Google Neon Accents */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1523] border border-[#1E293B] space-y-4 shadow-xl glow-google-multi">
              {uploadNotice && (
                <div className="p-2.5 rounded-xl bg-[#080B10] border border-[#34A853]/50 text-[#34A853] text-xs font-mono-code flex items-center justify-between animate-in fade-in">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    {uploadNotice}
                  </span>
                  {hasCustomFounder && (
                    <button
                      onClick={resetFounderPhoto}
                      className="text-[10px] text-slate-400 hover:text-white underline ml-2"
                    >
                      Reset Default
                    </button>
                  )}
                </div>
              )}

              <div className="relative rounded-xl overflow-hidden aspect-square border border-white/[0.08] group bg-black">
                <img
                  src={founderPhoto}
                  alt="Shubham Kasar — Founder of Codagram and Author of Shunya"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B10] via-transparent to-transparent opacity-85" />
                
                {/* Upload or Swap Photo Action Button */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl bg-[#080B10]/80 hover:bg-[#080B10] border border-white/20 hover:border-[#4285F4] text-white text-xs font-mono-code backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg group-hover:border-[#4285F4]"
                    title="Upload your photo (e.g. download.jpeg)"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#4285F4]" />
                    <span className="hidden sm:inline text-[11px]">Upload Photo</span>
                  </button>

                  {hasCustomFounder && (
                    <button
                      onClick={resetFounderPhoto}
                      className="p-2 rounded-xl bg-[#080B10]/80 hover:bg-[#080B10] border border-white/20 hover:border-[#EA4335] text-slate-300 hover:text-[#EA4335] text-xs font-mono-code backdrop-blur-md transition-all shadow-lg"
                      title="Reset to default portrait"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Overlay Founder Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#080B10]/85 backdrop-blur-md border border-white/[0.1] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                      SHUBHAM KASAR
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                      <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
                      <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
                      <span className="w-2 h-2 rounded-full bg-[#34A853]" />
                    </div>
                  </div>
                  <p className="text-[11px] font-mono-code text-slate-300 flex items-center justify-between">
                    <span>Founder, Codagram • Author, Shunya</span>
                    {hasCustomFounder && (
                      <span className="text-[#34A853] text-[10px]">Active Custom Photo</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Photo prompt hint for user */}
              <div className="pt-1 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                <span className="flex items-center gap-1 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34A853]" />
                  Verified Identity
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#4285F4] hover:underline"
                >
                  Swap Photo (download.jpeg)
                </button>
              </div>
            </div>

            {/* Timeline Matrix */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0F1523] border border-[#1E293B] space-y-6">
              <h3 className="text-sm font-mono-code uppercase tracking-widest text-slate-400 flex items-center justify-between">
                <span>The Sovereign Arc</span>
                <span className="text-[#34A853] text-xs font-semibold">Verified Trajectory</span>
              </h3>

              <div className="space-y-6">
                {narrativePillars.map((pillar, idx) => (
                  <div key={idx} className={`relative pl-6 border-l ${pillar.accent} space-y-1`}>
                    <span className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${pillar.dot}`} />
                    <span className="text-[10px] font-mono-code text-slate-400 tracking-wider uppercase">
                      {pillar.year}
                    </span>
                    <h4 className="text-base font-heading font-bold text-white">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono-code text-slate-400">
                <span>Base Location:</span>
                <span className="text-white">Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
