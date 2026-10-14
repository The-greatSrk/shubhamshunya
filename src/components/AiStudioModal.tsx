import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Search, 
  MapPin, 
  Image as ImageIcon, 
  BrainCircuit, 
  Terminal, 
  RefreshCw, 
  Check, 
  Copy, 
  ExternalLink,
  Sliders,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AiStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'chat' | 'think' | 'search' | 'maps' | 'image';
}

export const AiStudioModal: React.FC<AiStudioModalProps> = ({ isOpen, onClose, initialTab = 'chat' }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'think' | 'search' | 'maps' | 'image'>(initialTab);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // 1. Chat State
  const [chatRole, setChatRole] = useState<'codagram_advisor' | 'shunya_philosopher' | 'general_assistant'>('codagram_advisor');
  const [modelPreference, setModelPreference] = useState<'fast' | 'general' | 'complex'>('general');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to the Digital Headquarters AI. I am tuned to Shubham Kasar\'s ecosystem—connecting Codagram\'s capability-first education with Shunya\'s inquiry into consciousness. How can I assist your exploration today?',
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput.trim(),
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
      } else if (data.error) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Notice: ${data.error}`,
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
          content: 'Unable to reach the Gemini API endpoint. Please check your network connection.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // 2. High Thinking State (gemini-4-argon, thinkingLevel HIGH)
  const [thinkQuery, setThinkQuery] = useState('');
  const [thinkResult, setThinkResult] = useState<string | null>(null);
  const [thinkLoading, setThinkLoading] = useState(false);

  const handleRunThinking = async (queryText?: string) => {
    const q = queryText || thinkQuery;
    if (!q.trim() || thinkLoading) return;
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
      } else if (data.error) {
        setThinkResult(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setThinkResult(`Request failed: ${err.message}`);
    } finally {
      setThinkLoading(false);
    }
  };

  // 3. Search Grounding State (gemini-3.8-flash + googleSearch)
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

  // 4. Maps Grounding State (gemini-3.8-flash + googleMaps)
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

  // 5. Image Generation State (gemini-3-pro-image-preview with 1K, 2K, 4K affordance)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0c0c10] border border-white/[0.1] rounded-2xl flex flex-col overflow-hidden shadow-2xl text-neutral-200">
        {/* Modal Header & Navigation */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between flex-wrap gap-3 bg-[#08080a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-heading font-bold text-white flex items-center gap-2">
                <span>DIGITAL INTELLIGENCE TERMINAL</span>
                <span className="text-[10px] font-mono-code text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded">
                  Gemini SDK Suite
                </span>
              </h3>
              <p className="text-[11px] font-mono-code text-neutral-400">
                Grounding • High Thinking • Multimodal Intelligence
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors ${
                activeTab === 'chat'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Multi-Turn Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('think')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors ${
                activeTab === 'think'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>High Thinking (Argon)</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors ${
                activeTab === 'search'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Grounding</span>
            </button>

            <button
              onClick={() => setActiveTab('maps')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors ${
                activeTab === 'maps'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Maps Grounding</span>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors ${
                activeTab === 'image'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image Studio (Pro)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab 1: Multi-Turn Chatbot */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#09090c]">
            {/* Role & Model Controls */}
            <div className="px-5 py-3 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-code uppercase text-neutral-500">
                  Role:
                </span>
                <select
                  value={chatRole}
                  onChange={(e) => setChatRole(e.target.value as any)}
                  className="px-2.5 py-1 text-xs font-mono-code bg-black border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="codagram_advisor">Codagram Education Advisor</option>
                  <option value="shunya_philosopher">Shunya Philosophical Companion</option>
                  <option value="general_assistant">General Digital HQ Assistant</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-code uppercase text-neutral-500">
                  Model Profile:
                </span>
                <button
                  type="button"
                  onClick={() => setModelPreference('fast')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code ${
                    modelPreference === 'fast'
                      ? 'bg-neutral-200 text-black font-semibold'
                      : 'text-neutral-400 bg-white/[0.04]'
                  }`}
                >
                  Fast (3.1-lite)
                </button>
                <button
                  type="button"
                  onClick={() => setModelPreference('general')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code ${
                    modelPreference === 'general'
                      ? 'bg-neutral-200 text-black font-semibold'
                      : 'text-neutral-400 bg-white/[0.04]'
                  }`}
                >
                  General (3.8-flash)
                </button>
                <button
                  type="button"
                  onClick={() => setModelPreference('complex')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code ${
                    modelPreference === 'complex'
                      ? 'bg-[#d4af37] text-black font-semibold'
                      : 'text-neutral-400 bg-white/[0.04]'
                  }`}
                >
                  Complex (4-argon)
                </button>
              </div>
            </div>

            {/* Scrollable Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#d4af37] text-black font-medium'
                        : 'bg-white/[0.05] border border-white/[0.07] text-neutral-200'
                    }`}
                  >
                    <div className="text-[10px] font-mono-code uppercase opacity-60 mb-1">
                      {msg.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-xs font-mono-code text-neutral-400 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
                    <span>Gemini is generating response...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChat} className="p-4 border-t border-white/[0.08] bg-[#0c0c10] flex gap-2">
              <input
                type="text"
                placeholder="Ask about Codagram tracks, hiring students, Shunya philosophy, or Shubham's vision..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-white text-xs font-mono-code focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono-code hover:bg-neutral-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: High Thinking Mode (gemini-4-argon) */}
        {activeTab === 'think' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#09090c]">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#d4af37] uppercase">
                <BrainCircuit className="w-4 h-4" />
                <span>ThinkingLevel.HIGH • Gemini-4-Argon</span>
              </div>
              <h4 className="text-xl font-heading font-bold text-white">
                Deep First-Principles Reasoning Engine
              </h4>
              <p className="text-xs text-neutral-400 font-light max-w-2xl">
                Configured with <code className="text-white font-mono-code">ThinkingLevel.HIGH</code> without artificial token constraints. For deep dialectic analysis of educational models, consciousness, and complex software systems.
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 text-xs font-mono-code">
              <button
                onClick={() => {
                  setThinkQuery('Analyze the fundamental psychological paradox: "Build everything. Depend on nothing." How can extreme technological ambition coexist with complete inner detachment?');
                  handleRunThinking('Analyze the fundamental psychological paradox: "Build everything. Depend on nothing." How can extreme technological ambition coexist with complete inner detachment?');
                }}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300"
              >
                Paradox of Ambition & Detachment →
              </button>
              <button
                onClick={() => {
                  setThinkQuery('How can an outcome-oriented technical curriculum replace degree credentialism in India over the next 10 years?');
                  handleRunThinking('How can an outcome-oriented technical curriculum replace degree credentialism in India over the next 10 years?');
                }}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300"
              >
                10-Year Capability Curriculum Architecture →
              </button>
            </div>

            <div className="space-y-3">
              <textarea
                rows={3}
                value={thinkQuery}
                onChange={(e) => setThinkQuery(e.target.value)}
                placeholder="Enter complex philosophical, educational, or architectural query for deep thinking..."
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/[0.08] text-white text-xs font-mono-code focus:outline-none focus:border-[#d4af37] resize-none"
              />
              <button
                onClick={() => handleRunThinking()}
                disabled={thinkLoading || !thinkQuery.trim()}
                className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs font-mono-code hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {thinkLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
                <span>Execute Deep Reasoning (gemini-4-argon)</span>
              </button>
            </div>

            {/* Thinking Results Display */}
            {thinkResult && (
              <div className="p-6 rounded-2xl bg-black/70 border border-[#d4af37]/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-mono-code text-[#d4af37]">
                  <span>Reasoning Synthesis Output</span>
                  <span className="text-neutral-500">model: gemini-4-argon</span>
                </div>
                <div className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light whitespace-pre-wrap">
                  {thinkResult}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Search Grounding (gemini-3.8-flash + googleSearch) */}
        {activeTab === 'search' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#09090c]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#d4af37] uppercase">
                <Search className="w-4 h-4" />
                <span>Google Search Grounding • Gemini-3.8-Flash</span>
              </div>
              <h4 className="text-xl font-heading font-bold text-white">
                Live Web Grounding
              </h4>
              <p className="text-xs text-neutral-400 font-light">
                Fetches real-time search data with source links and verified citations.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                placeholder="Query real-time industry data..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-white text-xs font-mono-code focus:outline-none focus:border-[#d4af37]"
              />
              <button
                onClick={handleRunSearch}
                disabled={searchLoading}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono-code hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {searchLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Search</span>
              </button>
            </div>

            {searchResult && (
              <div className="p-6 rounded-2xl bg-black/60 border border-white/[0.08] space-y-4 animate-in fade-in">
                <div className="text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                  {searchResult.text}
                </div>

                {/* Grounding metadata / citations */}
                {searchResult.groundingMetadata?.groundingChunks && (
                  <div className="pt-4 border-t border-white/[0.08] space-y-2">
                    <span className="text-[11px] font-mono-code text-[#d4af37] uppercase tracking-wider">
                      Grounding Citations & Sources:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.groundingMetadata.groundingChunks.map((chunk: any, i: number) => (
                        <a
                          key={i}
                          href={chunk.web?.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono-code text-neutral-300 bg-white/[0.05] hover:bg-white/[0.1] px-2.5 py-1 rounded flex items-center gap-1.5 border border-white/[0.05]"
                        >
                          <span>{chunk.web?.title || 'Source'}</span>
                          <ExternalLink className="w-3 h-3 text-[#d4af37]" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Maps Grounding (gemini-3.8-flash + googleMaps) */}
        {activeTab === 'maps' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#09090c]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#d4af37] uppercase">
                <MapPin className="w-4 h-4" />
                <span>Google Maps Grounding • Gemini-3.8-Flash</span>
              </div>
              <h4 className="text-xl font-heading font-bold text-white">
                Geographic & Ecosystem Intelligence
              </h4>
              <p className="text-xs text-neutral-400 font-light">
                Grounds queries in real-world location context: Pune tech corridors, IT parks, engineering campuses.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={mapsPrompt}
                onChange={(e) => setMapsPrompt(e.target.value)}
                placeholder="Ask about tech parks, Pune hubs, campus locations..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-white text-xs font-mono-code focus:outline-none focus:border-[#d4af37]"
              />
              <button
                onClick={handleRunMaps}
                disabled={mapsLoading}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono-code hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {mapsLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                <span>Locate</span>
              </button>
            </div>

            {mapsResult && (
              <div className="p-6 rounded-2xl bg-black/60 border border-white/[0.08] space-y-4 animate-in fade-in">
                <div className="text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                  {mapsResult.text}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Image Studio (gemini-3-pro-image-preview with 1K, 2K, 4K affordance) */}
        {activeTab === 'image' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#09090c]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#d4af37] uppercase">
                <ImageIcon className="w-4 h-4" />
                <span>Model: Gemini-3-Pro-Image-Preview</span>
              </div>
              <h4 className="text-xl font-heading font-bold text-white">
                High-Resolution Asset Studio
              </h4>
              <p className="text-xs text-neutral-400 font-light">
                Generate editorial imagery with explicit user affordance for size (1K, 2K, 4K) and aspect ratio.
              </p>
            </div>

            {/* Controls Bar for Resolution & Ratio */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono-code uppercase text-neutral-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Image Size:</span>
                </span>
                {(['1K', '2K', '4K'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setImageSize(sz)}
                    className={`px-3 py-1 rounded text-xs font-mono-code transition-colors ${
                      imageSize === sz
                        ? 'bg-[#d4af37] text-black font-bold'
                        : 'bg-white/[0.04] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono-code uppercase text-neutral-400">
                  Aspect Ratio:
                </span>
                {(['1:1', '16:9', '4:3'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`px-3 py-1 rounded text-xs font-mono-code transition-colors ${
                      aspectRatio === r
                        ? 'bg-white text-black font-semibold'
                        : 'bg-white/[0.04] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt input */}
            <div className="space-y-3">
              <textarea
                rows={2}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe image to generate..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-white text-xs font-mono-code focus:outline-none focus:border-[#d4af37] resize-none"
              />
              <button
                onClick={handleGenerateImage}
                disabled={imgLoading}
                className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs font-mono-code hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {imgLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate High-Quality Image ({imageSize})</span>
              </button>
            </div>

            {/* Generated Image Canvas */}
            {generatedImg && (
              <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-mono-code text-neutral-400">
                  <span>Resolution: {imageSize} • Aspect: {aspectRatio}</span>
                  <a
                    href={generatedImg}
                    download="shubham_kasar_artwork.png"
                    className="text-[#d4af37] hover:underline"
                  >
                    Download Full Resolution
                  </a>
                </div>
                <div className="max-h-[380px] overflow-hidden rounded-xl border border-white/[0.06] flex items-center justify-center bg-black">
                  <img
                    src={generatedImg}
                    alt="Generated concept visual"
                    className="max-h-[380px] w-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
