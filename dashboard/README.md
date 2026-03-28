# 🚛 Fresh-Route Engine
### AQI-Optimized Smart Logistics Dashboard

Real-time Air Quality Index (AQI) optimized routing for perishable goods delivery. Reduce spoilage, save costs, and protect cargo freshness with intelligent logistics powered by A* routing and Gemini AI.

---

## ✨ Features

- 🔐 **Secure Logistics Portal** — Interactive "Story-driven" login flow explaining AQI supply chain problems and solutions
- 🗺️ **Real Geo Map Integration** — Interactive Leaflet map layered with custom green/hazard AQI zones over Delhi NCR
- 🧭 **A* Route Engine** — Side-by-side comparison of standard vs optimized routes
- 🚛 **Fleet Tracker** — Real-time monitoring of all delivery vehicles
- 🍃 **Freshness Meter** — Animated gauges showing cargo preservation levels
- 🤖 **Gemini AI Insights** — Predictive shelf-life and contamination risk analysis
- 📊 **Route Simulation** — Live simulation driving on real CartoDB Dark Matter routes
- 📍 **Smart Location Input** — GPS auto-detect or manual location selection

---

## 🛠️ Tech Stack

- **Next.js 16** — React framework with App Router
- **Tailwind CSS 4** — Utility-first styling
- **Framer Motion** — Smooth animations and transitions
- **TypeScript** — Type-safe development

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

---

## 📦 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Click **Deploy** — that's it!

---

## 📁 Project Structure

```
├── src/
│   └── app/
│       ├── page.tsx              # Main dashboard page
│       ├── layout.tsx            # Root layout with metadata
│       ├── globals.css           # Design system & animations
│       └── components/
│           ├── AQIMap.tsx        # Interactive AQI heatmap
│           ├── FleetTracker.tsx  # Vehicle fleet monitoring
│           ├── FreshnessMeter.tsx # Freshness gauge component
│           ├── GeminiInsight.tsx # AI predictions panel
│           ├── Header.tsx        # Top navigation bar
│           ├── LocationInput.tsx # Origin/destination picker
│           ├── Modals.tsx        # Settings, Help, Profile
│           ├── RouteComparison.tsx # Route A/B comparison
│           ├── Sidebar.tsx       # Side navigation
│           ├── SimulationPanel.tsx # Route simulation
│           └── StatsGrid.tsx     # Stats overview cards
├── public/                       # Static assets
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── vercel.json
```

---

## 👤 Author

**Jeshpreet Mahun** — Fleet Operations Manager

---

Built with **Next.js** · **Tailwind CSS** · **Framer Motion**
