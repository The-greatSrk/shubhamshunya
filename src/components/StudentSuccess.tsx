import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Terminal, 
  ArrowRight, 
  ShieldCheck, 
  Briefcase,
  Layers,
  ExternalLink
} from 'lucide-react';
import { getTestimonials, FirestoreTestimonial } from '../lib/firebase';

interface StudentSuccessProps {
  onOpenApply: () => void;
  onRequestTalent: () => void;
}

export const StudentSuccess: React.FC<StudentSuccessProps> = ({ onOpenApply, onRequestTalent }) => {
  const [testimonials, setTestimonials] = useState<FirestoreTestimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let mounted = true;
    getTestimonials()
      .then((items) => {
        if (mounted && items.length > 0) {
          setTestimonials(items);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [testimonials.length]);

  // Subtle auto-advance (8s interval, pauses on hover)
  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section id="success" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      <div className="space-y-16">
        {/* Section Header with Carousel Navigation Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#34A853]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>STUDENT TRANSFORMATION & CAPABILITY PROOF</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
              Real Proof Of Work.
              <br />
              <span className="text-[#4285F4] font-light">Real Independence.</span>
            </h2>
            <p className="text-base text-slate-300 font-light leading-relaxed">
              We don't showcase fake ratings or purchased awards. Every Codagram fellow graduates with verifiable, production-grade architectures that prove their engineering capability to the world.
            </p>
          </div>

          {/* Slider Prev / Next Controls */}
          {testimonials.length > 0 && (
            <div className="flex items-center gap-3 self-start lg:self-end">
              <span className="text-xs font-mono-code text-slate-500 mr-2">
                0{currentIndex + 1} / 0{testimonials.length}
              </span>
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full bg-[#0F1523] hover:bg-[#141C2E] border border-[#1E293B] hover:border-[#4285F4] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full bg-[#0F1523] hover:bg-[#141C2E] border border-[#1E293B] hover:border-[#4285F4] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Slide Card Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative"
        >
          {loading ? (
            <div className="p-12 rounded-2xl bg-[#0F1523] border border-[#1E293B] text-center text-xs font-mono-code text-slate-400 space-y-3">
              <div className="w-6 h-6 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin mx-auto" />
              <span>Querying verified student records from Cloud Firestore...</span>
            </div>
          ) : current ? (
            <div className="p-8 sm:p-12 rounded-2xl bg-[#0F1523] border border-[#1E293B] relative overflow-hidden transition-all duration-500 space-y-8 glow-google-green">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#34A853]/[0.04] blur-[100px] pointer-events-none rounded-full" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4285F4]/[0.03] blur-[100px] pointer-events-none rounded-full" />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                {/* Left 7 Columns: Story Quote and Author Information */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Pull Quote */}
                  <div className="space-y-4">
                    <span className="text-4xl sm:text-5xl font-serif text-[#4285F4]/30 leading-none select-none block">
                      “
                    </span>
                    <blockquote className="text-lg sm:text-2xl font-heading font-light text-white leading-relaxed -mt-6">
                      {current.quote}
                    </blockquote>
                  </div>

                  {/* Student Details */}
                  <div className="pt-4 border-t border-[#1E293B] flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-heading font-bold text-white">
                          {current.studentName}
                        </h3>
                        <span className="text-[10px] font-mono-code text-slate-500">
                          {current.id}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#34A853]">
                        {current.currentRole}
                      </p>
                      <p className="text-xs font-mono-code text-slate-400">
                        Cohort: {current.cohortTrack}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-[10px] font-mono-code text-[#34A853] bg-[#34A853]/10 px-2.5 py-1 rounded-full border border-[#34A853]/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Capstone Deployed</span>
                    </div>
                  </div>

                  {/* Skills unboxed text strip with typographic separators */}
                  <div className="pt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono-code text-slate-400">
                    <span className="text-slate-500 uppercase text-[10px] mr-1">Skills:</span>
                    {current.skills.map((skill, idx) => (
                      <React.Fragment key={skill}>
                        <span className="text-slate-200">{skill}</span>
                        {idx < current.skills.length - 1 && (
                          <span className="text-slate-600 select-none">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Right 5 Columns: Verified Capstone Project Inset Card */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-6 rounded-xl bg-[#080B10] border border-[#1E293B] space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
                      <span className="text-[#4285F4] uppercase tracking-wider font-semibold">
                        Capstone Evidence
                      </span>
                      <span>Production Grade</span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-base font-heading font-semibold text-white">
                        {current.projectTitle}
                      </h4>
                      <p className="text-xs text-slate-300 font-light leading-relaxed">
                        {current.projectMetrics}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1E293B] text-[11px] font-mono-code text-slate-400 flex items-center justify-between">
                      <span>Evaluated on System Design & Concurrency</span>
                      <span className="text-[#34A853] font-semibold">100% Passed</span>
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={onOpenApply}
                      className="flex-1 py-3 px-4 rounded-full text-xs font-mono-code uppercase tracking-wider font-bold text-slate-950 bg-white hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Join This Cohort</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={onRequestTalent}
                      className="py-3 px-4 rounded-full text-xs font-mono-code uppercase tracking-wider text-slate-300 hover:text-white bg-[#0F1523] hover:bg-[#141C2E] border border-[#1E293B] transition-colors"
                    >
                      <span>Hire Fellows</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Slide Indicator Bar with Google Brand Colors */}
              <div className="flex items-center justify-center gap-2 pt-4">
                {testimonials.map((_, idx) => {
                  const dotColors = ['bg-[#4285F4]', 'bg-[#EA4335]', 'bg-[#FBBC05]', 'bg-[#34A853]'];
                  const currentColor = dotColors[idx % 4];
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 transition-all rounded-full ${
                        currentIndex === idx
                          ? `w-8 ${currentColor}`
                          : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
