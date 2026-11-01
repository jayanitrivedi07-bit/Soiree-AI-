# Soirée AI — GenAI-Powered Celebration & Event Planner

> **Bespoke luxury event orchestration powered by Google Gemini AI, Express.js, and React.**

Soirée AI is a full-stack, GenAI-native celebration and event-planning platform designed for weddings, milestone anniversaries, galas, and bespoke gatherings. It transforms the complex, multi-vendor event planning process into an intuitive, sensory digital salon with dynamic ₹ INR budget allocations, milestone timelines, verified artisan dossiers, and a real-time autonomous concierge powered by Google Gemini.

---

## ✨ Key Features & Capabilities

1. **Autonomous Haute Concierge (Google Gemini 3.5)**
   - Contextual event intelligence synchronized with the active celebration dossier.
   - Sensory culinary pairings, run-of-show advice, lighting concepts, and follow-up inquiry suggestions.
   - Live multi-model fallback chain (`gemini-3.5-flash` → `gemini-3.5-flash-lite` → `gemini-flash-latest`).

2. **Interactive Celebration Onboarding Studio**
   - 3-step structured brief wizard capturing occasion type, guest count, ₹ INR budget, regional dietary preferences, and aesthetic motifs.
   - Instant live blueprint sidebar calculating 6-category budgetary distributions.

3. **Executive Planning Dashboard**
   - Real-time milestone progress metrics, budget utilization meters, quick-access planning hubs, and upcoming critical deadlines.

4. **Dynamic Indian Rupee Budget Ledger**
   - Automated financial ledger calculating estimated, actual, committed, and remaining balances.
   - Real-time overspending alerts and per-category breakdowns (Venue, Catering, Florals, Photography, Entertainment, Contingency).

5. **Milestone Run-of-Show & Timeline Calendar**
   - Phased task calendar with deadline tracking, priority badges (High / Medium / Low), and instant toggle completion.

6. **Artisan & Vendor Marketplace**
   - Curated directory of heritage caterers, botanical florists, medium-format cinematographers, and classical ensembles.
   - Dossier views with multi-image galleries, tasting menus, service pricing, lead times, and quotation tracking (`shortlisted`, `inquiry`, `contracted`, `booked`).

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, React Router 7, Lucide React |
| **Backend API** | Node.js (v20+), Express.js, TypeScript (ES Modules), Zod, Express Rate Limit, CORS |
| **Artificial Intelligence** | Google Gemini API (`@google/generative-ai`), multi-model fallback chain |
| **Database** | Supabase PostgreSQL (`@supabase/supabase-js`) with zero-config local persistent store fallback |
| **Testing** | Vitest, Supertest (12 integration tests covering CRUD, rate limiting, and live Gemini AI) |
| **Deployment Targets** | Frontend on **Vercel**, Backend on **Render**, Database on **Supabase** |

---

## 📁 Repository Structure

```
Soiree-AI/
├── src/                               # Frontend React + TypeScript application
│   ├── components/layout/             # Navigation, Topbar, Footer layouts
│   ├── context/EventContext.tsx       # Centralized state provider & API client sync
│   ├── data/defaultData.ts            # Seed demo data (Udaipur Heritage Gala)
│   ├── lib/
│   │   ├── api.ts                     # Full-stack API client with /api deduplication
│   │   ├── formatters.ts              # INR currency and date formatting utilities
│   │   └── storage.ts                 # Schema-versioned localStorage persistence
│   ├── pages/                         # 8 Production Pages
│   │   ├── LandingPage.tsx            # Haute couture brand showcase & CTAs
│   │   ├── CreateEventPage.tsx        # 3-step onboarding brief studio
│   │   ├── DashboardPage.tsx          # Executive celebration dashboard
│   │   ├── BudgetPage.tsx             # Interactive expense planner & ledger
│   │   ├── TimelinePage.tsx           # Milestones & run-of-show calendar
│   │   ├── VendorsPage.tsx            # Artisan marketplace & booking tracker
│   │   ├── VendorDetailPage.tsx       # Master artisan profile & dossier
│   │   └── AIAssistantPage.tsx        # Live Gemini AI planning salon
│   ├── types/index.ts                 # TypeScript data contracts & schemas
│   ├── App.tsx                        # Router configuration (8 routes)
│   └── main.tsx                       # Entry point
│
├── server/                            # Backend Express + TypeScript server
│   ├── db/
│   │   └── schema.sql                 # Supabase PostgreSQL relational schema
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts                 # Validated environment configuration
│   │   │   ├── database.ts            # Supabase client + local in-memory store
│   │   │   └── gemini.ts              # Google Generative AI client & fallback chain
│   │   ├── controllers/               # Event, Budget, Task, Vendor, AI controllers
│   │   ├── middleware/                # Rate limiters, Zod validators, error handlers
│   │   ├── routes/                    # Express REST route handlers
│   │   ├── schemas/                   # Zod request validation schemas
│   │   ├── services/                  # Business logic & GenAI orchestration
│   │   ├── types/index.ts             # Backend interfaces mirroring frontend models
│   │   ├── app.ts                     # Express app setup & route mounting
│   │   └── server.ts                  # Server entry point
│   ├── tests/api.test.ts              # Vitest + Supertest integration suite
│   ├── render.yaml                    # One-click Render deployment blueprint
│   └── package.json                   # Server dependencies & scripts
│
├── stitch_soir_e_ai_event_planner/    # Original Google Stitch design exports
├── .env.example                       # Root environment variables template
├── package.json                       # Frontend dependencies & build scripts
├── tailwind.config.js                 # Custom Burgundy & Champagne luxury palette
├── vite.config.ts                     # Vite build configuration
└── README.md                          # Platform documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 20+ installed
- npm or pnpm installed
- A Google Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/jayanitrivedi07-bit/Soiree-AI-.git
cd Soiree-AI-

# Install root & frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google Gemini API Key (Required for live GenAI assistant)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase PostgreSQL (Optional — falls back to local persistent store)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Frontend (`.env` or environment):**

```env
# Optional: In development, automatically defaults to http://localhost:5000/api
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run the Development Servers

In terminal 1 (Backend API):
```bash
cd server
npm run dev
# Running on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

In terminal 2 (Frontend Client):
```bash
npm run dev
# Running on http://localhost:5173
```

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Testing & Verification

The backend includes a comprehensive Vitest integration test suite verifying health checks, event CRUD, budget calculations, task toggle updates, catalog vendors, and live Gemini AI integration:

```bash
cd server
npm test
```

To build both frontend and backend for production:

```bash
# Build frontend
npm run build

# Build backend
cd server
npm run build
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health, service status, and Gemini readiness |
| `GET` | `/api/events` | List all celebrations |
| `POST` | `/api/events` | Create new event brief with auto-generated allocations |
| `GET` | `/api/events/:id` | Fetch full event dossier with tasks and expenses |
| `PUT` | `/api/events/:id` | Update celebration parameters |
| `DELETE` | `/api/events/:id` | Archive celebration |
| `GET` | `/api/events/:id/budget` | Dynamic financial summary & category breakdown |
| `POST` | `/api/events/:id/expenses` | Add expense item |
| `PUT` | `/api/expenses/:id` | Update expense quotation or payment status |
| `DELETE` | `/api/expenses/:id` | Remove expense item |
| `GET` | `/api/events/:id/tasks` | Get milestone tasks & completion percentage |
| `POST` | `/api/events/:id/tasks` | Add actionable task |
| `PATCH` | `/api/tasks/:id/status` | Toggle task completion (`done: boolean`) |
| `DELETE` | `/api/tasks/:id` | Remove task |
| `GET` | `/api/vendors` | Browse curated artisans (`?category=` filter supported) |
| `POST` | `/api/events/:id/vendors` | Add vendor to celebration |
| `PATCH` | `/api/events/:id/vendors/:id/status` | Update booking status (`shortlisted`, `inquiry`, `contracted`, `booked`) |
| `POST` | `/api/ai/chat` | Contextual Gemini concierge chat with follow-up suggestions |
| `POST` | `/api/ai/generate-plan` | Generate concept, themes, culinary pairings, and phased timeline |
| `POST` | `/api/ai/budget-suggestions` | AI-generated luxury budget recommendations in INR |
| `POST` | `/api/ai/generate-timeline` | AI-generated chronological run-of-show schedule |

---

## 🚢 Deployment Guide

### Deploying Backend to Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect this repository and select Root Directory as `server`.
3. Set Build Command: `npm install && npm run build`
4. Set Start Command: `npm start`
5. Configure Environment Variables:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `NODE_ENV`: `production`
   - `SUPABASE_URL`: (Optional) Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: (Optional) Your Supabase service role key

### Deploying Database to Supabase

1. Create a project at [Supabase](https://supabase.com).
2. Open the **SQL Editor**.
3. Run the schema script located at [`server/db/schema.sql`](server/db/schema.sql).
4. Add the database credentials to Render.

### Deploying Frontend to Vercel

1. Import the repository on [Vercel](https://vercel.com).
2. Set Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-render-app.onrender.com/api`
3. Click **Deploy**. Vercel will build the Vite project using `npm run build`.

---

## 📄 License

ISC © [Jayani Trivedi](https://github.com/jayanitrivedi07-bit)
