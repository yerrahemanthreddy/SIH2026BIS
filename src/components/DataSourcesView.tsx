import React from 'react';
import { 
  Database, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  FileText, 
  Scale, 
  Layers, 
  Globe2, 
  Lock, 
  ArrowUpRight,
  BookOpen,
  Cpu,
  UploadCloud,
  FileCheck2
} from 'lucide-react';

interface DataSourcesViewProps {
  onNavigate: (view: string) => void;
  totalStandards: number;
}

export const DataSourcesView: React.FC<DataSourcesViewProps> = ({ onNavigate, totalStandards }) => {
  const sources = [
    {
      id: 'bis-portal',
      name: 'Bureau of Indian Standards (BIS) Official Standards Portal',
      authority: 'Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution, Govt. of India',
      url: 'https://www.services.bis.gov.in/',
      secondaryUrl: 'https://standardsbis.bsbedge.com/',
      status: 'Primary Statutory Registry',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dataAccessed: [
        'Official Indian Standard (IS) alphanumeric codes (e.g., IS 456, IS 800, IS 10262)',
        'Canonical standard titles and publication years',
        'Revision numbers, reaffirmation dates, and active amendments',
        'Superseded or withdrawn standard status',
        'Standard pricing and official PDF e-sale catalog'
      ],
      description: 'The definitive statutory repository maintained by the Bureau of Indian Standards under the BIS Act, 2016. Every standard code recognized in this application corresponds to a registered record in this registry.'
    },
    {
      id: 'know-your-standards',
      name: 'BIS "Know Your Standards" (KYS) Electronic Repository',
      authority: 'BIS Central IT Operations & Standards Promotion Department',
      url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails',
      status: 'Technical Scope & Abstract Source',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      dataAccessed: [
        'Official scope definitions and technical abstracts',
        'Sectional committee assignments (e.g., CED 2, CED 7, ETD 14)',
        'Mandatory clause breakdowns and sampling guidelines',
        'Cross-referenced associated and normative standards'
      ],
      description: 'The public technical knowledge platform allowing citizens, engineers, and manufacturers to inspect the verified scopes, committee jurisdictions, and normative references of Indian Standards.'
    },
    {
      id: 'manakonline',
      name: 'Manakonline Portal (e-BIS Unified Standards System)',
      authority: 'Bureau of Indian Standards Standards Formulation & Certification Wing',
      url: 'https://www.manakonline.in/',
      status: 'Formulation & Certification Authority',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      dataAccessed: [
        'Division council classifications (Civil, Chemical, Electrotechnical, Food, Mechanical, Metallurgy, Textiles)',
        'Technical Committee formulation records',
        'Product Certification Schemes (Scheme I - ISI Mark, Scheme II - CRS)',
        'Draft standards currently under public consultation'
      ],
      description: 'The end-to-end e-governance platform powering standards drafting, technical committee balloting, and product certification licenses across the country.'
    },
    {
      id: 'gazette-qco',
      name: 'The Gazette of India — Quality Control Orders (QCOs)',
      authority: 'Published by Authority of the Government of India (Ministry of Commerce & Industry / DoCA)',
      url: 'https://egazette.gov.in/',
      secondaryUrl: 'https://consumeraffairs.nic.in/',
      status: 'Statutory Legal Mandates',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      dataAccessed: [
        'Notifications of mandatory BIS certification under Section 16 of the BIS Act',
        'Dates of mandatory enforcement for domestic manufacturers and importers',
        'Penal provisions for non-compliance and counterfeit ISI marks',
        'Exemptions for MSMEs, R&D imports, and export-oriented units'
      ],
      description: 'Statutory orders issued in the official Gazette making adherence to specific Indian Standards compulsory for public safety, consumer health, and infrastructure security.'
    },
    {
      id: 'bis-care',
      name: 'BIS Care Portal & Mobile Licensee Verification System',
      authority: 'BIS Consumer Affairs Department',
      url: 'https://www.bis.gov.in/consumer-affairs/bis-care-app/',
      status: 'Consumer Redressal & License Data',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      dataAccessed: [
        'Searchable database of operational ISI Mark licences (CM/L numbers)',
        'Compulsory Registration Scheme (CRS) registration numbers',
        'Hallmarking Unique Identification (HUID) validation for gold jewellery',
        'Consumer grievance registration and enforcement inspection mechanisms'
      ],
      description: 'Public-facing consumer protection infrastructure allowing verification of whether a product bearing the ISI or CRS mark carries a genuine, unexpired licence.'
    },
    {
      id: 'nbc-cpwd',
      name: 'National Building Code of India (NBC) & CPWD Specifications',
      authority: 'BIS CED (Civil Engineering Division) & Ministry of Housing and Urban Affairs',
      url: 'https://cpwd.gov.in/',
      secondaryUrl: 'https://www.bis.gov.in/standards/technical-department/civil-engineering/',
      status: 'Engineering & Procurement Norms',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      dataAccessed: [
        'Mandatory references in public infrastructure and building bylaws',
        'Concrete mix design specifications (IS 10262 & IS 456)',
        'Structural steel and seismic design criteria (IS 800 & IS 1893)',
        'Aggregate and cement quality benchmarks (IS 383, IS 269, IS 12269)'
      ],
      description: 'Comprehensive guidelines and statutory public works requirements governing all building construction, infrastructure projects, and engineering tenders throughout India.'
    },
    {
      id: 'google-search-grounding',
      name: 'Google Search Grounding Engine (gemini-3.8-flash & gemini-3.5-flash)',
      authority: 'Google AI Studio & DeepMind Search Retrieval Integration',
      url: 'https://ai.google.dev/',
      secondaryUrl: 'https://services.bis.gov.in/',
      status: 'Live Real-Time Web Grounding',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      dataAccessed: [
        'Live Gazette of India Quality Control Orders (QCOs) published in 2024-2026',
        'Recent active amendments & sectional committee draft revisions from services.bis.gov.in',
        'Real-time verification of compulsory certification deadlines across ministries',
        'Transparent citation of live government web URLs and domain provenance'
      ],
      description: 'Augments deterministic database retrieval with real-time Google Search grounding using the googleSearch tool on gemini-3.8-flash, providing verifiable web sources for recent regulatory updates.'
    }
  ];

  const technicalDivisions = [
    { code: 'CED', name: 'Civil Engineering Division', count: '1,500+ Standards', example: 'IS 456, IS 800, IS 10262, IS 875, IS 13920' },
    { code: 'ETD', name: 'Electrotechnical Division', count: '1,400+ Standards', example: 'IS 302, IS 1415, IS 694, IS 732, IS 2026' },
    { code: 'PCD', name: 'Petroleum, Coal & Related Products', count: '1,200+ Standards', example: 'IS 14543, IS 13428, IS 101, IS 1448' },
    { code: 'FAD', name: 'Food & Agriculture Division', count: '1,100+ Standards', example: 'IS 11536, IS 1165, IS 15757, IS 14433' },
    { code: 'MED', name: 'Mechanical Engineering Division', count: '1,800+ Standards', example: 'IS 2825, IS 3177, IS 807, IS 2062' },
    { code: 'MTD', name: 'Metallurgical Engineering Division', count: '900+ Standards', example: 'IS 1786, IS 2062, IS 1608, IS 1500' },
    { code: 'TED', name: 'Transport Engineering Division', count: '800+ Standards', example: 'IS 14283, IS 15636, IS 11852' },
    { code: 'TXD', name: 'Textiles Division', count: '1,300+ Standards', example: 'IS 16890, IS 277, IS 15748' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <Building2 className="w-4 h-4 text-blue-600" />
            Official Data Authority & Provenance
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Grounded in Government of India Publications
          </span>
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
          Where Does This Application Access Indian Standards Data?
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          This system operates under strict <strong>Anti-Hallucination Mandates</strong>. To guarantee accuracy for engineers, manufacturers, and consumers, every standard code, scope, clause, and certification scheme is directly grounded in publications by the <strong>Bureau of Indian Standards (BIS)</strong> and statutory gazette orders issued by the Government of India.
        </p>
      </div>

      {/* Data Ingestion & Integrity Pipeline Architecture */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            Data Ingestion & Integrity Flow (From Gazette to Screen)
          </h3>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Full Provenance Chain
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-left">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">1</div>
            <div className="font-bold text-xs text-slate-900">Official Portals</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Records extracted from BIS e-Sale, Manakonline, and DoCA Gazette QCOs.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-2 text-left">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">2</div>
            <div className="font-bold text-xs text-blue-900">Schema Ingestion</div>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Standardized into typed schemas with canonical normalization (e.g. <code>is456</code>).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2 text-left">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">3</div>
            <div className="font-bold text-xs text-indigo-900">SQLite FTS5 Index</div>
            <p className="text-[11px] text-indigo-700 leading-relaxed">
              Stored in high-speed local database with BM25 full-text indexing for &lt;10ms retrieval.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-2 text-left">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center">4</div>
            <div className="font-bold text-xs text-purple-900">Anti-Hallucination Gate</div>
            <p className="text-[11px] text-purple-700 leading-relaxed">
              Verifies code existence. Any unknown code (e.g. IS 999999) is immediately declined.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-left">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">5</div>
            <div className="font-bold text-xs text-emerald-900">Grounded Synthesis</div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Gemini AI models synthesize ONLY the verified data, appending live BIS verification links.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Data Sources Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            Official Government & BIS Data Sources
          </h3>
          <span className="text-xs text-slate-500">
            6 Authorized Portals Integrated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((src) => (
            <div 
              key={src.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${src.badgeColor}`}>
                      {src.status}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {src.name}
                    </h4>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors shrink-0"
                    title="Open official portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  <strong>Authority:</strong> {src.authority}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {src.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Key Data Fields Accessed:
                  </span>
                  <ul className="space-y-1">
                    {src.dataAccessed.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono text-[11px] text-slate-500 truncate max-w-[240px]">
                  {src.url.replace('https://', '')}
                </span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Visit Portal <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BIS Technical Sectional Committees */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" />
              BIS Technical Sectional Committees (Formulation Bodies)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Standards in India are formulated by specialized technical committees comprising industry experts, IIT professors, and government engineers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {technicalDivisions.map((div) => (
            <div key={div.code} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px]">
                  {div.code}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">{div.count}</span>
              </div>
              <div className="font-bold text-slate-800 text-xs">{div.name}</div>
              <div className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">Sample IS:</span> {div.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingest More Standards Dataset Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-300" />
            <h3 className="text-base font-bold text-white">
              Expand Standards Knowledge Base ({totalStandards} Currently Loaded)
            </h3>
          </div>
          <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
            Need to add thousands more standards from your organization or official BIS exports? Use our zero-code Data Ingestion pipeline to bulk import CSV or JSON files with automated duplicate recognition.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('import')}
            className="px-4 py-2 text-xs font-bold bg-white text-blue-950 hover:bg-blue-50 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4 text-blue-700" />
            Import Datasets (CSV/JSON)
          </button>
          <button
            onClick={() => onNavigate('search')}
            className="px-4 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            Browse Current Standards
          </button>
        </div>
      </div>
    </div>
  );
};
