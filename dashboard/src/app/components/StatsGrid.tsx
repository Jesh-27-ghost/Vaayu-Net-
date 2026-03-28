'use client';

import { useMemo, useEffect, useState } from 'react';

interface StatsGridProps {
  routeCalculated: boolean;
  aqiGrid: number[][];
}

export default function StatsGrid({ routeCalculated, aqiGrid }: StatsGridProps) {
  const [savingsCount, setSavingsCount] = useState(0);
  const [deliveriesCount, setDeliveriesCount] = useState(0);
  const [fleetCount, setFleetCount] = useState(0);

  const zoneStats = useMemo(() => {
    let green = 0, orange = 0, red = 0;
    aqiGrid.forEach((row) =>
      row.forEach((v) => {
        if (v <= 100) green++;
        else if (v <= 300) orange++;
        else red++;
      })
    );
    const total = green + orange + red;
    return {
      green,
      orange,
      red,
      greenPct: total ? Math.round((green / total) * 100) : 0,
      avgAqi: Math.round(
        aqiGrid.reduce((s, r) => s + r.reduce((a, b) => a + b, 0), 0) /
          Math.max(1, aqiGrid.reduce((s, r) => s + r.length, 0))
      ),
    };
  }, [aqiGrid]);

  // Animate counters
  useEffect(() => {
    const duration = 2000;
    const start = Date.now();
    const targetSavings = routeCalculated ? 17200 : 0;
    const targetDeliveries = 847;
    const targetFleet = 42;

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setSavingsCount(Math.round(targetSavings * ease));
      setDeliveriesCount(Math.round(targetDeliveries * ease));
      setFleetCount(Math.round(targetFleet * ease));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [routeCalculated]);

  const stats = [
    {
      emoji: '💰',
      label: 'Net Savings',
      value: `₹${savingsCount.toLocaleString('en-IN')}`,
      subtext: routeCalculated ? 'per shipment' : 'calculate route first',
      color: '#22c55e',
      progress: routeCalculated ? 85 : 0,
    },
    {
      emoji: '🌍',
      label: 'Avg AQI',
      value: zoneStats.avgAqi.toString(),
      subtext: zoneStats.avgAqi > 200 ? 'Unhealthy' : zoneStats.avgAqi > 100 ? 'Moderate' : 'Good',
      color: zoneStats.avgAqi > 200 ? '#ef4444' : zoneStats.avgAqi > 100 ? '#f97316' : '#22c55e',
      progress: Math.min(100, Math.round((zoneStats.avgAqi / 500) * 100)),
    },
    {
      emoji: '📦',
      label: 'Deliveries Today',
      value: deliveriesCount.toString(),
      subtext: `${zoneStats.greenPct}% via green routes`,
      color: '#3b82f6',
      progress: 72,
    },
    {
      emoji: '🚛',
      label: 'Active Fleet',
      value: `${fleetCount}/50`,
      subtext: 'vehicles in transit',
      color: '#a78bfa',
      progress: 84,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`stat-card animate-slide-up stagger-${i + 1}`}
          style={{ opacity: 0 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: '#64748b',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {stat.emoji} {stat.label}
            </div>
          </div>

          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: stat.color,
              lineHeight: 1,
              marginBottom: 6,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {stat.value}
          </div>

          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>
            {stat.subtext}
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: 3,
              background: '#1e293b',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${stat.progress}%`,
                background: `linear-gradient(90deg, ${stat.color}60, ${stat.color})`,
                borderRadius: 4,
                transition: 'width 1.5s ease-out',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
