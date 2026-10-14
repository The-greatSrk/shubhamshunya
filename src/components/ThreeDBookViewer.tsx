import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Upload, 
  RefreshCw, 
  Check, 
  ExternalLink, 
  Eye, 
  Layers, 
  Maximize2, 
  Compass, 
  BookOpen,
  Info
} from 'lucide-react';
import { useLiveAssets } from '../utils/customAssets';
import { ASSETS } from '../assets/branding';

interface ThreeDBookViewerProps {
  onBuyBook: (item: { title: string; amount: number; description: string }) => void;
  onOpenExcerpt: () => void;
}

export const ThreeDBookViewer: React.FC<ThreeDBookViewerProps> = ({ onBuyBook, onOpenExcerpt }) => {
  const { 
    bookCover, 
    hasCustomBook, 
    saveBookCover, 
    resetBookCover, 
    default3dBook, 
    default2dCover 
  } = useLiveAssets();

  // Mode: 'studio3d' (photorealistic 3D render) or 'interactive3d' (CSS 3D dimensional mesh)
  const [viewMode, setViewMode] = useState<'studio3d' | 'interactive3d'>('studio3d');
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Mouse tilt angles for Studio 3D view
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  
  // Interactive 3D book rotation angles
  const [rotY, setRotY] = useState(-25);
  const [rotX, setRotX] = useState(10);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialRotY: -25, initialRotX: 10 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle auto-rotate animation for interactive 3D model
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotY((prev) => (prev + 0.8) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Handle mouse move for interactive perspective tilt on Studio 3D mockup
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Normalize between -1 and 1
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    // Tilt limits
    setTilt({
      x: -normY * 12,
      y: normX * 16,
      glareX: ((x / rect.width) * 100),
      glareY: ((y / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  // Drag controls for Interactive 3D
  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== 'interactive3d') return;
    setIsDragging(true);
    setAutoRotate(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialRotY: rotY,
      initialRotX: rotX,
    };
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setRotY(dragStartRef.current.initialRotY + deltaX * 0.5);
    setRotX(Math.max(-45, Math.min(45, dragStartRef.current.initialRotX - deltaY * 0.5)));
  };

  const handleGlobalMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  // Handle uploading 2D Photo / PDF
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus(`Converting ${file.name} to 3D...`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        saveBookCover(dataUrl);
        setUploadStatus(`Successfully converted "${file.name}" to 3D!`);
        setTimeout(() => setUploadStatus(null), 4000);
      }
    };
    reader.onerror = () => {
      setUploadStatus('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative group max-w-md w-full mx-auto select-none">
      {/* Hidden file input for uploading 2D cover / PDF */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Atmospheric Google Neon Halo glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#4285F4]/20 via-[#FBBC05]/20 to-[#34A853]/20 blur-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none rounded-3xl" />

      {/* Main 3D Stage Card */}
      <div className="relative rounded-2xl bg-[#080B10] border border-[#1E293B] shadow-2xl p-5 space-y-4">
        {/* Top Control Bar with 3D Mode Badges */}
        <div className="flex items-center justify-between gap-2 border-b border-[#1E293B] pb-3 text-xs font-mono-code">
          <div className="flex items-center gap-1.5 bg-[#0F1523] p-1 rounded-lg border border-[#1E293B]">
            <button
              onClick={() => setViewMode('studio3d')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                viewMode === 'studio3d'
                  ? 'bg-[#4285F4] text-white font-bold shadow-md shadow-[#4285F4]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Studio Hardcover
            </button>
            <button
              onClick={() => setViewMode('interactive3d')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                viewMode === 'interactive3d'
                  ? 'bg-[#FBBC05] text-slate-950 font-bold shadow-md shadow-[#FBBC05]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Spin & Rotate
            </button>
          </div>

          <div className="flex items-center gap-1">
            {viewMode === 'interactive3d' && (
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-1.5 rounded-lg border text-[11px] transition-colors ${
                  autoRotate 
                    ? 'border-[#34A853] text-[#34A853] bg-[#34A853]/10' 
                    : 'border-[#1E293B] text-slate-400 hover:text-white'
                }`}
                title="Toggle continuous 3D rotation"
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg border border-[#1E293B] hover:border-[#4285F4] text-slate-300 hover:text-white bg-[#0F1523] transition-colors flex items-center gap-1"
              title="Upload your 2D photo or PDF to convert into 3D"
            >
              <Upload className="w-3.5 h-3.5 text-[#4285F4]" />
              <span className="hidden sm:inline text-[10px]">Upload 2D</span>
            </button>
          </div>
        </div>

        {/* Upload feedback banner */}
        {uploadStatus && (
          <div className="p-2 rounded-lg bg-[#0F1523] border border-[#34A853]/40 text-[#34A853] text-xs font-mono-code flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              {uploadStatus}
            </span>
            {hasCustomBook && (
              <button
                onClick={resetBookCover}
                className="text-[10px] text-slate-400 hover:text-white underline ml-2"
              >
                Reset Default
              </button>
            )}
          </div>
        )}

        {/* 3D VIEWPORT CONTAINER */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          className={`relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-b from-[#0F1523] to-[#05070A] border border-white/[0.08] flex items-center justify-center p-6 cursor-${
            viewMode === 'interactive3d' ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }`}
          style={{ perspective: '1200px' }}
        >
          {/* Subtle Google Neon ambient backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(66,133,244,0.08),transparent_65%)] pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-28 bg-[radial-gradient(ellipse_at_50%_100%,rgba(251,188,5,0.06),transparent_70%)] pointer-events-none" />

          {/* MODE 1: STUDIO PHOTOREALISTIC 3D HARDCOVER WITH DYNAMIC TILT */}
          {viewMode === 'studio3d' && (
            <div
              className="relative w-full h-full flex items-center justify-center transition-transform duration-150 ease-out"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Studio 3D Book Mockup Image */}
              <div className="relative max-h-full max-w-[85%] rounded-lg shadow-2xl drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] overflow-hidden">
                <img
                  src={bookCover}
                  alt="Shunya: Sat Chit Anand 3D Hardcover by Shubham Kasar"
                  className="w-full h-full object-contain filter contrast-105"
                />

                {/* Moving Specular Glare across cover */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 35%, transparent 60%)`,
                    mixBlendMode: 'overlay',
                  }}
                />
              </div>

              {/* 3D Dimensional Badge */}
              <div 
                className="absolute bottom-2 left-3 right-3 py-1.5 px-3 rounded-lg bg-[#080B10]/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-[10px] font-mono-code text-slate-300"
                style={{ transform: 'translateZ(30px)' }}
              >
                <span className="flex items-center gap-1.5 text-[#FBBC05]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05] animate-ping" />
                  3D Hardcover Perspective
                </span>
                <span className="text-slate-400">Hover to tilt</span>
              </div>
            </div>
          )}

          {/* MODE 2: INTERACTIVE CSS 3D BOOK WITH REAL 3D ROTATION */}
          {viewMode === 'interactive3d' && (
            <div
              className="relative flex items-center justify-center transition-transform duration-75 select-none"
              style={{
                transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                transformStyle: 'preserve-3d',
                width: '180px',
                height: '270px',
              }}
            >
              {/* FRONT COVER */}
              <div
                className="absolute inset-0 rounded-r-md border border-white/20 shadow-2xl overflow-hidden bg-[#0A0D15] flex flex-col justify-between p-4"
                style={{
                  transform: 'translateZ(18px)',
                  transformStyle: 'preserve-3d',
                  backgroundImage: `url(${hasCustomBook ? bookCover : default3dBook})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Fallback styling if background image is loading or custom */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] pointer-events-none" />
                <div className="relative z-10 space-y-1">
                  <div className="w-8 h-8 rounded-full border border-[#FBBC05]/60 flex items-center justify-center mx-auto text-[#FBBC05] text-xs font-serif-title shadow-sm">
                    0
                  </div>
                  <div className="text-center">
                    <div className="text-[13px] font-serif-title font-bold text-white tracking-widest uppercase">
                      SHUNYA
                    </div>
                    <div className="text-[9px] font-mono-code text-[#FBBC05] tracking-wider uppercase">
                      SAT CHIT ANAND
                    </div>
                  </div>
                </div>

                <div className="relative z-10 text-center border-t border-white/20 pt-1">
                  <span className="text-[9px] font-mono-code text-slate-300 tracking-wider">
                    SHUBHAM KASAR
                  </span>
                </div>
              </div>

              {/* BOOK SPINE (Left Side) */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-[#07090E] border border-white/20 flex items-center justify-center text-center px-1 shadow-md"
                style={{
                  width: '36px',
                  transform: 'rotateY(-90deg) translateZ(18px)',
                  transformOrigin: 'left center',
                }}
              >
                <span className="text-[9px] font-mono-code text-[#FBBC05] tracking-widest whitespace-nowrap -rotate-90 font-semibold uppercase">
                  SHUNYA : SAT CHIT ANAND
                </span>
              </div>

              {/* BOOK PAGES BLOCK (Right Edge) */}
              <div
                className="absolute top-0 bottom-0 right-0 border-r border-[#1E293B] shadow-inner"
                style={{
                  width: '36px',
                  transform: 'rotateY(90deg) translateZ(162px)',
                  transformOrigin: 'right center',
                  background: 'repeating-linear-gradient(90deg, #F3F1E7 0px, #E5E1D3 1px, #FFFDF8 2px, #ECE7D8 3px)',
                }}
              />

              {/* TOP PAGE EDGES */}
              <div
                className="absolute top-0 left-0 right-0 border-t border-b border-[#1E293B]"
                style={{
                  height: '36px',
                  transform: 'rotateX(90deg) translateZ(18px)',
                  transformOrigin: 'top center',
                  background: 'repeating-linear-gradient(0deg, #F3F1E7 0px, #E5E1D3 1px, #FFFDF8 2px, #ECE7D8 3px)',
                }}
              />

              {/* BOTTOM PAGE EDGES */}
              <div
                className="absolute bottom-0 left-0 right-0 border-t border-b border-[#1E293B]"
                style={{
                  height: '36px',
                  transform: 'rotateX(-90deg) translateZ(252px)',
                  transformOrigin: 'bottom center',
                  background: 'repeating-linear-gradient(0deg, #F3F1E7 0px, #E5E1D3 1px, #FFFDF8 2px, #ECE7D8 3px)',
                }}
              />

              {/* BACK COVER */}
              <div
                className="absolute inset-0 rounded-l-md border border-white/10 shadow-2xl bg-[#090C14] p-4 flex flex-col justify-between text-left text-slate-300"
                style={{
                  transform: 'translateZ(-18px) rotateY(180deg)',
                }}
              >
                <div className="space-y-1">
                  <span className="text-[8px] font-mono-code text-[#4285F4] uppercase">
                    Non-Dual Inquiry
                  </span>
                  <p className="text-[9px] font-serif-title italic line-clamp-5 text-slate-300 leading-tight">
                    "When you stop needing to become anyone, what remains is the silent consciousness of Sat Chit Anand."
                  </p>
                </div>
                <div className="border-t border-white/10 pt-1 flex items-center justify-between text-[8px] font-mono-code text-slate-400">
                  <span>Pune, India</span>
                  <span className="text-[#34A853]">Codagram Press</span>
                </div>
              </div>
            </div>
          )}

          {/* Drag instruction overlay for Interactive 3D */}
          {viewMode === 'interactive3d' && (
            <div className="absolute bottom-2 inset-x-3 py-1.5 px-3 rounded-lg bg-[#080B10]/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-[10px] font-mono-code text-slate-300 pointer-events-none">
              <span className="text-[#FBBC05] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Click & Drag to Rotate in 3D
              </span>
              <span className="text-slate-400">Y: {Math.round(rotY)}°</span>
            </div>
          )}
        </div>

        {/* 3D Metadata & Quick Purchase Actions */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono-code">
            <span className="text-[#FBBC05] font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Shunya: Sat Chit Anand
            </span>
            <span className="text-slate-400">By Shubham Kasar</span>
          </div>

          {/* Quick Buttons under 3D Viewer */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
            <button
              onClick={() => onBuyBook({
                title: 'Shunya: Hardcover Collector Edition',
                amount: 799,
                description: 'Gold-foil embossed 3D hardcover edition of Shunya: Sat Chit Anand with signed inscription by Shubham Kasar.',
              })}
              className="py-2.5 px-3 rounded-xl bg-[#FBBC05] hover:bg-[#F9AB00] text-slate-950 font-bold transition-all shadow-md shadow-[#FBBC05]/20 flex items-center justify-center gap-1.5"
            >
              <span>Order 3D Hardcover</span>
              <span className="text-[11px] opacity-80">(₹799)</span>
            </button>

            <a
              href="https://www.amazon.com/s?k=shunya+sat+chit+anand+shubham+kasar"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#0F1523] hover:bg-[#141C2E] border border-[#FF9900]/50 hover:border-[#FF9900] text-[#FF9900] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Amazon Kindle</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 pt-1">
            <button
              onClick={onOpenExcerpt}
              className="hover:text-white underline text-left"
            >
              Read Free Chapter Excerpt →
            </button>
            <span className="text-[#34A853]">Instant UPI • Fast Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
