# Vaayu-Net 🍃 

**Vaayu-Net** is an advanced, real-time Air Quality Index (AQI) Monitoring Dashboard. It is designed to track, analyze, and visualize environmental data with high precision using interactive geospatial mapping, intelligent AI insights, and dynamic analytics. 

## ✨ Key Features
- **Real-Time Interactive AQI Map**: Built with Leaflet and Mapbox GL for highly responsive, interactive geographic data visualization of local air quality.
- **AI-Powered Insights**: Integrates Google Generative AI (Gemini) to provide intelligent forecasting, alerting, and analysis of current atmospheric parameters.
- **Dynamic Analytics**: Powered by Recharts to display historical air quality trends, pollutant distributions, and predictive modeling.
- **Premium User Interface**: Fluid, responsive, and glassmorphic UI built natively with Next.js, React 19, Tailwind CSS v4, and Framer Motion.
- **Scalable Architecture**: Contains a `dashboard` frontend, with infrastructure prepared for a future robust backend data `ingestor`.

## 🛠️ Technology Stack
- **Framework**: [Next.js 16](https://nextjs.org/) & [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Maps**: [Leaflet](https://leafletjs.com/) & [Mapbox GL](https://www.mapbox.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI**: [@google/generative-ai](https://ai.google.dev/) (Gemini)
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v20+) installed.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jesh-27-ghost/Vaayu-Net-.git
   cd Vaayu-Net-/dashboard
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the `dashboard` directory and add your required API keys (e.g., Mapbox Access Token, Gemini API Key).
   ```env
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **View the Dashboard:**
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

## 📂 Project Structure

```text
Vaayu-Net/
├── dashboard/        # Main Next.js Web App
│   ├── src/          # React components, pages, and API hooks
│   ├── public/       # Static web assets
│   ├── package.json  # Frontend dependencies
│   └── ...
└── ingestor/         # Future backend service intended for real-time hardware data ingestion
```

## 📜 License
This project is open-source and available for monitoring purposes to promote environmental awareness and safety.
