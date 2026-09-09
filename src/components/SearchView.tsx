import React from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  ExternalLink, 
  Bot, 
  Columns3, 
  ShieldCheck, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { IndianStandard, SearchResponse } from '../types';

interface SearchViewProps {
  initialQuery?: string;
  onSelectStandard: (code: string) => void;
  onAskAi: (query: string) => void;
  onAddToCompare: (standard: IndianStandard) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  initialQuery = '',
  onSelectStandard,
  onAskAi,
  onAddToCompare
}) => {
  const [query, setQuery] = React.useState(initialQuery);
  const [category, setCategory] = React.useState('All');
  const [categories, setCategories] = React.useState<{ category: string; count: number }[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [searchData, setSearchData] = React.useState<SearchResponse | null>(null);

  // Load categories
  React.useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  const performSearch = React.useCallback((q: string, cat: string, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({
      q,
      category: cat === 'All' ? '' : cat,
      page: String(p),
      pageSize: '12'
    });

    fetch(`/api/search?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setSearchData(data);
      })
      .catch(err => {
        console.error('Search error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Run on mount or when initialQuery changes
  React.useEffect(() => {
    setQuery(initialQuery);
    setPage(1);
    performSearch(initialQuery, category, 1);
  }, [initialQuery, performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    performSearch(query, category, 1);
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setPage(1);
    performSearch(query, newCat, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    performSearch(query, category, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by IS code (e.g. IS 456, IS 800), title, materials, or scope..."
              className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 rounded-lg border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  performSearch('', category, 1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.category} value={c.category}>
                  {c.category} ({c.count})
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results Metadata & Search Timing */}
        {searchData && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span>
                Found <strong className="text-slate-900">{searchData.total}</strong> verified standards
                {query && <span> for "<strong>{query}</strong>"</span>}
              </span>

              {searchData.detectedCode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  <Sparkles className="w-3 h-3" />
                  Code detected: {searchData.detectedCode.toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Query processed in {searchData.executionTimeMs} ms</span>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-slate-600">Retrieving official standards from BIS database...</p>
        </div>
      )}

      {/* Results Grid */}
      {!loading && searchData && searchData.results.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchData.results.map((std) => (
              <div
                key={std.id || std.standard_number}
                className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Code, Badges, Category */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={() => onSelectStandard(std.standard_number)}
                          className="font-mono font-bold text-base text-blue-700 hover:text-blue-900 cursor-pointer hover:underline"
                        >
                          {std.standard_number}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />
                          Verified BIS
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Year: {std.publication_year} • {std.technical_committee || 'Sectional Committee'}
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                      {std.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onSelectStandard(std.standard_number)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug line-clamp-2"
                  >
                    {std.title}
                  </h3>

                  {/* Scope Summary */}
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {std.scope}
                  </p>

                  {/* Related Standards Chips */}
                  {std.related_standards && std.related_standards.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Related:</span>
                      {std.related_standards.slice(0, 3).map((rel) => (
                        <button
                          key={rel}
                          onClick={() => onSelectStandard(rel)}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 transition-colors"
                        >
                          {rel}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectStandard(std.standard_number)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Full Details →
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onAddToCompare(std)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                      title="Add to comparison table"
                    >
                      <Columns3 className="w-3.5 h-3.5" />
                      <span className="text-[11px] hidden sm:inline">Compare</span>
                    </button>

                    <button
                      onClick={() => onAskAi(`Tell me about ${std.standard_number}`)}
                      className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                      title="Ask AI assistant about this standard"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span className="text-[11px] hidden sm:inline">Ask AI</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {searchData.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-xs text-slate-600 font-medium">
                Page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{searchData.totalPages}</strong>
              </span>

              <button
                disabled={page >= searchData.totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State / Not Found */}
      {!loading && searchData && searchData.results.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No Verified Standards Found
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We could not find any standard matching "<strong>{query}</strong>" in the indexed BIS database. Under BIS Anti-Hallucination guidelines, unverified standards are not fabricated.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setQuery('');
                performSearch('', 'All', 1);
              }}
              className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Reset Search & Show All
            </button>
            <a
              href="https://www.services.bis.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Search Official BIS Portal <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
