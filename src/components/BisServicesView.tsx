import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  Smartphone, 
  FlaskConical, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Building, 
  BadgePercent,
  Sparkles,
  Search,
  Scale
} from 'lucide-react';

export const BisServicesView: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('isi');

  const schemes = [
    {
      id: 'isi',
      title: 'ISI Mark Certification (Scheme I)',
      badge: 'Product Certification',
      icon: Award,
      summary: 'The flagship quality certification mark for industrial and consumer goods in India since 1955.',
      details: [
        'Applicable under the BIS Act, 2016 and Bureau of Indian Standards (Conformity Assessment) Regulations, 2018.',
        'Over 450 products under Mandatory Certification (Quality Control Orders - QCOs) issued by line ministries (Steel, Cement, Cables, Toys, Chemical, Pressure Cookers).',
        'Process involves factory inspection, verification of manufacturing infrastructure, quality control testing in factory lab, and independent testing in BIS recognized labs.',
        'Once granted, manufacturer receives a unique Certification Marks License (CM/L) number.',
        'Surveillance audits and market sample testing ensure continuous compliance.'
      ],
      portalUrl: 'https://www.manakonline.in/'
    },
    {
      id: 'crs',
      title: 'Compulsory Registration Scheme (CRS - Scheme II)',
      badge: 'Electronics & IT Products',
      icon: ShieldCheck,
      summary: 'Self-declaration of conformity based on testing in BIS-recognized labs for Electronics & IT goods.',
      details: [
        'Administered under Ministry of Electronics and Information Technology (MeitY) and Ministry of New and Renewable Energy (MNRE).',
        'Covers 80+ product categories including laptops, smartphones, power adapters, LED luminaires, smart watches, and solar PV inverters.',
        'Requires rigorous safety testing against relevant IS standards (such as IS 13252 for IT equipment and IS 16046 for secondary cells/batteries).',
        'Foreign and domestic manufacturers obtain an R-Number (Registration Number) and apply the standard BIS CRS logo on products and packaging.',
        'No initial factory inspection required, but post-market surveillance is strictly enforced.'
      ],
      portalUrl: 'https://www.crsbis.in/BIS/'
    },
    {
      id: 'hallmark',
      title: 'Hallmarking Scheme (Gold & Silver)',
      badge: 'Precious Metals & Jewellery',
      icon: Scale,
      summary: 'Accurate determination and official recording of the proportionate content of precious metal.',
      details: [
        'Mandatory hallmarking of gold jewellery implemented across designated districts in India.',
        'Key purity grades: 14 Karat (585), 18 Karat (750), 20 Karat (833), 22 Karat (916), 23 Karat (958), and 24 Karat (995/999).',
        'HUID (Hallmark Unique Identification): Every piece of hallmarked jewellery receives a distinct 6-digit alphanumeric code laser-engraved at an Assaying & Hallmarking Centre (AHC).',
        'Consumers can verify purity, jewelers registration, and AHC details via the BIS Care App using the HUID number.',
        'Governed under IS 1417 (Gold) and IS 2112 (Silver).'
      ],
      portalUrl: 'https://www.manakonline.in/MANAK/hallmarkingNew'
    },
    {
      id: 'mscs',
      title: 'Management Systems Certification (MSCS)',
      badge: 'ISO Standards & Audits',
      icon: Building,
      summary: 'Certification of organizational management systems aligned with global ISO and national IS standards.',
      details: [
        'ISO 9001 (IS/ISO 9001) — Quality Management Systems (QMS)',
        'ISO 14001 (IS/ISO 14001) — Environmental Management Systems (EMS)',
        'ISO 45001 (IS/ISO 45001) — Occupational Health & Safety Management (OHSMS)',
        'ISO 22000 (IS/ISO 22000) — Food Safety Management Systems (FSMS)',
        'ISO 27001 (IS/ISO 27001) — Information Security Management Systems (ISMS)',
        'IS 15700 — Quality Management Systems for Public Service Delivery (Sevottam)'
      ],
      portalUrl: 'https://www.manakonline.in/'
    },
    {
      id: 'lrs',
      title: 'Laboratory Recognition Scheme (LRS)',
      badge: 'Testing Infrastructure',
      icon: FlaskConical,
      summary: 'Network of high-precision testing laboratories evaluating compliance to Indian Standards.',
      details: [
        'BIS maintains Central and Regional Laboratories equipped with state-of-the-art analytical instrumentation.',
        'Recognizes hundreds of private and government commercial laboratories across India under the LRS scheme.',
        'Laboratories must be accredited as per ISO/IEC 17025 (IS/ISO/IEC 17025) by NABL.',
        'Testing covers chemical analysis, mechanical strength, electrical safety, microbiological parameters, and environmental durability.'
      ],
      portalUrl: 'https://www.bis.gov.in/laboratories/'
    },
    {
      id: 'consumer',
      title: 'Consumer Empowerment & BIS Care App',
      badge: 'Consumer Protection',
      icon: Smartphone,
      summary: 'Direct digital tools empowering citizens to verify authenticity and report violations.',
      details: [
        'BIS Care Mobile App (available on Android & iOS): Scan ISI mark, verify CM/L license number, check HUID code on gold, and verify registration numbers.',
        '"Know Your Standards" (KYS) portal: Allows free viewing of over 22,000 Indian Standards for students, researchers, and public consumers.',
        'Online Complaint & Grievance redressal: Report substandard goods, misuse of ISI/Hallmark, or deceptive quality marks directly to enforcement officers.',
        'Standard Clubs in Schools and Colleges: Fostering quality consciousness among future engineers and consumers.'
      ],
      portalUrl: 'https://www.bis.gov.in/consumer-affairs/'
    }
  ];

  const currentScheme = schemes.find(s => s.id === activeTab) || schemes[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Bureau of Indian Standards — Core Services & Certification Schemes
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Comprehensive guidance for manufacturers, industries, exporters, and consumers on BIS conformity assessment.
        </p>
      </div>

      {/* Scheme Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {schemes.map((scheme) => {
          const Icon = scheme.icon;
          const isActive = activeTab === scheme.id;
          return (
            <button
              key={scheme.id}
              onClick={() => setActiveTab(scheme.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-white' : 'text-blue-600'}`} />
              <div className="text-[11px] font-bold leading-tight">{scheme.title.split('(')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Detailed Scheme Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <currentScheme.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{currentScheme.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {currentScheme.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentScheme.summary}</p>
            </div>
          </div>

          <a
            href={currentScheme.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Manak Online Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Detailed Points */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Key Regulations, Implementation & Compliance Framework:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentScheme.details.map((point, index) => (
              <div
                key={index}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Flow for Industry */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Standard 4-Step Certification Flow for Industry
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-1.5">1</div>
              <div className="text-xs font-bold text-slate-900">Identify IS Code</div>
              <p className="text-[10px] text-slate-500 mt-1">Determine applicable standard & testing parameters.</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-1.5">2</div>
              <div className="text-xs font-bold text-slate-900">Lab & In-house Testing</div>
              <p className="text-[10px] text-slate-500 mt-1">Conduct conformity tests in factory or recognized lab.</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-1.5">3</div>
              <div className="text-xs font-bold text-slate-900">Application & Audit</div>
              <p className="text-[10px] text-slate-500 mt-1">Submit on Manak Online with factory inspection.</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-1.5">4</div>
              <div className="text-xs font-bold text-slate-900">Grant of License</div>
              <p className="text-[10px] text-slate-500 mt-1">Receive CM/L number and affix official ISI/CRS mark.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
