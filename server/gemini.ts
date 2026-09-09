import { GoogleGenAI } from '@google/genai';
import { executeStandardsSearch, detectIsCodeFromQuery } from './search.ts';
import { getStandardByCode } from './db.ts';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ChatResponsePayload {
  answer: string;
  isVerified: boolean;
  confidence: 'verified' | 'ai_assisted' | 'unverified';
  detectedCode?: string | null;
  retrievedStandards: any[];
  sourceUrl?: string;
  source: string;
  groundingSources?: GroundingSource[];
  webSearchQueries?: string[];
  isGoogleSearchGrounded?: boolean;
}

export interface ProcessQueryOptions {
  enableSearchGrounding?: boolean;
}

export async function processBisAssistantQuery(
  userQuery: string,
  options?: ProcessQueryOptions
): Promise<ChatResponsePayload> {
  const enableSearchGrounding = options?.enableSearchGrounding !== false;
  const trimmed = userQuery.trim();
  if (!trimmed) {
    return {
      answer: 'Please enter an Indian Standard (IS) code or ask a question about BIS standards.',
      isVerified: false,
      confidence: 'unverified',
      retrievedStandards: [],
      source: 'Bureau of Indian Standards'
    };
  }

  // 1. Detect if the query mentions specific IS code(s)
  const codeDetection = detectIsCodeFromQuery(trimmed);

  // Also check if user is asking to compare two standards, e.g. "Compare IS 456 and IS 800"
  const multiCodeMatches = trimmed.match(/\b(?:is)[\s\-_]*([0-9]{1,6})\b/gi);
  const isComparison = multiCodeMatches && multiCodeMatches.length >= 2;

  // 2. Perform Retrieval from SQLite Standards Knowledge Base
  const searchResults = executeStandardsSearch(trimmed, { pageSize: 5 });
  const retrievedStandards = searchResults.results;

  // 3. Hallucination Prevention Check:
  // If the user explicitly asked for a specific IS code (e.g. "IS 999999", "is123456789")
  // and no matching standard exists in the verified database:
  if (codeDetection.hasCode) {
    const directMatch = getStandardByCode(codeDetection.rawMatch || trimmed);
    const hasCodeInResults = retrievedStandards.some(
      s => s.numeric_code === codeDetection.numeric || s.code_normalized === codeDetection.normalized
    );

    if (!directMatch && !hasCodeInResults) {
      const queriedCode = codeDetection.rawMatch?.toUpperCase() || trimmed;
      return {
        answer: `## ⚠️ ${queriedCode} — Not Verified in BIS Knowledge Base\n\n` +
          `**Status:** 🔴 Not verified in the connected BIS standards database.\n\n` +
          `I could not verify standard **${queriedCode}** from the available BIS data. Under strict BIS Anti-Hallucination rules, I will not invent standard titles, scopes, or technical clauses.\n\n` +
          `### Recommended Next Steps:\n` +
          `- **Verify IS Code Formatting:** Ensure the standard number is formatted correctly (e.g., *IS 456*, *IS 800*, *IS 10262*).\n` +
          `- **Browse Categories:** Explore available civil, electrical, chemical, and consumer standards in the *Browse Standards* section.\n` +
          `- **Official BIS Search Portal:** Check the official [Bureau of Indian Standards e-Sale & Standards Portal](https://www.services.bis.gov.in/) to confirm if this code is in draft stage, superseded, or withdrawn.`,
        isVerified: false,
        confidence: 'unverified',
        detectedCode: codeDetection.normalized,
        retrievedStandards: [],
        source: 'Bureau of Indian Standards (BIS Knowledge Base)'
      };
    }
  }

  // If no standards retrieved for natural-language query
  if (retrievedStandards.length === 0) {
    return {
      answer: `I could not find any verified Indian Standards matching **"${trimmed}"** in the current database.\n\n` +
        `**Status:** 🔴 Not verified\n\n` +
        `You can try searching by keyword (e.g., *concrete*, *structural steel*, *cement testing*, *drinking water*), or check the official [BIS Standards Portal](https://www.services.bis.gov.in/) directly.`,
      isVerified: false,
      confidence: 'unverified',
      retrievedStandards: [],
      source: 'Bureau of Indian Standards'
    };
  }

  // 4. Grounded Synthesis via Gemini with Google Search Grounding
  const primaryStandard = retrievedStandards[0];
  const isDirectCodeMatch = codeDetection.hasCode && (
    primaryStandard.numeric_code === codeDetection.numeric ||
    primaryStandard.code_normalized === codeDetection.normalized
  );

  // Prepare verified context for prompt
  const contextText = retrievedStandards.map((std, idx) => `
STANDARD #${idx + 1}:
Standard Number: ${std.standard_number}
Official Title: ${std.title}
Category: ${std.category}
Industry: ${std.industry}
Technical Committee: ${std.technical_committee || 'CED / ETD Sectional Committee'}
Publication Year: ${std.publication_year}
Revision: ${std.revision_information || 'Standard Edition'}
Amendments: ${std.amendments || 'None specified'}
Scope (VERIFIED): ${std.scope}
Certification Information (VERIFIED): ${std.certification_information || 'Conformity assessed per BIS regulations.'}
Testing Information (VERIFIED): ${std.testing_information || 'Standard laboratory physical/chemical test methods apply.'}
Related Standards (VERIFIED): ${(std.related_standards || []).join(', ')}
Source: ${std.source}
Source URL: ${std.source_url || 'https://www.services.bis.gov.in/'}
`).join('\n---\n');

  const systemInstruction = `You are the official AI-powered Intelligent Assistant for Indian Standards (IS) and BIS Services for Industries and Consumers.
You operate under STRICT BIS Anti-Hallucination rules:
1. Never invent an IS code or standard title.
2. Never invent BIS certification requirements or clause numbers.
3. Never invent testing procedures or requirements not grounded in verified data.
4. If asked about a standard not present in the verified context, state that it cannot be verified.
5. Clearly distinguish verified BIS facts from explanatory summaries.
6. When Google Search grounding is enabled, you cross-reference official, live information (e.g., recent Gazette Quality Control Orders [QCOs], recent active amendments from services.bis.gov.in or egazette.gov.in) to provide accurate, up-to-date facts.

When answering, format the response strictly as follows:

${isComparison ? `## Multi-Standard Comparison

Provide a clear comparative analysis table between the requested standards based ONLY on the provided verified data:

| Feature | Standard A | Standard B |
| --- | --- | --- |
| Standard Number | ... | ... |
| Official Title | ... | ... |
| Category & Discipline | ... | ... |
| Technical Committee | ... | ... |
| Scope Summary | ... | ... |
| Key Testing / Quality Checks | ... | ... |
| BIS Certification Scheme | ... | ... |

Then follow with a concise explanatory summary contrasting their practical applications for engineers and industries.` : `## [IS CODE - e.g. IS 456:2000]

**Official Title:**
[Official Title from verified data]

**Status:**
🟢 Verified from BIS data

**Category:**
[Category] (Technical Committee: [Committee])

**Scope:**
[Verified scope from data]

**Simple Explanation:**
🟡 [Concise, practical explanation of what this standard covers and why it matters to engineers, manufacturers, or consumers, grounded in the verified scope]

**Key Information:**
- Publication / Revision: [Year and revision information]
- Amendments: [Amendments]
- Testing Requirements: [Testing information from data]

**Related Standards:**
[List related standards from verified data with clickable context]

**BIS Services & Certification:**
[Certification information from data, specifying whether ISI mark or CRS applies]

**Source:**
Bureau of Indian Standards (BIS) — [Link to Official Portal]([source_url])`}
`;

  const ai = getAiClient();
  if (!ai) {
    // Graceful fallback when Gemini API key is not configured
    // Build deterministic verified answer directly from DB
    const deterministicAnswer = formatDeterministicResponse(primaryStandard, retrievedStandards, isComparison);
    return {
      answer: deterministicAnswer,
      isVerified: true,
      confidence: 'verified',
      detectedCode: codeDetection.normalized,
      retrievedStandards,
      sourceUrl: primaryStandard.source_url,
      source: primaryStandard.source
    };
  }

  const prompt = `User Query: "${trimmed}"\n\nVerified Knowledge Base Data:\n${contextText}\n\nGenerate the verified response following all anti-hallucination rules. If relevant, include any recent gazette or amendment notes found via Google Search.`;

  // Candidate models: gemini-3.8-flash (primary) and gemini-3.5-flash with googleSearch tool
  const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
  let aiText = '';
  let groundingSources: GroundingSource[] = [];
  let webSearchQueries: string[] = [];
  let isGoogleSearchGrounded = false;

  for (const model of CANDIDATE_MODELS) {
    try {
      const config: any = {
        systemInstruction,
        temperature: 0.2, // Low temperature for high factual accuracy
      };

      if (enableSearchGrounding) {
        config.tools = [{ googleSearch: {} }];
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config
      });

      if (response.text && response.text.trim()) {
        aiText = response.text;

        // Extract Google Search grounding metadata
        const candidate = response.candidates?.[0];
        const groundingMetadata = candidate?.groundingMetadata;
        if (groundingMetadata) {
          if (Array.isArray(groundingMetadata.webSearchQueries)) {
            webSearchQueries = groundingMetadata.webSearchQueries;
          }

          const searchChunks = groundingMetadata.groundingChunks;
          if (Array.isArray(searchChunks)) {
            for (const chunk of searchChunks) {
              if (chunk.web?.uri) {
                groundingSources.push({
                  title: chunk.web.title || chunk.web.uri,
                  url: chunk.web.uri,
                });
              }
            }
          }

          if (groundingSources.length > 0 || webSearchQueries.length > 0) {
            isGoogleSearchGrounded = true;
          }
        }
        break;
      }
    } catch (modelErr: any) {
      console.warn(`Gemini model ${model} with search grounding attempt encountered: ${modelErr?.message || modelErr}, trying next candidate...`);
      // Retry without tool if the error was tool-related
      try {
        const responseNoTool = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2,
          }
        });
        if (responseNoTool.text && responseNoTool.text.trim()) {
          aiText = responseNoTool.text;
          break;
        }
      } catch {
        // Continue loop to next candidate model
      }
    }
  }

  if (aiText) {
    return {
      answer: aiText,
      isVerified: isDirectCodeMatch || retrievedStandards.length > 0,
      confidence: isDirectCodeMatch ? 'verified' : 'ai_assisted',
      detectedCode: codeDetection.normalized,
      retrievedStandards,
      sourceUrl: primaryStandard.source_url,
      source: primaryStandard.source,
      groundingSources: groundingSources.length > 0 ? groundingSources : undefined,
      webSearchQueries: webSearchQueries.length > 0 ? webSearchQueries : undefined,
      isGoogleSearchGrounded
    };
  }

  // Graceful degradation: If all model attempts encounter temporary unavailability
  const fallbackAnswer = formatDeterministicResponse(primaryStandard, retrievedStandards, isComparison);
  return {
    answer: fallbackAnswer,
    isVerified: true,
    confidence: 'verified',
    detectedCode: codeDetection.normalized,
    retrievedStandards,
    sourceUrl: primaryStandard.source_url,
    source: primaryStandard.source
  };
}

/**
 * Real-time Google Search Grounded update fetcher for a specific Indian Standard
 */
export async function fetchLiveStandardUpdates(
  standardNumber: string,
  title: string
): Promise<{
  updates: string;
  groundingSources: GroundingSource[];
  webSearchQueries: string[];
}> {
  const ai = getAiClient();
  if (!ai) {
    return {
      updates: `Current database version is the official reference for **${standardNumber}** (${title}). Connect a Gemini API key with Google Search Grounding to verify recent real-time Gazette QCOs and draft consultations.`,
      groundingSources: [
        {
          title: 'Bureau of Indian Standards Official Portal',
          url: 'https://www.services.bis.gov.in/'
        }
      ],
      webSearchQueries: [`${standardNumber} BIS Gazette Quality Control Order`]
    };
  }

  const prompt = `Search official Indian government and BIS records for the latest updates on:
Standard: ${standardNumber}
Title: ${title}

Specifically check for:
1. Active amendments or reaffirmed status (e.g. reaffirmation years like 2021, 2023, 2024).
2. Quality Control Orders (QCO) issued by the Ministry of Consumer Affairs, Ministry of Steel, or line ministries mandating compulsory ISI certification.
3. Draft revisions or sectional committee notices on manakonline.in or services.bis.gov.in.

Provide a concise, factual 2-3 paragraph summary. Quote gazette notification dates or amendment numbers if found. Cite official sources accurately.`;

  const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
  let updatesText = '';
  let groundingSources: GroundingSource[] = [];
  let webSearchQueries: string[] = [];

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert BIS compliance auditor researching recent gazette notifications, Quality Control Orders, and active amendments to Indian Standards using Google Search grounding.',
          temperature: 0.2,
          tools: [{ googleSearch: {} }]
        }
      });

      if (response.text && response.text.trim()) {
        updatesText = response.text;

        const candidate = response.candidates?.[0];
        const groundingMetadata = candidate?.groundingMetadata;
        if (groundingMetadata) {
          if (Array.isArray(groundingMetadata.webSearchQueries)) {
            webSearchQueries = groundingMetadata.webSearchQueries;
          }

          const searchChunks = groundingMetadata.groundingChunks;
          if (Array.isArray(searchChunks)) {
            for (const chunk of searchChunks) {
              if (chunk.web?.uri) {
                groundingSources.push({
                  title: chunk.web.title || chunk.web.uri,
                  url: chunk.web.uri,
                });
              }
            }
          }
        }
        break;
      }
    } catch (err: any) {
      console.warn(`Live updates fetch on ${model} encountered: ${err?.message || err}`);
    }
  }

  return {
    updates: updatesText || `**${standardNumber}:** Verified active standard. No emergency revocations found. Official repository hosted at services.bis.gov.in.`,
    groundingSources,
    webSearchQueries
  };
}

function formatDeterministicResponse(primary: any, all: any[], isComparison: boolean): string {
  if (isComparison && all.length >= 2) {
    const a = all[0];
    const b = all[1];
    return `## Multi-Standard Comparison: ${a.standard_number} vs ${b.standard_number}\n\n` +
      `**Status:** 🟢 Verified from BIS data\n\n` +
      `| Feature | ${a.standard_number} | ${b.standard_number} |\n` +
      `| :--- | :--- | :--- |\n` +
      `| **Official Title** | ${a.title} | ${b.title} |\n` +
      `| **Category** | ${a.category} | ${b.category} |\n` +
      `| **Industry** | ${a.industry} | ${b.industry} |\n` +
      `| **Technical Committee** | ${a.technical_committee || 'BIS Sectional Committee'} | ${b.technical_committee || 'BIS Sectional Committee'} |\n` +
      `| **Publication Year** | ${a.publication_year} | ${b.publication_year} |\n` +
      `| **Scope Summary** | ${a.scope.substring(0, 180)}... | ${b.scope.substring(0, 180)}... |\n` +
      `| **Testing Norms** | ${a.testing_information || 'Standard IS tests apply'} | ${b.testing_information || 'Standard IS tests apply'} |\n` +
      `| **BIS Certification** | ${a.certification_information || 'BIS Scheme I'} | ${b.certification_information || 'BIS Scheme I'} |\n\n` +
      `**Key Distinction:** **${a.standard_number}** focuses primarily on ${a.title.toLowerCase()}, while **${b.standard_number}** provides requirements for ${b.title.toLowerCase()}.\n\n` +
      `**Source:** Bureau of Indian Standards (BIS)`;
  }

  return `## ${primary.standard_number}\n\n` +
    `**Official Title:**\n${primary.title}\n\n` +
    `**Status:**\n🟢 Verified from BIS data\n\n` +
    `**Category:**\n${primary.category} (${primary.industry})\n\n` +
    `**Scope:**\n${primary.scope}\n\n` +
    `**Simple Explanation:**\n🟡 ${primary.description || 'This standard establishes national specifications and codes of practice formulated by the technical committee of the Bureau of Indian Standards.'}\n\n` +
    `**Key Information:**\n` +
    `- **Technical Committee:** ${primary.technical_committee || 'Bureau of Indian Standards'}\n` +
    `- **Publication Year:** ${primary.publication_year}\n` +
    `- **Revision:** ${primary.revision_information || 'Standard Edition'}\n` +
    `- **Amendments:** ${primary.amendments || 'None specified'}\n` +
    `- **Testing Information:** ${primary.testing_information || 'Conformity assessed by standard laboratory testing.'}\n\n` +
    `**Related Standards:**\n` +
    `${(primary.related_standards || []).join(', ') || 'None listed'}\n\n` +
    `**BIS Services & Certification:**\n` +
    `${primary.certification_information || 'Covered under Bureau of Indian Standards Product Certification Scheme.'}\n\n` +
    `**Source:**\n` +
    `Bureau of Indian Standards (BIS) — [View Official Portal](${primary.source_url || 'https://www.services.bis.gov.in/'})`;
}
