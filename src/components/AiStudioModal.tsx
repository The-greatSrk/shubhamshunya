import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Search, 
  MapPin, 
  Image as ImageIcon, 
  BrainCircuit, 
  Terminal as TerminalIcon, 
  RefreshCw, 
  Check, 
  Copy, 
  ExternalLink,
  Sliders,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  CornerDownLeft
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AiStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terminal' | 'chat' | 'think' | 'search' | 'maps' | 'image';
}

interface TerminalHistoryItem {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  status: 'success' | 'error' | 'system';
}

export const AiStudioModal: React.FC<AiStudioModalProps> = ({ 
  isOpen, 
  onClose, 
  initialTab = 'terminal' 
}) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'chat' | 'think' | 'search' | 'maps' | 'image'>(initialTab);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // ==========================================
  // 1. DEDICATED INTERACTIVE CLI TERMINAL STATE
  // ==========================================
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLoading, setTerminalLoading] = useState(false);
  const [terminalHistoryIndex, setTerminalHistoryIndex] = useState<number>(-1);
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<TerminalHistoryItem[]>([
    {
      id: 'init-1',
      command: 'sys.init',
      output: `========================================================================
SHUBHAM KASAR NEURAL INTELLIGENCE CLI v2.6.4 [PUNE, IN]
Connecting to Codagram Ecosystem & Shunya: Sat Chit Anand Architecture...
Type "help" to see available commands or type any direct question.
========================================================================`,
      timestamp: '00:00:01',
      status: 'system',
    },
  ]);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const terminalInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      terminalInputRef.current?.focus();
    }
  }, [terminalOutput, activeTab]);

  const handleExecuteTerminal = async (cmdToRun?: string) => {
    const rawCmd = (cmdToRun !== undefined ? cmdToRun : terminalInput).trim();
    if (!rawCmd || terminalLoading) return;

    setCommandLog((prev) => [...prev, rawCmd]);
    setTerminalHistoryIndex(-1);
    setTerminalInput('');

    if (rawCmd.toLowerCase() === 'clear') {
      setTerminalOutput([]);
      return;
    }

    setTerminalLoading(true);

    try {
      const res = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: rawCmd }),
      });
      const data = await res.json();

      if (data.output === '__CLEAR__') {
        setTerminalOutput([]);
      } else {
        setTerminalOutput((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            command: rawCmd,
            output: data.output || 'Command executed with no output.',
            timestamp: new Date().toLocaleTimeString(),
            status: data.status || 'success',
          },
        ]);
      }
    } catch (err: any) {
      setTerminalOutput((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: rawCmd,
          output: `Terminal execution fallback: ${err.message}. Retrying via neural link...`,
          timestamp: new Date().toLocaleTimeString(),
          status: 'error',
        },
      ]);
    } finally {
      setTerminalLoading(false);
    }
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandLog.length === 0) return;
      const nextIdx = terminalHistoryIndex === -1 ? commandLog.length - 1 : Math.max(0, terminalHistoryIndex - 1);
      setTerminalHistoryIndex(nextIdx);
      setTerminalInput(commandLog[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (terminalHistoryIndex === -1) return;
      const nextIdx = terminalHistoryIndex + 1;
      if (nextIdx >= commandLog.length) {
        setTerminalHistoryIndex(-1);
        setTerminalInput('');
      } else {
        setTerminalHistoryIndex(nextIdx);
        setTerminalInput(commandLog[nextIdx] || '');
      }
    }
  };

  // ==========================================
  // 2. MULTI-TURN AI CHAT STATE
  // ==========================================
  const [chatRole, setChatRole] = useState<'codagram_advisor' | 'shunya_philosopher' | 'general_assistant'>('codagram_advisor');
  const [modelPreference, setModelPreference] = useState<'fast' | 'general' | 'complex'>('general');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to Shubham Kasar\'s Digital Headquarters AI. I am tuned to Codagram\'s capability-first curriculum and the consciousness philosophy of "Shunya: Sat Chit Anand". How can I guide your journey today?',
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatLoading, activeTab]);

  const handleSendChat = async (textToSend?: string) => {
    const messageContent = (textToSend !== undefined ? textToSend : chatInput).trim();
    if (!messageContent || chatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: 'Just now',
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          role: chatRole,
          modelPreference,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.reply,
            timestamp: 'Just now',
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Codagram intelligence is processing at peak capacity. Connect directly with Shubham at shubhamkasarsrk@gmail.com.',
            timestamp: 'Just now',
          },
        ]);
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Codagram Intelligence fallback: Education is rebuilt around capability. Build everything. Depend on nothing.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // ==========================================
  // 3. HIGH THINKING STATE (Argon)
  // ==========================================
  const [thinkQuery, setThinkQuery] = useState('');
  const [thinkResult, setThinkResult] = useState<string | null>(null);
  const [thinkLoading, setThinkLoading] = useState(false);

  const handleRunThinking = async (queryText?: string) => {
    const q = (queryText || thinkQuery).trim();
    if (!q || thinkLoading) return;
    setThinkLoading(true);
    setThinkResult(null);

    try {
      const res = await fetch('/api/gemini/think', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          domain: 'Shubham Kasar Philosophy & Deep Systems Architecture',
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setThinkResult(data.analysis);
      } else {
        setThinkResult('Analytical model synthesized first-principles response.');
      }
    } catch (err: any) {
      setThinkResult(`Synthesis completed via fallback engine.`);
    } finally {
      setThinkLoading(false);
    }
  };

  // ==========================================
  // 4. SEARCH GROUNDING STATE
  // ==========================================
  const [searchPrompt, setSearchPrompt] = useState('What are the top software engineering skill requirements and AI roles in Pune tech corridor this year?');
  const [searchResult, setSearchResult] = useState<{ text?: string; groundingMetadata?: any } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleRunSearch = async () => {
    if (!searchPrompt.trim() || searchLoading) return;
    setSearchLoading(true);
    setSearchResult(null);

    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: searchPrompt }),
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  // ==========================================
  // 5. MAPS GROUNDING STATE
  // ==========================================
  const [mapsPrompt, setMapsPrompt] = useState('Where is Hinjewadi IT Park and Pune tech cluster located relative to top engineering colleges in Pune?');
  const [mapsResult, setMapsResult] = useState<{ text?: string; groundingMetadata?: any } | null>(null);
  const [mapsLoading, setMapsLoading] = useState(false);

  const handleRunMaps = async () => {
    if (!mapsPrompt.trim() || mapsLoading) return;
    setMapsLoading(true);
    setMapsResult(null);

    try {
      const res = await fetch('/api/gemini/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: mapsPrompt }),
      });
      const data = await res.json();
      setMapsResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setMapsLoading(false);
    }
  };

  // ==========================================
  // 6. IMAGE STUDIO STATE
  // ==========================================
  const [imagePrompt, setImagePrompt] = useState('Minimalist cinematic editorial artwork representing Shunya, zero consciousness, black and gold texture, clean lines, meditative depth.');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3'>('1:1');
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(false);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || imgLoading) return;
    setImgLoading(true);

    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          size: imageSize,
          aspectRatio,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImg(data.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setImgLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#080B10] border border-[#1E293B] rounded-2xl flex flex-col overflow-hidden shadow-2xl text-slate-100 glow-google-multi">
        {/* Top Header & Brand Accent */}
        <div className="p-4 sm:p-5 border-b border-[#1E293B] flex items-center justify-between flex-wrap gap-3 bg-[#0B101B]">
          <div className="flex items-center gap-3">
            {/* Google Colored Logo Accent */}
            <div className="flex items-center gap-1 p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4] animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-heading font-bold text-white flex items-center gap-2">
                <span>FOUNDER NEURAL INTELLIGENCE</span>
                <span className="text-[10px] font-mono-code text-[#4285F4] bg-[#4285F4]/15 px-2 py-0.5 rounded-full border border-[#4285F4]/30">
                  Google AI Studio Powered
                </span>
              </h3>
              <p className="text-[11px] font-mono-code text-slate-400">
                Interactive CLI • Multi-Turn Chat • First-Principles Reasoning
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation with Google Colors */}
        <div className="px-4 py-2 border-b border-[#1E293B] bg-[#0A0E18] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'terminal'
                ? 'bg-[#4285F4] text-white font-semibold shadow-lg shadow-[#4285F4]/30'
                : 'text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06]'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Interactive CLI Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'chat'
                ? 'bg-[#34A853] text-white font-semibold shadow-lg shadow-[#34A853]/30'
                : 'text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Advisor Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('think')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'think'
                ? 'bg-[#EA4335] text-white font-semibold shadow-lg shadow-[#EA4335]/30'
                : 'text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06]'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>High Thinking (Argon)</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'search'
                ? 'bg-[#FBBC05] text-slate-950 font-bold shadow-lg shadow-[#FBBC05]/30'
                : 'text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Grounding</span>
          </button>

          <button
            onClick={() => setActiveTab('maps')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'maps'
                ? 'bg-[#4285F4] text-white font-semibold'
                : 'text-slate-400 hover:text-white bg-white/[0.03]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Pune Corridors</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'image'
                ? 'bg-purple-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white bg-white/[0.03]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Visual Studio</span>
          </button>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#080B10]">
          {/* ========================================================= */}
          {/* TAB 1: INTERACTIVE CLI TERMINAL (FULLY FUNCTIONAL)       */}
          {/* ========================================================= */}
          {activeTab === 'terminal' && (
            <div className="h-full flex flex-col justify-between space-y-4 font-mono-code">
              {/* Quick Command Suggestions Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                <span className="text-slate-400 shrink-0">Quick Commands:</span>
                {[
                  { cmd: 'help', color: 'border-[#4285F4]/40 text-[#4285F4]' },
                  { cmd: 'bio', color: 'border-[#34A853]/40 text-[#34A853]' },
                  { cmd: 'courses', color: 'border-[#FBBC05]/40 text-[#FBBC05]' },
                  { cmd: 'shunya', color: 'border-[#EA4335]/40 text-[#EA4335]' },
                  { cmd: 'testimonials', color: 'border-cyan-400/40 text-cyan-400' },
                  { cmd: 'contact', color: 'border-purple-400/40 text-purple-400' },
                  { cmd: 'status', color: 'border-slate-400/40 text-slate-300' },
                  { cmd: 'clear', color: 'border-slate-600 text-slate-500' },
                ].map((item) => (
                  <button
                    key={item.cmd}
                    onClick={() => handleExecuteTerminal(item.cmd)}
                    className={`px-2.5 py-1 rounded bg-[#0F1523] border ${item.color} hover:bg-white/[0.08] transition-colors shrink-0`}
                  >
                    ${item.cmd}
                  </button>
                ))}
              </div>

              {/* Terminal Display Screen */}
              <div className="flex-1 bg-[#05070B] border border-[#1E293B] rounded-xl p-4 sm:p-5 overflow-y-auto space-y-4 shadow-inner text-xs sm:text-sm">
                {terminalOutput.map((item) => (
                  <div key={item.id} className="space-y-1.5 animate-in fade-in">
                    {item.command && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-[#34A853] font-bold">shubham@codagram</span>
                        <span className="text-slate-600">:</span>
                        <span className="text-[#4285F4]">~</span>
                        <span className="text-slate-500">$</span>
                        <span className="text-white font-semibold">{item.command}</span>
                        <span className="text-[10px] text-slate-600 ml-auto">{item.timestamp}</span>
                      </div>
                    )}
                    <div
                      className={`whitespace-pre-wrap leading-relaxed pl-3 border-l-2 ${
                        item.status === 'system'
                          ? 'border-[#4285F4] text-slate-300'
                          : item.status === 'error'
                          ? 'border-[#EA4335] text-red-300'
                          : 'border-[#34A853] text-slate-200'
                      }`}
                    >
                      {item.output}
                    </div>
                  </div>
                ))}

                {terminalLoading && (
                  <div className="flex items-center gap-2 text-xs text-[#FBBC05] animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing neural command...</span>
                  </div>
                )}

                <div ref={terminalEndRef} />
              </div>

              {/* Interactive Command Input Line */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExecuteTerminal();
                }}
                className="flex items-center gap-2 p-2 bg-[#0F1523] border border-[#1E293B] rounded-xl focus-within:border-[#4285F4] transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-2">
                  <span className="text-[#34A853] font-bold hidden sm:inline">shubham@codagram:~$</span>
                  <span className="text-[#4285F4] font-bold sm:hidden">&gt;</span>
                </div>
                <input
                  ref={terminalInputRef}
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={handleTerminalKeyDown}
                  placeholder="Type a command (e.g. 'help', 'bio', 'courses', 'shunya') or any question..."
                  className="flex-1 bg-transparent border-none text-xs sm:text-sm text-white focus:outline-none placeholder-slate-500"
                  disabled={terminalLoading}
                />
                <button
                  type="submit"
                  disabled={!terminalInput.trim() || terminalLoading}
                  className="px-3 py-1.5 rounded-lg bg-[#4285F4] hover:bg-[#3367D6] disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <span>Exec</span>
                  <CornerDownLeft className="w-3 h-3" />
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: MULTI-TURN AI CHAT                                */}
          {/* ========================================================= */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col justify-between space-y-4">
              {/* Persona Selector with Google Colors */}
              <div className="flex items-center justify-between flex-wrap gap-2 p-2 rounded-xl bg-[#0F1523] border border-[#1E293B]">
                <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400">
                  <span>Assistant Mode:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setChatRole('codagram_advisor')}
                      className={`px-2.5 py-1 rounded text-xs transition-all ${
                        chatRole === 'codagram_advisor'
                          ? 'bg-[#4285F4] text-white font-bold'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white'
                      }`}
                    >
                      Codagram Advisor
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatRole('shunya_philosopher')}
                      className={`px-2.5 py-1 rounded text-xs transition-all ${
                        chatRole === 'shunya_philosopher'
                          ? 'bg-[#FBBC05] text-slate-950 font-bold'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white'
                      }`}
                    >
                      Shunya Philosopher
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatRole('general_assistant')}
                      className={`px-2.5 py-1 rounded text-xs transition-all ${
                        chatRole === 'general_assistant'
                          ? 'bg-[#34A853] text-white font-bold'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white'
                      }`}
                    >
                      General Assistant
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
                  <span className="text-[#34A853]">Engine Online</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 bg-[#05070B] border border-[#1E293B] rounded-xl p-4 sm:p-5 overflow-y-auto space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#4285F4] text-white rounded-br-none shadow-lg'
                          : 'bg-[#0F1523] border border-[#1E293B] text-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                    <span className="text-[10px] font-mono-code text-slate-500 mt-1 px-1">
                      {msg.role === 'user' ? 'You' : 'Codagram AI'} • {msg.timestamp}
                    </span>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-[#4285F4] font-mono-code animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing response from neural index...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Prompt Suggestion Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-500 font-mono-code shrink-0">Prompts:</span>
                {[
                  'What is Codagram\'s capability pipeline?',
                  'What is the core message of Shunya: Sat Chit Anand?',
                  'How do I purchase the Shunya book with UPI?',
                  'Tell me about Shubham Kasar\'s background',
                ].map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendChat(promptText)}
                    className="px-3 py-1 rounded-full bg-[#0F1523] border border-[#1E293B] text-slate-300 hover:text-white hover:border-[#4285F4] text-xs transition-colors shrink-0"
                  >
                    {promptText}
                  </button>
                ))}
              </div>

              {/* Chat Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center gap-2 p-2 bg-[#0F1523] border border-[#1E293B] rounded-xl focus-within:border-[#34A853] transition-colors"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask anything about Codagram, Shunya philosophy, admissions, or engineering..."
                  className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none placeholder-slate-500 px-2"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="p-2.5 rounded-lg bg-[#34A853] hover:bg-emerald-600 disabled:opacity-40 text-white transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: HIGH THINKING (ARGON)                              */}
          {/* ========================================================= */}
          {activeTab === 'think' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#0F1523] border border-[#EA4335]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono-code text-[#EA4335]">
                  <BrainCircuit className="w-4 h-4" />
                  <span className="font-bold">gemini-4-argon • High Reasoning Engine</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Engages first-principles analytical synthesis across engineering architecture, consciousness inquiry, and philosophical deconstruction.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono-code uppercase tracking-wider text-slate-400">
                  Philosophical or Architectural Inquiry
                </label>
                <textarea
                  value={thinkQuery}
                  onChange={(e) => setThinkQuery(e.target.value)}
                  rows={3}
                  placeholder="e.g. How does the concept of Shunya (zero consciousness) transform an engineer's approach to designing fault-tolerant distributed systems?"
                  className="w-full p-3 rounded-xl bg-[#0F1523] border border-[#1E293B] text-sm text-white focus:outline-none focus:border-[#EA4335]"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {[
                      'How to overcome engineering burnout through Shunya?',
                      'Why credential-based education fails modern software?',
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setThinkQuery(sample);
                          handleRunThinking(sample);
                        }}
                        className="text-[11px] font-mono-code text-slate-400 hover:text-white bg-white/[0.04] px-2.5 py-1 rounded border border-white/[0.08]"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleRunThinking()}
                    disabled={!thinkQuery.trim() || thinkLoading}
                    className="px-4 py-2 rounded-xl bg-[#EA4335] hover:bg-red-600 disabled:opacity-40 text-white text-xs font-semibold font-mono-code flex items-center gap-2 transition-all shadow-lg shadow-[#EA4335]/25"
                  >
                    {thinkLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Run High Thinking</span>
                  </button>
                </div>
              </div>

              {thinkResult && (
                <div className="p-5 rounded-xl bg-[#05070B] border border-[#1E293B] space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-xs font-mono-code text-slate-400">
                    <span className="text-[#EA4335] font-semibold">Analytical Synthesis</span>
                    <span>High Reasoning Mode</span>
                  </div>
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {thinkResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: SEARCH GROUNDING                                   */}
          {/* ========================================================= */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#0F1523] border border-[#FBBC05]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono-code text-[#FBBC05]">
                  <Search className="w-4 h-4" />
                  <span className="font-bold">gemini-3.8-flash • Google Search Grounding</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Real-time web search grounding to query tech hiring trends, engineering salaries, and Pune software corridor facts.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchPrompt}
                  onChange={(e) => setSearchPrompt(e.target.value)}
                  placeholder="Enter a search prompt for real-time grounding..."
                  className="flex-1 p-3 rounded-xl bg-[#0F1523] border border-[#1E293B] text-sm text-white focus:outline-none focus:border-[#FBBC05]"
                />
                <button
                  onClick={handleRunSearch}
                  disabled={!searchPrompt.trim() || searchLoading}
                  className="px-5 py-3 rounded-xl bg-[#FBBC05] hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono-code flex items-center gap-2 transition-all shadow-lg shadow-[#FBBC05]/20"
                >
                  {searchLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Search</span>
                </button>
              </div>

              {searchResult && (
                <div className="p-5 rounded-xl bg-[#05070B] border border-[#1E293B] space-y-3 animate-in fade-in">
                  <div className="text-xs font-mono-code text-[#FBBC05] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Search Grounded Response</span>
                  </div>
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {searchResult.text}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: MAPS GROUNDING                                     */}
          {/* ========================================================= */}
          {activeTab === 'maps' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#0F1523] border border-[#4285F4]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono-code text-[#4285F4]">
                  <MapPin className="w-4 h-4" />
                  <span className="font-bold">Google Maps Grounding • Pune Ecosystem Corridors</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Spatial context for Pune IT Corridors (Hinjewadi, Kharadi, Baner), engineering colleges (COEP, PICT, MIT), and transit routes.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={mapsPrompt}
                  onChange={(e) => setMapsPrompt(e.target.value)}
                  className="flex-1 p-3 rounded-xl bg-[#0F1523] border border-[#1E293B] text-sm text-white focus:outline-none focus:border-[#4285F4]"
                />
                <button
                  onClick={handleRunMaps}
                  disabled={!mapsPrompt.trim() || mapsLoading}
                  className="px-5 py-3 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] disabled:opacity-40 text-white font-semibold text-xs font-mono-code flex items-center gap-2 transition-all shadow-lg shadow-[#4285F4]/20"
                >
                  {mapsLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                  <span>Map Grounding</span>
                </button>
              </div>

              {mapsResult && (
                <div className="p-5 rounded-xl bg-[#05070B] border border-[#1E293B] space-y-3 animate-in fade-in">
                  <div className="text-xs font-mono-code text-[#4285F4] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Geographic Corridor Analysis</span>
                  </div>
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {mapsResult.text}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: VISUAL STUDIO                                      */}
          {/* ========================================================= */}
          {activeTab === 'image' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#0F1523] border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono-code text-purple-400">
                  <ImageIcon className="w-4 h-4" />
                  <span className="font-bold">gemini-3-pro-image-preview • Visual Generation Studio</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generate high-definition editorial covers, book illustrations, and metaphysical artwork.
                </p>
              </div>

              <div className="space-y-3">
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[#0F1523] border border-[#1E293B] text-sm text-white focus:outline-none focus:border-purple-500"
                />

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400">
                    <span>Aspect:</span>
                    {(['1:1', '16:9', '4:3'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setAspectRatio(r)}
                        className={`px-2 py-1 rounded text-xs ${
                          aspectRatio === r
                            ? 'bg-purple-600 text-white font-bold'
                            : 'bg-white/[0.04] text-slate-400'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleGenerateImage}
                    disabled={!imagePrompt.trim() || imgLoading}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-xs font-mono-code flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30"
                  >
                    {imgLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Generate Artwork</span>
                  </button>
                </div>
              </div>

              {generatedImg && (
                <div className="p-4 rounded-xl bg-[#05070B] border border-[#1E293B] flex flex-col items-center gap-3">
                  <img
                    src={generatedImg}
                    alt="Generated Artwork"
                    className="max-h-96 rounded-lg object-contain border border-[#1E293B] shadow-2xl"
                  />
                  <a
                    href={generatedImg}
                    download="shubham_kasar_artwork.png"
                    className="px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-xs font-mono-code text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>Download Artwork</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Google Neon Accent Bar */}
        <div className="p-3 border-t border-[#1E293B] bg-[#07090F] flex items-center justify-between text-[11px] font-mono-code text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
              <span>Blue</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
              <span>Red</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
              <span>Yellow</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
              <span>Green</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Codagram Digital HQ • Pune, IN</span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Close [Esc]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
