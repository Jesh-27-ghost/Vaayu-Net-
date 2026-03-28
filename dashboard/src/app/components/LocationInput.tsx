'use client';

import { useState } from 'react';

interface LocationInputProps {
  origin: string;
  destination: string;
  cargoType: string;
  aqiSensitivity: number;
  onOriginChange: (v: string) => void;
  onDestinationChange: (v: string) => void;
  onCargoChange: (v: string) => void;
  onSensitivityChange: (v: number) => void;
  onCalculate: () => void;
  routeCalculated: boolean;
}

const ORIGINS = ['Azadpur Mandi', 'Ghazipur Mandi', 'Okhla Mandi', 'Narela Mandi'];
const DESTINATIONS = ['South Delhi', 'Gurugram', 'Noida', 'Faridabad', 'Greater Noida'];
const CARGO_TYPES = [
  { value: 'Vegetables', icon: '🥬' },
  { value: 'Dairy', icon: '🥛' },
  { value: 'Fruits', icon: '🍎' },
  { value: 'Organic Goods', icon: '🌿' },
  { value: 'Fish & Seafood', icon: '🐟' },
  { value: 'Flowers', icon: '💐' },
];

export default function LocationInput({
  origin,
  destination,
  cargoType,
  aqiSensitivity,
  onOriginChange,
  onDestinationChange,
  onCargoChange,
  onSensitivityChange,
  onCalculate,
  routeCalculated,
}: LocationInputProps) {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(false);

  const handleGPSDetect = () => {
    setGpsLoading(true);
    setTimeout(() => {
      setGpsLoading(false);
      setGpsDetected(true);
      onOriginChange('Azadpur Mandi');
      setTimeout(() => setGpsDetected(false), 3000);
    }, 1500);
  };

  const sensitivityLabel =
    aqiSensitivity > 70 ? 'High' : aqiSensitivity > 40 ? 'Medium' : 'Low';
  const sensitivityColor =
    aqiSensitivity > 70 ? '#22c55e' : aqiSensitivity > 40 ? '#f97316' : '#ef4444';

  return (
    <div
      className="glass-panel animate-slide-up stagger-6"
      style={{ padding: 16, opacity: 0 }}
    >
      <div className="section-label">📍 Smart Location Input</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'start' }}>
        {/* Origin */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block' }}>
              Origin
            </label>
            <button
              onClick={handleGPSDetect}
              disabled={gpsLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 6px',
                borderRadius: 4,
                border: '1px solid #1e293b',
                background: gpsDetected ? 'rgba(34,197,94,0.1)' : 'transparent',
                color: gpsDetected ? '#22c55e' : '#64748b',
                fontSize: 9,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              {gpsLoading ? (
                <>
                  <span className="animate-spin-slow" style={{ display: 'inline-block' }}>⟳</span>
                  ...
                </>
              ) : gpsDetected ? (
                <>✅ GPS</>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
                  </svg>
                  Auto-detect
                </>
              )}
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <select
              value={origin}
              onChange={(e) => onOriginChange(e.target.value)}
              className="select-dark"
            >
              {ORIGINS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Destination */}
        <div>
          <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4, display: 'block', height: 16 }}>
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="select-dark"
          >
            {DESTINATIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Cargo Type */}
        <div>
          <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4, display: 'block', height: 16 }}>
            Cargo Type
          </label>
          <select
            value={cargoType}
            onChange={(e) => onCargoChange(e.target.value)}
            className="select-dark"
          >
            {CARGO_TYPES.map((c) => (
              <option key={c.value}>
                {c.icon} {c.value}
              </option>
            ))}
          </select>

          {/* AQI Sensitivity */}
          <div style={{ marginTop: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <span style={{ fontSize: 9, color: '#64748b' }}>AQI Sensitivity</span>
              <span style={{ fontSize: 9, color: sensitivityColor, fontWeight: 700 }}>{sensitivityLabel}</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={aqiSensitivity}
              onChange={(e) => onSensitivityChange(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: sensitivityColor,
                height: 4,
              }}
            />
          </div>
        </div>

        {/* Calculate Button */}
        <div>
          <button
            onClick={onCalculate}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              whiteSpace: 'nowrap',
              fontSize: 12,
            }}
          >
            ⚡ {routeCalculated ? 'Recalculate' : 'Calculate Routes'}
          </button>
        </div>
      </div>

      {/* Active route info */}
      {routeCalculated && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: 12,
            padding: '8px 14px',
            borderRadius: 10,
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#22c55e', fontWeight: 600 }}>
            <div className="animate-pulse-live" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            Fresh Route Active
          </div>
          <span style={{ color: '#94a3b8' }}>
            {origin} → {destination} | {cargoType} | Sensitivity: {sensitivityLabel}
          </span>
        </div>
      )}
    </div>
  );
}
