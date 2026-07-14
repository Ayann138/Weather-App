# Weather AI App

A modern weather dashboard built with Next.js. Search any city, view current conditions and forecasts, explore interactive charts, and get local weather-intelligence insights (comfort, clothing, travel, outdoor timing, and more).

**Live stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · TanStack Query · Recharts · Framer Motion

---

## Features

- **Location search** — city lookup via OpenStreetMap Nominatim (debounced, keyboard-friendly)
- **Hero weather card** — current temperature, condition, feels-like, and daily high/low
- **Metrics** — wind, sunrise, and sunset
- **AI summary** — optional narrative from the Weather AI API when available
- **Mission Control insights** — local scoring for weather quality, comfort, hydration, clothing, travel, activities, planner tips, and outdoor windows
- **Charts** — temperature, rain, and comfort trends (Recharts)
- **Daily & hourly forecast** — upcoming days and next hours
- **Light / dark theme** — system-aware toggle with persistence

---

## Prerequisites

- [Node.js](https://nodejs.org/) **18+** (20 LTS recommended)
- npm (comes with Node)
- A [Weather AI](https://api.weather-ai.co) API key (`wai_live_...`)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Ayann138/Weather-App.git
cd Weather-App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and add your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Preferred (server-only — used by /api/weather proxy)
WEATHER_API_KEY=your_api_key_here

# Optional fallback (also works; avoid exposing keys in production if possible)
# NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

> The weather API is called **server-side** through `/api/weather/forecast` so the key stays off the client and CORS is avoided. Geocoding goes through `/api/geocode`.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production build (optional)

```bash
npm run build
npm start
```

---

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start development server   |
| `npm run build` | Create production build    |
| `npm start`     | Serve production build     |
| `npm run lint`  | Run ESLint                 |

---

## Environment variables

| Variable                       | Required | Description                                      |
| ------------------------------ | -------- | ------------------------------------------------ |
| `WEATHER_API_KEY`              | Yes\*    | Weather AI API key (recommended, server-only)    |
| `NEXT_PUBLIC_WEATHER_API_KEY`  | Yes\*    | Fallback if `WEATHER_API_KEY` is not set         |

\*At least one of the two must be set.

---

## Project structure

```
src/
├── app/                  # App Router pages & API routes
│   ├── api/
│   │   ├── geocode/      # Nominatim proxy
│   │   └── weather/      # Weather AI proxy
│   ├── layout.tsx
│   └── page.tsx
├── api/                  # Client weather fetch helpers
├── components/           # UI (hero card, charts, insights, search, …)
├── hooks/                # useWeather, debounce, chart theme
├── lib/                  # formatting, metrics, env, utilities
├── services/
│   └── weather-intelligence/  # Local scoring & advisors
└── types/                # Shared TypeScript types
```

---

## Tech stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **UI:** Tailwind CSS v4, shadcn/ui, Lucide icons, Framer Motion
- **Data:** TanStack Query, Axios
- **Charts:** Recharts
- **Theming:** next-themes

---
