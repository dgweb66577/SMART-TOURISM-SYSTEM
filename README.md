# Goa Tourism PWA — Smart Travel, Places & Dining Platform

A full-stack, mobile-first Progressive Web App (PWA) inspired by **[goa.app](https://goa.app)**, engineered for smart tourism, destination discovery, verified reviews, and dining across Goa. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase Auth & PostgreSQL**, **Qdrant Vector Database**, and a **FastAPI** AI recommendation microservice.

---

## 🌴 Key Features

### 📍 1. Places & Attractions Discovery (`/places`)
- **46 Verified Destinations**: All major destinations across North Goa, South Goa, and Panaji mapped directly with official data and signed Google Cloud Storage galleries from `goa.app`.
- **Category Banners & Quick Filters**:
  - 🏖️ **Beaches** (Anjuna, Calangute, Baga, Vagator, Palolem, Morjim, Butterfly Beach, etc.)
  - 🏰 **Forts & Heritage** (Fort Aguada & Lighthouse, Chapora Fort, Cabo de Rama, Reis Magos, Terekhol)
  - 🌊 **Waterfalls & Nature** (Dudhsagar Falls, Tambdi Surla, Hivre Falls, Charavane, Netravali, Bamanbudo, Mainapi, Kesarval Spring)
  - ⛪ **Churches & Cathedrals** (Basilica of Bom Jesus, Se Cathedral, Church of Our Lady of the Immaculate Conception)
  - 🛕 **Temples & Spiritual** (Shanta Durga, Mangueshi Temple, Tambdi Surla Mahadev)
  - 🌿 **Wildlife & Spices** (Bhagwan Mahavir Wildlife Sanctuary, Sahakari Spice Farm)
  - 🛍️ **Quarters & Markets** (Fontainhas Latin Quarter, Anjuna Flea Market, Mapusa Market)
  - 🌅 **Viewpoints & Islands** (Divar Island, Chorao Island, Dona Paula Viewpoint)
- **Search & Region Filtering**: Live search by name or taluka, filterable by *All Goa*, *North Goa*, *South Goa*, and *Panaji & Central*.

---

### 🏛️ 2. Place Detail Page (`/places/[slug]`)
Faithfully styled to mirror the modern layout of `goa.app` (e.g., `/places/anjuna-beach`, `/places/fort-aguada`):
- **Hero Image & Thumbnail Strip**: Full-width rounded hero banner with category tag on top-right (`Beaches`, `Forts & Heritage`, etc.) and an interactive thumbnail strip beneath to switch preview photos.
- **Official Destination Data**:
  - Full address, GPS coordinates, Google Maps one-click directions (`Get Directions`).
  - Visiting hours, official entry fees (e.g., ASI entry for Fort Aguada), and best times to visit.
  - Authentic history, architectural notes, and cultural significance.
  - Practical traveler tips and official guidelines (respecting heritage sites, modesty, footwear, and anti-littering rules).
- **Beach Safety Status**: Dynamic safety banner with Drishti Marine lifeguard advisories, flag status (*Safe / Caution / High Risk*), and swim zone alerts.
- **Popular Experiences Sidebar**: Related bookable activities with verified thumbnails (e.g., *Flyboarding* in Chapora, *Vagator Beach Photography Packages by VsnapU*, *Grand Island Scuba Diving*).

---

### 📊 3. Verified Reviews & Interactive Pie Chart Rating
Implemented for both **Places** and **Restaurants**:
- **Rating Pie Chart**: Visual breakdown rendering percentage and color-coded segments:
  - 🟩 **5 Stars (Excellent)**: Emerald Green
  - 🟢 **4 Stars (Very Good)**: Amber Green
  - 🟡 **3 Stars (Average)**: Yellow / Amber
  - 🟠 **2 Stars (Poor)**: Orange
  - 🔴 **1 Star (Terrible)**: Rose Red
- **Interactive Review Submission**: Verified traveler name, star selector (1 to 5), and review comment with instant UI update.
- **Local Persistence & Supabase Integration**: Stores user reviews with timestamps and ratings.

---

### 🍽️ 4. Food & Restaurant Discovery (`/restaurants`)
- **Dining Filter Pills**: Quick filter by *All Types*, *Casual Dining*, *Family Style*, *Pure Vegetarian*, *Beach Shacks*, *Multi Cuisine*, and *Boutique Cafes*.
- **Featured Dining Offers Carousel**: Horizontal scroll showcasing exclusive partner promotions (*Flat 10% Off*, *Flat 15% Off*, *Flat 20% Off*) with brand tags.
- **Restaurant Detail Pages (`/restaurants/[id]`)**:
  - Full-width hero banner with gallery.
  - **Interactive Offers Section**: Peach cards with orange accent borders, coupon copy, and unlock mechanisms.
  - **Embedded Google Maps**: Exact street address, interactive map, and floating navigation buttons.
  - **Menu & Bill Calculator**: Categorized dishes with dietary badges (Veg / Non-Veg) and quick order builder.
  - **Sticky Table Reservation Widget**: Date, time slot, party size, and seating preference with automated booking confirmation pass (`GOA-XXXXXX`).

---

### 👤 5. Traveler Dashboard (`/dashboard`)
- **Personalized Header**: Greets travelers by name with clean modern typography.
- **Top Categories Navigation**: Instant shortcuts to *Places*, *Restaurants*, *Activities*, *Rentals*, *Taxi*, and *Events*.
- **Live Coastal Conditions**: Real-time temperature, sunset time, high/low tides, and Drishti Marine lifeguard flags (*Green Flag / Safe*).
- **Active Trip Itineraries**: Curated morning, afternoon, and sunset schedules.
- **AI Smart Concierge**: Context-aware recommendations for local attractions, hidden waterfalls, and coastal dining.

---

### 🔐 6. Authentication & Roles
- **Dual-Mode Google Sign-In**:
  - **Production Mode**: Full Google Cloud OAuth integration.
  - **Instant Local/Demo Mode**: Built-in Google Account Selector (*Monali Dessai* / custom) providing immediate zero-config login with valid Supabase Auth sessions.
- **Role-Based Access Control (RBAC)**:
  - `user`: Tourist traveler dashboard, bookings, favorites, reviews.
  - `place_incharge`: Verified place manager and venue editor.
  - `platform_admin`: Central platform management portal (`/admin`).

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React, Sonner |
| **State & Cache** | TanStack React Query, Zustand, LocalStorage persistence |
| **Database & Auth** | Supabase (PostgreSQL 15, GoTrue Auth, Row-Level Security, Storage API) |
| **Vector DB & AI** | Qdrant Vector Database, FastAPI (Python 3.12 microservice) |
| **Containerization** | Docker, Docker Compose |

---

## 🚀 Running the Project

### Prerequisites
* **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** installed and running.
* **[Node.js](https://nodejs.org/)** (v18 or v20+) installed.

---

### Option A: Run All Services via Docker (Recommended)

Start the entire stack (Frontend, AI Service, Supabase PostgreSQL, Studio, and Qdrant) with one command:

1. Open your terminal in VS Code (<kbd>Ctrl</kbd> + <kbd>`</kbd>).
2. Start the containers:
   ```powershell
   docker compose up -d
   ```
3. Open your browser:
   * **Goa Tourism PWA (Frontend)**: [http://localhost:3000](http://localhost:3000)
   * **Places Directory**: [http://localhost:3000/places](http://localhost:3000/places)
   * **Restaurants Directory**: [http://localhost:3000/restaurants](http://localhost:3000/restaurants)
   * **Supabase Studio GUI**: [http://localhost:54323](http://localhost:54323)
   * **AI Microservice Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   * **Qdrant Dashboard**: [http://localhost:6333/dashboard](http://localhost:6333/dashboard)

4. To stop all containers:
   ```powershell
   docker compose down
   ```

---

### Option B: Local VS Code Development with Instant Hot-Reload

When editing React/Next.js components and you want instant Fast Refresh:

1. Keep database & AI services running in Docker, but stop the containerized frontend to free port `3000`:
   ```powershell
   docker stop goa-frontend
   ```
2. Start the Next.js dev server locally from the root folder:
   ```powershell
   npm run dev
   ```
3. Visit [http://localhost:3000](http://localhost:3000). Every change you save in VS Code will update in the browser immediately.

---

## 🗺️ Key Routes

| Route | URL | Description |
|---|---|---|
| **Home Page** | `http://localhost:3000` | Landing page & hero destination search |
| **Places Directory** | `http://localhost:3000/places` | 46 places with category banners & filters |
| **Fort Aguada & Lighthouse** | `http://localhost:3000/places/fort-aguada` | Historic 1612 fort with 6 official photos & ASI data |
| **Anjuna Beach** | `http://localhost:3000/places/anjuna-beach` | Beach safety advisory, gallery & popular experiences |
| **Dudhsagar Waterfall** | `http://localhost:3000/places/dudhsagar-waterfall` | 4x4 safari, forest entry & waterfall gallery |
| **Restaurants Directory** | `http://localhost:3000/restaurants` | Dining directory with category pills & promo codes |
| **Restaurant Detail** | `http://localhost:3000/restaurants/mos-cafe-panjim-goa` | Dining detail page with menu & table booking |
| **Traveler Dashboard** | `http://localhost:3000/dashboard` | Coastal conditions, itinerary planner & AI concierge |
| **Admin Portal** | `http://localhost:3000/admin` | Platform administration (`platform_admin` role) |
| **Partner Portal** | `http://localhost:3000/place/dashboard` | Place owner management (`place_incharge` role) |

---

## 🔑 Demo & Test Credentials

| Role | Email | Password / Access |
|---|---|---|
| **Tourist (Google Demo)** | `monalidesai@gmail.com` | Click **"Continue with Google"** → Select *Monali Dessai* |
| **Platform Admin** | `admin@goa.app` | `Password123!` |
| **Place Incharge** | `partner@goa.app` | `Password123!` |

---

## 📁 Project Directory Structure

```
Goa Tourism PWA/
├── frontend/                     # Next.js 14 App Router application
│   ├── app/                      # Page routes & layouts
│   │   ├── (user)/               # Tourist & public routes (/places, /restaurants, /dashboard)
│   │   ├── (admin)/              # Admin portal
│   │   └── (auth)/               # Login & Signup routes
│   ├── components/               # React UI components
│   │   ├── places/               # PlacesViewClient, PlaceDetailClient
│   │   ├── restaurants/          # RestaurantsViewClient, RestaurantDetailClient
│   │   ├── dashboard/            # TouristDashboardClient
│   │   └── ui/                   # RatingPieChart, Buttons, Dialogs, Toasts
│   └── lib/
│       ├── data/                 # placesData.ts (all 46 destinations & experiences)
│       └── supabase/             # Supabase client (browser & server SSR)
├── ai-service/                   # FastAPI recommendation microservice (Python 3.12)
├── supabase/                     # Supabase migrations, seed.sql, config
├── docker-compose.yml            # Multi-container orchestration
└── README.md                     # Project documentation
```
