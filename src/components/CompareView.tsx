import React from 'react';
import { 
  Columns3, 
  Plus, 
  Trash2, 
  Bot, 
  ShieldCheck, 
  Printer, 
  Download, 
  Layers, 
  ExternalLink,
  Search,
  Check
} from 'lucide-react';
import { IndianStandard } from '../types';

interface CompareViewProps {
  compareList: IndianStandard[];
  onRemoveFromCompare: (code: string) => void;
  onAddStandardByCode: (code: string) => void;
  onAskAiCompare: (codes: string[]) => void;
  onSelectStandard: (code: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  compareList,
  onRemoveFromCompare,
  onAddStandardByCode,
  onAskAiCompare,
  onSelectStandard
}) => {
  const [searchInput, setSearchInput] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<IndianStandard[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const presets = [
    { label: 'IS 456 vs IS 800', desc: 'Concrete Design vs Steel Design', codes: ['IS 456:2000', 'IS 800:2007'] },
    { label: 'IS 1786 vs IS 2062', desc: 'TMT Reinforcement Bars vs Structural Steel Plates', codes: ['IS 1786:2008', 'IS 2062:2011'] },
    { label: 'IS 10262 vs IS 383', desc: 'Mix Proportioning vs Aggregates Specification', codes: ['IS 10262:2019', 'IS 383:2016'] },
    { label: 'IS 10500 vs IS 14543', desc: 'Drinking Water vs Packaged Drinking Water', codes: ['IS 10500:2012', 'IS 14543:2024'] }
  ];

  const handleSearchStandards = (term: string) => {
    setSearchInput(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    fetch(`/api/search?q=${encodeURIComponent(term)}&pageSize=5`)
      .then(res => res.json())
      .then(data => {
        if (data && data.results) {
          setSearchResults(data.results);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsSearching(false);
      });
  };

  const handleSelectPreset = (codes: string[]) => {
    codes.forEach(c => onAddStandardByCode(c));
  };

  const handleExportCsv = () => {
    if (compareList.length === 0) return;
    const headers = ['Attribute', ...compareList.map(s => `"${s.standard_number}"`)];
    const rows = [
      ['Official Title', ...compareList.map(s => `"${s.title.replace(/"/g, '""')}"`)],
      ['Category', ...compareList.map(s => `"${s.category}"`)],
      ['Industry', ...compareList.map(s => `"${s.industry}"`)],
      ['Publication Year', ...compareList.map(s => `"${s.publication_year}"`)],
      ['Technical Committee', ...compareList.map(s => `"${s.technical_committee || ''}"`)],
      ['Scope', ...compareList.map(s => `"${s.scope.replace(/"/g, '""')}"`)],
      ['Testing Info', ...compareList.map(s => `"${(s.testing_information || '').replace(/"/g, '""')}"`)],
      ['Certification Info', ...compareList.map(s => `"${(s.certification_information || '').replace(/"/g, '""')}"`)],
      ['Related Standards', ...compareList.map(s => `"${(s.related_standards || []).join(', ')}"`)],
      ['Source', ...compareList.map(s => `"${s.source}"`)]
    ];

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BIS_Comparison_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Columns3 className="w-5 h-5 text-indigo-600" />
            Multi-Standard Technical Comparison Matrix
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Compare scope, testing requirements, conformity schemes, and technical committees across Indian Standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {compareList.length >= 2 && (
            <button
              onClick={() => onAskAiCompare(compareList.map(s => s.standard_number))}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4" />
              AI Comparative Analysis
            </button>
          )}

          {compareList.length > 0 && (
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Standard Selector & Presets */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchStandards(e.target.value)}
              placeholder="Search standard to add (e.g. IS 456, IS 10262, cement)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 rounded-lg border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                {searchResults.map((res) => (
                  <div
                    key={res.standard_number}
                    onClick={() => {
                      onAddStandardByCode(res.standard_number);
                      setSearchInput('');
                      setSearchResults([]);
                    }}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-blue-700">{res.standard_number}</span>
                      <p className="text-slate-600 line-clamp-1">{res.title}</p>
                    </div>
                    <Plus className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Popular Comparisons:</span>
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleSelectPreset(preset.codes)}
              className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-medium transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {compareList.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-md mx-auto space-y-3">
          <Columns3 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Standards Selected for Comparison</h3>
          <p className="text-xs text-slate-500">
            Select at least two Indian Standards using the search box above or by clicking the quick presets.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleSelectPreset(['IS 456:2000', 'IS 800:2007'])}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Load Example: IS 456 vs IS 800
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              {/* Header Row: Standard Codes & Remove Buttons */}
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-4 py-3.5 text-left font-bold text-slate-300 uppercase tracking-wider w-48 shrink-0">
                    Feature / Attribute
                  </th>
                  {compareList.map((std) => (
                    <th key={std.standard_number} className="px-4 py-3.5 text-left min-w-[280px]">
                      <div className="flex items-center justify-between gap-2">
                        <span 
                          onClick={() => onSelectStandard(std.standard_number)}
                          className="font-mono font-bold text-sm text-blue-300 hover:text-white cursor-pointer hover:underline"
                        >
                          {std.standard_number}
                        </span>
                        <button
                          onClick={() => onRemoveFromCompare(std.standard_number)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Remove standard from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Year: {std.publication_year}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {/* Official Title */}
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900 bg-slate-50/50">Official Title</td>
                  {compareList.map(std => (
                    <td key={std.standard_number} className="px-4 py-3 font-medium text-slate-800">
                      {std.title}
                    </td>
                  ))}
                </tr>

                {/* Status */}
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900 bg-slate-50/50">BIS Status</td>
                  {compareList.map(std => (
                    <td key={std.standard_number} className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        🟢 Verified BIS Standard
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Category & Industry */}
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900 bg-slate-50/50">Category & Sector</td>
                  {compareList.map(std => (
                    <td key={std.standard_number} className="px-4 py-3 text-slate-700">
                      <div className="font-semibold text-blue-700">{std.category}</div>
                      <div className="text-slate-500 text-[11px]">{std.industry}</div>
                    </td>
                  ))}
                </tr>

                {/* Technical Committee */}
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900 bg-slate-50/50">Sectional Committee</td>
                  {compareList.map(std => (
                    <td key={std.standard_number} className="px-4 py-3 text-slate-700">
                      {std.technical_committee || 'Bureau of Indian Standards Sectional Committee'}
                    </td>
                  ))}
                </tr>

                {/* Scope Summary */}
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900 bg-slate-50/50">Scope & Objective</td>
                  {compareList.map(std => (
                    <td key={std.standard_number} className="px-4 py-3 text-slate-600 leading-relaxed text-xs">
                      {std.scope}
                    </td>
                  ))}
                </tr>

                {/* Simple Explanation */}
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900 bg-slate-50/50">Plain Summary</td>
                  {compareList.map(std => (
                    <td key={std.standard_number} className="px-4 py-3 text-slate-700 bg-amber-50/30 text-xs leading-relaxed">
                      {std.description || 'Standard technical guidelines formulated for industrial practice.'}
                    </td>
                  ))}
                </tr>

                {/* Testing Requirements */}
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900 bg-slate-50/50">Testing & Compliance</td>
                  {compareList.map(std => (
                    <td key={std.standard_number} className="px-4 py-3 text-slate-700 leading-relaxed">
                      {std.testing_information || 'Mandatory physical/chemical tests as specified in standard methods.'}
                    </td>
                  ))}
                </tr>

                {/* Certification Scheme */}
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900 bg-slate-50/50">Conformity Scheme</td>
                  {compareList.map(std => (
                    <td key={std.standard_number} className="px-4 py-3 text-slate-700">
                      {std.certification_information || 'Bureau of Indian Standards Product Certification Scheme.'}
                    </td>
                  ))}
                </tr>

                {/* Related Standards */}
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900 bg-slate-50/50">Cross References</td>
                  {compareList.map(std => (
                    <td key={std.standard_number} className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(std.related_standards || []).map(rel => (
                          <button
                            key={rel}
                            onClick={() => onSelectStandard(rel)}
                            className="font-mono px-1.5 py-0.5 rounded bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-[10px]"
                          >
                            {rel}
                          </button>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Source Verification */}
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900 bg-slate-50/50">Official Source</td>
                  {compareList.map(std => (
                    <td key={std.standard_number} className="px-4 py-3 text-slate-600">
                      <div>{std.source}</div>
                      <a
                        href={std.source_url || 'https://www.services.bis.gov.in/'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1 text-[11px] mt-0.5"
                      >
                        Official BIS Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
