# Soirée AI — Backend & GenAI Integration Engine

Soirée AI is an intelligent celebration and luxury event planning assistant powered by Google Gemini API, Express.js, TypeScript, and Supabase PostgreSQL.

## Architecture

- **Runtime**: Node.js 20+ with Express.js & TypeScript (ES Modules)
- **AI Core**: Official `@google/generative-ai` SDK with multi-model fallback chain (`gemini-3.5-flash` → `gemini-3.5-flash-lite` → `gemini-flash-latest`)
- **Database**: Dual-engine architecture:
  - Primary: Supabase PostgreSQL (via `@supabase/supabase-js`)
  - Fallback: Zero-configuration local persistent store with seed celebration data
- **Security & Validation**: Zod schema validation, Express rate limiting (`apiLimiter`, `aiLimiter`), CORS protection, and secure server-side API key handling.

---

## Getting Started

### 1. Environment Setup

Create `server/.env` based on `server/.env.example`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase PostgreSQL (Optional - falls back to high-performance local store)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Run Test Suite

```bash
npm test
```

### 5. Build for Production

```bash
npm run build
npm start
```

---

## API Endpoints

### Health Check
- `GET /api/health` — Verifies API health and configuration status.

### Event Management (`/api/events`)
- `GET /api/events` — Retrieve all celebration events.
- `POST /api/events` — Create a new event brief with auto-generated initial budget allocations and milestone checklist.
- `GET /api/events/:id` — Retrieve full event dossier including tasks, expenses, and booked artisans.
- `PUT /api/events/:id` — Update event specifications.
- `DELETE /api/events/:id` — Archive or delete celebration.

### Budget & Financial Ledger
- `GET /api/events/:eventId/budget` — Retrieve expense list and dynamic budget summary (committed totals, remaining balance, overspending alerts, and category breakdown).
- `POST /api/events/:eventId/expenses` — Record planned or actual expense.
- `PUT /api/expenses/:expenseId` — Update expense quotation, actual payment, or status (`paid`, `contracted`, `pending`, `reserved`).
- `DELETE /api/expenses/:expenseId` — Remove expense line item.

### Milestones & Run-of-Show (`/api/tasks`)
- `GET /api/events/:eventId/tasks` — Retrieve timeline tasks and completion metrics.
- `POST /api/events/:eventId/tasks` — Add actionable deadline or milestone.
- `PUT /api/tasks/:taskId` — Modify task details.
- `PATCH /api/tasks/:taskId/status` — Toggle task completion status (`done: boolean`).
- `DELETE /api/tasks/:taskId` — Remove task.

### Artisan & Vendor Marketplace (`/api/vendors`)
- `GET /api/vendors` — Browse curated master artisans and service providers (optional `?category=` filter).
- `GET /api/vendors/:id` — Detailed vendor dossier (galleries, services, pricing, lead time).
- `GET /api/events/:eventId/vendors` — Retrieve vendors assigned to a specific celebration.
- `POST /api/events/:eventId/vendors` — Add artisan/vendor to event roster.
- `PATCH /api/events/:eventId/vendors/:vendorId/status` — Update booking status (`shortlisted`, `inquiry`, `contracted`, `booked`).
- `DELETE /api/events/:eventId/vendors/:vendorId` — Remove vendor from celebration.

### Google Gemini GenAI Services (`/api/ai`)
- `POST /api/ai/chat` — Contextual celebration planning concierge. Returns intelligent response and 3 suggested follow-up prompts.
- `POST /api/ai/generate-plan` — Generates end-to-end celebration concept, theme motifs, culinary pairings, and phased timeline in validated JSON.
- `POST /api/ai/budget-suggestions` — Calculates luxury allocation breakdown in Indian Rupees (INR) and money-saving strategies.
- `POST /api/ai/generate-timeline` — Generates a phased schedule with prioritized deadlines before celebration day.
- `GET /api/ai/chat-history/:eventId` — Retrieve persistent salon conversation history.

---

## Deployment Instructions

### Deploy Backend to Render

1. Create a **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure the service:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `SUPABASE_URL`: (Optional) Supabase project URL.
   - `SUPABASE_SERVICE_ROLE_KEY`: (Optional) Supabase key.
   - `NODE_ENV`: `production`

### Deploy Database to Supabase

1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor**.
3. Paste and execute the contents of `server/db/schema.sql`.
4. Copy the project URL and service role key into your Render environment variables.

### Deploy Frontend to Vercel

1. Import the repository in [Vercel](https://vercel.com).
2. Set Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-render-service.onrender.com/api`
3. Deploy!

