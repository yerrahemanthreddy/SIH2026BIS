export interface IndianStandard {
  id: number;
  standard_number: string;      // e.g. "IS 456:2000"
  code_normalized: string;      // e.g. "is456"
  numeric_code: string;         // e.g. "456"
  title: string;                // e.g. "Plain and Reinforced Concrete - Code of Practice"
  scope: string;                // Verified scope
  description?: string;         // Plain language explanation
  category: string;             // e.g. "Civil Engineering"
  industry: string;             // e.g. "Construction & Infrastructure"
  technical_committee?: string; // e.g. "CED 2 (Cement and Concrete)"
  publication_year: number;     // e.g. 2000
  revision_information?: string;// e.g. "Fourth Revision, Reaffirmed 2021"
  amendments?: string;          // e.g. "Amendments 1 through 5 incorporated"
  related_standards: string[];  // e.g. ["IS 875", "IS 10262", "IS 1786", "IS 383"]
  certification_information?: string; // e.g. "Mandatory ISI Certification under QCO"
  testing_information?: string; // e.g. "Requires testing per IS 516 (Strength), IS 4031"
  source: string;               // "Bureau of Indian Standards"
  source_url?: string;          // Official URL
  keywords: string[];           // Array of keywords
  is_verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ConfidenceLevel = 'verified' | 'ai_assisted' | 'unverified';

export interface SearchResultItem extends IndianStandard {
  relevanceScore?: number;
  matchType?: 'exact_code' | 'normalized_code' | 'title' | 'fts_fulltext' | 'keyword';
}

export interface SearchResponse {
  query: string;
  detectedCode?: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  results: SearchResultItem[];
  executionTimeMs: number;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isVerified?: boolean;
  confidence?: ConfidenceLevel;
  detectedCode?: string | null;
  retrievedStandards?: IndianStandard[];
  sourceUrl?: string;
  groundingSources?: GroundingSource[];
  webSearchQueries?: string[];
  isGoogleSearchGrounded?: boolean;
}

export interface CategoryStat {
  category: string;
  count: number;
  iconName?: string;
}

export interface DashboardStats {
  totalStandards: number;
  totalCategories: number;
  totalIndustries: number;
  verifiedCount: number;
  categoryStats: CategoryStat[];
  recentStandards: IndianStandard[];
  popularSearches: { query: string; count: number }[];
  searchHistory: { query: string; timestamp: string; resultsCount: number }[];
  databaseSize: string;
  lastUpdated: string;
}

export interface ImportSummary {
  totalProcessed: number;
  imported: number;
  duplicates: number;
  invalid: number;
  failed: number;
  errors: string[];
  totalInDatabase: number;
}

export type ImportResult = ImportSummary;

export interface TestCaseResult {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  executionTimeMs?: number;
  details?: string;
  input?: string;
}
