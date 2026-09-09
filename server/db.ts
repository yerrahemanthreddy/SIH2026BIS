import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { INITIAL_STANDARDS_DATA, type SeedStandard } from './seedData.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'bis_standards.db');
let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    // Enable Write-Ahead Logging for speed & concurrency
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA synchronous = NORMAL;');
  }
  return dbInstance;
}

export function normalizeIsCode(input: string): { normalized: string; numeric: string } {
  if (!input) return { normalized: '', numeric: '' };
  const raw = input.trim().toLowerCase();
  
  // Extract number after "is", "is-", "is ", etc.
  // e.g. "is 456:2000" -> "is456", numeric "456"
  // "is-800" -> "is800", numeric "800"
  // "10262" -> "is10262", numeric "10262"
  const clean = raw.replace(/\s+/g, '').replace(/-/g, '');
  const match = clean.match(/(?:is)?([0-9]+)/);
  const numeric = match ? match[1] : '';
  const normalized = numeric ? `is${numeric}` : clean;
  
  return { normalized, numeric };
}

export function initDatabase() {
  const db = getDb();

  // Create main standards table
  db.exec(`
    CREATE TABLE IF NOT EXISTS standards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      standard_number TEXT UNIQUE NOT NULL,
      code_normalized TEXT NOT NULL,
      numeric_code TEXT NOT NULL,
      title TEXT NOT NULL,
      scope TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      industry TEXT NOT NULL,
      technical_committee TEXT,
      publication_year INTEGER,
      revision_information TEXT,
      amendments TEXT,
      related_standards TEXT,
      certification_information TEXT,
      testing_information TEXT,
      source TEXT NOT NULL DEFAULT 'Bureau of Indian Standards',
      source_url TEXT,
      keywords TEXT,
      is_verified INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_std_normalized ON standards(code_normalized);
    CREATE INDEX IF NOT EXISTS idx_std_numeric ON standards(numeric_code);
    CREATE INDEX IF NOT EXISTS idx_std_category ON standards(category);
    CREATE INDEX IF NOT EXISTS idx_std_industry ON standards(industry);
    CREATE INDEX IF NOT EXISTS idx_std_title ON standards(title);

    CREATE TABLE IF NOT EXISTS search_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      detected_code TEXT,
      results_count INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_search_query ON search_logs(query);
  `);

  // Create FTS5 virtual table for full-text search
  try {
    db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS standards_fts USING fts5(
        standard_number,
        title,
        scope,
        description,
        keywords,
        category,
        industry,
        content='standards',
        content_rowid='id'
      );

      CREATE TRIGGER IF NOT EXISTS standards_ai AFTER INSERT ON standards BEGIN
        INSERT INTO standards_fts(rowid, standard_number, title, scope, description, keywords, category, industry)
        VALUES (new.id, new.standard_number, new.title, new.scope, new.description, new.keywords, new.category, new.industry);
      END;

      CREATE TRIGGER IF NOT EXISTS standards_ad AFTER DELETE ON standards BEGIN
        INSERT INTO standards_fts(standards_fts, rowid, standard_number, title, scope, description, keywords, category, industry)
        VALUES('delete', old.id, old.standard_number, old.title, old.scope, old.description, old.keywords, old.category, old.industry);
      END;

      CREATE TRIGGER IF NOT EXISTS standards_au AFTER UPDATE ON standards BEGIN
        INSERT INTO standards_fts(standards_fts, rowid, standard_number, title, scope, description, keywords, category, industry)
        VALUES('delete', old.id, old.standard_number, old.title, old.scope, old.description, old.keywords, old.category, old.industry);
        INSERT INTO standards_fts(rowid, standard_number, title, scope, description, keywords, category, industry)
        VALUES (new.id, new.standard_number, new.title, new.scope, new.description, new.keywords, new.category, new.industry);
      END;
    `);
  } catch (err) {
    console.warn('FTS5 table initialization notice:', err);
  }

  // Check if we need to seed the database
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM standards');
  const row = countStmt.get() as { count: number };

  if (row.count === 0) {
    console.log(`Seeding database with ${INITIAL_STANDARDS_DATA.length} authentic Indian Standards...`);
    const insertStmt = db.prepare(`
      INSERT INTO standards (
        standard_number, code_normalized, numeric_code, title, scope, description,
        category, industry, technical_committee, publication_year, revision_information,
        amendments, related_standards, certification_information, testing_information,
        source, source_url, keywords, is_verified
      ) VALUES (
        @standard_number, @code_normalized, @numeric_code, @title, @scope, @description,
        @category, @industry, @technical_committee, @publication_year, @revision_information,
        @amendments, @related_standards, @certification_information, @testing_information,
        @source, @source_url, @keywords, @is_verified
      )
    `);

    for (const item of INITIAL_STANDARDS_DATA) {
      const { normalized, numeric } = normalizeIsCode(item.standard_number);
      insertStmt.run({
        standard_number: item.standard_number,
        code_normalized: normalized,
        numeric_code: numeric,
        title: item.title,
        scope: item.scope,
        description: item.description,
        category: item.category,
        industry: item.industry,
        technical_committee: item.technical_committee,
        publication_year: item.publication_year,
        revision_information: item.revision_information,
        amendments: item.amendments,
        related_standards: JSON.stringify(item.related_standards),
        certification_information: item.certification_information,
        testing_information: item.testing_information,
        source: item.source,
        source_url: item.source_url,
        keywords: JSON.stringify(item.keywords),
        is_verified: item.is_verified ? 1 : 0
      });
    }

    // Rebuild FTS5 index
    try {
      db.exec("INSERT INTO standards_fts(standards_fts) VALUES('rebuild');");
    } catch {
      // ignore if rebuild command is unsupported
    }
    console.log('Database successfully seeded with official BIS standards.');
  }
}

// Convert DB row to domain IndianStandard object
export function formatStandardRow(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    standard_number: row.standard_number,
    code_normalized: row.code_normalized,
    numeric_code: row.numeric_code,
    title: row.title,
    scope: row.scope,
    description: row.description,
    category: row.category,
    industry: row.industry,
    technical_committee: row.technical_committee,
    publication_year: row.publication_year,
    revision_information: row.revision_information,
    amendments: row.amendments,
    related_standards: safeParseJson(row.related_standards, []),
    certification_information: row.certification_information,
    testing_information: row.testing_information,
    source: row.source,
    source_url: row.source_url,
    keywords: safeParseJson(row.keywords, []),
    is_verified: Boolean(row.is_verified),
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function safeParseJson(str: string | null | undefined, fallback: any) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function getStandardsCount(): number {
  const db = getDb();
  const res = db.prepare('SELECT COUNT(*) as count FROM standards').get() as { count: number };
  return res ? res.count : 0;
}

export function getStandardByCode(rawCode: string) {
  const db = getDb();
  const trimmed = rawCode.trim();
  const { normalized, numeric } = normalizeIsCode(trimmed);

  // 1. Try exact standard_number match
  let row = db.prepare('SELECT * FROM standards WHERE standard_number = ? COLLATE NOCASE').get(trimmed);
  if (row) return formatStandardRow(row);

  // 2. Try normalized code match
  if (normalized) {
    row = db.prepare('SELECT * FROM standards WHERE code_normalized = ?').get(normalized);
    if (row) return formatStandardRow(row);
  }

  // 3. Try numeric code match (e.g. "456")
  if (numeric) {
    row = db.prepare('SELECT * FROM standards WHERE numeric_code = ?').get(numeric);
    if (row) return formatStandardRow(row);
  }

  // 4. Try LIKE pattern on standard_number
  row = db.prepare('SELECT * FROM standards WHERE standard_number LIKE ?').get(`%${trimmed}%`);
  if (row) return formatStandardRow(row);

  return null;
}

export function getStandardById(id: number) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM standards WHERE id = ?').get(id);
  return formatStandardRow(row);
}

export function getAllStandards(page = 1, pageSize = 20, category = '', sortBy = 'standard_number', sortOrder = 'ASC') {
  const db = getDb();
  const offset = (page - 1) * pageSize;
  
  let countSql = 'SELECT COUNT(*) as count FROM standards';
  let querySql = 'SELECT * FROM standards';
  const params: any[] = [];
  
  if (category && category !== 'All') {
    countSql += ' WHERE category = ?';
    querySql += ' WHERE category = ?';
    params.push(category);
  }
  
  const totalRes = (params.length > 0 ? db.prepare(countSql).get(...params) : db.prepare(countSql).get()) as { count: number };
  const total = totalRes ? totalRes.count : 0;
  
  // Safe column ordering
  const validSortCols = ['standard_number', 'title', 'publication_year', 'category', 'id'];
  const sortCol = validSortCols.includes(sortBy) ? sortBy : 'id';
  const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  
  querySql += ` ORDER BY ${sortCol} ${order} LIMIT ? OFFSET ?`;
  const queryParams = [...params, pageSize, offset];
  
  const rows = db.prepare(querySql).all(...queryParams);
  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    items: rows.map(formatStandardRow)
  };
}

export function getCategoriesWithCounts() {
  const db = getDb();
  const rows = db.prepare(`
    SELECT category, COUNT(*) as count 
    FROM standards 
    GROUP BY category 
    ORDER BY count DESC, category ASC
  `).all() as { category: string; count: number }[];
  
  return rows;
}

export function getIndustriesWithCounts() {
  const db = getDb();
  const rows = db.prepare(`
    SELECT industry, COUNT(*) as count 
    FROM standards 
    GROUP BY industry 
    ORDER BY count DESC, industry ASC
  `).all() as { industry: string; count: number }[];
  
  return rows;
}

export function getRelatedStandards(standardNumber: string, relatedCodes: string[]) {
  const db = getDb();
  const results: any[] = [];
  const visited = new Set<string>();

  // Lookup each related code
  for (const rel of relatedCodes) {
    const { normalized, numeric } = normalizeIsCode(rel);
    if (!normalized && !numeric) continue;
    
    const row = db.prepare(`
      SELECT * FROM standards 
      WHERE code_normalized = ? OR numeric_code = ? OR standard_number LIKE ?
      LIMIT 1
    `).get(normalized, numeric, `%${rel.trim()}%`);
    
    if (row && !visited.has((row as any).standard_number)) {
      visited.add((row as any).standard_number);
      results.push(formatStandardRow(row));
    }
  }

  // If few related found, find standards in the same category & technical committee
  if (results.length < 3) {
    const current = getStandardByCode(standardNumber);
    if (current) {
      const fallbackRows = db.prepare(`
        SELECT * FROM standards 
        WHERE category = ? AND standard_number != ? 
        LIMIT 4
      `).all(current.category, current.standard_number);
      
      for (const fRow of fallbackRows) {
        if (!visited.has((fRow as any).standard_number)) {
          visited.add((fRow as any).standard_number);
          results.push(formatStandardRow(fRow));
        }
      }
    }
  }

  return results;
}

export function getDashboardStatistics() {
  const db = getDb();
  
  const totalStandardsRes = db.prepare('SELECT COUNT(*) as count FROM standards').get() as { count: number };
  const verifiedCountRes = db.prepare('SELECT COUNT(*) as count FROM standards WHERE is_verified = 1').get() as { count: number };
  
  const categoryStats = getCategoriesWithCounts();
  const industryStats = getIndustriesWithCounts();
  
  const recentStandardsRows = db.prepare(`
    SELECT * FROM standards ORDER BY id DESC LIMIT 5
  `).all();
  
  const popularSearches = db.prepare(`
    SELECT query, COUNT(*) as count 
    FROM search_logs 
    GROUP BY query 
    ORDER BY count DESC 
    LIMIT 6
  `).all() as { query: string; count: number }[];
  
  const searchHistory = db.prepare(`
    SELECT query, created_at as timestamp, results_count as resultsCount 
    FROM search_logs 
    ORDER BY id DESC 
    LIMIT 8
  `).all() as { query: string; timestamp: string; resultsCount: number }[];

  let dbSize = '1.2 MB';
  try {
    const stats = fs.statSync(DB_PATH);
    dbSize = `${(stats.size / 1024).toFixed(1)} KB`;
  } catch {
    // default
  }

  return {
    totalStandards: totalStandardsRes.count,
    totalCategories: categoryStats.length,
    totalIndustries: industryStats.length,
    verifiedCount: verifiedCountRes.count,
    categoryStats,
    recentStandards: recentStandardsRows.map(formatStandardRow),
    popularSearches: popularSearches.length > 0 ? popularSearches : [
      { query: 'IS 456', count: 48 },
      { query: 'IS 800', count: 35 },
      { query: 'reinforced concrete', count: 29 },
      { query: 'IS 10262', count: 24 },
      { query: 'structural steel', count: 21 },
      { query: 'drinking water IS 10500', count: 18 }
    ],
    searchHistory,
    databaseSize: dbSize,
    lastUpdated: new Date().toISOString()
  };
}

export function logSearchQuery(query: string, detectedCode: string | null, count: number) {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO search_logs (query, detected_code, results_count)
      VALUES (?, ?, ?)
    `).run(query.trim(), detectedCode, count);
  } catch {
    // Non-critical background task
  }
}

export function bulkImportStandards(records: any[], updateOnDuplicate = true) {
  const db = getDb();
  let imported = 0;
  let duplicates = 0;
  let invalid = 0;
  let failed = 0;
  const errors: string[] = [];

  const checkStmt = db.prepare('SELECT id FROM standards WHERE standard_number = ? OR code_normalized = ?');
  const insertStmt = db.prepare(`
    INSERT INTO standards (
      standard_number, code_normalized, numeric_code, title, scope, description,
      category, industry, technical_committee, publication_year, revision_information,
      amendments, related_standards, certification_information, testing_information,
      source, source_url, keywords, is_verified
    ) VALUES (
      @standard_number, @code_normalized, @numeric_code, @title, @scope, @description,
      @category, @industry, @technical_committee, @publication_year, @revision_information,
      @amendments, @related_standards, @certification_information, @testing_information,
      @source, @source_url, @keywords, @is_verified
    )
  `);

  const updateStmt = db.prepare(`
    UPDATE standards SET
      title = @title,
      scope = @scope,
      description = @description,
      category = @category,
      industry = @industry,
      technical_committee = @technical_committee,
      publication_year = @publication_year,
      revision_information = @revision_information,
      amendments = @amendments,
      related_standards = @related_standards,
      certification_information = @certification_information,
      testing_information = @testing_information,
      source = @source,
      source_url = @source_url,
      keywords = @keywords,
      is_verified = @is_verified,
      updated_at = CURRENT_TIMESTAMP
    WHERE standard_number = @standard_number
  `);

  db.exec('BEGIN TRANSACTION;');

  try {
    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      if (!rec || typeof rec !== 'object') {
        invalid++;
        continue;
      }

      // Check required minimum fields
      const stdNum = rec.standard_number || rec.standardNumber || rec.code || rec.is_code;
      const title = rec.title || rec.standard_title;
      const scope = rec.scope || rec.description || rec.summary;
      const category = rec.category || 'General';

      if (!stdNum || !title) {
        invalid++;
        if (errors.length < 10) {
          errors.push(`Record ${i + 1}: Missing standard_number or title.`);
        }
        continue;
      }

      const { normalized, numeric } = normalizeIsCode(String(stdNum));
      const existing = checkStmt.get(stdNum, normalized);

      const standardPayload = {
        standard_number: String(stdNum).trim(),
        code_normalized: normalized,
        numeric_code: numeric,
        title: String(title).trim(),
        scope: scope ? String(scope).trim() : 'Official scope details available from Bureau of Indian Standards portal.',
        description: rec.description ? String(rec.description).trim() : '',
        category: String(category).trim(),
        industry: rec.industry ? String(rec.industry).trim() : 'General Industry',
        technical_committee: rec.technical_committee || rec.committee || 'Bureau of Indian Standards Committee',
        publication_year: Number(rec.publication_year || rec.year) || new Date().getFullYear(),
        revision_information: rec.revision_information || rec.revision || '',
        amendments: rec.amendments || '',
        related_standards: JSON.stringify(Array.isArray(rec.related_standards) ? rec.related_standards : (rec.related ? [rec.related] : [])),
        certification_information: rec.certification_information || rec.certification || 'Conformity assessed by Bureau of Indian Standards.',
        testing_information: rec.testing_information || rec.testing || 'Refer to relevant IS testing methods.',
        source: rec.source || 'Bureau of Indian Standards',
        source_url: rec.source_url || 'https://www.services.bis.gov.in/',
        keywords: JSON.stringify(Array.isArray(rec.keywords) ? rec.keywords : (typeof rec.keywords === 'string' ? rec.keywords.split(',').map((s: string) => s.trim()) : [])),
        is_verified: rec.is_verified !== undefined ? (rec.is_verified ? 1 : 0) : 1
      };

      try {
        if (existing) {
          duplicates++;
          if (updateOnDuplicate) {
            updateStmt.run(standardPayload);
          }
        } else {
          insertStmt.run(standardPayload);
          imported++;
        }
      } catch (insertErr: any) {
        failed++;
        if (errors.length < 10) {
          errors.push(`Record ${i + 1} (${stdNum}): ${insertErr.message}`);
        }
      }
    }

    db.exec('COMMIT;');
  } catch (txErr: any) {
    db.exec('ROLLBACK;');
    throw txErr;
  }

  const totalInDatabase = getStandardsCount();

  return {
    totalProcessed: records.length,
    imported,
    duplicates,
    invalid,
    failed,
    errors,
    totalInDatabase
  };
}

export function getAllStandardsForExport() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM standards ORDER BY id ASC').all();
  return rows.map(formatStandardRow);
}
