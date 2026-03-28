'use client';

import { useEffect, useState } from 'react';

interface FreshnessMeterProps {
  routeCalculated: boolean;
  simulationMode: boolean;
  simProgress: number;
}

function GaugeCard({
  label,
  subtitle,
  value,
  color,
  gradientId,
  avgAqi,
  warning,
  icon,
}: {
  label: string;
  subtitle: string;
  value: number;
  color: string;
  gradientId: string;
  avgAqi: number;
  warning: string;
  icon: string;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const arc = circumference * 0.75;
  const offset = arc - (arc * value) / 100;

  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid #1e293b',
        borderRadius: 14,
        padding: 16,
        textAlign: 'center',
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.boxShadow = `0 0 20px ${color}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1e293b';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Subtle top glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: 1,
          background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
        }}
      />

      <div style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1', marginBottom: 2 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 9, color: '#64748b', marginBottom: 8 }}>{subtitle}</div>

      <svg width="100" height="75" viewBox="0 0 100 80">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="50%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
          <filter id={`shadow-${gradientId}`}>
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.5" />
          </filter>
        </defs>
        {/* Background arc */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="7"
          strokeDasharray={`${arc} ${circumference}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          transform="rotate(135 50 50)"
        />
        {/* Value arc */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="7"
          strokeDasharray={`${arc} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(135 50 50)"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
          filter={`url(#shadow-${gradientId})`}
        />
        {/* Value text */}
        <text
          x="50"
          y="46"
          textAnchor="middle"
          fontSize="20"
          fontWeight="800"
          fill={color}
          fontFamily="'JetBrains Mono', monospace"
        >
          {value}%
        </text>
        <text x="50" y="60" textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="Inter, sans-serif">
          freshness
        </text>
      </svg>

      <div
        style={{
          fontSize: 9,
          marginTop: 4,
          color: color === '#ef4444' ? '#fca5a5' : '#86efac',
          fontWeight: 500,
        }}
      >
        {warning}
      </div>
      <div style={{ fontSize: 9, marginTop: 4, color: '#64748b' }}>
        Avg AQI:{' '}
        <span
          style={{
            color: avgAqi > 200 ? '#ef4444' : avgAqi > 100 ? '#f97316' : '#22c55e',
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {avgAqi}
        </span>
      </div>
    </div>
  );
}

export default function FreshnessMeter({
  routeCalculated,
  simulationMode,
  simProgress,
}: FreshnessMeterProps) {
  const [freshA, setFreshA] = useState(0);
  const [freshB, setFreshB] = useState(0);

  useEffect(() => {
    if (routeCalculated) {
      const duration = 1500;
      const start = Date.now();
      const targetA = simulationMode ? Math.max(38, 72 - simProgress * 20) : 72;
      const targetB = simulationMode ? Math.min(99, 96 + simProgress * 2) : 96;
      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setFreshA(Math.round(targetA * ease));
        setFreshB(Math.round(targetB * ease));
        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    } else {
      setFreshA(0);
      setFreshB(0);
    }
  }, [routeCalculated, simulationMode, simProgress > 0.5]);

  return (
    <div
      className="glass-panel animate-slide-up stagger-2"
      style={{ padding: 16, opacity: 0 }}
    >
      <div className="section-label">🧊 Freshness Monitor</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <GaugeCard
          label="Truck A"
          subtitle="Standard Route"
          value={freshA}
          color="#ef4444"
          gradientId="gaugeA"
          avgAqi={380}
          warning="⚠️ 28% shelf-life lost"
          icon="🔴"
        />
        <GaugeCard
          label="Truck B"
          subtitle="Fresh Route"
          value={freshB}
          color="#22c55e"
          gradientId="gaugeB"
          avgAqi={65}
          warning="✅ Optimal freshness"
          icon="🟢"
        />
      </div>

      {/* Comparison bar */}
      {routeCalculated && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: 12,
            padding: '8px 12px',
            background: '#0f172a',
            borderRadius: 10,
            border: '1px solid #1e293b',
          }}
        >
          <div style={{ fontSize: 9, color: '#64748b', marginBottom: 6, fontWeight: 600, letterSpacing: '0.5px' }}>
            SHELF-LIFE COMPARISON
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ height: 6, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${freshA}%`, background: 'linear-gradient(90deg, #ef444460, #ef4444)', borderRadius: 4, transition: 'width 1.5s' }} />
              </div>
            </div>
            <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", minWidth: 30, textAlign: 'center' }}>
              {freshA}%
            </span>
            <span style={{ fontSize: 9, color: '#475569' }}>vs</span>
            <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", minWidth: 30, textAlign: 'center' }}>
              {freshB}%
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ height: 6, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${freshB}%`, background: 'linear-gradient(90deg, #22c55e60, #22c55e)', borderRadius: 4, transition: 'width 1.5s' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
