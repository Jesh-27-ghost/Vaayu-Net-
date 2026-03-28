'use client';

interface RouteComparisonProps {
  routeCalculated: boolean;
  savingsCount: number;
}

export default function RouteComparison({ routeCalculated, savingsCount }: RouteComparisonProps) {
  const rows = [
    { metric: 'Distance', std: '12.3 km', fresh: '15.1 km', icon: '📏' },
    { metric: 'Transit Time', std: '28 min', fresh: '35 min', icon: '⏱️' },
    { metric: 'Avg AQI Exposure', std: '380', fresh: '65', icon: '🌫️', stdBadge: 'red', freshBadge: 'green' },
    { metric: 'Freshness Retained', std: '72%', fresh: '96%', icon: '🍃' },
    { metric: 'Spoilage Loss', std: '₹18,000', fresh: '₹800', icon: '📉' },
    { metric: 'Carbon Impact', std: 'High', fresh: 'Low', icon: '♻️', stdBadge: 'red', freshBadge: 'green' },
  ];

  return (
    <div
      className="glass-panel animate-slide-up stagger-3"
      style={{ padding: 16, opacity: 0 }}
    >
      <div className="section-label">📊 Route Comparison</div>

      <div
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          border: '1px solid #1e293b',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: '#1e293b' }}>
              <th
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontWeight: 600,
                  color: '#94a3b8',
                  fontSize: 10,
                }}
              >
                Metric
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '8px 12px',
                  fontWeight: 600,
                  color: '#ef4444',
                  fontSize: 10,
                }}
              >
                🔴 Standard
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '8px 12px',
                  fontWeight: 600,
                  color: '#22c55e',
                  fontSize: 10,
                }}
              >
                🟢 Fresh
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderTop: '1px solid #1e293b',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '8px 12px', color: '#cbd5e1' }}>
                  <span style={{ marginRight: 6 }}>{row.icon}</span>
                  {row.metric}
                </td>
                <td style={{ textAlign: 'right', padding: '8px 12px' }}>
                  {row.stdBadge ? (
                    <span className={`badge badge-${row.stdBadge}`}>{row.std}</span>
                  ) : (
                    <span style={{ color: '#f1f5f9' }}>{row.std}</span>
                  )}
                </td>
                <td style={{ textAlign: 'right', padding: '8px 12px' }}>
                  {row.freshBadge ? (
                    <span className={`badge badge-${row.freshBadge}`}>{row.fresh}</span>
                  ) : (
                    <span style={{ color: '#f1f5f9' }}>{row.fresh}</span>
                  )}
                </td>
              </tr>
            ))}

            {/* NET SAVINGS row */}
            <tr
              style={{
                background: 'rgba(34,197,94,0.08)',
                borderTop: '2px solid rgba(34,197,94,0.3)',
              }}
            >
              <td
                style={{
                  padding: '10px 12px',
                  fontWeight: 700,
                  color: '#22c55e',
                  fontSize: 12,
                }}
              >
                💰 NET SAVINGS
              </td>
              <td style={{ textAlign: 'right', padding: '10px 12px', color: '#64748b' }}>
                —
              </td>
              <td
                style={{
                  textAlign: 'right',
                  padding: '10px 12px',
                  fontWeight: 800,
                  color: '#22c55e',
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                ₹{routeCalculated ? savingsCount.toLocaleString('en-IN') : '0'} ✅
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Fleet impact */}
      {routeCalculated && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: 12,
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.15)',
            fontSize: 11,
            color: '#94a3b8',
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: '#22c55e', fontWeight: 600 }}>Fleet Impact:</span> For 200 trucks × 5 deliveries/day
          = <span style={{ color: '#22c55e', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>₹17.2L saved daily</span>
        </div>
      )}
    </div>
  );
}
