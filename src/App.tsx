import React from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeLanding } from './components/HomeLanding';
import { SearchView } from './components/SearchView';
import { ChatAssistantView } from './components/ChatAssistantView';
import { BrowseCategoriesView } from './components/BrowseCategoriesView';
import { CompareView } from './components/CompareView';
import { DashboardView } from './components/DashboardView';
import { BisServicesView } from './components/BisServicesView';
import { DataImportView } from './components/DataImportView';
import { TestSuiteView } from './components/TestSuiteView';
import { AboutView } from './components/AboutView';
import { DataSourcesView } from './components/DataSourcesView';
import { StandardDetailsModal } from './components/StandardDetailsModal';
import { IndianStandard } from './types';
import { Menu, X, Check, Columns3 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = React.useState<string>('home');
  const [totalStandards, setTotalStandards] = React.useState<number>(14);
  const [recentStandards, setRecentStandards] = React.useState<IndianStandard[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [chatPrompt, setChatPrompt] = React.useState<string>('');
  const [selectedStandardCode, setSelectedStandardCode] = React.useState<string | null>(null);
  const [compareList, setCompareList] = React.useState<IndianStandard[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch initial standards stats and recent standards
  React.useEffect(() => {
    fetch('/api/standards?pageSize=6')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (typeof data.total === 'number') setTotalStandards(data.total);
          if (Array.isArray(data.items)) setRecentStandards(data.items);
        }
      })
      .catch(err => console.error('Failed to load initial standards:', err));
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('search');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAi = (prompt: string) => {
    setChatPrompt(prompt);
    setCurrentView('chat');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStandard = (code: string) => {
    setSelectedStandardCode(code);
  };

  const handleAddToCompare = (standard: IndianStandard) => {
    setCompareList(prev => {
      if (prev.some(s => s.standard_number === standard.standard_number)) {
        showToast(`${standard.standard_number} is already in the comparison table.`);
        return prev;
      }
      if (prev.length >= 4) {
        showToast('Maximum 4 standards can be compared simultaneously.');
        return prev;
      }
      showToast(`Added ${standard.standard_number} to comparison table.`);
      return [...prev, standard];
    });
  };

  const handleAddStandardByCode = async (code: string) => {
    try {
      const res = await fetch(`/api/standards/${encodeURIComponent(code)}`);
      if (!res.ok) throw new Error('Standard not found');
      const data = await res.json();
      handleAddToCompare(data);
    } catch {
      showToast(`Could not find standard ${code} to add.`);
    }
  };

  const handleRemoveFromCompare = (code: string) => {
    setCompareList(prev => prev.filter(s => s.standard_number !== code));
    showToast(`Removed ${code} from comparison.`);
  };

  const handleAskAiCompare = (codes: string[]) => {
    handleAskAi(`Compare ${codes.join(' and ')} in detail, explaining their differences and applications`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Enterprise Header */}
      <Header
        totalStandards={totalStandards}
        onNavigate={handleNavigate}
        onQuickSearch={handleQuickSearch}
      />

      {/* Mobile Top Sub-bar */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Menu</span>
        </button>

        <div className="flex items-center gap-2">
          {compareList.length > 0 && (
            <button
              onClick={() => handleNavigate('compare')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Compare ({compareList.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Persistent Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            currentView={currentView}
            onNavigate={handleNavigate}
            totalStandards={totalStandards}
          />
        </div>

        {/* Mobile Flyout Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-xs flex">
            <div className="w-72 bg-slate-900 h-full shadow-2xl overflow-y-auto">
              <div className="p-4 flex items-center justify-between border-b border-slate-800">
                <span className="font-bold text-white text-sm">BIS Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar
                currentView={currentView}
                onNavigate={handleNavigate}
                totalStandards={totalStandards}
              />
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* View Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {currentView === 'home' && (
            <HomeLanding
              onSearch={handleQuickSearch}
              onSelectStandard={handleSelectStandard}
              onNavigate={handleNavigate}
              totalStandards={totalStandards}
              recentStandards={recentStandards}
            />
          )}

          {currentView === 'search' && (
            <SearchView
              initialQuery={searchQuery}
              onSelectStandard={handleSelectStandard}
              onAskAi={handleAskAi}
              onAddToCompare={handleAddToCompare}
            />
          )}

          {currentView === 'chat' && (
            <ChatAssistantView
              initialPrompt={chatPrompt}
              onSelectStandard={handleSelectStandard}
            />
          )}

          {currentView === 'browse' && (
            <BrowseCategoriesView
              onSelectCategory={(cat) => {
                setSearchQuery('');
                setCurrentView('search');
              }}
              onSelectStandard={handleSelectStandard}
            />
          )}

          {currentView === 'compare' && (
            <CompareView
              compareList={compareList}
              onRemoveFromCompare={handleRemoveFromCompare}
              onAddStandardByCode={handleAddStandardByCode}
              onAskAiCompare={handleAskAiCompare}
              onSelectStandard={handleSelectStandard}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              onSelectStandard={handleSelectStandard}
              onSearchQuery={handleQuickSearch}
            />
          )}

          {currentView === 'services' && (
            <BisServicesView />
          )}

          {currentView === 'sources' && (
            <DataSourcesView
              onNavigate={handleNavigate}
              totalStandards={totalStandards}
            />
          )}

          {currentView === 'import' && (
            <DataImportView
              onImportSuccess={(newTotal) => {
                setTotalStandards(newTotal);
                showToast(`Successfully ingested records! Total standards: ${newTotal}`);
              }}
            />
          )}

          {currentView === 'test-suite' && (
            <TestSuiteView />
          )}

          {currentView === 'about' && (
            <AboutView />
          )}
        </main>
      </div>

      {/* Global Standard Details Modal */}
      {selectedStandardCode && (
        <StandardDetailsModal
          standardCode={selectedStandardCode}
          onClose={() => setSelectedStandardCode(null)}
          onSelectRelated={(code) => setSelectedStandardCode(code)}
          onAskAi={handleAskAi}
          onAddToCompare={handleAddToCompare}
        />
      )}

      {/* Floating Compare Pill (when standards selected) */}
      {compareList.length > 0 && currentView !== 'compare' && (
        <div className="fixed bottom-5 right-5 z-30 animate-in slide-in-from-bottom-5">
          <button
            onClick={() => handleNavigate('compare')}
            className="px-4 py-2.5 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 border border-slate-700 flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105"
          >
            <Columns3 className="w-4 h-4 text-indigo-400" />
            <span>Compare {compareList.length} Standards</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </button>
        </div>
      )}

      {/* Global Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
