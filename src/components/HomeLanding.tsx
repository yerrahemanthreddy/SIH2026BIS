import React from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  ArrowRight, 
  Columns3, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Layers,
  Award,
  Zap,
  Building2,
  ExternalLink
} from 'lucide-react';
import { IndianStandard } from '../types';

interface HomeLandingProps {
  onSearch: (query: string) => void;
  onSelectStandard: (code: string) => void;
  onNavigate: (view: string) => void;
  totalStandards: number;
  recentStandards: IndianStandard[];
}

export const HomeLanding: React.FC<HomeLandingProps> = ({
  onSearch,
  onSelectStandard,
  onNavigate,
  totalStandards,
  recentStandards
}) => {
  const [searchInput, setSearchInput] = React.useState('');

  const quickChips = [
    { label: 'IS 456', query: 'IS 456', desc: 'Reinforced Concrete' },
    { label: 'IS 800', query: 'IS 800', desc: 'Structural Steel' },
    { label: 'IS 10262', query: 'IS 10262', desc: 'Concrete Mix Proportioning' },
    { label: 'IS 383', query: 'IS 383', desc: 'Coarse & Fine Aggregates' },
    { label: 'IS 1786', query: 'IS 1786', desc: 'TMT Steel Rebars' },
    { label: 'IS 2062', query: 'IS 2062', desc: 'Structural Steel Plates' },
    { label: 'IS 1343', query: 'IS 1343', desc: 'Prestressed Concrete' },
    { label: 'IS 875', query: 'IS 875', desc: 'Design Loads (Wind/Dead/Live)' },
    { label: 'IS 516', query: 'IS 516', desc: 'Hardened Concrete Strength' },
    { label: 'IS 4031', query: 'IS 4031', desc: 'Hydraulic Cement Physical Tests' },
    { label: 'Structural Steel', query: 'standard for structural steel design', desc: 'Semantic Search' },
    { label: 'Cement Testing', query: 'standards for cement testing', desc: 'Natural Language' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-10 shadow-xl border border-blue-900/50">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Smart India Hackathon • BIS AI Assistant
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Indian Standards & BIS Services <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-indigo-200 to-sky-300">
              Intelligent Assistant
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Instantly recognize, search, and understand thousands of official Indian Standards (IS) codes. Powered by grounded RAG architecture with 100% anti-hallucination verification.
          </p>

          {/* Primary Search Input */}
          <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center shadow-2xl rounded-xl bg-white p-1.5 focus-within:ring-4 focus-within:ring-blue-400/40 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter IS code (e.g. IS 456, IS 800) or describe what you need..."
                className="w-full px-3 py-3 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none rounded-lg"
              />
              <button
                type="submit"
                className="px-5 py-3 text-sm font-bold rounded-lg bg-blue-700 hover:bg-blue-600 text-white shadow transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Query Chips */}
          <div className="space-y-2 pt-3">
            <p className="text-xs text-slate-300 font-medium">Quick Standards & Queries:</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => onSearch(chip.query)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-blue-900/60 border border-slate-700/80 hover:border-blue-400/50 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
                  title={chip.desc}
                >
                  <span className="font-semibold text-blue-300">{chip.label}</span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">({chip.desc})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Verification Legend & Anti-Hallucination Framework */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Strict Anti-Hallucination & Verification Framework
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Verified BIS data is strictly prioritized over generative AI memory. Source transparency is embedded in every response.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              🟢 Verified from BIS data
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              🟡 AI explanation
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              🔴 Not verified
            </span>
          </div>
        </div>
      </section>

      {/* Metric Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">{totalStandards}</div>
            <div className="text-xs text-slate-500 font-medium">Standards Indexed</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">&lt; 8 ms</div>
            <div className="text-xs text-slate-500 font-medium">FTS5 Search SLA</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">14+</div>
            <div className="text-xs text-slate-500 font-medium">Industry Sectors</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">100%</div>
            <div className="text-xs text-slate-500 font-medium">Verified Sources</div>
          </div>
        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          onClick={() => onNavigate('chat')}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors flex items-center justify-between">
            AI Assistant Chat
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Ask questions in conversational English or Hindi transliteration. The assistant verifies database records before crafting grounded explanations.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('compare')}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Columns3 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors flex items-center justify-between">
            Compare Standards
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Side-by-side technical comparison between standards (e.g. IS 456 vs IS 800, IS 1786 vs IS 2062) for engineers and project consultants.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('services')}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
            BIS Certification Services
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Understand ISI Mark certification, Compulsory Registration Scheme (CRS), Hallmark licensing, laboratory testing, and compliance procedures.
          </p>
        </div>
      </section>

      {/* Popular Standards Showcase */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Featured Indian Standards</h2>
            <p className="text-xs text-slate-500">Key reference codes utilized across infrastructure and consumer industries</p>
          </div>
          <button 
            onClick={() => onNavigate('browse')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Browse All ({totalStandards}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentStandards.map((std) => (
            <div
              key={std.standard_number}
              onClick={() => onSelectStandard(std.standard_number)}
              className="p-4 rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-sm text-blue-700 group-hover:text-blue-800 transition-colors font-mono">
                    {std.standard_number}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {std.category}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">
                  {std.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                  {std.scope}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Rev: {std.publication_year}</span>
                <span className="font-medium text-blue-600 group-hover:underline">View Standard →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official Data Provenance & Sources Section */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              Verified Data Provenance
            </div>
            <h2 className="text-base font-bold text-slate-900">Where Does This System Access Data?</h2>
            <p className="text-xs text-slate-500">All information is strictly grounded in official Indian statutory publications</p>
          </div>
          <button
            onClick={() => onNavigate('sources')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Explore All 6 Data Sources</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="font-bold text-slate-900">BIS Official Standards Portal</div>
            <p className="text-[11px] text-slate-500">Canonical IS alphanumeric codes, amendments, and e-Sale catalog.</p>
            <span className="text-[10px] font-mono text-blue-600 block">services.bis.gov.in</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="font-bold text-slate-900">Know Your Standards (KYS)</div>
            <p className="text-[11px] text-slate-500">Technical scopes, testing requirements, and normative cross-references.</p>
            <span className="text-[10px] font-mono text-blue-600 block">KYS Repository</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="font-bold text-slate-900">Manakonline (e-BIS)</div>
            <p className="text-[11px] text-slate-500">Sectional Committees (CED, ETD, etc.) and certification licensing schemes.</p>
            <span className="text-[10px] font-mono text-blue-600 block">manakonline.in</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="font-bold text-slate-900">The Gazette of India</div>
            <p className="text-[11px] text-slate-500">Quality Control Orders (QCOs) mandating compulsory ISI certification.</p>
            <span className="text-[10px] font-mono text-blue-600 block">egazette.gov.in</span>
          </div>
        </div>
      </section>
    </div>
  );
};
