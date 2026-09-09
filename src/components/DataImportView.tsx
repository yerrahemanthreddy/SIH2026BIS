import React from 'react';
import { 
  UploadCloud, 
  FileText, 
  Database, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  Copy, 
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { ImportResult } from '../types';

interface DataImportViewProps {
  onImportSuccess: (totalInDb: number) => void;
}

export const DataImportView: React.FC<DataImportViewProps> = ({ onImportSuccess }) => {
  const [activeMode, setActiveMode] = React.useState<'json' | 'csv'>('json');
  const [inputText, setInputText] = React.useState('');
  const [updateOnDuplicate, setUpdateOnDuplicate] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [importResult, setImportResult] = React.useState<ImportResult | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const sampleJsonTemplate = `[
  {
    "standard_number": "IS 16046:2018",
    "title": "Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes - Safety Requirements for Portable Sealed Secondary Cells",
    "scope": "Specifies requirements and tests for the safe operation of portable sealed secondary cells and batteries (such as lithium-ion battery packs).",
    "description": "Critical standard for smartphone, laptop, and electric vehicle battery safety under BIS Compulsory Registration Scheme.",
    "category": "Electrotechnical",
    "industry": "Electronics & Energy Storage",
    "technical_committee": "ETD 11 Secondary Cells and Batteries",
    "publication_year": 2018,
    "revision_information": "Second Revision",
    "amendments": "Corrigendum 1",
    "related_standards": ["IS 13252", "IS 16047"],
    "certification_information": "Mandatory under BIS Compulsory Registration Scheme (CRS) for all portable electronics.",
    "testing_information": "Thermal abuse, altitude simulation, external short-circuit, overcharge, and mechanical crush testing.",
    "source": "Bureau of Indian Standards",
    "source_url": "https://www.services.bis.gov.in/",
    "keywords": ["battery", "lithium", "cells", "portable", "safety", "CRS"]
  }
]`;

  const sampleCsvTemplate = `standard_number,title,scope,category,industry,publication_year,related_standards,keywords
"IS 14543:2024","Packaged Drinking Water (Other Than Packaged Natural Mineral Water) - Specification","Prescribes requirements and methods of sampling and test for packaged drinking water other than packaged natural mineral water.","Chemical","Food & Beverages",2024,"IS 10500; IS 3025","water; packaged; drinking; mineral; quality"
"IS 15410:2003","Containers for Packaging of Natural Mineral Water and Packaged Drinking Water - Specification","Specifies requirements for food grade PET and polyolefin containers.","Plastics","Packaging",2003,"IS 14543","bottles; packaging; plastic; PET; containers"`;

  const handleSetTemplate = () => {
    setInputText(activeMode === 'json' ? sampleJsonTemplate : sampleCsvTemplate);
    setErrorMessage(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileRead(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileRead(e.target.files[0]);
    }
  };

  const handleFileRead = (file: File) => {
    const isCsv = file.name.endsWith('.csv');
    setActiveMode(isCsv ? 'csv' : 'json');
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      setErrorMessage(null);
    };
    reader.readAsText(file);
  };

  const handleRunImport = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please provide JSON or CSV data in the input box or upload a file.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setImportResult(null);

    try {
      let payload: any;
      if (activeMode === 'json') {
        try {
          const parsed = JSON.parse(inputText);
          payload = { records: Array.isArray(parsed) ? parsed : [parsed], updateOnDuplicate };
        } catch (jsonErr: any) {
          throw new Error(`JSON syntax error: ${jsonErr.message}`);
        }
      } else {
        payload = { csvData: inputText, updateOnDuplicate };
      }

      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result: ImportResult = await res.json();
      if (!res.ok) {
        throw new Error((result as any).error || 'Data import failed on server.');
      }

      setImportResult(result);
      if (result.totalInDatabase) {
        onImportSuccess(result.totalInDatabase);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const content = activeMode === 'json' ? sampleJsonTemplate : sampleCsvTemplate;
    const filename = activeMode === 'json' ? 'bis_standards_template.json' : 'bis_standards_template.csv';
    const mime = activeMode === 'json' ? 'application/json' : 'text/csv';

    const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            Admin & Data Ingestion Pipeline
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Scalable ingestion engine supporting thousands of Indian Standards via JSON or CSV datasets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/export"
            download
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export Entire DB (JSON)
          </a>
        </div>
      </div>

      {/* Ingestion Results Alert */}
      {importResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            Ingestion Batch Complete! Database is updated and FTS5 search index rebuilt.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
              <span className="text-slate-500 font-medium">Processed</span>
              <div className="text-lg font-black text-slate-900">{importResult.totalProcessed}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
              <span className="text-emerald-700 font-medium">Newly Imported</span>
              <div className="text-lg font-black text-emerald-700">{importResult.imported}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
              <span className="text-amber-700 font-medium">Duplicates Updated</span>
              <div className="text-lg font-black text-amber-700">{importResult.duplicates}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
              <span className="text-blue-700 font-medium">Total Standards in DB</span>
              <div className="text-lg font-black text-blue-700">{importResult.totalInDatabase}</div>
            </div>
          </div>

          {importResult.errors && importResult.errors.length > 0 && (
            <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200 space-y-1">
              <div className="font-bold">Errors encountered during ingestion:</div>
              <ul className="list-disc pl-5">
                {importResult.errors.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Import Verification Error
          </div>
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Main Import Interface */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        {/* Mode Selector & Template Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveMode('json');
                setErrorMessage(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'json'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              JSON Format
            </button>
            <button
              onClick={() => {
                setActiveMode('csv');
                setErrorMessage(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'csv'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              CSV Format
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSetTemplate}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              Load Sample Template
            </button>
            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template
            </button>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragOver ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
          }`}
        >
          <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-800">
            Drag & drop dataset file here (.json or .csv)
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            or browse from your local file system
          </p>
          <input
            type="file"
            id="fileUpload"
            accept=".json,.csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="fileUpload"
            className="mt-3 inline-block px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            Browse File
          </label>
        </div>

        {/* Direct Text Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700">
              Paste or Edit Raw {activeMode.toUpperCase()} Payload:
            </label>
            <span className="text-[11px] text-slate-400">
              {inputText.length > 0 ? `${inputText.split('\n').length} lines` : 'Empty'}
            </span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            placeholder={
              activeMode === 'json'
                ? '[\n  {\n    "standard_number": "IS 1234",\n    "title": "...",\n    "scope": "..."\n  }\n]'
                : 'standard_number,title,scope,category\n"IS 1234","Sample Title","Sample Scope","Civil"'
            }
            className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed"
          />
        </div>

        {/* Import Settings & Execution Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={updateOnDuplicate}
              onChange={(e) => setUpdateOnDuplicate(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Update record if standard_number already exists in database (overwrite)</span>
          </label>

          <button
            onClick={handleRunImport}
            disabled={loading || !inputText.trim()}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing & Indexing...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Ingest Into Knowledge Base</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
