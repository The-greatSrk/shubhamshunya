import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Check, Languages, Sparkles, X, RotateCcw } from 'lucide-react';
import { 
  LANGUAGES, 
  SupportedLanguage, 
  applyLanguage, 
  getStoredLanguage 
} from '../utils/translator';

interface GoogleTranslateToggleProps {
  className?: string;
  showQuickPills?: boolean;
}

export const GoogleTranslateToggle: React.FC<GoogleTranslateToggleProps> = ({
  className = '',
  showQuickPills = true,
}) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(getStoredLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize and synchronize translation engine on mount
  useEffect(() => {
    const initial = getStoredLanguage();
    if (initial !== 'en') {
      applyLanguage(initial);
      setShowNotification(true);
    }

    const checkInterval = setInterval(() => {
      const stored = getStoredLanguage();
      if (stored !== currentLang) {
        setCurrentLang(stored);
      }
    }, 1200);

    return () => clearInterval(checkInterval);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (targetLang: SupportedLanguage) => {
    if (targetLang === currentLang && !isOpen) return;

    setIsTranslating(true);
    setCurrentLang(targetLang);
    setIsOpen(false);

    // Apply neural DOM translator + Google Translate cookies & events
    applyLanguage(targetLang);

    if (targetLang !== 'en') {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }

    setTimeout(() => {
      setIsTranslating(false);
    }, 400);
  };

  const activeOption = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div ref={dropdownRef} className={`relative inline-flex items-center notranslate ${className}`}>
      {/* Google Translate Main Capsule */}
      <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-full bg-[#0B101B]/95 border border-[#1E293B] hover:border-[#4285F4]/70 transition-all shadow-md group">
        
        {/* Toggle Button labeled "Google Translate" */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono-code text-white hover:bg-white/[0.06] transition-colors"
          title="Google Translate — Translate complete website to Marathi (मराठी) or Hindi (हिंदी)"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {/* Google 4-Color Cluster */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
          </div>

          <div className="flex items-center gap-1 font-semibold text-slate-100">
            <Languages className="w-3.5 h-3.5 text-[#4285F4]" />
            <span className="hidden xs:inline">Google Translate</span>
            <span className="xs:hidden">Translate</span>
          </div>

          {/* Active Language Badge */}
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
              currentLang === 'mr'
                ? 'bg-[#34A853]/25 text-[#4ade80] border border-[#34A853]/50'
                : currentLang === 'hi'
                ? 'bg-[#FBBC05]/25 text-[#fde047] border border-[#FBBC05]/50'
                : 'bg-white/[0.08] text-slate-300 border border-white/[0.12]'
            }`}
          >
            {activeOption.badge}
          </span>

          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-white' : 'group-hover:text-white'
            }`}
          />
        </button>

        {/* Quick One-Click Switch Pills: EN | मराठी | हिंदी */}
        {showQuickPills && (
          <div className="hidden sm:flex items-center gap-1 pl-1 pr-1 border-l border-white/[0.1]">
            {LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectLanguage(lang.code);
                  }}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#4285F4] to-[#2563EB] text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                  title={`Translate website to ${lang.name} (${lang.nativeName})`}
                >
                  {lang.badge}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Language Selector Dropdown Modal */}
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 top-full mt-2 w-72 sm:w-84 rounded-2xl bg-[#090D16] border border-[#1E293B] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-2 border-b border-white/[0.08] mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
                <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
                <span className="w-2 h-2 rounded-full bg-[#34A853]" />
              </div>
              <div>
                <div className="text-xs font-mono-code font-bold text-white flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-[#4285F4]" />
                  <span>Google Translate</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono-code">
                  भाषा निवडा • अपनी भाषा चुनें
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-1.5">
            {LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#141C2E] border border-[#4285F4]/70 text-white shadow-md'
                      : 'hover:bg-white/[0.04] text-slate-300 hover:text-white border border-transparent'
                  }`}
                >
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-mono-code font-bold shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#4285F4] text-white shadow-sm'
                        : 'bg-white/[0.06] text-slate-400'
                    }`}
                  >
                    {lang.badge}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {lang.nativeName}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] text-[#34A853] font-mono-code font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>सक्रिय / Active</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug mt-0.5">
                      {lang.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-2.5 pt-2 border-t border-white/[0.08] px-2 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
            <span>अचूक भाषांतर (Meaning Preserved)</span>
            <span className="text-[#4285F4] font-semibold">मराठी • हिंदी • EN</span>
          </div>
        </div>
      )}

      {/* Translating indicator toast */}
      {isTranslating && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-xl bg-[#0F1523] border border-[#4285F4] text-white text-xs font-mono-code flex items-center gap-2 shadow-2xl animate-pulse notranslate">
          <Sparkles className="w-4 h-4 text-[#4285F4] animate-spin" />
          <span>भाषांतर लागू होत आहे (Applying {activeOption.name} translation)...</span>
        </div>
      )}
    </div>
  );
};

// Top Floating Banner that appears when Marathi or Hindi is active
export const GoogleTranslateBanner: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(getStoredLanguage);

  useEffect(() => {
    const handleCheck = () => {
      setCurrentLang(getStoredLanguage());
    };
    handleCheck();
    const interval = setInterval(handleCheck, 1200);
    return () => clearInterval(interval);
  }, []);

  if (currentLang === 'en') return null;

  const handleResetToEnglish = () => {
    applyLanguage('en');
    setCurrentLang('en');
  };

  return (
    <div className="bg-gradient-to-r from-[#0F1523] via-[#141C2E] to-[#0F1523] border-b border-[#4285F4]/30 px-4 py-1.5 text-xs font-mono-code text-white notranslate relative z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-slate-200">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
            <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
            <span className="w-2 h-2 rounded-full bg-[#34A853]" />
          </div>
          <span className="font-semibold text-white">Google Translate:</span>
          {currentLang === 'mr' ? (
            <span>
              संपूर्ण वेबसाइट आता <strong className="text-[#34A853]">मराठी</strong> भाषेत उपलब्ध आहे (मराठी वाचकांसाठी सुलभ).
            </span>
          ) : (
            <span>
              पूरी वेबसाइट अब <strong className="text-[#FBBC05]">हिंदी</strong> भाषा में अनुवादित है (हिंदी पाठकों के लिए सुलभ)।
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleResetToEnglish}
          className="px-2.5 py-0.5 rounded-full bg-white/[0.1] hover:bg-white/[0.2] border border-white/20 text-white text-[11px] transition-colors flex items-center gap-1 font-mono-code"
          title="Switch back to original English"
        >
          <RotateCcw className="w-3 h-3" />
          <span>मूळ इंग्रजीमध्ये पहा (View in Original English)</span>
        </button>
      </div>
    </div>
  );
};
