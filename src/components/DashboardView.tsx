import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  ShieldCheck, 
  FolderKanban, 
  Activity, 
  Clock, 
  Search, 
  TrendingUp, 
  FileCheck2,
  HardDrive,
  Cpu
} from 'lucide-react';
import { DashboardStats, IndianStandard } from '../types';

interface DashboardViewProps {
  onSelectStandard: (code: string) => void;
  onSearchQuery: (query: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectStandard,
  onSearchQuery
}) => {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">Computing real-time BIS database analytics...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            BIS Standards Knowledge Engine Dashboard
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Real-time analytics, FTS5 index telemetry, and query audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Last sync: {new Date(stats.lastUpdated).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Standards</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalStandards}</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {stats.verifiedCount} fully verified ({Math.round((stats.verifiedCount / (stats.totalStandards || 1)) * 100)}%)
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Sectors</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalCategories}</div>
          <div className="text-[11px] text-slate-500">
            Covering {stats.totalIndustries} industry disciplines
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search Engine</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">&lt; 8 ms</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SQLite FTS5 Full-Text Active
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Knowledge Storage</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.databaseSize}</div>
          <div className="text-[11px] text-slate-500">
            Zero-latency local embedded WAL database
          </div>
        </div>
      </div>

      {/* Grid: Category Distribution & Popular Searches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Standards Distribution by Category
            </h3>
            <span className="text-xs text-slate-400">Live Breakdown</span>
          </div>

          <div className="space-y-3">
            {stats.categoryStats.map((item) => {
              const pct = Math.round((item.count / (stats.totalStandards || 1)) * 100);
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.category}</span>
                    <span className="font-bold text-slate-900">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Searches & Recent Audit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Frequently Queried IS Codes
              </h3>
              <span className="text-xs text-slate-400">Search Trends</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {stats.popularSearches.map((s) => (
                <button
                  key={s.query}
                  onClick={() => onSearchQuery(s.query)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs text-slate-700 hover:text-blue-800 font-medium transition-colors flex items-center gap-2"
                >
                  <span>{s.query}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                    {s.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Recent Search Audit Logs
            </h4>
            <div className="space-y-1.5">
              {stats.searchHistory.slice(0, 4).map((h, i) => (
                <div key={i} className="flex items-center justify-between text-xs text-slate-600 py-1 border-b border-slate-50">
                  <span className="font-mono text-blue-700 font-semibold">{h.query}</span>
                  <span className="text-[11px] text-slate-400">
                    {h.resultsCount} hits • {new Date(h.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recently Added Standards */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-purple-600" />
          Recently Registered Official Standards
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead>
              <tr className="text-left font-bold text-slate-500 uppercase text-[10px]">
                <th className="py-2 px-3">Standard Number</th>
                <th className="py-2 px-3">Official Title</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Committee</th>
                <th className="py-2 px-3">Year</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {stats.recentStandards.map((std) => (
                <tr key={std.standard_number} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{std.standard_number}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs truncate">{std.title}</td>
                  <td className="py-2.5 px-3">{std.category}</td>
                  <td className="py-2.5 px-3 text-slate-500">{std.technical_committee || 'Sectional Committee'}</td>
                  <td className="py-2.5 px-3">{std.publication_year}</td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => onSelectStandard(std.standard_number)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
