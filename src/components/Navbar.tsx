import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ArrowRight, BookOpen, Terminal, Users, ShieldCheck } from 'lucide-react';
import { GoogleTranslateToggle, GoogleTranslateBanner } from './GoogleTranslateToggle';

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
          ? 'bg-[#080B10]/95 backdrop-blur-md border-b border-[#1E293B] py-2 sm:py-3 shadow-lg'
          : 'bg-[#080B10]/80 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none py-3 sm:py-5'
      }`}
    >
      {/* Top Banner when translation is active */}
      <GoogleTranslateBanner />

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

        {/* Action CTAs: Google Translate Toggle in middle between name on top and admin button */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Dedicated Google Translate Toggle Button */}
          <GoogleTranslateToggle showQuickPills={true} />

          {/* Admin Desk Button */}
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

        {/* Mobile Actions: Google Translate Toggle in middle between Name and Admin */}
        <div className="flex sm:hidden items-center gap-1.5">
          <GoogleTranslateToggle showQuickPills={false} />
          
          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-[#1E293B] text-slate-300 flex items-center justify-center"
            title="Founder Admin Desk"
          >
            <ShieldCheck className="w-4 h-4 text-[#34A853]" />
          </button>

          <button
            onClick={() => onOpenAiSuite('terminal')}
            className="p-1.5 rounded-lg bg-[#0F1523] border border-[#4285F4]/40 text-[#4285F4]"
            title="AI Terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/[0.04] text-slate-300"
            title="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#1E293B] bg-[#080B10] px-5 py-6 space-y-4 animate-in slide-in-from-top">
          {/* Mobile Language Selector Box */}
          <div className="p-3.5 rounded-2xl bg-[#0F1523] border border-[#1E293B] space-y-2.5 notranslate">
            <div className="text-[11px] font-mono-code text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                <span>Google Translate</span>
              </span>
              <span className="text-[#34A853]">मराठी • हिंदी</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono-code">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.cookie = 'googtrans=/en/en; path=/;';
                  document.cookie = `googtrans=/en/en; path=/; domain=${window.location.hostname};`;
                  localStorage.setItem('codagram_language', 'en');
                  const s = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
                  if (s) { s.value = 'en'; s.dispatchEvent(new Event('change', { bubbles: true })); }
                  else { window.location.reload(); }
                }}
                className="py-2 px-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-center text-white border border-white/[0.08]"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.cookie = 'googtrans=/en/mr; path=/;';
                  document.cookie = `googtrans=/en/mr; path=/; domain=${window.location.hostname};`;
                  localStorage.setItem('codagram_language', 'mr');
                  const s = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
                  if (s) { s.value = 'mr'; s.dispatchEvent(new Event('change', { bubbles: true })); }
                  else { window.location.reload(); }
                }}
                className="py-2 px-1 rounded-xl bg-[#34A853]/15 border border-[#34A853]/40 text-[#34A853] text-center font-bold"
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.cookie = 'googtrans=/en/hi; path=/;';
                  document.cookie = `googtrans=/en/hi; path=/; domain=${window.location.hostname};`;
                  localStorage.setItem('codagram_language', 'hi');
                  const s = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
                  if (s) { s.value = 'hi'; s.dispatchEvent(new Event('change', { bubbles: true })); }
                  else { window.location.reload(); }
                }}
                className="py-2 px-1 rounded-xl bg-[#FBBC05]/15 border border-[#FBBC05]/40 text-[#FBBC05] text-center font-bold"
              >
                हिंदी
              </button>
            </div>
          </div>

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
