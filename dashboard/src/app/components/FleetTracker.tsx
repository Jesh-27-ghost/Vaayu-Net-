'use client';

import { useState, useEffect } from 'react';

const FLEET_DATA = [
  { id: 'FRE-001', driver: 'Rajesh K.', cargo: 'Organic Tomatoes', route: 'Fresh', origin: 'Azadpur', dest: 'South Delhi', aqi: 65, freshness: 96, status: 'In Transit', eta: '12 min', speed: 34 },
  { id: 'FRE-002', driver: 'Amit P.', cargo: 'Dairy Products', route: 'Standard', origin: 'Ghazipur', dest: 'Gurugram', aqi: 320, freshness: 68, status: 'Warning', eta: '28 min', speed: 22 },
  { id: 'FRE-003', driver: 'Suresh M.', cargo: 'Fresh Fruits', route: 'Fresh', origin: 'Okhla', dest: 'Noida', aqi: 85, freshness: 94, status: 'In Transit', eta: '18 min', speed: 40 },
  { id: 'FRE-004', driver: 'Priya S.', cargo: 'Vegetables', route: 'Fresh', origin: 'Azadpur', dest: 'Faridabad', aqi: 55, freshness: 98, status: 'In Transit', eta: '35 min', speed: 28 },
  { id: 'FRE-005', driver: 'Kumar R.', cargo: 'Fish & Seafood', route: 'Standard', origin: 'Ghazipur', dest: 'South Delhi', aqi: 450, freshness: 42, status: 'Critical', eta: '8 min', speed: 18 },
  { id: 'FRE-006', driver: 'Neha T.', cargo: 'Organic Greens', route: 'Fresh', origin: 'Azadpur', dest: 'Gurugram', aqi: 72, freshness: 95, status: 'In Transit', eta: '22 min', speed: 36 },
];

export default function FleetTracker() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 3000);
    return () => clearInterval(t);
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'In Transit': return { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', border: 'rgba(34,197,94,0.3)' };
      case 'Warning': return { bg: 'rgba(249,115,22,0.1)', color: '#f97316', border: 'rgba(249,115,22,0.3)' };
      case 'Critical': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' };
      default: return { bg: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' };
    }
  };

  // Slightly vary speeds based on time to make it feel alive
  const varySpeed = (base: number) => base + Math.round(Math.sin(now / 5000) * 3);

  return (
    <div
      className="glass-panel animate-slide-up stagger-4"
      style={{ padding: 16, opacity: 0 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="section-label" style={{ marginBottom: 0 }}>🚛 Fleet Tracker</div>
        <span className="badge badge-green">
          {FLEET_DATA.filter(t => t.status === 'In Transit').length} Active
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              {['Vehicle', 'Cargo', 'Route', 'AQI', 'Fresh%', 'Speed', 'ETA', 'Status'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '6px 8px',
                    fontWeight: 600,
                    color: '#64748b',
                    fontSize: 9,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FLEET_DATA.map((truck) => {
              const statusStyle = getStatusStyle(truck.status);
              return (
                <tr
                  key={truck.id}
                  style={{
                    borderBottom: '1px solid rgba(30,41,59,0.5)',
                    transition: 'background 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '8px', color: '#f1f5f9', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                    {truck.id}
                    <div style={{ fontSize: 9, color: '#64748b', fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                      {truck.driver}
                    </div>
                  </td>
                  <td style={{ padding: '8px', color: '#cbd5e1' }}>{truck.cargo}</td>
                  <td style={{ padding: '8px' }}>
                    <span className={`badge badge-${truck.route === 'Fresh' ? 'green' : 'red'}`}>
                      {truck.route}
                    </span>
                  </td>
                  <td style={{ padding: '8px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: truck.aqi > 300 ? '#ef4444' : truck.aqi > 100 ? '#f97316' : '#22c55e' }}>
                    {truck.aqi}
                  </td>
                  <td style={{ padding: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, height: 4, background: '#1e293b', borderRadius: 4, overflow: 'hidden', minWidth: 40 }}>
                        <div style={{
                          height: '100%',
                          width: `${truck.freshness}%`,
                          background: truck.freshness > 80 ? '#22c55e' : truck.freshness > 50 ? '#f97316' : '#ef4444',
                          borderRadius: 4,
                          transition: 'width 0.5s',
                        }} />
                      </div>
                      <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                        {truck.freshness}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '8px', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                    {varySpeed(truck.speed)} km/h
                  </td>
                  <td style={{ padding: '8px', color: '#cbd5e1', fontWeight: 500 }}>
                    {truck.eta}
                  </td>
                  <td style={{ padding: '8px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 600,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`,
                      }}
                    >
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: statusStyle.color,
                        ...(truck.status === 'Critical' ? { animation: 'pulse-live 1s infinite' } : {}),
                      }} />
                      {truck.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
