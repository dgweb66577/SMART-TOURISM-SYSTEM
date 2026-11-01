# Goa Tourism PWA — Smart Travel, Places, Events & Dining Platform

A full-stack, mobile-first Progressive Web App (PWA) inspired by **[goa.app](https://goa.app)**, engineered for smart tourism, destination discovery, live events & parties, verified reviews, and dining across Goa. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase Auth & PostgreSQL**, **Qdrant Vector Database**, and a **FastAPI** AI recommendation microservice.

---

## 🌴 Key Features

### 🎉 1. Events & Parties in Goa (`/events`)
Faithfully implemented following the official **goa.app** events architecture:
- **Header & Filter Suite**:
  - Live search by event name, artist, venue, or keywords.
  - City/Region dropdown filter (*North Goa*, *South Goa*, *Panaji*, *Vagator*, *Anjuna*, *Ashwem*, *Arpora*, *Palolem*, *Morjim*).
  - Event category filter (*Music Festivals*, *Party & Nightlife*, *Beach Parties*, *Food & Wine*, *Culture & Arts*, *Traditional Carnivals*, *Wellness & Yoga*).
  - Date quick-filter buttons: **`ALL TYPES`**, **`Today`**, **`Tomorrow`**, **`Weekend`**.
- **Horizontal Category Icon Strip**:
  - Quick-switch icon buttons for instant one-click category filtering.
- **Curated Sections**:
  - 🔥 **POPULAR EVENTS IN GOA**: Top-booked and trending experiences (Sunburn Festival, HillTop Trance, Goa Sunsplash, King Momo Carnival).
  - 🌙 **BEST PARTY EVENTS IN GOA**: Nightclubs, full moon beach raves, and clifftop sessions.
  - 📅 **UPCOMING EVENTS IN GOA**: Comprehensive calendar with date boxes (`Month` + `Day`), pricing badges (`₹... Onwards` or `Free Entry`), and venue details.

---

### 🎟️ 2. Event Detail Pages (`/events/[slug]`)
Mirroring the design and layout of `goa.app` with complete visitor and ticketing workflows:
- **Hero Banner & Thumbnail Strip**: Full-width rounded preview container, category badge, and interactive thumbnail gallery.
- **Event Information**:
  - Exact date, timing, venue address, and Google Maps one-click navigation (`Get Venue Directions`).
  - Detailed story, performing artist lineup cards, key highlights, and entry guidelines.
  - Verified organizer certification badge.
- **Sticky Ticket Booking Widget**:
  - Multi-tier ticket selection (e.g. *General Admission*, *Season Pass*, *VIP Clifftop Deck*, *Couple Pass*).
  - Quantity counter with instant total price calculation.
  - **"Book Tickets Now" / "Register for Free Spot"**: Generates a verified digital event pass modal with unique pass ID (`GOA-EV-XXXXXX`), simulated QR code, and ticket credentials.
- **Verified Reviews & Interactive Rating Pie Chart**:
  - **SVG Rating Pie Chart**: Visual breakdown rendering percentage and color-coded segments (5★ Emerald, 4★ Sky Blue, 3★ Amber, 2★ Orange, 1★ Rose Red).
  - **Interactive Review Submission**: Traveler name, star selector (1–5), and comment with instant UI update.
  - List of attendee reviews with verified traveler badges.
- **"You May Also Like" Carousel**: Recommends similar events in the same region or category.

---

### 📍 3. Places & Attractions Discovery (`/places`)
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
- **Place Detail Page (`/places/[slug]`)**:
  - Two-column layout with 4-photo thumbnail gallery, Drishti Marine beach safety flags, history, ASI timings & entry fees, directions, and **Popular Experiences** (Flyboarding, VsnapU Photography Packages, Scuba Diving).
  - Verified reviews with interactive **Rating Pie Chart**.

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
  - Verified reviews with interactive **Rating Pie Chart**.

---

### 👤 5. Traveler Dashboard (`/dashboard`)
- **Personalized Header**: Greets travelers by name with clean modern typography.
- **Top Categories Navigation**: Instant shortcuts to *Places*, *Events*, *Restaurants*, *Activities*, *Rentals*, and *Taxi*.
- **Live Coastal Conditions**: Real-time temperature, sunset time, high/low tides, and Drishti Marine lifeguard flags (*Green Flag / Safe*).
- **Active Trip Itineraries**: Curated morning, afternoon, and sunset schedules.
- **AI Smart Concierge**: Context-aware recommendations for local attractions, hidden waterfalls, nightlife, and coastal dining.

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
   * **Events Directory**: [http://localhost:3000/events](http://localhost:3000/events)
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

## 🗺️ Key Routes & URLs

| Route | URL | Description |
|---|---|---|
| **Home Page** | `http://localhost:3000` | Landing page & hero destination search |
| **Events Directory** | `http://localhost:3000/events` | Goa.app style events suite with filters & calendar |
| **Sunburn Festival** | `http://localhost:3000/events/sunburn-goa-music-festival` | EDM festival with ticket tiers & reviews pie chart |
| **HillTop Sunday Party** | `http://localhost:3000/events/hilltop-sunday-sunset-party` | Weekly psychedelic trance gathering |
| **Goa Carnival** | `http://localhost:3000/events/goa-carnival-grand-parade` | Historic 500-year King Momo carnival parade |
| **Curlies Full Moon Party** | `http://localhost:3000/events/curlies-full-moon-beach-party` | South Anjuna beachfront party tonight |
| **Places Directory** | `http://localhost:3000/places` | 46 places with category banners & filters |
| **Fort Aguada & Lighthouse** | `http://localhost:3000/places/fort-aguada` | Historic 1612 fort with 6 official photos & ASI data |
| **Anjuna Beach** | `http://localhost:3000/places/anjuna-beach` | Beach safety advisory, gallery & popular experiences |
| **Restaurants Directory** | `http://localhost:3000/restaurants` | Dining directory with category pills & promo codes |
| **Traveler Dashboard** | `http://localhost:3000/dashboard` | Coastal conditions, itinerary planner & AI concierge |

---

## 🔑 Demo & Test Credentials

| Role | Email | Password / Access |
|---|---|---|
| **Tourist (Google Demo)** | `monalidesai@gmail.com` | Click **"Continue with Google"** → Select *Monali Dessai* |
| **Platform Admin** | `admin@goa.app` | `Password123!` |
| **Place Incharge** | `partner@goa.app` | `Password123!` |
