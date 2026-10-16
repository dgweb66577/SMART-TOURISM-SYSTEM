# AI-Powered Smart Tourism PWA for Goa — Docker + RBAC Foundation

A high-performance Progressive Web App inspired by [goa.app](https://goa.app/), engineered for modern smart tourism in Goa. Built with Next.js 14 (App Router), Supabase Auth & PostgreSQL, Role-Based Access Control (RBAC), FastAPI AI microservice scaffolding, and Qdrant vector database containerization.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Lucide React
- **State & Data**: Zustand (Auth/Global state), TanStack React Query (Server cache)
- **Forms & Validation**: React Hook Form, Zod
- **Backend & Database**: Supabase (PostgreSQL, GoTrue Auth, Storage, Row-Level Security)
- **AI Microservice (Scaffold)**: FastAPI (Python 3.12), Uvicorn
- **Vector DB**: Qdrant (Docker service)
- **Orchestration**: Docker Compose + Supabase CLI

---

## RBAC Roles & Post-Login Redirection

| Role | Description | Redirect Target | Access Permissions |
| :--- | :--- | :--- | :--- |
| **`user`** | Tourist / Visitor exploring places, itineraries, and deals | `/` | Public pages, `/trips`, `/profile` |
| **`platform_admin`** | Full platform administrator managing users, places, and system content | `/admin` | `/admin/*` management suite |
| **`place_incharge`** | Business owner or manager listing and managing their venue | `/place/dashboard` | `/place/*` venue management suite |

---

## Quickstart Guide

Follow these steps to run the complete environment locally:

### 1. Prerequisites
Install Docker Desktop and the Supabase CLI:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)

### 2. Start Local Supabase
From the repository root, start the local Supabase container cluster:
```bash
supabase start
```

### 3. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env
```
Populate `.env` with the output from `supabase status`:
- `NEXT_PUBLIC_SUPABASE_URL` (API URL, e.g. `http://127.0.0.1:54321`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon key)
- `SUPABASE_SERVICE_ROLE_KEY` (service_role key)

### 4. Build and Run via Docker Compose
Run the development stack with hot-reloading:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### 5. Access the Application
- **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
- **FastAPI AI Service**: [http://localhost:8000/health](http://localhost:8000/health)
- **Qdrant Vector Database**: [http://localhost:6333/dashboard](http://localhost:6333/dashboard)
- **Supabase Studio (Local)**: [http://127.0.0.1:54323](http://127.0.0.1:54323)

---

## Repository Structure

```
goa-smart-tourism/
├── docker-compose.yml           # Production Docker Compose orchestration
├── docker-compose.dev.yml       # Development overrides with hot reloading
├── .env.example                 # Environment variables blueprint
├── .gitignore                   # Git exclusions
├── README.md                    # Setup and documentation
├── frontend/                    # Next.js 14 App Router frontend
│   ├── Dockerfile               # Multi-stage production Dockerfile
│   ├── Dockerfile.dev           # Development Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── components.json
│   ├── middleware.ts            # RBAC route protection
│   ├── app/                     # App Router route groups
│   │   ├── (auth)/              # Login, Signup, Unauthorized
│   │   ├── (user)/              # Tourist browsing & profile
│   │   ├── (admin)/             # Platform Admin suite
│   │   └── (place)/             # Place Incharge dashboard
│   ├── components/
│   │   ├── auth/                # LoginForm, SignupForm, RoleGuard
│   │   ├── admin/               # AdminSidebar
│   │   ├── place/               # PlaceSidebar
│   │   └── ui/                  # shadcn/ui components
│   └── lib/
│       ├── supabase/            # Browser, Server, Middleware clients
│       ├── stores/              # Zustand auth store
│       └── validations/         # Zod auth schemas
├── ai-service/                  # FastAPI microservice
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── requirements.txt
│   └── main.py
└── supabase/                    # Supabase config, migrations & seeds
    ├── config.toml
    ├── seed.sql
    └── migrations/
        └── 20250101000000_init_roles.sql
```
