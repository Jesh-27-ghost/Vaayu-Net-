'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenProfile: () => void;
  simulationMode: boolean;
  onToggleSimulation: () => void;
}

export default function Header({
  onOpenSettings,
  onOpenHelp,
  onOpenProfile,
  simulationMode,
  onToggleSimulation,
}: HeaderProps) {
  const [clock, setClock] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header
      style={{
        height: 56,
        background: 'linear-gradient(180deg, #111827 0%, #0d1117 100%)',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #22c55e20, #16a34a30)',
            border: '1px solid rgba(34,197,94,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          🚛
        </div>
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 16,
              color: '#f1f5f9',
              letterSpacing: '-0.3px',
              lineHeight: 1.1,
            }}
          >
            Fresh-Route{' '}
            <span style={{ color: '#22c55e' }}>Engine</span>
          </div>
          <div
            style={{
              fontSize: 10,
              color: '#64748b',
              letterSpacing: '0.5px',
            }}
          >
            AQI-Optimized Logistics
          </div>
        </div>
        <span className="badge badge-green" style={{ marginLeft: 4 }}>
          v2.0
        </span>
      </div>

      {/* Center: Search */}
      <div
        style={{
          position: 'relative',
          width: 320,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: searchFocused ? '#1e293b' : '#151d2e',
            border: `1px solid ${searchFocused ? '#22c55e40' : '#1e293b'}`,
            borderRadius: 10,
            padding: '7px 12px',
            transition: 'all 0.2s',
            boxShadow: searchFocused
              ? '0 0 0 3px rgba(34,197,94,0.08)'
              : 'none',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search routes, vehicles, zones..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f1f5f9',
              fontSize: 12,
              marginLeft: 8,
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: '#475569',
              background: '#0f172a',
              padding: '2px 6px',
              borderRadius: 4,
              border: '1px solid #1e293b',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            ⌘K
          </span>
        </div>
      </div>

      {/* Right: Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* LIVE indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            className="animate-pulse-live"
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e',
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#22c55e',
              letterSpacing: 1.5,
            }}
          >
            LIVE
          </span>
        </div>

        {/* Clock */}
        <span
          style={{
            fontSize: 12,
            color: '#94a3b8',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 500,
          }}
        >
          {clock}
        </span>

        {/* Divider */}
        <div
          style={{ width: 1, height: 24, background: '#1e293b' }}
        />

        {/* Simulation Toggle */}
        <button
          onClick={onToggleSimulation}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 12px',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            background: simulationMode
              ? 'rgba(34,197,94,0.12)'
              : 'rgba(100,116,139,0.12)',
            color: simulationMode ? '#22c55e' : '#94a3b8',
            border: `1px solid ${
              simulationMode
                ? 'rgba(34,197,94,0.3)'
                : 'rgba(100,116,139,0.2)'
            }`,
            transition: 'all 0.25s',
            fontFamily: 'inherit',
          }}
        >
          <div
            className="toggle-switch"
            style={{
              background: simulationMode ? '#22c55e' : '#334155',
            }}
          >
            <div
              className="toggle-knob"
              style={{ left: simulationMode ? 19 : 3 }}
            />
          </div>
          Simulation
        </button>

        {/* Divider */}
        <div
          style={{ width: 1, height: 24, background: '#1e293b' }}
        />

        {/* Action buttons */}
        {[
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            ),
            action: onOpenSettings,
            tip: 'Settings',
          },
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r="0.5" fill="currentColor" />
              </svg>
            ),
            action: onOpenHelp,
            tip: 'Help',
          },
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            ),
            action: onOpenProfile,
            tip: 'Profile',
          },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className="tooltip"
            data-tip={btn.tip}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1e293b';
              e.currentTarget.style.borderColor = '#334155';
              e.currentTarget.style.color = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            {btn.icon}
          </button>
        ))}

        {/* User avatar */}
        <button
          onClick={onOpenProfile}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            border: '2px solid #1e293b',
            cursor: 'pointer',
          }}
        >
          JM
        </button>
      </div>
    </header>
  );
}
