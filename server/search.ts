import { getDb, formatStandardRow, normalizeIsCode } from './db.ts';

export interface SearchOptions {
  category?: string;
  industry?: string;
  page?: number;
  pageSize?: number;
}

export function detectIsCodeFromQuery(query: string): {
  hasCode: boolean;
  rawMatch?: string;
  normalized?: string;
  numeric?: string;
} {
  if (!query) return { hasCode: false };
  const trimmed = query.trim();

  // Pattern for IS codes:
  // e.g., "IS 456", "IS-456", "IS456", "IS 456:2000", "is 10262", "IS 875 (Part 1)", "IS 999999"
  const isRegex = /\b(?:is)[\s\-_]*([0-9]{1,10})(?:\s*[:\-]\s*[0-9]{4})?/i;
  const match = trimmed.match(isRegex);

  if (match) {
    const rawMatch = match[0];
    const numeric = match[1];
    const normalized = `is${numeric}`;
    return {
      hasCode: true,
      rawMatch,
      normalized,
      numeric
    };
  }

  // Also check if the query is just a number (e.g. "456" or "800")
  if (/^[0-9]{2,10}$/.test(trimmed)) {
    return {
      hasCode: true,
      rawMatch: trimmed,
      normalized: `is${trimmed}`,
      numeric: trimmed
    };
  }

  return { hasCode: false };
}

export function executeStandardsSearch(rawQuery: string, options: SearchOptions = {}) {
  const startTime = Date.now();
  const db = getDb();
  const query = rawQuery ? rawQuery.trim() : '';
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize || 20));

  if (!query) {
    // Return standard paginated list
    const offset = (page - 1) * pageSize;
    let countSql = 'SELECT COUNT(*) as count FROM standards';
    let sql = 'SELECT * FROM standards';
    const params: any[] = [];

    if (options.category && options.category !== 'All') {
      countSql += ' WHERE category = ?';
      sql += ' WHERE category = ?';
      params.push(options.category);
    }

    sql += ' ORDER BY id ASC LIMIT ? OFFSET ?';
    const total = (db.prepare(countSql).get(...params) as any).count;
    const rows = db.prepare(sql).all(...params, pageSize, offset);

    return {
      query,
      detectedCode: null,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      results: rows.map(formatStandardRow),
      executionTimeMs: Date.now() - startTime
    };
  }

  const codeDetection = detectIsCodeFromQuery(query);
  const detectedCode = codeDetection.hasCode ? codeDetection.normalized : null;
  const numericCode = codeDetection.numeric;

  const scoreMap = new Map<number, { row: any; score: number; matchType: string }>();

  // 1. Tier 1: Check Exact / Normalized Code Match
  if (detectedCode || numericCode) {
    const codeRows = db.prepare(`
      SELECT * FROM standards 
      WHERE code_normalized = ? OR numeric_code = ? OR standard_number LIKE ?
    `).all(detectedCode || '', numericCode || '', `%${codeDetection.rawMatch || query}%`);

    for (const row of codeRows as any[]) {
      let score = 100;
      if (row.numeric_code === numericCode) {
        score = 110; // exact numeric hit
      }
      scoreMap.set(row.id, { row, score, matchType: 'exact_code' });
    }
  }

  // 2. Tier 2: FTS5 Full-Text Search
  // Prepare sanitized search terms for SQLite FTS5, omitting noise words and 'is'
  const stopWords = new Set(['is', 'the', 'and', 'for', 'about', 'what', 'which', 'tell', 'show', 'me', 'clause', 'code', 'standard', 'standards', 'indian']);
  const sanitized = query
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(t => t.length > 1 && !stopWords.has(t.toLowerCase()));

  // If the query was an explicit IS code query (e.g. "IS 999999") and no matching code exists,
  // do not return unrelated standards via loose text search
  const isPureCodeLookup = Boolean(codeDetection.hasCode && (
    query.trim().length <= (codeDetection.rawMatch?.length || 0) + 3 ||
    /^(?:what is|tell me about|scope of|clause for|is|standard)\s+/i.test(query)
  ));

  if (sanitized.length > 0 && !(isPureCodeLookup && scoreMap.size === 0)) {
    try {
      // Create FTS query with prefix wildcard, e.g. "concrete* OR reinforced*"
      const ftsQuery = sanitized.map(t => `"${t}"*`).join(' OR ');
      const ftsSql = `
        SELECT standards.*, rank 
        FROM standards_fts 
        JOIN standards ON standards.id = standards_fts.rowid 
        WHERE standards_fts MATCH ?
        ORDER BY rank 
        LIMIT 50
      `;
      const ftsRows = db.prepare(ftsSql).all(ftsQuery) as any[];

      for (const row of ftsRows) {
        const existing = scoreMap.get(row.id);
        // SQLite FTS5 rank is negative (lower = better), e.g. -5.2
        const ftsScore = Math.max(30, Math.min(85, Math.round(75 - (row.rank || 0) * 5)));
        if (!existing) {
          scoreMap.set(row.id, { row, score: ftsScore, matchType: 'fts_fulltext' });
        } else {
          existing.score = Math.max(existing.score, ftsScore + 15);
        }
      }
    } catch {
      // Fall through to LIKE search if FTS syntax edge case occurs
    }
  }

  // 3. Tier 3: LIKE search across Title, Keywords, Category
  if (!(isPureCodeLookup && scoreMap.size === 0)) {
    const likeTokens = query.split(/\s+/).filter(t => t.length > 2 && !stopWords.has(t.toLowerCase()));
    for (const token of likeTokens) {
      const likeRows = db.prepare(`
        SELECT * FROM standards 
        WHERE title LIKE ? OR keywords LIKE ? OR scope LIKE ?
        LIMIT 30
      `).all(`%${token}%`, `%${token}%`, `%${token}%`) as any[];

      for (const row of likeRows) {
        const existing = scoreMap.get(row.id);
        let likeScore = 40;
        if (row.title.toLowerCase().includes(token.toLowerCase())) {
          likeScore = 65;
        }
        if (existing) {
          existing.score += 15;
        } else {
          scoreMap.set(row.id, { row, score: likeScore, matchType: 'keyword' });
        }
      }
    }
  }

  // Filter by category if requested
  let allMatches = Array.from(scoreMap.values());
  if (options.category && options.category !== 'All') {
    allMatches = allMatches.filter(item => item.row.category === options.category);
  }

  // Sort by score descending
  allMatches.sort((a, b) => b.score - a.score);

  const total = allMatches.length;
  const offset = (page - 1) * pageSize;
  const pagedItems = allMatches.slice(offset, offset + pageSize).map(item => {
    const formatted = formatStandardRow(item.row);
    return {
      ...formatted,
      relevanceScore: item.score,
      matchType: item.matchType
    };
  });

  return {
    query,
    detectedCode,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    results: pagedItems,
    executionTimeMs: Date.now() - startTime
  };
}
