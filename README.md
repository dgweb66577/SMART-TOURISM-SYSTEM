# Goa Tourism PWA — Smart Travel & Dining Platform

A full-stack, mobile-first Progressive Web App (PWA) inspired by **[goa.app](https://goa.app)**, crafted for smart tourism and dining across Goa. Engineered with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase Auth & PostgreSQL (RBAC)**, **Qdrant Vector Database**, and a **FastAPI** AI recommendation microservice.

---

## 🌟 Key Features

### 🍽️ 1. Food & Restaurant Discovery (`/restaurants`)
- **Category Filter Pills**: Quick filter by *All Types*, *Casual Dining*, *Family Style*, *Pure Vegetarian*, *Beach Shacks*, *Multi Cuisine*, and *Boutique Cafes*.
- **Featured Dining Offers Carousel**: Horizontal scroll carousel showcasing exclusive restaurant partner discounts (*Flat 10% Off*, *Flat 15% Off*, *Flat 20% Off*) with brand badges.
- **Advanced Filtering & Search**: Real-time search by dish or venue name, regional filter (*North Goa*, *South Goa*, *Panaji*), and dietary filter (*All*, *Veg*, *Non-Veg*).
- **Interactive Restaurant Cards**: High-res imagery, rating & review badges, cost for two, "Must Try" highlights, quick *Menu* modal, *Book Table* modal, and direct *Details* navigation.

---

### 📍 2. Restaurant Detail Pages (`/restaurants/[id]` & `/restaurant/[id]`)
Faithfully styled after **goa.app** restaurant pages (e.g., *MO's Cafe Panjim*, *Dropiet Candolim*, *1961 Fontainhas*, *Fortune's Feast*, *Gunpowder Assagao*):
- **Hero Banner & Signature Logo Badge**: Full-width rounded hero card with image gallery, gallery thumbnail strip, and the center-left white logo box.
- **Interactive OFFERS Section**:
  - Distinctive peach-colored cards with orange accent borders (`border-l-[#EA580C] bg-[#FFF7ED]`).
  - **`🔒 OFFER LOCKED / UNLOCK NOW`** buttons: Clicking an offer unlocks the promo code, copies it to the clipboard, and updates the status to **`✓ UNLOCKED`**.
  - **HOW TO REDEEM OFFERS ?** card with numbered steps and quick coupon copy.
- **Curated Nearby Things to Do**: Highlights nearby landmarks and cultural spots (e.g. *Kala Academy*, *Immaculate Conception Church*, *Fontainhas Latin Quarter*).
- **Google Maps Location Embed**:
  - Exact street address display.
  - Interactive Google Maps iframe centered on the venue's location with a red pin.
  - Floating **`Open in Maps ↗`** button for instant one-click navigation in Google Maps.
- **Photos & Menu Tabs**:
  - **Photos Tab**: Interactive photo gallery grid with a click-to-preview full-screen modal.
  - **Menu Tab**: Categorized chef menu with dietary filters, item descriptions, and "+ Add" live bill calculator.
- **Sticky Table Reservation Widget**:
  - Date selector (*Today*, *Tomorrow*, etc.).
  - Party size selector (1 to 8+ guests).
  - Time slot selection and seating preference (*Indoor AC*, *Garden Terrace*).
  - Reservation confirmation with unique booking pass generator (`GOA-XXXXXX`).
- **Verified Reviews & Form**: Real traveler reviews + interactive star rating and review submission form.
- **Weekly Opening Hours Schedule**: Day-by-day hours with the current day highlighted in orange.
- **Similar Restaurants Grid**: Browse other curated Goa dining venues.

---

### 🌴 3. Traveler Dashboard (`/dashboard`)
- **Personalized Header**: Greets the traveler by name (*Welcome to Goa, Monali Dessai!*) without distracting logos.
- **Top Categories Navigation**: Instant access to *Restaurants*, *Activities*, *Rentals*, *Taxi*, *Beach Shacks*, *Packages*, and *Events*.
- **Dedicated "Restaurants & Dining" Tab**: Embeds the full restaurant discovery engine directly within the dashboard.
- **Live Coastal Conditions**: Real-time temperature, sunset time, high/low tides, and Drishti Marine lifeguard safety flags (*Green Flag / Safe*).
- **Active Trip Itineraries**: Daily morning, afternoon, and sunset stops with customizable schedules.
- **AI Smart Concierge**: Context-aware recommendations for local dining, sunset spots, and coastal safety.

---

### 🔑 4. Authentication & "Continue with Google"
- **Dual-Mode Google Sign-In**:
  - **Production Mode**: Connects directly with Google Cloud OAuth using `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
  - **Instant Local/Demo Mode**: If Google Cloud keys aren't set up, clicking **"Continue with Google"** launches an authentic Google Account Selector dialog (*Monali Dessai*, *Goa Explorer*, or custom Google email) that instantly establishes a real session in Supabase Auth.
- **Email & Password Login / Signup** with Zod validation.
- **Magic Link Login**: Passwordless one-time login links dispatched to email.
- **Role-Based Access Control (RBAC)**: Supports `user`, `place_incharge`, and `platform_admin`.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React, Sonner (Toasts) |
| **State Management** | Zustand (Global & Auth Store), TanStack React Query |
| **Form Handling** | React Hook Form, Zod validation |
| **Database & Auth** | Supabase (PostgreSQL, GoTrue Auth, Row-Level Security, Storage) |
| **Maps & Location** | Embedded Google Maps with direct deep-linking |
| **AI Recommendation** | FastAPI (Python 3.12), Uvicorn microservice |
| **Vector Search** | Qdrant Vector Database |
| **Containerization** | Docker, Docker Compose |

---

## 🚀 How to Run the Project

### Prerequisites
Make sure you have installed and running:
1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (must be running in the background)
2. **[Node.js](https://nodejs.org/)** (v18 or v20+)
3. **[Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)** (installed globally via `npm install -g supabase` or winget/brew)

---

### Step-by-Step Instructions

Open your terminal in **VS Code** (`Ctrl + \``) in the project root directory:

#### 1️⃣ Start Supabase (Database & Auth)
```powershell
npm run supabase:start
```
> ⏳ *Wait until it completes and outputs your local API URL (`http://127.0.0.1:54321`) and Studio URL.*

#### 2️⃣ Start the Application Containers
```powershell
npm run docker:dev
```
> ⏳ *Wait until you see:*
> ```
> goa-frontend  |  ✓ Ready in 2.3s
> ```

#### 3️⃣ Open in Browser
Open your browser and navigate to:
```
http://localhost:3000
```

---

### 🛑 How to Stop the App

```powershell
# Stop app containers
npm run docker:down

# Stop local Supabase
npm run supabase:stop
```

---

## 🧭 Key Routes & URLs

| Page | URL | Description |
|---|---|---|
| **Home Page** | `http://localhost:3000` | Landing page |
| **Restaurants Listing** | `http://localhost:3000/restaurants` | Full dining discovery page with filters & offers |
| **MO's Cafe (Detail Page)** | `http://localhost:3000/restaurant/mos-cafe-panjim-goa` | goa.app layout with Google Maps & Offers |
| **Fortune's Feast (Detail Page)** | `http://localhost:3000/restaurants/fortunes-feast` | Restaurant detail page |
| **Gunpowder Assagao (Detail Page)** | `http://localhost:3000/restaurants/gunpowder` | Restaurant detail page |
| **Traveler Dashboard** | `http://localhost:3000/dashboard` | Personalized hub with dining tab & live weather |
| **Sign In** | `http://localhost:3000/login` | Email/password or **Continue with Google** |
| **Sign Up** | `http://localhost:3000/signup` | New traveler registration |
| **Admin Portal** | `http://localhost:3000/admin` | Platform administration (`platform_admin` role) |
| **Place Manager** | `http://localhost:3000/place/dashboard` | Place owner management (`place_incharge` role) |
| **Supabase Studio** | `http://127.0.0.1:54323` | Local database & table management GUI |
| **AI Recommendation Service** | `http://localhost:8000/health` | FastAPI health check endpoint |
| **Qdrant Vector DB** | `http://localhost:6333/dashboard` | Qdrant web dashboard |

---

## 🔐 Default Credentials

| Role | Email | Password |
|---|---|---|
| **Platform Admin** | `admin@goa.app` | `Password123!` |
| **Place Incharge** | `partner@goa.app` | `Password123!` |
| **Tourist (Google Demo)** | `monalidesai@gmail.com` | *Click "Continue with Google" -> Monali Dessai* |

---

## 📁 Project Structure

```
Goa Tourism PWA/
├── docker-compose.yml           # Production Docker Compose orchestration
├── docker-compose.dev.yml       # Development Docker Compose overrides
├── package.json                 # Root automation scripts
├── README.md                    # Project documentation
├── frontend/                    # Next.js 14 App Router Frontend
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Authentication routes (login, signup, unauthorized)
│   │   ├── (user)/              # User-facing routes
│   │   │   ├── dashboard/       # Traveler dashboard page
│   │   │   ├── explore/         # Places & activities discovery
│   │   │   ├── profile/         # User profile settings
│   │   │   ├── restaurant/[id]/ # Singular restaurant detail route
│   │   │   ├── restaurants/     # Restaurant listing & dynamic detail routes
│   │   │   └── trips/           # Itinerary builder
│   │   ├── (admin)/             # Admin management portal
│   │   ├── (place)/             # Venue incharge management portal
│   │   ├── auth/callback/       # OAuth callback handler
│   │   └── layout.tsx           # Global root layout
│   ├── components/              # Modular UI components
│   │   ├── auth/                # LoginForm, SignupForm, GoogleAuthModal
│   │   ├── dashboard/           # TouristDashboardClient
│   │   ├── restaurants/         # RestaurantsViewClient, RestaurantDetailClient
│   │   └── ui/                  # Reusable UI elements (Button, Card, Input, Label, Sonner)
│   └── lib/
│       ├── data/                # restaurantsData.ts (comprehensive restaurant directory)
│       ├── stores/              # Zustand stores (authStore)
│       ├── supabase/            # Supabase browser, server & middleware clients
│       └── validations/         # Zod validation schemas
├── ai-service/                  # FastAPI AI recommendation microservice
│   ├── main.py                  # API endpoints
│   └── requirements.txt         # Python dependencies
└── supabase/                    # Local Supabase configuration
    ├── config.toml              # Supabase local environment config
    ├── seed.sql                 # Initial seed data
    └── migrations/              # PostgreSQL schema migrations
```

---

## 💡 Troubleshooting

- **Port 3000 already in use**:
  ```powershell
  # Find process using port 3000
  netstat -ano | findstr :3000
  # Terminate process
  taskkill /PID <PID_NUMBER> /F
  ```
- **Supabase CLI permission error on Windows**:
  Run your VS Code or terminal as **Administrator**, then re-run `npm run supabase:start`.
- **Containers not refreshing changes**:
  Run `docker restart goa-frontend` or restart the dev stack with `npm run docker:down` followed by `npm run docker:dev`.

---

Licensed under the MIT License. Built for Goa Tourism.
