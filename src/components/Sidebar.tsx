import React from 'react';
import { 
  Home, 
  Search, 
  Bot, 
  FolderKanban, 
  Columns3, 
  LayoutDashboard, 
  Award, 
  UploadCloud, 
  FlaskConical, 
  Info,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Database
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  totalStandards: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, totalStandards }) => {
  const navItems = [
    { id: 'home', label: 'Home / Portal', icon: Home },
    { id: 'search', label: 'Standards Search', icon: Search, badge: 'Fast' },
    { id: 'chat', label: 'AI Assistant', icon: Bot, badge: 'RAG' },
    { id: 'browse', label: 'Browse Categories', icon: FolderKanban },
    { id: 'compare', label: 'Compare Standards', icon: Columns3 },
    { id: 'dashboard', label: 'Dashboard & Metrics', icon: LayoutDashboard },
    { id: 'services', label: 'BIS Services & Schemes', icon: Award },
    { id: 'sources', label: 'Data Sources & Provenance', icon: Database, badge: 'Official' },
    { id: 'import', label: 'Data Ingestion', icon: UploadCloud, badge: 'Admin' },
    { id: 'test-suite', label: 'Hackathon Test Suite', icon: FlaskConical, badge: '12/12' },
    { id: 'about', label: 'System & Architecture', icon: Info },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Portal Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'hover:bg-slate-800 hover:text-white text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Status & Official Links */}
      <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
        {/* Knowledge Base Status Card */}
        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="font-semibold text-slate-200">Knowledge Engine</span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SQLite FTS5
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {totalStandards} verified IS records ready for sub-millisecond retrieval.
          </p>
        </div>

        {/* Official BIS Web Portal External Link */}
        <a
          href="https://www.services.bis.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-xs text-slate-400 hover:text-blue-300 transition-colors py-1 px-1"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            Official BIS Portal
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
};
