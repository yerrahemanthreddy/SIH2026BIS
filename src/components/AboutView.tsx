import React from 'react';
import { 
  Info, 
  ShieldCheck, 
  Database, 
  Cpu, 
  CheckCircle2, 
  ExternalLink, 
  FileCheck, 
  Sparkles,
  Layers,
  Award,
  Zap
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const rules = [
    { num: 1, text: 'Never invent an IS code under any circumstances.' },
    { num: 2, text: 'Never invent or fabricate a standard title.' },
    { num: 3, text: 'Never invent a BIS certification requirement (e.g. ISI mark, CRS, or Hallmarking).' },
    { num: 4, text: 'Never invent clause numbers or technical tables.' },
    { num: 5, text: 'Never invent testing requirements or testing values.' },
    { num: 6, text: 'Never claim information is officially from BIS unless retrieved from verified data.' },
    { num: 7, text: 'If information is unavailable or unverified, explicitly declare: "I could not verify this IS standard from the available BIS data."' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Smart India Hackathon • Internal Evaluation Project
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
          AI-Powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          National standards play a critical role in quality control, consumer safety, industrial manufacturing, and public procurement across India. This platform bridges technical knowledge gaps using a grounded Retrieval-Augmented Generation (RAG) architecture that scales seamlessly to tens of thousands of standards.
        </p>
      </div>

      {/* Grounded RAG Pipeline Diagram */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          System Architecture & Grounded RAG Pipeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center mx-auto">1</div>
            <div className="font-bold text-xs text-slate-900">User Input</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              User asks about an IS code, materials, scope, or comparative requirements.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center mx-auto">2</div>
            <div className="font-bold text-xs text-blue-900">Code Normalizer</div>
            <p className="text-[11px] text-blue-700 leading-snug">
              Extracts canonical numerical codes ("IS-456", "is 456" -&gt; "is456").
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mx-auto">3</div>
            <div className="font-bold text-xs text-indigo-900">SQLite FTS5 Retrieval</div>
            <p className="text-[11px] text-indigo-700 leading-snug">
              Multi-tier BM25 & exact retrieval from indexed database (&lt;8ms latency).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center mx-auto">4</div>
            <div className="font-bold text-xs text-purple-900">Anti-Hallucination Gate</div>
            <p className="text-[11px] text-purple-700 leading-snug">
              Verifies authenticity. Rejects unverified codes without generating false claims.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto">5</div>
            <div className="font-bold text-xs text-emerald-900">Grounded Synthesis</div>
            <p className="text-[11px] text-emerald-700 leading-snug">
              Gemini 3.8 Flash synthesizes verified scope, plain explanations, and BIS source links.
            </p>
          </div>
        </div>
      </div>

      {/* 7 Strict Anti-Hallucination Mandates */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            The 7 BIS Anti-Hallucination Mandates
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Zero Hallucination Tolerance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rules.map((rule) => (
            <div
              key={rule.num}
              className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-800"
            >
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                {rule.num}
              </div>
              <span className="leading-relaxed font-medium">{rule.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scalability Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Scalable Database Engine</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminates hardcoded lists. Built upon SQLite WAL mode with B-tree indexed fields, supporting 50,000+ standards effortlessly.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">FTS5 Full-Text Search</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            BM25 token ranking indexes standard numbers, scopes, titles, and technical keywords for instant sub-10ms query resolution.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Dynamic Ingestion & APIs</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            New standards can be imported dynamically via JSON or CSV datasets without modifying a single line of backend or frontend code.
          </p>
        </div>
      </div>

      {/* Official Data Sources & Authority Provenance */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            Official Data Sources & Authority Provenance
          </h3>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Direct Statutory Grounding
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          The system strictly accesses and verifies Indian Standards data from recognized statutory portals and gazette notifications issued by the Government of India:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">1. BIS Official Standards Portal & e-Sale</div>
            <p className="text-[11px] text-slate-600">Official catalog of IS codes, titles, publication dates, reaffirmations, and active amendments.</p>
            <a href="https://www.services.bis.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]">
              services.bis.gov.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">2. BIS "Know Your Standards" (KYS) Directory</div>
            <p className="text-[11px] text-slate-600">Technical abstracts, verified scopes, testing requirements, and normative cross-references.</p>
            <a href="https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]">
              KYS Portal Repository <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">3. Manakonline (e-BIS Unified Portal)</div>
            <p className="text-[11px] text-slate-600">Technical Sectional Committees (CED, ETD, FAD, PCD, etc.) and Product Certification schemes.</p>
            <a href="https://www.manakonline.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]">
              manakonline.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">4. The Gazette of India (Quality Control Orders)</div>
            <p className="text-[11px] text-slate-600">Mandatory BIS conformity notifications issued by the Department of Consumer Affairs & Ministries.</p>
            <a href="https://egazette.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]">
              egazette.gov.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Official Attribution */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-slate-300">
          <Award className="w-5 h-5 text-blue-400 shrink-0" />
          <span>
            Data grounded in official publications of the <strong>Bureau of Indian Standards (BIS)</strong>, Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
          </span>
        </div>
        <a
          href="https://www.services.bis.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shrink-0 inline-flex items-center gap-1.5"
        >
          <span>Official BIS Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
