'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StatsGrid from '../components/StatsGrid';
import dynamic from 'next/dynamic';
const AQIMap = dynamic(() => import('../components/AQIMap'), { ssr: false });
import RouteComparison from '../components/RouteComparison';
import FleetTracker from '../components/FleetTracker';
import FreshnessMeter from '../components/FreshnessMeter';
import GeminiInsight from '../components/GeminiInsight';
import LocationInput from '../components/LocationInput';
import SimulationPanel from '../components/SimulationPanel';
import Modals from '../components/Modals';

// ─── AQI Grid Generator ─────────────────────────────────────────
function generateAQIGrid(rows: number, cols: number, seed?: number[][]) {
  const grid: number[][] = [];
  const hotspots = [
    { r: 5, c: 38, intensity: 460, radius: 10 },  // Okhla Industrial
    { r: 3, c: 41, intensity: 490, radius: 8 },    // Industrial East
    { r: 14, c: 26, intensity: 340, radius: 8 },   // Central congestion
    { r: 20, c: 10, intensity: 310, radius: 7 },   // NH-48 corridor
    { r: 8, c: 40, intensity: 380, radius: 6 },    // Anand Vihar
  ];
  const parks = [
    { r: 22, c: 4, intensity: -200, radius: 9 },    // South park
    { r: 1, c: 1, intensity: -160, radius: 8 },     // Ridge Park
    { r: 25, c: 18, intensity: -180, radius: 10 },  // Faridabad green belt
    { r: 12, c: 2, intensity: -130, radius: 7 },    // West green zone
    { r: 26, c: 34, intensity: -140, radius: 7 },   // SE green
  ];

  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      let aqi = 110 + Math.random() * 80;
      for (const h of hotspots) {
        const dist = Math.sqrt((r - h.r) ** 2 + (c - h.c) ** 2);
        if (dist < h.radius) aqi += h.intensity * Math.pow(1 - dist / h.radius, 1.5);
      }
      for (const p of parks) {
        const dist = Math.sqrt((r - p.r) ** 2 + (c - p.c) ** 2);
        if (dist < p.radius) aqi += p.intensity * Math.pow(1 - dist / p.radius, 1.5);
      }
      if (seed && seed[r] && seed[r][c]) {
        aqi = seed[r][c] + (Math.random() - 0.5) * 25;
      }
      grid[r][c] = Math.max(10, Math.min(500, Math.round(aqi)));
    }
  }
  return grid;
}

// ─── Main Page ───────────────────────────────────────────────────
export default function FreshRouteDashboard() {
  // State
  const [aqiGrid, setAqiGrid] = useState<number[][]>(() => generateAQIGrid(28, 48));
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [origin, setOrigin] = useState('Azadpur Mandi');
  const [destination, setDestination] = useState('South Delhi');
  const [cargoType, setCargoType] = useState('Vegetables');
  const [aqiSensitivity, setAqiSensitivity] = useState(70);
  const [savingsCount, setSavingsCount] = useState(0);
  const [activeModal, setActiveModal] = useState<'settings' | 'help' | 'profile' | null>(null);

  // Auto-refresh AQI grid
  useEffect(() => {
    const t = setInterval(() => {
      setAqiGrid((prev) => generateAQIGrid(28, 48, prev));
    }, 30000);
    return () => clearInterval(t);
  }, []);

  // Simulation animation
  useEffect(() => {
    if (!simulationMode) return;
    const t = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 1) return 0;
        return prev + 0.006;
      });
    }, 50);
    return () => clearInterval(t);
  }, [simulationMode]);

  // Savings counter animation
  useEffect(() => {
    if (!routeCalculated) return;
    const target = 17200;
    const duration = 2000;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setSavingsCount(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [routeCalculated]);

  const handleCalculateRoutes = useCallback(() => {
    setRouteCalculated(true);
    setSimProgress(0);
    setSavingsCount(0);
  }, []);

  const handleToggleSimulation = useCallback(() => {
    setSimulationMode((s) => !s);
    if (!routeCalculated) handleCalculateRoutes();
  }, [routeCalculated, handleCalculateRoutes]);

  const handleResetSimulation = useCallback(() => {
    setSimulationMode(false);
    setSimProgress(0);
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <Header
        onOpenSettings={() => setActiveModal('settings')}
        onOpenHelp={() => setActiveModal('help')}
        onOpenProfile={() => setActiveModal('profile')}
        simulationMode={simulationMode}
        onToggleSimulation={handleToggleSimulation}
      />

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Row 1: Stats */}
          <StatsGrid routeCalculated={routeCalculated} aqiGrid={aqiGrid} />

          {/* Row 2: Map + Right Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 12, minHeight: 520 }}>
            {/* Left Column: Map */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 520 }}>
              <AQIMap
                aqiGrid={aqiGrid}
                routeCalculated={routeCalculated}
                simulationMode={simulationMode}
                simProgress={simProgress}
                origin={origin}
                destination={destination}
              />
            </div>

            {/* Right Column: Panels */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                overflowY: 'auto',
                minHeight: 0,
              }}
            >
              <FreshnessMeter
                routeCalculated={routeCalculated}
                simulationMode={simulationMode}
                simProgress={simProgress}
              />
              <RouteComparison routeCalculated={routeCalculated} savingsCount={savingsCount} />
              <SimulationPanel
                simulationMode={simulationMode}
                simProgress={simProgress}
                routeCalculated={routeCalculated}
                onToggleSimulation={handleToggleSimulation}
                onResetSimulation={handleResetSimulation}
              />
            </div>
          </div>

          {/* Row 3: Location Input */}
          <LocationInput
            origin={origin}
            destination={destination}
            cargoType={cargoType}
            aqiSensitivity={aqiSensitivity}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
            onCargoChange={setCargoType}
            onSensitivityChange={setAqiSensitivity}
            onCalculate={handleCalculateRoutes}
            routeCalculated={routeCalculated}
          />

          {/* Row 4: Fleet Tracker + Gemini */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 12 }}>
            <FleetTracker />
            <GeminiInsight />
          </div>

          {/* Footer */}
          <footer
            style={{
              textAlign: 'center',
              padding: '16px 0 8px',
              fontSize: 11,
              color: '#475569',
              borderTop: '1px solid #1e293b',
            }}
          >
            Built with{' '}
            <span style={{ color: '#f1f5f9' }}>Next.js</span> ·{' '}
            <span style={{ color: '#f1f5f9' }}>Tailwind CSS</span> ·{' '}
            <span style={{ color: '#f1f5f9' }}>Framer Motion</span>
            {' '} — by <span style={{ color: '#22c55e', fontWeight: 600 }}>Jeshpreet Mahun</span>
          </footer>
        </main>
      </div>

      {/* Modals */}
      <Modals type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}

