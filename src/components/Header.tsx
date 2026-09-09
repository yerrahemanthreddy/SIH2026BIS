import React from 'react';
import { ShieldCheck, Search, Sparkles, BookOpen, Database } from 'lucide-react';

interface HeaderProps {
  totalStandards: number;
  onNavigate: (view: string) => void;
  onQuickSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ totalStandards, onNavigate, onQuickSearch }) => {
  const [quickInput, setQuickInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onQuickSearch(quickInput.trim());
      setQuickInput('');
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Government-Style Tricolor Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-900 border border-blue-400/30 flex items-center justify-center shadow-inner group-hover:border-blue-300 transition-colors">
              <ShieldCheck className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-blue-200 transition-colors">
                  BIS Standards Assistant
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  AI-Powered
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Bureau of Indian Standards • मानक: पथप्रदर्शक:
              </p>
            </div>
          </div>

          {/* Header Quick Search Form */}
          <form onSubmit={handleSubmit} className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Search IS code (e.g. IS 456, IS 800, cement)..."
                className="w-full pl-9 pr-20 py-1.5 text-sm bg-slate-800/90 text-white placeholder-slate-400 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Metrics & Quick Actions */}
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 cursor-pointer hover:bg-slate-700/80 transition-colors"
              onClick={() => onNavigate('dashboard')}
              title="Verified Indian Standards currently indexed in database"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-400">{totalStandards}</span>
              <span className="hidden sm:inline">Standards Active</span>
            </div>

            <button
              onClick={() => onNavigate('chat')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden sm:inline">AI Chat</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
