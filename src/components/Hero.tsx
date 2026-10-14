import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Terminal, Sparkles, Compass } from 'lucide-react';
import { ASSETS } from '../assets/branding';
import { useLiveAssets } from '../utils/customAssets';

interface HeroProps {
  onOpenApply: () => void;
  onExploreShunya: () => void;
  onOpenAi: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenApply, onExploreShunya, onOpenAi }) => {
  const { founderPhoto } = useLiveAssets();
  const dynamicStatements = [
    'Building what education could become.',
    'Technology outside. Consciousness within.',
    'Build everything. Depend on nothing.',
    'Capability over certificates. Always.',
  ];

  const rotatingRoles = [
    { title: 'Founder of Codagram', color: 'text-[#4285F4]', dot: 'bg-[#4285F4]' },
    { title: 'Author of Shunya: Sat Chit Anand', color: 'text-[#FBBC05]', dot: 'bg-[#FBBC05]' },
    { title: 'Sovereign Systems Architect', color: 'text-[#34A853]', dot: 'bg-[#34A853]' },
    { title: 'Philosophical Thinker', color: 'text-[#EA4335]', dot: 'bg-[#EA4335]' },
    { title: 'Rank #1 Google SEO: Shubham Kasar', color: 'text-[#4285F4]', dot: 'bg-[#4285F4]' },
  ];

  const [statementIndex, setStatementIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const sInterval = setInterval(() => {
      setStatementIndex((prev) => (prev + 1) % dynamicStatements.length);
    }, 4500);

    const rInterval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % rotatingRoles.length);
    }, 3000);

    return () => {
      clearInterval(sInterval);
      clearInterval(rInterval);
    };
  }, []);

  // Subtle interactive constellation canvas with Google brand colored particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FFFFFF'];
    const numPoints = Math.min(Math.floor(width / 30), 48);
    const points: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }> = [];

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.6 + 0.6,
        color: colors[i % colors.length],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connections
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 125) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(66, 133, 244, ${0.07 * (1 - dist / 125)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.35;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const currentRole = rotatingRoles[roleIndex];

  return (
    <section className="relative min-h-[96vh] flex flex-col justify-between pt-32 pb-16 px-5 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-60 z-0"
      />

      {/* Atmospheric Google Neon radial lightings */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[350px] bg-[#4285F4]/[0.05] blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-[#EA4335]/[0.035] blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[300px] bg-[#34A853]/[0.04] blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/3 right-1/3 w-[450px] h-[250px] bg-[#FBBC05]/[0.035] blur-[130px] pointer-events-none rounded-full" />

      {/* Main Hero Header */}
      <div className="relative z-10 max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          {/* Founder Avatar Pill with Google Neon Accent */}
          <a
            href="#story"
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0F1523] border border-[#1E293B] shadow-sm hover:border-[#4285F4] transition-all group"
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20 bg-black">
              <img src={founderPhoto} alt="Shubham Kasar" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-mono-code text-white font-medium">Shubham Kasar</span>
            <div className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            </div>
          </a>

          {/* Editorial Role Tag with Google Colors */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0F1523] border border-[#1E293B] shadow-sm">
            <span className={`w-2 h-2 rounded-full ${currentRole.dot} animate-pulse`} />
            <span className={`text-xs font-mono-code uppercase tracking-wider font-semibold ${currentRole.color}`}>
              {currentRole.title}
            </span>
          </div>
        </div>

        {/* Primary Name with Google Color Glow */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-black tracking-tighter text-white uppercase leading-[0.95]">
            SHUBHAM KASAR
          </h1>
          <div className="h-12 sm:h-14 overflow-hidden">
            <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-light text-slate-300 transition-all duration-500 transform">
              {dynamicStatements[statementIndex]}
            </p>
          </div>
        </div>

        {/* Core Philosophical & Educational Paradox Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0F1523] max-w-3xl border-l-4 border-l-[#4285F4] border-t border-r border-b border-[#1E293B] relative space-y-3 shadow-xl glow-google-blue">
          <p className="text-sm sm:text-base font-light text-slate-300 leading-relaxed">
            <span className="text-white font-medium">Education</span> teaches people how to become someone.
            <br />
            <span className="text-[#FBBC05] font-serif-title font-normal">Shunya: Sat Chit Anand</span> asks what remains when you stop becoming.
            <br />
            <span className="text-[#34A853] font-medium">Codagram</span> asks what education could become when learning, capability and opportunity finally meet.
          </p>
          <div className="flex items-center justify-between text-xs font-mono-code pt-1">
            <span className="text-slate-400 uppercase tracking-widest">
              Build everything. Depend on nothing.
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href="#codagram"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-mono-code uppercase tracking-wider font-bold text-slate-950 bg-white hover:bg-slate-200 transition-transform active:scale-95 shadow-lg shadow-white/10"
          >
            <span>Explore Codagram</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#shunya"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-mono-code uppercase tracking-wider text-slate-200 bg-[#0F1523] hover:bg-[#141C2E] border border-[#FBBC05]/40 hover:border-[#FBBC05] transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#FBBC05]" />
            <span>Read Shunya Book</span>
          </a>

          <button
            onClick={onOpenAi}
            className="flex items-center gap-2 px-4 py-3.5 rounded-full text-xs font-mono-code text-white bg-[#0F1523] hover:bg-[#141C2E] border border-[#4285F4]/40 hover:border-[#4285F4] transition-colors glow-google-blue"
          >
            <Terminal className="w-4 h-4 text-[#4285F4]" />
            <span>Launch AI Terminal</span>
          </button>
        </div>
      </div>

      {/* Hero Footnote / Scroll invitation */}
      <div className="relative z-10 pt-16 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono-code text-slate-400 border-t border-[#1E293B] mt-12 gap-4">
        <div className="flex items-center gap-6">
          <span className="text-[#34A853] font-semibold">PUNE, MAHARASHTRA</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-[#4285F4]">DISTRIBUTED SYSTEMS & CONSCIOUSNESS</span>
        </div>

        <a
          href="#story"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <span>The Founder Story</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform text-[#FBBC05]" />
        </a>
      </div>
    </section>
  );
};
