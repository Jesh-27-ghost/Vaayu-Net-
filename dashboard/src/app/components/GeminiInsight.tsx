'use client';

import { useState, useEffect, useRef } from 'react';

const INSIGHTS = [
  {
    type: 'prediction' as const,
    icon: '🧬',
    title: 'Shelf-Life Prediction',
    cargo: 'Organic Tomatoes (Truck A)',
    risk: 'high' as const,
    confidence: 0.87,
    message: 'Estimated 28% shelf-life reduction due to SO₂ and PM2.5 exposure in Okhla Industrial corridor. AQI exposure of 380+ for 12 min is degrading surface integrity.',
    recommendation: 'Reroute via Faridabad bypass to preserve 24% additional freshness.',
    metrics: [
      { label: 'PM2.5', value: '380 µg/m³', status: 'critical' },
      { label: 'SO₂', value: '120 ppb', status: 'warning' },
      { label: 'Temp', value: '8°C', status: 'ok' },
    ],
  },
  {
    type: 'alert' as const,
    icon: '⚠️',
    title: 'Contamination Risk Alert',
    cargo: 'Dairy Products (Truck B)',
    risk: 'medium' as const,
    confidence: 0.74,
    message: 'Humidity spike detected near NH-48. Combined with elevated NO₂ levels, organic dairy is showing early signs of oxidative stress.',
    recommendation: 'Activate refrigeration mode + seal vents. ETA to green zone: 8 min.',
    metrics: [
      { label: 'NO₂', value: '85 ppb', status: 'warning' },
      { label: 'Humidity', value: '78%', status: 'warning' },
      { label: 'Temp', value: '6°C', status: 'ok' },
    ],
  },
  {
    type: 'insight' as const,
    icon: '📊',
    title: 'Route Optimization Report',
    cargo: 'Daily Fleet Summary',
    risk: 'low' as const,
    confidence: 0.92,
    message: 'Today\'s fresh-route adoption saved ₹2.4L across 47 deliveries. Average freshness retention improved from 71% to 94%. PM2.5 exposure reduced by 82%.',
    recommendation: 'Recommend expanding fresh-route to evening shift (6PM-10PM) for additional ₹1.1L savings.',
    metrics: [
      { label: 'Savings', value: '₹2.4L', status: 'ok' },
      { label: 'Routes', value: '47', status: 'ok' },
      { label: 'Fresh%', value: '94%', status: 'ok' },
    ],
  },
];

export default function GeminiInsight() {
  const [activeInsight, setActiveInsight] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const insight = INSIGHTS[activeInsight];

  // Typewriter effect for message
  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const text = insight.message;

    const type = () => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        timeoutRef.current = setTimeout(type, 12);
      } else {
        setIsTyping(false);
      }
    };

    timeoutRef.current = setTimeout(type, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeInsight]);

  // Auto-cycle insights
  useEffect(() => {
    const t = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % INSIGHTS.length);
    }, 15000);
    return () => clearInterval(t);
  }, []);

  const riskColors = {
    low: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', border: 'rgba(34,197,94,0.3)' },
    medium: { bg: 'rgba(249,115,22,0.1)', color: '#f97316', border: 'rgba(249,115,22,0.3)' },
    high: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  };

  const statusColors = {
    ok: '#22c55e',
    warning: '#f97316',
    critical: '#ef4444',
  };

  const risk = riskColors[insight.risk];

  return (
    <div
      className="glass-panel animate-slide-up stagger-5"
      style={{ padding: 16, opacity: 0 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="section-label" style={{ marginBottom: 0 }}>
          🤖 Gemini AI Insights
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {isTyping && (
            <div style={{ display: 'flex', gap: 2, marginRight: 6 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#a78bfa',
                    animation: `pulse-live 1s ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          )}
          <span className="badge badge-purple">
            Gemini 2.0 Pro
          </span>
        </div>
      </div>

      {/* Insight tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {INSIGHTS.map((ins, i) => (
          <button
            key={i}
            onClick={() => setActiveInsight(i)}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: 8,
              border: `1px solid ${i === activeInsight ? '#a78bfa40' : '#1e293b'}`,
              background: i === activeInsight ? 'rgba(167,139,250,0.1)' : 'transparent',
              color: i === activeInsight ? '#c4b5fd' : '#64748b',
              fontSize: 10,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {ins.icon} {ins.type === 'prediction' ? 'Predict' : ins.type === 'alert' ? 'Alert' : 'Report'}
          </button>
        ))}
      </div>

      {/* Insight card */}
      <div
        key={activeInsight}
        className="animate-fade-in"
        style={{
          background: '#0f172a',
          borderRadius: 12,
          border: '1px solid #1e293b',
          padding: 14,
        }}
      >
        {/* Title & risk */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>
              {insight.icon} {insight.title}
            </div>
            <div style={{ fontSize: 10, color: '#64748b' }}>{insight.cargo}</div>
          </div>
          <div
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              fontSize: 9,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              background: risk.bg,
              color: risk.color,
              border: `1px solid ${risk.border}`,
            }}
          >
            {insight.risk} risk
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {insight.metrics.map((m, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: 8,
                background: '#111827',
                border: '1px solid #1e293b',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 8, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {m.label}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: statusColors[m.status as keyof typeof statusColors],
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: 2,
                }}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Message (typewriter) */}
        <div
          style={{
            fontSize: 11,
            color: '#cbd5e1',
            lineHeight: 1.7,
            marginBottom: 10,
            minHeight: 44,
            borderLeft: '2px solid #a78bfa30',
            paddingLeft: 10,
          }}
        >
          {displayedText}
          {isTyping && <span style={{ color: '#a78bfa', animation: 'blink 1s infinite' }}>▊</span>}
        </div>

        {/* Recommendation */}
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            background: 'rgba(167,139,250,0.06)',
            border: '1px solid rgba(167,139,250,0.15)',
            fontSize: 10,
            color: '#94a3b8',
          }}
        >
          <span style={{ color: '#a78bfa', fontWeight: 600 }}>💡 Recommendation:</span>{' '}
          {insight.recommendation}
        </div>

        {/* Confidence */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 80, height: 3, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${insight.confidence * 100}%`,
                  background: 'linear-gradient(90deg, #a78bfa60, #a78bfa)',
                  borderRadius: 4,
                }}
              />
            </div>
            <span style={{ fontSize: 9, color: '#a78bfa', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
              {Math.round(insight.confidence * 100)}% confidence
            </span>
          </div>
          <span style={{ fontSize: 9, color: '#475569' }}>
            Updated just now
          </span>
        </div>
      </div>
    </div>
  );
}
