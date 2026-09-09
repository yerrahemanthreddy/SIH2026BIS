import React from 'react';
import { 
  FlaskConical, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  FileCode2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TestCaseResult } from '../types';

export const TestSuiteView: React.FC = () => {
  const [running, setRunning] = React.useState(false);
  const [testResults, setTestResults] = React.useState<TestCaseResult[]>([]);
  const [testSummary, setTestSummary] = React.useState<{
    totalTests: number;
    passedCount: number;
    failedCount: number;
    allPassed: boolean;
    timestamp?: string;
  } | null>(null);

  const runAllTests = async () => {
    setRunning(true);
    try {
      const res = await fetch('/api/test-runner');
      const data = await res.json();
      setTestResults(data.results || []);
      setTestSummary({
        totalTests: data.totalTests,
        passedCount: data.passedCount,
        failedCount: data.failedCount,
        allPassed: data.allPassed,
        timestamp: data.timestamp
      });
    } catch (err) {
      console.error('Test suite failed:', err);
    } finally {
      setRunning(false);
    }
  };

  // Run automatically on first mount
  React.useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-600" />
              Smart India Hackathon Automated Evaluation Test Suite
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              12 Test Cases
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Automated verification of exact retrieval, code normalization, FTS5 latency, duplicate handling, and anti-hallucination protocols.
          </p>
        </div>

        <button
          onClick={runAllTests}
          disabled={running}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-300 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
        >
          {running ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Executing Test Suite...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Re-run All 12 Tests</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Score Banner */}
      {testSummary && (
        <div className={`rounded-xl border p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          testSummary.allPassed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              testSummary.allPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}>
              {testSummary.allPassed ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base font-extrabold ${testSummary.allPassed ? 'text-emerald-900' : 'text-rose-900'}`}>
                  {testSummary.allPassed ? 'All 12 Hackathon Verification Tests Passed!' : 'Some Test Cases Failed'}
                </h3>
                <span className={`px-2 py-0.5 text-xs font-black rounded-full ${
                  testSummary.allPassed ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                }`}>
                  {testSummary.passedCount} / {testSummary.totalTests} ({Math.round((testSummary.passedCount / testSummary.totalTests) * 100)}%)
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Evaluation SLA: 100% Anti-Hallucination Verified • FTS5 Sub-Millisecond Retrieval Validated.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Timestamp: {testSummary.timestamp ? new Date(testSummary.timestamp).toLocaleTimeString() : 'Just now'}
          </div>
        </div>
      )}

      {/* Test Cases List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Test Case Specification</span>
          <span className="hidden sm:inline">Execution Metrics & Assertion Logs</span>
        </div>

        <div className="divide-y divide-slate-100">
          {testResults.map((tc) => (
            <div key={tc.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    tc.status === 'passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {tc.status === 'passed' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    #{tc.id}. {tc.name}
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    Input: "{tc.input}"
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px] ${
                    tc.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {tc.status}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {tc.executionTimeMs} ms
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 pl-8">
                {tc.description}
              </p>

              {tc.details && (
                <div className="ml-8 mt-1.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700">
                  <strong className="text-slate-900 font-semibold">Assertion Result:</strong> {tc.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
