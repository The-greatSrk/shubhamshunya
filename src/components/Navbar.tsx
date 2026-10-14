import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ArrowRight, BookOpen, Terminal, Users, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenAiSuite: (initialTab?: 'terminal' | 'chat' | 'think' | 'search' | 'maps' | 'image') => void;
  onOpenApply: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAiSuite, 
  onOpenApply, 
  onOpenAdmin,
  activeSection 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Codagram', href: '#codagram' },
    { name: 'Stories', href: '#success' },
    { name: 'Shunya', href: '#shunya' },
    { name: 'Talent', href: '#talent' },
    { name: 'Science Lab', href: '#science' },
    { name: 'Philosophy', href: '#philosophy' },
    { name: 'Story', href: '#story' },
    { name: 'Vision', href: '#vision' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080B10]/95 backdrop-blur-md border-b border-[#1E293B] py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand mark with Google Color Cluster */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="flex items-center gap-1 p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] group-hover:border-[#4285F4]/40 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
            <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
            <span className="w-2 h-2 rounded-full bg-[#34A853]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-[#4285F4] transition-colors">
              SHUBHAM KASAR
            </span>
            <span className="text-[10px] tracking-widest uppercase text-slate-400 font-mono-code flex items-center gap-1.5">
              <span>CODAGRAM</span>
              <span className="text-[#34A853]">•</span>
              <span>SHUNYA</span>
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-widest font-mono-code">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.name}
                href={link.href}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onOpenAdmin}
            className="px-3 py-1.5 rounded-full text-xs font-mono-code text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-[#1E293B] transition-colors flex items-center gap-1.5"
            title="Founder Admin & UPI Management"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#34A853]" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => onOpenAiSuite('terminal')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono-code text-white bg-[#0F1523] hover:bg-[#141C2E] border border-[#4285F4]/40 hover:border-[#4285F4] transition-all glow-google-blue"
            title="Launch Founder AI Terminal CLI"
          >
            <Terminal className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>AI Terminal</span>
          </button>

          <button
            onClick={onOpenApply}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono-code uppercase tracking-wider font-semibold text-slate-950 bg-white hover:bg-slate-200 transition-transform active:scale-95 shadow-md"
          >
            <span>Apply</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => onOpenAiSuite('terminal')}
            className="p-2 rounded-lg bg-[#0F1523] border border-[#4285F4]/40 text-[#4285F4]"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/[0.04] text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#1E293B] bg-[#080B10] px-5 py-6 space-y-4 animate-in slide-in-from-top">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono-code uppercase tracking-wider">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#0F1523] text-slate-300 hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiSuite('terminal');
              }}
              className="w-full py-2.5 rounded-xl bg-[#4285F4] text-white text-xs font-mono-code font-bold flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch AI Terminal</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-xl bg-[#0F1523] border border-[#1E293B] text-slate-300 text-xs font-mono-code flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#34A853]" />
              <span>Admin Desk & UPI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
