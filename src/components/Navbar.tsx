import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ArrowRight, BookOpen, Terminal, Users } from 'lucide-react';

interface NavbarProps {
  onOpenAiSuite: (initialTab?: 'chat' | 'think' | 'search' | 'maps' | 'image') => void;
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
      setScrolled(window.scrollY > 30);
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
          ? 'bg-[#08080a]/90 backdrop-blur-md border-b border-white/[0.07] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand mark */}
        <a href="#" className="flex flex-col group">
          <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-[#d4af37] transition-colors">
            SHUBHAM KASAR
          </span>
          <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-mono-code flex items-center gap-1.5">
            <span>CODAGRAM</span>
            <span className="text-[#d4af37]/60">•</span>
            <span>SHUNYA</span>
          </span>
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-widest font-mono-code">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`transition-colors py-1 relative ${
                activeSection === link.href.slice(1)
                  ? 'text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {link.name}
              {activeSection === link.href.slice(1) && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#d4af37]" />
              )}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onOpenAdmin}
            className="px-3 py-1.5 rounded-full text-xs font-mono-code text-neutral-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] transition-colors"
            title="Founder Admin & UPI Management"
          >
            <span>Admin</span>
          </button>

          <button
            onClick={() => onOpenAiSuite('chat')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono-code text-neutral-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#d4af37]/40 transition-all"
            title="Ask Codagram & Shubham AI Intelligence"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>AI Terminal</span>
          </button>

          <button
            onClick={onOpenApply}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono-code font-medium text-black bg-white hover:bg-[#ededef] transition-transform active:scale-95 shadow-sm"
          >
            <span>Join Codagram</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={() => onOpenAiSuite('chat')}
            className="p-2 text-neutral-300 bg-white/[0.04] border border-white/[0.08] rounded-full"
            aria-label="Open AI Terminal"
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0c10] border-b border-white/[0.08] px-6 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs uppercase font-mono-code tracking-wider">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded text-neutral-300 hover:text-white hover:bg-white/[0.05]"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApply();
              }}
              className="w-full py-2.5 rounded-full text-xs font-mono-code font-semibold text-black bg-white flex items-center justify-center gap-2"
            >
              <span>Apply for Codagram</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiSuite('chat');
              }}
              className="w-full py-2.5 rounded-full text-xs font-mono-code text-neutral-200 bg-white/[0.05] border border-white/[0.1] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Ask Codagram & Shubham AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
