# Project Analyzer — Backend

A production-quality **FastAPI** backend that powers the Project Analyzer career advisor.

## What it does

1. Accepts a job search query (title + location + date filter)
2. Fetches **real** job listings from the [JSearch API (RapidAPI)](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
3. Runs each job description through an **LLM** (Google Gemini or OpenAI) **concurrently**
4. Returns enriched results: `tech_stack`, `core_problem`, and a tailored `project_idea`
5. Caches results (TTL-based) so repeat searches are instant

---

## Architecture

```
backend/
├── main.py                        # Uvicorn entry point
├── requirements.txt
├── .env.example                   # Copy to .env and fill in your keys
└── app/
    ├── application.py             # FastAPI factory (CORS, lifespan, error handlers)
    ├── core/
    │   ├── config.py              # pydantic-settings — single source of truth
    │   ├── exceptions.py          # Custom exception hierarchy
    │   └── logging.py             # Structured logging via structlog
    ├── models/
    │   └── schemas.py             # Pydantic request/response schemas
    ├── services/
    │   ├── jsearch_service.py     # JSearch (RapidAPI) HTTP client + retries
    │   ├── ai_service.py          # LLM abstraction (Gemini / OpenAI)
    │   └── job_orchestrator.py    # Pipeline: fetch → analyse → cache → return
    ├── cache/
    │   └── memory_cache.py        # Thread-safe TTL cache (cachetools)
    └── api/
        ├── deps.py                # FastAPI dependency injectors
        └── v1/
            └── routes/
                └── jobs.py        # Route handlers
```

### Key design patterns

| Pattern | Where used |
|---|---|
| **Factory** | `create_app()` in `application.py` — clean test/prod separation |
| **Singleton** | `get_orchestrator()` — one pipeline instance per process |
| **Strategy** | `BaseAIProvider` → `GeminiProvider` / `OpenAIProvider` |
| **Dependency Injection** | FastAPI `Depends(orchestrator_dep)` in route handlers |
| **Repository / Adapter** | `JSearchService` isolates the HTTP client from business logic |
| **Semaphore** | Caps concurrent AI calls (`AI_CONCURRENCY_LIMIT`) |
| **TTL Cache** | `InMemoryCache` wraps `cachetools.TTLCache` with a thread lock |
| **Retry** | `tenacity` decorators on HTTP + AI calls (3 attempts, exponential backoff) |

---

## Quick start

### 1. Prerequisites

- Python **3.12 or 3.13** (not 3.14 — pydantic-core doesn't support it yet)
- A [RapidAPI](https://rapidapi.com) account → subscribe to **JSearch** (free tier available)
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey) **OR** an **OpenAI API key**

### 2. Set up the environment

```bash
cd backend
python3.13 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure secrets

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
JSEARCH_API_KEY=your_rapidapi_key
AI_PROVIDER=gemini          # or "openai"
GEMINI_API_KEY=your_key     # if using Gemini
OPENAI_API_KEY=your_key     # if using OpenAI
```

### 4. Run the server

```bash
uvicorn main:app --reload --port 8000
```

The API is now live at **http://localhost:8000**.  
Interactive docs: **http://localhost:8000/docs**

---

## API reference

### `POST /api/v1/generate-projects`

Primary endpoint — full pipeline.

**Request body:**
```json
{
  "job_title": "Senior React Developer",
  "location": "San Francisco",
  "date_posted": "7d"
}
```
`date_posted` options: `"anytime"` | `"24h"` | `"7d"` | `"30d"`

**Response:**
```json
{
  "success": true,
  "total": 3,
  "message": "Found 3 job listings.",
  "data": [
    {
      "id": "abc123",
      "job_title": "Senior React Developer",
      "company": "Acme Corp",
      "url": "https://...",
      "location": "San Francisco, CA",
      "posted_date": "2026-04-24",
      "description": "...",
      "analysis": {
        "tech_stack": ["React", "TypeScript", "GraphQL"],
        "core_problem": "Build a real-time dashboard...",
        "project_idea": "Create a live data visualization tool..."
      }
    }
  ]
}
```

### `POST /api/v1/jobs/search`

Alias for `generate-projects` — same request/response shape.

### `GET /api/v1/health`

Liveness probe. Returns `{"status": "ok"}`.

---

## Environment variables reference

| Variable | Default | Description |
|---|---|---|
| `JSEARCH_API_KEY` | *(required)* | RapidAPI key for JSearch |
| `AI_PROVIDER` | `gemini` | `gemini` or `openai` |
| `GEMINI_API_KEY` | *(required if Gemini)* | Google AI Studio key |
| `OPENAI_API_KEY` | *(required if OpenAI)* | OpenAI platform key |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model name |
| `GEMINI_MODEL` | `gemini-1.5-flash` | Gemini model name |
| `ALLOWED_ORIGINS` | `http://localhost:5173,...` | Comma-separated CORS origins |
| `AI_CONCURRENCY_LIMIT` | `5` | Max concurrent AI calls |
| `CACHE_TTL_SECONDS` | `600` | Cache expiry in seconds |
| `CACHE_MAX_SIZE` | `128` | Max cached entries |
| `JSEARCH_MAX_RESULTS` | `10` | Max jobs fetched per search |
| `LOG_LEVEL` | `INFO` | `DEBUG` / `INFO` / `WARNING` |

---

## Connecting the frontend

Update `src/features/jobs/api/jobsApi.js` to call this backend instead of the mock data:

```js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchJobs = async ({ jobTitle, location, datePosted }) => {
  const res = await fetch(`${API_BASE}/api/v1/generate-projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job_title: jobTitle,
      location,
      date_posted: datePosted,
    }),
  });
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
};
```

Then set `VITE_API_URL=https://your-backend.onrender.com` in the frontend `.env`.

---

## Deployment (Render)

1. Push to GitHub
2. Create a **New Web Service** on [Render](https://render.com)
3. Set **Build Command:** `pip install -r requirements.txt`
4. Set **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add all env vars from `.env.example` in the Render dashboard
6. Update `ALLOWED_ORIGINS` to include your Vercel/Firebase frontend URL

