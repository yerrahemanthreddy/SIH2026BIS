import React from 'react';
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  Bot, 
  Columns3, 
  Calendar, 
  Layers, 
  FileText, 
  Award, 
  FlaskConical, 
  ArrowRight,
  Share2,
  Check,
  Building2,
  CheckCircle2,
  Globe,
  Sparkles,
  Search,
  Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { IndianStandard } from '../types';

interface StandardDetailsModalProps {
  standardCode: string | null;
  onClose: () => void;
  onSelectRelated: (code: string) => void;
  onAskAi: (prompt: string) => void;
  onAddToCompare: (standard: IndianStandard) => void;
}

export const StandardDetailsModal: React.FC<StandardDetailsModalProps> = ({
  standardCode,
  onClose,
  onSelectRelated,
  onAskAi,
  onAddToCompare
}) => {
  const [standard, setStandard] = React.useState<IndianStandard | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Live Google Search Grounding state
  const [liveUpdates, setLiveUpdates] = React.useState<{
    updates: string;
    groundingSources: { title: string; url: string }[];
    webSearchQueries: string[];
  } | null>(null);
  const [loadingLiveUpdates, setLoadingLiveUpdates] = React.useState(false);
  const [liveUpdatesError, setLiveUpdatesError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!standardCode) return;
    setLoading(true);
    setError(null);
    setLiveUpdates(null);
    setLiveUpdatesError(null);

    fetch(`/api/standards/${encodeURIComponent(standardCode)}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Standard ${standardCode} not found in database.`);
        }
        return res.json();
      })
      .then((data) => {
        setStandard(data);
      })
      .catch((err: any) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [standardCode]);

  const handleFetchLiveUpdates = async () => {
    if (!standard) return;
    setLoadingLiveUpdates(true);
    setLiveUpdatesError(null);
    try {
      const res = await fetch(`/api/standards/${encodeURIComponent(standard.standard_number)}/live-updates`);
      if (!res.ok) {
        throw new Error('Failed to retrieve live updates from Google Search grounding.');
      }
      const data = await res.json();
      setLiveUpdates(data);
    } catch (err: any) {
      setLiveUpdatesError(err.message);
    } finally {
      setLoadingLiveUpdates(false);
    }
  };

  if (!standardCode) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `?standard=${encodeURIComponent(standardCode)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-blue-300">
                  {standard ? standard.standard_number : standardCode}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Verified BIS Standard
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Bureau of Indian Standards Specification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Copy link to standard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {loading && (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs font-medium text-slate-500">Loading verified standard record...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <X className="w-4 h-4" />
                Standard Could Not Be Verified
              </div>
              <p className="text-xs leading-relaxed">{error}</p>
              <p className="text-[11px] text-slate-600">
                Under BIS anti-hallucination protocols, unverified records are never fabricated.
              </p>
            </div>
          )}

          {!loading && !error && standard && (
            <>
              {/* Title & Metadata Header */}
              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                  {standard.title}
                </h2>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                    {standard.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                    Industry: {standard.industry}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Year: {standard.publication_year}
                  </span>
                  {standard.revision_information && (
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {standard.revision_information}
                    </span>
                  )}
                </div>
              </div>

              {/* Technical Committee Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
                <Layers className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 font-semibold">Technical Sectional Committee:</strong>{' '}
                  <span className="text-slate-700">{standard.technical_committee || 'Bureau of Indian Standards Sectional Committee'}</span>
                  {standard.amendments && (
                    <div className="mt-1 text-slate-600">
                      <strong className="text-slate-800">Amendments / Corrigenda:</strong> {standard.amendments}
                    </div>
                  )}
                </div>
              </div>

              {/* Official Scope */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Verified Scope of the Standard
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed text-xs sm:text-sm">
                  {standard.scope}
                </div>
              </div>

              {/* Simple Plain-English Explanation */}
              {standard.description && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Simple Explanation for Industry & Consumers
                  </h3>
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-slate-800 leading-relaxed text-xs sm:text-sm">
                    {standard.description}
                  </div>
                </div>
              )}

              {/* Grid: Testing Information & Certification Scheme */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Testing Information */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-purple-600" />
                    Key Testing & Quality Parameters
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {standard.testing_information || 'Physical, chemical, and dimensional compliance tests per BIS guidelines.'}
                  </p>
                </div>

                {/* BIS Services & Certification */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    BIS Conformity & Licensing
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {standard.certification_information || 'Eligible for BIS ISI mark certification scheme under standard regulations.'}
                  </p>
                </div>
              </div>

              {/* Live Gazette Notifications & Amendments (Google Search Grounding) */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        Live Gazette Notifications & Amendments
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          Google Search Grounding
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Powered by gemini-3.8-flash with real-time web retrieval
                      </p>
                    </div>
                  </div>

                  {!liveUpdates && (
                    <button
                      onClick={handleFetchLiveUpdates}
                      disabled={loadingLiveUpdates}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      {loadingLiveUpdates ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Searching Live Web...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5" />
                          <span>Check Live Status</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {!liveUpdates && !loadingLiveUpdates && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Verify whether recent <strong>Quality Control Orders (QCOs)</strong>, draft revisions, or reaffirmations have been published in the official Gazette of India or BIS portal for <strong>{standard.standard_number}</strong>.
                  </p>
                )}

                {loadingLiveUpdates && (
                  <div className="p-4 rounded-lg bg-white border border-blue-200 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <div className="text-xs text-slate-600">
                      <strong>Querying Google Search Grounding:</strong> Cross-referencing <em>{standard.standard_number}</em> against services.bis.gov.in and egazette.gov.in...
                    </div>
                  </div>
                )}

                {liveUpdatesError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    ⚠️ {liveUpdatesError}
                  </div>
                )}

                {liveUpdates && (
                  <div className="space-y-3 pt-1">
                    <div className="p-3.5 rounded-lg bg-white border border-blue-200 text-xs text-slate-700 space-y-2 prose prose-slate max-w-none">
                      <ReactMarkdown>
                        {liveUpdates.updates}
                      </ReactMarkdown>
                    </div>

                    {/* Grounded Queries */}
                    {liveUpdates.webSearchQueries && liveUpdates.webSearchQueries.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Search className="w-3 h-3 text-slate-400" />
                          Google queries:
                        </span>
                        {liveUpdates.webSearchQueries.map((q, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[10px]">
                            "{q}"
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Sources */}
                    {liveUpdates.groundingSources && liveUpdates.groundingSources.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          Verified Grounding Sources ({liveUpdates.groundingSources.length})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {liveUpdates.groundingSources.map((s, idx) => {
                            let domain = '';
                            try {
                              domain = new URL(s.url).hostname.replace('www.', '');
                            } catch {
                              domain = 'web';
                            }
                            return (
                              <a
                                key={idx}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center justify-between gap-2 text-xs group"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="text-[11px] font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                                    {s.title || domain}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 truncate">
                                    <Globe className="w-2.5 h-2.5 text-slate-400" />
                                    {domain}
                                  </div>
                                </div>
                                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Related Standards */}
              {standard.related_standards && standard.related_standards.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Cross-Referenced Indian Standards
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {standard.related_standards.map((rel) => (
                      <button
                        key={rel}
                        onClick={() => onSelectRelated(rel)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-1.5 transition-colors group"
                      >
                        <span className="font-mono">{rel}</span>
                        <ArrowRight className="w-3 h-3 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              {standard.keywords && standard.keywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Tags:</span>
                  {standard.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}

              {/* Official Data Source & Provenance Block */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Official Data Source & Provenance
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Authentic BIS Record
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  This standard is published by the <strong>{standard.source || 'Bureau of Indian Standards (BIS)'}</strong> under the authority of the Ministry of Consumer Affairs, Food & Public Distribution, Government of India. Formulated by <strong>{standard.technical_committee || 'BIS Technical Sectional Committee'}</strong>.
                </p>

                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-slate-500 font-mono truncate max-w-[280px]">
                    {(standard.source_url || 'https://www.services.bis.gov.in/').replace('https://', '')}
                  </span>
                  <a
                    href={standard.source_url || 'https://www.services.bis.gov.in/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    <span>Verify on Official BIS Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        {standard && (
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                onAddToCompare(standard);
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-white transition-colors flex items-center gap-1.5"
            >
              <Columns3 className="w-3.5 h-3.5 text-indigo-600" />
              Add to Compare Table
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onAskAi(`Tell me about ${standard.standard_number}`);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5" />
                Ask Assistant About This
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
