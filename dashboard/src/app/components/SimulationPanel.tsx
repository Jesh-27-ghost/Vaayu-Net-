'use client';

import { useState, useEffect, useRef } from 'react';

interface SimulationPanelProps {
  simulationMode: boolean;
  simProgress: number;
  routeCalculated: boolean;
  onToggleSimulation: () => void;
  onResetSimulation: () => void;
}

const ALERT_TEMPLATES = [
  { type: 'critical' as const, text: 'Okhla Industrial Area AQI spiked to 487. Auto-rerouting Truck A.' },
  { type: 'warning' as const, text: 'SO₂ levels elevated near NH-48. Exposure risk: HIGH for dairy cargo.' },
  { type: 'info' as const, text: 'Fresh Route via Faridabad Bypass confirmed. AQI avg: 65.' },
  { type: 'gemini' as const, text: '⚠️ Shelf-life of tomatoes reduced by 28% on standard route.' },
  { type: 'critical' as const, text: 'PM2.5 at 380µg/m³ near Anand Vihar. All fresh-routes diverted.' },
  { type: 'warning' as const, text: 'Wind direction shifting NW. AQI corridor expanding towards Dwarka.' },
  { type: 'info' as const, text: 'Green corridor through Mehrauli confirmed. ETA updated to 32 min.' },
  { type: 'gemini' as const, text: 'Dairy products on Truck B showing 12% quality degradation risk.' },
  { type: 'critical' as const, text: 'Emergency: AQI reading 512 at Wazirpur Industrial. All routes diverted.' },
  { type: 'info' as const, text: 'Truck B maintaining optimal freshness at 96%. Route on track.' },
  { type: 'warning' as const, text: 'Humidity spike detected. Organic goods spoilage risk elevated.' },
  { type: 'gemini' as const, text: 'Recommend switching to refrigerated transport for Route A cargo.' },
];

const ALERT_CONFIG = {
  critical: { badge: '🔴 CRITICAL', badgeColor: '#ef4444', bgColor: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)' },
  warning: { badge: '🟠 WARNING', badgeColor: '#f97316', bgColor: 'rgba(249,115,22,0.06)', borderColor: 'rgba(249,115,22,0.2)' },
  info: { badge: '🟢 INFO', badgeColor: '#22c55e', bgColor: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.2)' },
  gemini: { badge: '🤖 GEMINI', badgeColor: '#a78bfa', bgColor: 'rgba(167,139,250,0.06)', borderColor: 'rgba(167,139,250,0.2)' },
};

export default function SimulationPanel({
  simulationMode,
  simProgress,
  routeCalculated,
  onToggleSimulation,
  onResetSimulation,
}: SimulationPanelProps) {
  const [alerts, setAlerts] = useState<Array<{ id: number; type: string; text: string; time: number }>>([]);
  const alertIdRef = useRef(0);
  const alertIndexRef = useRef(0);

  // Initialize and auto-feed alerts
  useEffect(() => {
    const initial = ALERT_TEMPLATES.slice(0, 4).map((t, i) => ({
      id: ++alertIdRef.current,
      type: t.type,
      text: t.text,
      time: Date.now() - i * 15000,
    }));
    alertIndexRef.current = 4;
    setAlerts(initial);

    const t = setInterval(() => {
      const template = ALERT_TEMPLATES[alertIndexRef.current % ALERT_TEMPLATES.length];
      alertIndexRef.current++;
      setAlerts((prev) =>
        [
          {
            id: ++alertIdRef.current,
            type: template.type,
            text: template.text,
            time: Date.now(),
          },
          ...prev,
        ].slice(0, 15)
      );
    }, 12000);

    return () => clearInterval(t);
  }, []);

  function timeAgo(ts: number) {
    const seconds = Math.round((Date.now() - ts) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  }

  return (
    <div
      className="glass-panel animate-slide-up stagger-5"
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        opacity: 0,
      }}
    >
      {/* Simulation Controls */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="section-label" style={{ marginBottom: 0 }}>📊 Route Simulation</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={onToggleSimulation}
              disabled={!routeCalculated}
              style={{
                padding: '5px 12px',
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 700,
                cursor: routeCalculated ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                border: 'none',
                background: simulationMode
                  ? 'rgba(239,68,68,0.15)'
                  : routeCalculated
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : '#1e293b',
                color: simulationMode ? '#ef4444' : routeCalculated ? '#fff' : '#475569',
                boxShadow: !simulationMode && routeCalculated ? '0 0 12px rgba(34,197,94,0.3)' : 'none',
              }}
            >
              {simulationMode ? '⏹ Stop' : '▶ Start Simulation'}
            </button>
            {simulationMode && (
              <button
                onClick={onResetSimulation}
                className="btn-ghost"
                style={{ padding: '5px 10px', fontSize: 10 }}
              >
                ⟳ Reset
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {simulationMode && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 9, color: '#64748b' }}>Progress</span>
              <span style={{ fontSize: 9, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                {Math.round(simProgress * 100)}%
              </span>
            </div>
            <div style={{ height: 4, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${simProgress * 100}%`,
                  background: 'linear-gradient(90deg, #22c55e, #86efac)',
                  borderRadius: 4,
                  transition: 'width 0.1s linear',
                  boxShadow: '0 0 8px rgba(34,197,94,0.4)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Live Alerts Feed */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div className="section-label" style={{ marginBottom: 0 }}>🔔 Live Alerts</div>
          <span style={{ fontSize: 9, color: '#475569' }}>{alerts.length} events</span>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            maxHeight: 280,
          }}
        >
          {alerts.map((alert) => {
            const cfg = ALERT_CONFIG[alert.type as keyof typeof ALERT_CONFIG] || ALERT_CONFIG.info;
            return (
              <div
                key={alert.id}
                className="animate-fade-in"
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: cfg.bgColor,
                  border: `1px solid ${cfg.borderColor}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = cfg.bgColor.replace('0.06', '0.12'))}
                onMouseLeave={(e) => (e.currentTarget.style.background = cfg.bgColor)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: cfg.badgeColor }}>{cfg.badge}</span>
                  <span style={{ fontSize: 8, color: '#475569' }}>{timeAgo(alert.time)}</span>
                </div>
                <p style={{ fontSize: 10, lineHeight: 1.5, color: '#cbd5e1', margin: 0 }}>
                  {alert.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
