import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutShubham } from './components/AboutShubham';
import { CodagramSection } from './components/CodagramSection';
import { StudentJourney } from './components/StudentJourney';
import { StudentSuccess } from './components/StudentSuccess';
import { ShunyaSection } from './components/ShunyaSection';
import { TalentNetwork } from './components/TalentNetwork';
import { ZeroSection } from './components/ZeroSection';
import { ScienceLab } from './components/ScienceLab';
import { PhilosophyEssays } from './components/PhilosophyEssays';
import { TalkToShubham } from './components/TalkToShubham';
import { MediaPress } from './components/MediaPress';
import { PartnerSection } from './components/PartnerSection';
import { VisionSection } from './components/VisionSection';
import { Footer } from './components/Footer';
import { AiStudioModal } from './components/AiStudioModal';
import { ApplicationModal } from './components/ApplicationModal';
import { PaymentModal, PaymentItem } from './components/PaymentModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LearningProgram, TalentCandidate } from './types';
import { Sparkles, CreditCard, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalTab, setAiModalTab] = useState<'terminal' | 'chat' | 'think' | 'search' | 'maps' | 'image'>('terminal');

  // Application & Hiring Modal State
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [appModalType, setAppModalType] = useState<'student' | 'employer' | 'shunya'>('student');
  const [selectedProgram, setSelectedProgram] = useState<LearningProgram | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<TalentCandidate | null>(null);

  // UPI Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentItem, setPaymentItem] = useState<PaymentItem | null>(null);

  // Admin Dashboard State
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Scroll spy to track active section for navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'story', 'codagram', 'success', 'shunya', 'talent', 'science', 'philosophy', 'talk', 'media', 'partner', 'vision'];
      const scrollY = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAiStudio = (tab: 'terminal' | 'chat' | 'think' | 'search' | 'maps' | 'image' = 'terminal') => {
    setAiModalTab(tab);
    setIsAiModalOpen(true);
  };

  const handleOpenStudentApply = (program?: LearningProgram) => {
    setAppModalType('student');
    setSelectedProgram(program || null);
    setSelectedCandidate(null);
    setIsAppModalOpen(true);
  };

  const handleOpenEmployerHire = (candidate?: TalentCandidate) => {
    setAppModalType('employer');
    setSelectedCandidate(candidate || null);
    setSelectedProgram(null);
    setIsAppModalOpen(true);
  };

  const handleOpenShunyaOrder = () => {
    setAppModalType('shunya');
    setSelectedProgram(null);
    setSelectedCandidate(null);
    setIsAppModalOpen(true);
  };

  const handleBuyBookWithUpi = (edition: { title: string; amount: number; description: string }) => {
    setPaymentItem({
      itemType: 'book',
      itemName: edition.title,
      amount: edition.amount,
      description: edition.description,
    });
    setIsPaymentModalOpen(true);
  };

  const handleEnrollWithUpi = (track: { itemName: string; amount: number; description: string }) => {
    setPaymentItem({
      itemType: 'course_registration',
      itemName: track.itemName,
      amount: track.amount,
      description: track.description,
    });
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-[#F1F5F9] selection:bg-[#4285F4]/30 selection:text-white">
      {/* Persistent Navigation with Admin button */}
      <Navbar
        onOpenAiSuite={(tab) => openAiStudio(tab)}
        onOpenApply={() => handleOpenStudentApply()}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        activeSection={activeSection}
      />

      <main>
        {/* 1. Cinematic Hero */}
        <div id="hero">
          <Hero
            onOpenApply={() => handleOpenStudentApply()}
            onExploreShunya={() => {
              const el = document.getElementById('shunya');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenAi={() => openAiStudio('chat')}
          />
        </div>

        {/* 2. Founder Story Narrative */}
        <AboutShubham />

        {/* 3. Pillar One: Codagram (Execution, Capability Pipeline, Curriculum) */}
        <CodagramSection
          onSelectProgram={(prog) => handleOpenStudentApply(prog)}
          onOpenApply={() => handleOpenStudentApply()}
          onEnrollWithUpi={handleEnrollWithUpi}
        />

        {/* 4. Student Journey (Day 1 to Independence) */}
        <StudentJourney onOpenApply={() => handleOpenStudentApply()} />

        {/* 4b. Student Transformation & Capability Proof (Firestore Testimonials Carousel) */}
        <StudentSuccess
          onOpenApply={() => handleOpenStudentApply()}
          onRequestTalent={() => handleOpenEmployerHire()}
        />

        {/* 5. Pillar Two: Shunya (Consciousness, Book, Contemplative Inquiries, Direct Buy Editions) */}
        <ShunyaSection
          onOpenOrderModal={() => handleOpenShunyaOrder()}
          onOpenAiPhilosophy={() => openAiStudio('think')}
          onBuyBook={handleBuyBookWithUpi}
        />

        {/* 6. Talent Network ("Don't Hire a Resume. Hire Capability") */}
        <TalentNetwork
          onRequestCandidate={(candidate) => handleOpenEmployerHire(candidate)}
          onSubmitHiringReq={() => handleOpenEmployerHire()}
        />

        {/* 7. Zero Section (The baseline: 0 and honest telemetry) */}
        <ZeroSection />

        {/* 8. Bioscience Skills: Frontier Bio-Computing Lab */}
        <ScienceLab />

        {/* 9. Philosophy & Essays ("Ideas that refuse to sit quietly") */}
        <PhilosophyEssays />

        {/* 10. Talk To Shubham (Counselling & Perspective) */}
        <TalkToShubham />

        {/* 11. Media, Press Kit & Speaking */}
        <MediaPress />

        {/* 12. Institutional & Campus Partnerships */}
        <PartnerSection />

        {/* 13. Future Vision & Investor Disclosure */}
        <VisionSection />
      </main>

      {/* 14. Cinematic Final Statement Footer with Admin Desk trigger */}
      <Footer
        onOpenApply={() => handleOpenStudentApply()}
        onOpenAi={() => openAiStudio('chat')}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
      />

      {/* Floating Action Buttons for Admin & AI Intelligence Terminal */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
        <button
          onClick={() => setIsAdminDashboardOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#0F1523]/95 hover:bg-[#141C2E] text-slate-400 hover:text-white border border-[#1E293B] shadow-2xl backdrop-blur-md transition-all text-xs font-mono-code"
          title="Admin Desk & UPI Setup"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#34A853]" />
          <span className="hidden md:inline">Admin Desk</span>
        </button>

        <button
          onClick={() => openAiStudio('terminal')}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0F1523]/95 hover:bg-[#141C2E] text-white border border-[#4285F4]/50 shadow-2xl backdrop-blur-md transition-all hover:scale-105 group glow-google-blue"
          title="Open Founder AI Terminal CLI"
        >
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-[#34A853]" />
          </div>
          <Sparkles className="w-4 h-4 text-[#4285F4]" />
          <span className="text-xs font-mono-code font-bold tracking-wider uppercase">
            AI Terminal
          </span>
        </button>
      </div>

      {/* Interactive AI Intelligence Modal (Chat, Thinking, Search, Maps, Image) */}
      <AiStudioModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialTab={aiModalTab}
      />

      {/* Interactive Application / Hiring / Shunya Inquiries Modal */}
      <ApplicationModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        type={appModalType}
        selectedProgram={selectedProgram}
        selectedCandidate={selectedCandidate}
      />

      {/* Dynamic UPI Payment Checkout Modal (GPay, PhonePe, Paytm, QR, UTR Receipt) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPaymentItem(null);
        }}
        item={paymentItem}
      />

      {/* Founder Admin Dashboard (Passcode Protected, Live UPI ID Editing, Order Management) */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
    </div>
  );
}
