# BIS Standards Intelligent Assistant
> **Smart India Hackathon Problem Statement**: AI-powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers

An enterprise-grade, full-stack web application designed to recognize, search, and synthesize reliable technical specifications across thousands of **Indian Standards (IS)** published by the **Bureau of Indian Standards (BIS)**.

---

## Key Features

1. **Intelligent Search & Recognition**:
   - Sub-10ms full-text and IS code search using SQLite FTS5 with BM25 relevance ranking.
   - Normalizes all standard input variations (`IS 456`, `is-456`, `is456`, `456`, `IS 456:2000`).
   - Supports natural language discovery (e.g., *"standard for structural steel design"* -> `IS 800`).

2. **Strict Anti-Hallucination Architecture**:
   - Enforces the **7 BIS Anti-Hallucination Mandates**: Never invents IS numbers, titles, clauses, test methods, or certification requirements.
   - Rejects unverified or fabricated codes (e.g. `IS 999999`) with an immediate unverified warning and links to official BIS portals.
   - Strict retrieval-augmented generation (RAG) grounding with verified metadata before synthesis.

3. **Resilient Multi-Model Gemini Integration**:
   - Server-side AI synthesis powered by `@google/genai`.
   - Multi-model fallback cascade (`gemini-3.6-flash`, `gemini-flash-latest`, `gemini-3.1-flash-lite`, `gemini-3.8-flash`) to ensure 99.9% uptime during API demand spikes.
   - Deterministic offline database fallback if no API key is provided or if network is unavailable.

4. **Scalable Standards Knowledge Base**:
   - Built to handle tens of thousands of standards.
   - Built-in CSV and JSON bulk dataset ingestion pipeline with schema validation and duplicate detection.
   - One-click export of the entire knowledge base to JSON.

5. **Comprehensive Module Views**:
   - **Assistant**: Natural language conversational interface with comparison tables and source verification badges.
   - **Data Sources & Provenance**: Dedicated transparency portal auditing all official government data channels and sectional committees.
   - **Browse Standards**: Category and industry-filtered directory.
   - **BIS Services**: Information on ISI Mark, Compulsory Registration Scheme (CRS), Hallmarking, and grievance portals.
   - **Analytics Dashboard**: Sectoral distribution metrics and search trends.
   - **Dataset Ingestion**: Bulk CSV/JSON import and export utilities.
   - **Test Suite**: Automated 12-point verification suite testing all hackathon evaluation criteria.

---

## Official Data Sources & Provenance

To maintain absolute fidelity and comply with the **7 BIS Anti-Hallucination Mandates**, the system accesses data exclusively from official Government of India bodies and statutory Bureau of Indian Standards repositories:

1. **Bureau of Indian Standards (BIS) Official Portal & e-Sale Catalog** ([services.bis.gov.in](https://www.services.bis.gov.in/) & [standardsbis.bsbedge.com](https://standardsbis.bsbedge.com/))
   - *Data Accessed:* Standard alphanumeric identifiers (`IS 456`, `IS 800`), canonical titles, publication years, revisions, reaffirmations, and active amendments.
2. **BIS "Know Your Standards" (KYS) Electronic Repository** ([services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards](https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails))
   - *Data Accessed:* Scope definitions, technical abstracts, sampling norms, and normative cross-references.
3. **Manakonline Portal (e-BIS Unified Standards System)** ([manakonline.in](https://www.manakonline.in/))
   - *Data Accessed:* Sectional Technical Committees (CED, ETD, FAD, PCD, MED, MTD, TED, TXD) and Product Certification Schemes (Scheme I - ISI Mark, Scheme II - CRS).
4. **The Gazette of India — Quality Control Orders (QCOs)** ([egazette.gov.in](https://egazette.gov.in/) / [consumeraffairs.nic.in](https://consumeraffairs.nic.in/))
   - *Data Accessed:* Statutory notifications enforcing mandatory BIS certification for domestic manufacturers and importers.
5. **BIS Care Portal & Licence Verification System** ([bis.gov.in](https://www.bis.gov.in/consumer-affairs/bis-care-app/))
   - *Data Accessed:* Consumer grievance redressal guidelines and ISI / Hallmarking licensee verification data.
6. **National Building Code of India (NBC) & CPWD Specifications** ([cpwd.gov.in](https://cpwd.gov.in/))
   - *Data Accessed:* Mandatory construction, concrete mix design, structural steel, and civic engineering standards.

---

## Prerequisites

- **Node.js**: Version **22.5.0 or higher** (uses native `node:sqlite` for zero native-addon build requirements).
- **npm**: Version 10 or higher.
- **Gemini API Key** *(Optional)*: If omitted, the assistant operates with deterministic database-verified responses.

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/bis-standards-intelligent-assistant.git
cd bis-standards-intelligent-assistant
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API key (optional but recommended for natural language conversational synthesis):
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at:
```
http://localhost:3000
```

---

## Production Build & Deployment

To compile and run in production mode:

```bash
# 1. Build frontend and backend bundles
npm run build

# 2. Start production server
npm start
```

---

## Running Automated Verification Tests

The application includes an automated 12-point test runner that verifies:
- Valid IS code exact retrieval (`IS 456`)
- Invalid IS code rejection and anti-hallucination gating (`IS 999999`)
- Flexible formatting variations (`IS-456`, `is456`, `456`)
- Semantic natural language queries (`"standard for structural steel design"`)
- Empty input resilience
- Standard details and committee retrieval (`IS 800`)
- Cross-referenced related standards linkage
- Dataset import schema enforcement
- Duplicate standard detection
- AI anti-hallucination guard against invented clauses
- Clean HTTP 404 error responses
- Sub-50ms search SLA execution

You can run the tests by:
1. Navigating to the **Test Suite** tab in the web application UI.
2. Or querying the automated test runner endpoint directly:
```bash
curl http://localhost:3000/api/test-runner
```

---

## REST API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check and service status |
| `GET` | `/api/search?q=:query` | Fast full-text and IS code search with relevance scoring |
| `GET` | `/api/standards` | Paginated list of standards with category filtering |
| `GET` | `/api/standards/:code` | Single standard technical details by code or ID |
| `GET` | `/api/standards/:code/related` | Cross-referenced standards relationships |
| `GET` | `/api/categories` | Dynamic categories with count breakdown |
| `GET` | `/api/industries` | Dynamic industries with count breakdown |
| `GET` | `/api/dashboard` | Aggregated metrics and database statistics |
| `POST` | `/api/chat` | RAG intelligent assistant query with anti-hallucination gate |
| `POST` | `/api/import` | Ingest CSV or JSON standards dataset |
| `GET` | `/api/export` | Download full standards database as JSON |
| `GET` | `/api/test-runner` | Execute automated 12-test validation suite |

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Backend**: Express 4, Node.js v22 (`node:sqlite` WAL mode, SQLite FTS5).
- **AI / LLM**: Google Gemini API via `@google/genai` with multi-model fallback.
- **Bundler & Tooling**: Vite 6, esbuild, tsx.
