import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Terminal, Sparkles, Compass } from 'lucide-react';

interface HeroProps {
  onOpenApply: () => void;
  onExploreShunya: () => void;
  onOpenAi: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenApply, onExploreShunya, onOpenAi }) => {
  const dynamicStatements = [
    'Building what education could become.',
    'Technology outside. Consciousness within.',
    'Build everything. Depend on nothing.',
    'Capability over certificates. Always.',
  ];

  const rotatingRoles = [
    'Founder of Codagram',
    'Author of Shunya',
    'Technology Builder',
    'Philosophical Thinker',
    'Student of Consciousness',
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

  // Subtle interactive constellation canvas
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

    const numPoints = Math.min(Math.floor(width / 32), 45);
    const points: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
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
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.08 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-[96vh] flex flex-col justify-between pt-32 pb-16 px-5 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-60 z-0"
      />

      {/* Subtle atmospheric radial lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#d4af37]/[0.035] blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-white/[0.02] blur-[120px] pointer-events-none rounded-full" />

      {/* Main Hero Header */}
      <div className="relative z-10 max-w-5xl space-y-8">
        {/* Editorial Role Tag */}
        <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-300">
            {rotatingRoles[roleIndex]}
          </span>
        </div>

        {/* Primary Name */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-black tracking-tighter text-white uppercase leading-[0.95]">
            SHUBHAM KASAR
          </h1>
          <div className="h-12 sm:h-14 overflow-hidden">
            <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-light text-neutral-300 transition-all duration-500 transform">
              {dynamicStatements[statementIndex]}
            </p>
          </div>
        </div>

        {/* Core Philosophical & Educational Paradox */}
        <div className="p-6 sm:p-8 rounded-2xl glass-panel max-w-3xl border-l-2 border-l-[#d4af37] relative space-y-3">
          <p className="text-sm sm:text-base font-light text-neutral-300 leading-relaxed">
            <span className="text-white font-medium">Education</span> teaches people how to become someone.
            <br />
            <span className="text-[#d4af37] font-serif-title font-normal">Shunya</span> asks what remains when you stop becoming.
            <br />
            <span className="text-white font-medium">Codagram</span> asks what education could become when learning, capability and opportunity finally meet.
          </p>
          <p className="text-xs font-mono-code text-neutral-500 uppercase tracking-widest pt-1">
            Build everything. Depend on nothing.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href="#codagram"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-mono-code uppercase tracking-wider font-semibold text-black bg-white hover:bg-neutral-200 transition-transform active:scale-95 shadow-lg shadow-white/5"
          >
            <span>Explore Codagram</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#shunya"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-mono-code uppercase tracking-wider text-neutral-200 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.12] transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span>Read Shunya</span>
          </a>

          <button
            onClick={onOpenAi}
            className="flex items-center gap-2 px-4 py-3.5 rounded-full text-xs font-mono-code text-neutral-400 hover:text-white transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Digital Assistant</span>
          </button>
        </div>
      </div>

      {/* Hero Footnote / Scroll invitation */}
      <div className="relative z-10 pt-16 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono-code text-neutral-500 border-t border-white/[0.06] mt-12 gap-4">
        <div className="flex items-center gap-6">
          <span>PUNE, MAHARASHTRA</span>
          <span className="hidden sm:inline text-neutral-700">•</span>
          <span>SYSTEMS & PHILOSOPHY</span>
        </div>

        <a
          href="#story"
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
        >
          <span>The Founder Story</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
};
