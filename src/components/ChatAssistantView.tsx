import React from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Trash2, 
  ArrowUpRight, 
  ExternalLink,
  BookOpen,
  Building2,
  Globe,
  Search
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, IndianStandard } from '../types';

interface ChatAssistantViewProps {
  initialPrompt?: string;
  onSelectStandard: (code: string) => void;
}

export const ChatAssistantView: React.FC<ChatAssistantViewProps> = ({
  initialPrompt = '',
  onSelectStandard
}) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `## Welcome to the BIS Standards AI Assistant\n\n` +
        `**Status:** 🟢 Operational & Grounded with Verified BIS Database + Google Search\n\n` +
        `I am your specialized assistant for Indian Standards (IS) codes, technical committees, conformity assessment, and BIS certification schemes.\n\n` +
        `### Powered by Google Search Grounding:\n` +
        `- **Live Gazette Updates:** Real-time Quality Control Orders (QCOs) and ministry notifications.\n` +
        `- **Active Amendments:** Cross-referencing recent reaffirmations and sectional committee revisions.\n` +
        `- **Standard Code Lookup:** *"Tell me about IS 456"* or *"What is IS 800?"*\n` +
        `- **Scope Queries:** *"What is the scope of IS 10262?"*\n` +
        `- **Application Queries:** *"Which IS code is used for reinforced concrete design?"*\n` +
        `- **Cross-Standard Comparisons:** *"Compare IS 456 and IS 800"*\n` +
        `- **Anti-Hallucination Testing:** *"Tell me about IS 999999"*`,
      timestamp: new Date().toISOString(),
      confidence: 'verified',
      isVerified: true
    }
  ]);

  const [input, setInput] = React.useState(initialPrompt);
  const [loading, setLoading] = React.useState(false);
  const [searchGroundingEnabled, setSearchGroundingEnabled] = React.useState(true);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [speakingId, setSpeakingId] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Tell me about IS 456',
    'What are the latest 2024-2026 Quality Control Orders (QCOs)?',
    'What is IS 800?',
    'Recent amendments & revisions to IS 456',
    'Which IS code is used for reinforced concrete design?',
    'What are mandatory BIS rules for solar panels and batteries?',
    'Find standards related to cement',
    'Explain IS 1786 in simple language',
    'Compare IS 456 and IS 800',
    'Tell me about IS 999999'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // If initialPrompt provided on mount or click, auto-send
  React.useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: trimmed,
          enableSearchGrounding: searchGroundingEnabled 
        })
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'No response returned.',
        timestamp: new Date().toISOString(),
        confidence: data.confidence || 'ai_assisted',
        isVerified: Boolean(data.isVerified),
        detectedCode: data.detectedCode,
        retrievedStandards: data.retrievedStandards,
        sourceUrl: data.sourceUrl,
        groundingSources: data.groundingSources,
        webSearchQueries: data.webSearchQueries,
        isGoogleSearchGrounded: data.isGoogleSearchGrounded
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Communication error: Could not reach the assistant service. ${err.message}`,
        timestamp: new Date().toISOString(),
        confidence: 'unverified',
        isVerified: false
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }

      window.speechSynthesis.cancel();
      // Strip markdown symbols for cleaner speech
      const cleanText = text.replace(/[#*`_\[\]]/g, '').substring(0, 500);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClearChat = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'assistant',
        content: 'Conversation history reset. Ask any question regarding Indian Standards.',
        timestamp: new Date().toISOString(),
        confidence: 'verified',
        isVerified: true
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              BIS Intelligent Knowledge Assistant
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Grounded RAG
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Retrieval-Augmented Generation • Strict Anti-Hallucination Protocol
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Google Search Grounding Active Indicator / Toggle */}
          <button
            onClick={() => setSearchGroundingEnabled(!searchGroundingEnabled)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              searchGroundingEnabled 
                ? 'bg-blue-50 border-blue-200 text-blue-800 shadow-2xs hover:bg-blue-100' 
                : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'
            }`}
            title="Google Search Grounding via gemini-3.8-flash for live Gazette QCOs and amendments"
          >
            <Globe className={`w-3.5 h-3.5 ${searchGroundingEnabled ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Google Search Grounding:</span>
            <span className="font-bold">{searchGroundingEnabled ? 'Active' : 'Off'}</span>
          </button>

          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
            title="Clear Conversation"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-4xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
              msg.role === 'user'
                ? 'bg-slate-800 text-white'
                : msg.confidence === 'unverified'
                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                : 'bg-blue-700 text-white'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Card */}
            <div className={`flex flex-col gap-1.5 max-w-2xl sm:max-w-3xl ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}>
              {/* Confidence Badge Header (Assistant only) */}
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 text-xs mb-0.5">
                  {msg.confidence === 'verified' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      🟢 Verified from BIS data
                    </span>
                  )}
                  {msg.confidence === 'ai_assisted' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      🟡 AI explanation based on retrieved BIS information
                    </span>
                  )}
                  {msg.confidence === 'unverified' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      🔴 Not verified in BIS knowledge base
                    </span>
                  )}
                </div>
              )}

              {/* Message Bubble Content */}
              <div className={`p-4 sm:p-5 rounded-2xl shadow-sm text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none prose prose-slate max-w-none'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                ) : (
                  <div className="space-y-3 leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h2: ({ node, ...props }) => (
                          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3 mt-1" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-sm font-bold text-slate-900 mt-3 mb-1" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-2" {...props} />
                        ),
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-3 border border-slate-200 rounded-lg">
                            <table className="min-w-full divide-y divide-slate-200 text-xs" {...props} />
                          </div>
                        ),
                        th: ({ node, ...props }) => (
                          <th className="bg-slate-100 px-3 py-2 text-left font-bold text-slate-700" {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-3 py-2 border-t border-slate-100 text-slate-700" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc pl-5 space-y-1 my-2 text-xs sm:text-sm text-slate-700" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="text-slate-700 leading-normal" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-bold text-slate-900" {...props} />
                        ),
                        a: ({ node, ...props }) => (
                          <a className="text-blue-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Retrieved Standards Cards Drawer (if any retrieved) */}
                {msg.retrievedStandards && msg.retrievedStandards.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      Retrieved Grounding Standards ({msg.retrievedStandards.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.retrievedStandards.map((std: any) => (
                        <button
                          key={std.standard_number}
                          onClick={() => onSelectStandard(std.standard_number)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-1.5 transition-colors group"
                        >
                          <span className="font-mono">{std.standard_number}</span>
                          <span className="text-[10px] text-blue-600 max-w-[120px] truncate hidden sm:inline">
                            {std.title}
                          </span>
                          <ArrowUpRight className="w-3 h-3 text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Google Search Grounding Box (when web queries or sources are returned) */}
                {((msg.groundingSources && msg.groundingSources.length > 0) || (msg.webSearchQueries && msg.webSearchQueries.length > 0) || msg.isGoogleSearchGrounded) && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] font-bold text-blue-700 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>Grounded with Google Search</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono">
                          gemini-3.8-flash
                        </span>
                      </div>
                      {msg.groundingSources && msg.groundingSources.length > 0 && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          {msg.groundingSources.length} web source{msg.groundingSources.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Web Search Queries */}
                    {msg.webSearchQueries && msg.webSearchQueries.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Search className="w-3 h-3 text-slate-400" />
                          Google queries:
                        </span>
                        {msg.webSearchQueries.map((q, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                            "{q}"
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Grounded Web Sources Links */}
                    {msg.groundingSources && msg.groundingSources.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {msg.groundingSources.map((source, idx) => {
                          let domain = '';
                          try {
                            domain = new URL(source.url).hostname.replace('www.', '');
                          } catch {
                            domain = 'web source';
                          }
                          return (
                            <a
                              key={idx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50/70 hover:border-blue-200 transition-colors flex items-start justify-between gap-2 group"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="text-[11px] font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                                  {source.title || domain}
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate font-mono">
                                  <Globe className="w-2.5 h-2.5 text-slate-400" />
                                  {domain}
                                </div>
                              </div>
                              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Official BIS Data Sourcing Attribution */}
                {msg.role === 'assistant' && msg.isVerified && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Data Grounding: <strong>Bureau of Indian Standards (services.bis.gov.in)</strong></span>
                    </div>
                    <a
                      href={msg.sourceUrl || 'https://www.services.bis.gov.in/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span>Verify Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Message Actions Bar (Assistant only) */}
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 text-xs text-slate-400 pl-1">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200 hover:text-slate-700 transition-colors"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => handleSpeak(msg.id, msg.content)}
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200 hover:text-slate-700 transition-colors"
                  >
                    {speakingId === msg.id ? <VolumeX className="w-3 h-3 text-rose-600" /> : <Volume2 className="w-3 h-3" />}
                    <span>{speakingId === msg.id ? 'Stop' : 'Listen'}</span>
                  </button>

                  <span className="text-[10px] text-slate-400 ml-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex gap-3 max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Searching verified BIS database & verifying facts...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">Try asking:</span>
        {samplePrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSendMessage(p)}
            className="px-2.5 py-1 text-xs rounded-full bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-300 text-slate-700 hover:text-blue-700 shrink-0 shadow-2xs transition-all font-medium"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any IS code, scope, clause, testing, or comparison..."
            className="flex-1 px-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            <span className="hidden sm:inline text-xs">Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
