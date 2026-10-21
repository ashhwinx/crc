# Coast Road Capital (CRC) Corporate Platform
## Phase 1 | Production-Ready MERN Railroad Logistics & Railcar Leasing Website

An enterprise-grade, high-performance web platform built for **Coast Road Capital (CRC)**, an American railroad logistics and railcar leasing business. Designed with authentic railroad heritage, industrial information architecture, and production-quality full-stack engineering.

---

## 1. System Architecture

The project is structured as a modern MERN application with a unified root management layer:

```
crc/
├── package.json                 # Root script runner (concurrent dev, installation)
├── README.md                    # System architecture & operations manual
├── client/                      # Frontend Application (React 19 + TypeScript + Vite)
│   ├── index.html               # Semantic HTML5 entry, Google Fonts, OpenGraph
│   ├── vite.config.ts           # Vite bundler configuration
│   ├── src/
│   │   ├── assets/              # Client heralds, brand vectors, logos
│   │   ├── components/
│   │   │   ├── common/          # Reusable UI components (TrackMotif, Button, etc.)
│   │   │   ├── layout/          # Global Header, Mobile Drawer, Footer
│   │   │   └── catalog/         # QuickInquiryModal, SpecTable
│   │   ├── data/                # Typed 7-category railcar catalog data
│   │   ├── pages/               # Home, About, RailcarLeasing, Quote, BookCall, Contact, NotFound
│   │   ├── services/            # API client layer (Axios / Fetch)
│   │   ├── styles/              # Design tokens & responsive CSS architecture
│   │   ├── types/               # TypeScript interfaces for inquiries, equipment, bookings
│   │   ├── App.tsx              # React Router v7 routes
│   │   └── main.tsx             # React DOM entry
│   └── public/
│       ├── images/              # Client locomotives (SCL GP40-2 1637, Milwaukee #967) & 7 equipment photos
│       └── favicon.png          # Preserved CRC diamond herald favicon
│
├── server/                      # Backend API (Node.js + Express + Mongoose)
│   ├── package.json             # Backend dependencies & scripts
│   ├── .env                     # Local environment configuration
│   ├── .env.example             # Documented template for deployment
│   └── src/
│       ├── config/              # MongoDB connection & environment loader
│       ├── controllers/         # Inquiries, Equipment, Bookings controllers
│       ├── data/                # Canonical 7-category equipment specifications
│       ├── middleware/          # Rate limiting, error handling, security headers
│       ├── models/              # Mongoose schemas: Inquiry, BookingRequest
│       ├── routes/              # Express REST router definitions
│       ├── services/            # Email dispatch & calendar integration boundaries
│       └── server.js            # Express application bootstrap
│
└── client_materials/            # Source documents, PDFs, brand guidelines, and photos
```

---

## 2. Brand Identity & Design System

The visual identity is derived directly from the supplied Coast Road Capital logo and American railroad heritage:

### Color Palette
- **Railroad Red:** `#AA2E1F` — Calls to action, active navigation tabs, subtle border accents, and rail track motifs.
- **Warm Cream:** `#EDE6D4` — Editorial content cards, background panels, specification tables, and soft industrial contrast.
- **Near Black:** `#0A0A09` — Primary typography, hero backgrounds, heavy industrial footers, and dark sections.
- **Pure White:** `#FFFFFF` — Readable text on dark backgrounds and clean form inputs.

### Typography
- **Display Headings:** *Barlow Condensed* (ExtraBold / Black Italic) — Inspired by historic Seaboard Coast Line (SCL) typography.
- **Body & Technical Specs:** *Inter* — Clean, highly legible sans-serif for specifications, forms, and editorial copy.

### Authentic Railroad Imagery
- **Historic SCL GP40-2 #1637:** Client locomotive photograph ("Pulling For You!") prominently featured on the Homepage Business Intro.
- **Historic Milwaukee Road #967:** Featured in the Heritage section of About Us.
- **High-Resolution Freight Equipment:** Dedicated photography for all 7 equipment categories.
- **Preserved Logo Art:** The original CRC logo artwork, diamond herald, and lettering are preserved without any distortion or redesign.

---

## 3. Phase 1 Scope & Features

### Core Pages & Modules
1. **Homepage (`/`):**
   - **Section A:** Hero with railroad yard imagery, value proposition, and dual CTAs ("Explore Railcars" / "Request a Quote").
   - **Section B:** Business introduction featuring client's historic SCL #1637 locomotive.
   - **Section C:** Railcar leasing and equipment sourcing overview.
   - **Section D:** 7-category interactive equipment overview grid.
   - **Section E:** 3-step inquiry journey explanation (Explore -> Specify -> Consult).
   - **Section F:** Heritage preview highlighting American railroad lineage.
   - **Section G:** Closing call-to-action banner.
   - **Section H:** Comprehensive corporate footer with dynamic copyright, quick links, and catalog shortcuts.
2. **About Us (`/about`):**
   - Industrial business overview, railcar leasing methodology, operational footprint, safety/FRA regulatory compliance, and historic railroad heritage narrative.
3. **Railcar Leasing Catalog (`/railcars`):**
   - Dedicated equipment discovery tool with 7 client-verified categories:
     1. **Boxcars:** 50-ft standard, 50-ft high-cube, 60-ft standard, 60-ft high-cube, insulated, refrigerated.
     2. **Covered Hoppers:** 3,230 cu ft PD, 3,281 cu ft cement/mineral, 4,359 cu ft industrial, 4,650–4,750 cu ft, 5,161–5,400 cu ft grain, 5,660–5,850 cu ft pneumatic, 6,241–6,541 cu ft large-capacity.
     3. **Open-Top Hoppers:** 2,400 cu ft, 2,480 cu ft rapid discharge, 2,900 cu ft aggregate, 3,000–4,000 cu ft bulk.
     4. **Gondolas:** 42-ft coil car, 52-ft mill gondola, 65/66-ft mill gondola, high-sided gondola, rotary gondola.
     5. **Centerbeam Flatcars:** 65-ft, 73-ft, riser-deck, riserless-deck.
     6. **Bulkhead / General Flatcars:** 50-ft bulkhead, 60-ft bulkhead, 62-ft bulkhead, 60-ft general purpose, 89-ft specialty, heavy-duty.
     7. **Tank Cars:** 13,000–19,000 gal, 20,000–25,000 gal, 25,000–30,000+ gal (insulated/non-insulated, pressure/non-pressure).
   - Category filtering, detailed specification tables, commodity profiles, and two inquiry pathways:
     - **Quick Modal Inquiry:** Direct popover for fast category inquiries without leaving the catalog.
     - **Full Quote Navigation:** Deep links carrying `?category=...&config=...` query parameters to prefill the main quote form.
   - Truthful positioning: Positioned as an equipment discovery and leasing inquiry tool without fabricated live inventory counts.
4. **Request a Quote (`/quote`):**
   - Enhanced quote request flow supporting preselected categories and dynamic configuration dropdowns.
   - Live client-side and server-side validation, loading states, MongoDB persistence, and unique inquiry reference numbers (`CRC-INQ-XXXXXX`).
5. **Book a Call (`/book-call`):**
   - Consultation scheduling experience with interactive date picker, CST business hour time slot selection, topic selection, and MongoDB persistence (`CRC-BKG-XXXXXX`).
   - Clearly documented calendar integration boundary.
6. **Contact (`/contact`):**
   - Corporate communications channel, inquiry form, and location disclosure indicating that the map will embed verified corporate headquarters upon client confirmation.

### Explicitly Excluded Features (Reserved for Future Phases)
- **Phase 2:** Dynamic Cost Estimator with backend calculation engine; Interactive 3D railroad track layout visualization.
- **Phase 3:** Content Management System (CMS); Administrative dashboard for users, inventory, and quotes.

---

## 4. Quickstart & Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB:** Local instance running on port 27017 or a MongoDB Atlas URI

### 1. Install Dependencies
Run the unified installer from the workspace root:
```bash
npm run install:all
```
*This installs dependencies for the root orchestrator, `client`, and `server`.*

### 2. Configure Environment Variables
Copy the server environment template and verify your database connection:
```bash
cp server/.env.example server/.env
```
Default local values:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/coastroadcapital
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3. Start Development Servers
Run both frontend and backend concurrently from the root directory:
```bash
npm run dev
```
Alternatively, launch them individually in separate terminals:
- **Backend API:** `npm run dev:server` (runs on `http://localhost:5000`)
- **Frontend App:** `npm run dev:client` (runs on `http://localhost:5173`)

### 4. Build for Production
To generate the production-optimized frontend bundle:
```bash
npm run build:client
```
The output is written to `client/dist/`.

---

## 5. API Reference

All API routes are prefixed with `/api`. Rate limiting is active (100 req/15min for general routes, 15 req/15min for submission endpoints).

### 1. Health Check
- **Endpoint:** `GET /api/health`
- **Description:** Verifies service health, active version, and database connectivity.
- **Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-10-21T13:50:32.874Z",
  "service": "Coast Road Capital API",
  "version": "1.0.0 (Phase 1)",
  "database": {
    "state": "connected",
    "connected": true
  },
  "phase": "Phase 1 - Production Ready MERN Corporate Platform"
}
```

### 2. Equipment Catalog
- **Endpoint:** `GET /api/equipment`
- **Description:** Returns all 7 verified railcar categories with configurations, typical capacities, and commodity profiles.
- **Endpoint:** `GET /api/equipment/:id`
- **Description:** Returns specific category details by category slug (e.g. `boxcars`, `covered-hoppers`).

### 3. Submit Quote Inquiry
- **Endpoint:** `POST /api/inquiries`
- **Payload:**
```json
{
  "fullName": "Marcus Vance",
  "company": "Vance Industrial Logistics",
  "email": "m.vance@vanceindustrials.com",
  "phone": "312-555-0199",
  "category": "Covered Hoppers",
  "configuration": "5,161–5,400 cu ft grain",
  "quantity": 25,
  "commodity": "Grain and agricultural feed",
  "timing": "Q1 2027",
  "message": "Seeking 25 cars for long-term triple-net lease."
}
```
- **Response:** `201 Created` with inquiry reference number and persistence confirmation.

### 4. Book a Consultation
- **Endpoint:** `POST /api/bookings/request`
- **Payload:**
```json
{
  "fullName": "Sarah Jenkins",
  "company": "Midwest Agricultural Sourcing",
  "email": "sjenkins@midwestagri.com",
  "phone": "612-555-4321",
  "preferredDate": "2026-10-28",
  "preferredTime": "10:00 AM CST",
  "topic": "Equipment Leasing Options",
  "fleetSizeEstimate": "10-25 cars",
  "notes": "Discussing 5,161 cu ft covered hoppers."
}
```
- **Response:** `201 Created` with booking reference number and scheduling status.

---

## 6. Integration Boundaries & Client Setup

### Email Dispatch Setup (SMTP)
The backend includes a pluggable Nodemailer dispatch service (`server/src/services/emailService.js`). In Phase 1, inquiries and bookings are persisted to MongoDB regardless of email status. To enable automated transactional email alerts:
1. Obtain corporate SMTP credentials (e.g., Mailgun, SendGrid, Amazon SES, or Microsoft 365).
2. Set the following in `server/.env`:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@coastroadcapital.com
SMTP_PASS=your_production_password
NOTIFICATION_EMAIL=leasing@coastroadcapital.com
```
3. Restart the server. The application will automatically route dispatch notifications to `NOTIFICATION_EMAIL`.

### Calendar Scheduling Provider Setup
Consultation requests are currently stored with full customer preferences in MongoDB. To connect directly with an internal calendar service (e.g., Google Calendar API, Microsoft Graph, or Calendly Webhooks):
1. Obtain your API key or webhook endpoint from your calendar provider.
2. Update `server/.env`:
```env
CALENDAR_API_KEY=your_calendar_api_key
CALENDAR_WEBHOOK_URL=https://api.calendly.com/scheduled_events
```
3. The booking controller (`server/src/controllers/bookingController.js`) will forward consultation requests to the configured calendar webhook.

---

## 7. Pending Client Information for Final Production Deployment

To transition Phase 1 to live public deployment, the following client-specific assets and details are required:
1. **Corporate Physical Address:** Verified headquarters or operational depot address to embed the official Google Maps frame on `/contact`.
2. **Direct Telephone & Public Email:** Verified public telephone number and email address for header/footer display.
3. **Production Mailgun / SMTP Credentials:** For outbound confirmation notifications.
4. **Calendar Endpoint / Scheduling URL:** If automated calendar slot reserving is desired in place of consultation requests.
5. **Production Domain & SSL:** For final CORS origin whitelisting (`CORS_ORIGIN=https://www.coastroadcapital.com`).

---

## 8. License & Proprietary Notice

© Coast Road Capital. All Rights Reserved.  
Original logo artwork and brand assets are proprietary to Coast Road Capital.
