import React from 'react';
import { 
  FolderKanban, 
  Layers, 
  ArrowRight, 
  Search, 
  Building2, 
  Cpu, 
  Flame, 
  Droplet, 
  Cog, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { IndianStandard } from '../types';

interface BrowseCategoriesViewProps {
  onSelectCategory: (category: string) => void;
  onSelectStandard: (code: string) => void;
}

export const BrowseCategoriesView: React.FC<BrowseCategoriesViewProps> = ({
  onSelectCategory,
  onSelectStandard
}) => {
  const [categories, setCategories] = React.useState<{ category: string; count: number }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCat, setSelectedCat] = React.useState<string | null>(null);
  const [categoryStandards, setCategoryStandards] = React.useState<IndianStandard[]>([]);
  const [loadingStandards, setLoadingStandards] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0 && !selectedCat) {
            handlePickCategory(data[0].category);
          }
        }
      })
      .catch(err => console.error('Failed to load categories:', err))
      .finally(() => setLoading(false));
  }, []);

  const handlePickCategory = (catName: string) => {
    setSelectedCat(catName);
    setLoadingStandards(true);

    fetch(`/api/standards?category=${encodeURIComponent(catName)}&pageSize=50`)
      .then(res => res.json())
      .then(data => {
        if (data && data.items) {
          setCategoryStandards(data.items);
        }
      })
      .catch(err => console.error('Failed to load category standards:', err))
      .finally(() => setLoadingStandards(false));
  };

  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('civil') || lower.includes('construction')) return Building2;
    if (lower.includes('electric') || lower.includes('electronics')) return Cpu;
    if (lower.includes('chemical') || lower.includes('water') || lower.includes('petroleum')) return Droplet;
    if (lower.includes('metallurg') || lower.includes('steel')) return Flame;
    return Cog;
  };

  const filteredStandards = categoryStandards.filter(s => 
    s.standard_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.scope.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-blue-600" />
          Data-Driven Category Browser
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Explore Indian Standards systematically mapped across technical committees and industrial sectors.
        </p>
      </div>

      {/* Category Grid */}
      {loading ? (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading dynamic BIS categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.category);
            const isSelected = selectedCat === cat.category;
            return (
              <button
                key={cat.category}
                onClick={() => handlePickCategory(cat.category)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.01]'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-blue-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-700 group-hover:bg-blue-100'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-blue-800 text-blue-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {cat.count}
                  </span>
                </div>
                <h3 className="text-xs font-bold leading-tight">
                  {cat.category}
                </h3>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Category Standards Listing */}
      {selectedCat && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>{selectedCat} Standards</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {filteredStandards.length} Standards
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Formulated under Bureau of Indian Standards Technical Division
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter in this category..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loadingStandards ? (
            <div className="py-12 text-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Loading standards...</p>
            </div>
          ) : filteredStandards.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No standards found matching your filter in {selectedCat}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {filteredStandards.map((std) => (
                <div
                  key={std.standard_number}
                  onClick={() => onSelectStandard(std.standard_number)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group bg-slate-50/50 hover:bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono font-bold text-sm text-blue-700 group-hover:text-blue-900">
                        {std.standard_number}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug">
                      {std.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                      {std.scope}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Year: {std.publication_year}</span>
                    <span className="font-medium text-blue-600 group-hover:underline flex items-center gap-0.5">
                      View Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
