# Project Analyzer — Backend (Java Spring Boot)

A production-quality **Spring Boot 3** backend that powers the Project Analyzer career advisor.
This is the Java migration of the original Python FastAPI backend with full feature parity.

## What it does

1. Accepts a job search query (title + location + date filter)
2. Fetches **real** job listings from the [JSearch API (RapidAPI)](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
3. Runs each job description through an **LLM** (Google Gemini or OpenAI) **concurrently**
4. Returns enriched results: `tech_stack`, `core_problem`, and a tailored `project_idea`
5. Caches results (TTL-based) so repeat searches are instant

---

## Architecture

```
backend-java/
├── pom.xml                              # Maven build file (Spring Boot 3.2 + Java 17)
├── .env.example                         # Copy to .env and fill in your keys
└── src/
    ├── main/
    │   ├── java/com/projectanalyzer/
    │   │   ├── ProjectAnalyzerApplication.java  # Spring Boot entry point
    │   │   ├── config/
    │   │   │   ├── AppProperties.java           # @ConfigurationProperties (replaces pydantic-settings)
    │   │   │   ├── CacheConfig.java             # Caffeine TTL cache setup
    │   │   │   ├── CorsConfig.java              # CORS filter
    │   │   │   └── WebClientConfig.java         # WebClient factory
    │   │   ├── exception/
    │   │   │   ├── AppException.java            # Base domain exception
    │   │   │   ├── AIAnalysisException.java     # → HTTP 502
    │   │   │   ├── ConfigurationException.java  # → HTTP 500
    │   │   │   ├── JobFetchException.java        # → HTTP 502
    │   │   │   ├── JobNotFoundException.java     # → HTTP 404
    │   │   │   └── GlobalExceptionHandler.java  # @RestControllerAdvice
    │   │   ├── model/
    │   │   │   ├── ApiResponse.java             # Generic JSON envelope
    │   │   │   ├── JobAnalysis.java             # AI output record
    │   │   │   ├── JobListing.java              # Enriched job record
    │   │   │   └── SearchRequest.java           # Validated inbound payload
    │   │   ├── service/
    │   │   │   ├── ai/
    │   │   │   │   ├── AIProvider.java          # Strategy interface
    │   │   │   │   ├── GeminiAIProvider.java    # Google Gemini implementation
    │   │   │   │   ├── OpenAIProvider.java      # OpenAI implementation
    │   │   │   │   ├── NoOpAIProvider.java      # Fallback (no key configured)
    │   │   │   │   ├── AIProviderFactory.java   # Selects provider at startup
    │   │   │   │   └── AIResponseParser.java    # LLM JSON response parser
    │   │   │   ├── JSearchService.java          # JSearch HTTP client + retry
    │   │   │   └── JobOrchestratorService.java  # Pipeline: fetch→analyse→cache→return
    │   │   └── controller/
    │   │       └── JobsController.java          # REST endpoints
    │   └── resources/
    │       ├── application.properties           # All configuration
    │       └── logback-spring.xml               # JSON structured logging
    └── test/
        └── java/com/projectanalyzer/
            ├── ProjectAnalyzerApplicationTest.java  # Context smoke test
            ├── controller/
            │   └── JobsControllerTest.java          # Web layer slice tests
            └── service/
                └── AIResponseParserTest.java         # Parser unit tests
```

### Key design patterns

| Pattern | Python original | Java equivalent |
|---|---|---|
| **Factory** | `create_app()` | `@SpringBootApplication` + `@Bean` factories |
| **Singleton** | `@lru_cache` on `get_orchestrator()` | Spring `@Service` (singleton by default) |
| **Strategy** | `BaseAIProvider` ABC | `AIProvider` interface |
| **Dependency Injection** | FastAPI `Depends(...)` | Spring `@Autowired` / constructor injection |
| **Retry** | `tenacity` decorators | Resilience4j `@Retry` |
| **TTL Cache** | `cachetools.TTLCache` + lock | Caffeine `CaffeineCacheManager` |
| **Semaphore** | `asyncio.Semaphore` | `java.util.concurrent.Semaphore` |
| **Concurrent analysis** | `asyncio.gather` | `CompletableFuture` + `ExecutorService` |
| **HTTP client** | `httpx.AsyncClient` | Spring `WebClient` (reactive) |
| **Validation** | Pydantic models | Jakarta Bean Validation (`@Valid`, `@NotBlank`, etc.) |
| **Config** | pydantic-settings | `@ConfigurationProperties(prefix="app")` |

---

## Quick start

### 1. Prerequisites

- **Java 17** or later (tested on Java 17 LTS)
- **Maven 3.8+**
- A [RapidAPI](https://rapidapi.com) account → subscribe to **JSearch** (free tier available)
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey) **OR** an **OpenAI API key**

### 2. Configure secrets

```bash
cd backend-java
cp .env.example .env
```

Edit `.env` and fill in:

```env
JSEARCH_API_KEY=your_rapidapi_key
AI_PROVIDER=gemini          # or "openai"
GEMINI_API_KEY=your_key     # if using Gemini
OPENAI_API_KEY=your_key     # if using OpenAI
```

### 3. Build and run

```bash
# Load .env variables into the shell, then run
set -a; source .env; set +a
mvn spring-boot:run
```

Or build a fat JAR:

```bash
mvn clean package -DskipTests
java -jar target/project-analyzer-backend-1.0.0.jar
```

The API is now live at **http://localhost:8000**.  
Interactive docs: **http://localhost:8000/docs** (Swagger UI)  
OpenAPI JSON: **http://localhost:8000/api-docs**

### 4. Run tests

```bash
mvn test
```

---

## API reference

All endpoints are identical to the original Python backend, ensuring zero frontend changes.

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

### `GET /api/v1/jobs/feed`

Browse endpoint — GET-friendly for the Job Feed page.

Query params:
- `q` — search term (default: `"software engineer"`)
- `location` — city / "Remote" (default: `""`)
- `date_posted` — recency filter (default: `"anytime"`)

### `GET /api/v1/dashboard/stats`

Returns lightweight aggregate market stats.

### `GET /api/v1/health`

Liveness probe. Returns `{"status": "ok"}`.

---

## Environment variables reference

| Variable | Default | Description |
|---|---|---|
| `JSEARCH_API_KEY` | *(required)* | RapidAPI key for JSearch |
| `AI_PROVIDER` | `gemini` | `gemini` or `openai` |
| `GEMINI_API_KEY` | *(required if Gemini)* | Google AI Studio key |
| `GEMINI_MODEL` | `gemini-1.5-flash` | Gemini model name |
| `OPENAI_API_KEY` | *(required if OpenAI)* | OpenAI platform key |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model name |
| `APP_ALLOWED_ORIGINS` | `http://localhost:5173,...` | Comma-separated CORS origins |
| `AI_CONCURRENCY_LIMIT` | `5` | Max concurrent AI calls |
| `CACHE_TTL_SECONDS` | `600` | Cache expiry in seconds |
| `CACHE_MAX_SIZE` | `128` | Max cached entries |
| `HTTP_TIMEOUT_SECONDS` | `30.0` | HTTP client timeout |
| `LOG_LEVEL` | `INFO` | `DEBUG` / `INFO` / `WARN` / `ERROR` |

---

## Connecting the frontend

No frontend changes needed — all API endpoints and JSON shapes are identical to the Python backend.

Set `VITE_API_URL=http://localhost:8000` (or your deployed URL) in the frontend `.env`.

---

## Deployment

### Render

1. Push to GitHub
2. Create a **New Web Service** on [Render](https://render.com)
3. Set **Build Command:** `mvn clean package -DskipTests`
4. Set **Start Command:** `java -jar target/project-analyzer-backend-1.0.0.jar`
5. Add all env vars from `.env.example` in the Render dashboard
6. Update `APP_ALLOWED_ORIGINS` to include your Vercel/Firebase frontend URL

### Docker (optional)

```dockerfile
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/project-analyzer-backend-1.0.0.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
mvn clean package -DskipTests
docker build -t project-analyzer-backend .
docker run -p 8000:8000 --env-file .env project-analyzer-backend
```

---

## Migration notes (Python → Java)

| Concern | Python (FastAPI) | Java (Spring Boot) |
|---|---|---|
| Web framework | FastAPI 0.115 | Spring Boot 3.2 / Spring MVC |
| Runtime | CPython 3.13 / Uvicorn | JVM 17 / embedded Tomcat |
| HTTP client | httpx (async) | WebClient (reactive) |
| Validation | Pydantic v2 | Jakarta Bean Validation |
| Config | pydantic-settings | @ConfigurationProperties |
| Retry | tenacity | Resilience4j |
| Cache | cachetools TTLCache | Caffeine |
| Logging | structlog (JSON) | SLF4J + logstash-logback-encoder |
| Concurrency | asyncio + Semaphore | CompletableFuture + Semaphore |
| DI | FastAPI Depends | Spring @Service / @Autowired |
| OpenAPI | FastAPI built-in | springdoc-openapi |
