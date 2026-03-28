'use client';

import { useEffect, useRef, useMemo } from 'react';
import type { Map, Polyline, CircleMarker } from 'leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface AQIMapProps {
  aqiGrid: number[][]; // We won't use this directly for leaflet, but we'll show zones instead
  routeCalculated: boolean;
  simulationMode: boolean;
  simProgress: number;
  origin: string;
  destination: string;
}

// Coordinate paths for routes
// Standard Route passes through highly polluted areas (Okhla etc)
const stdPoints: [number, number][] = [
  [28.7300, 77.1700], // Azadpur
  [28.6600, 77.2100], 
  [28.6000, 77.2400], 
  [28.5300, 77.2800], // Okhla Traffic
  [28.4500, 77.3000], // South/Faridabad Border
];

// Fresh Route bypasses pollution via greener corridors
const freshPoints: [number, number][] = [
  [28.7300, 77.1700], // Azadpur
  [28.6800, 77.1500],
  [28.6200, 77.1300], // Ridge area
  [28.5500, 77.1800], // Green belt
  [28.4800, 77.2400], 
  [28.4500, 77.3000], // Destination
];

const HOTSPOTS = [
  { lat: 28.5300, lng: 77.2800, aqi: 480, name: 'Okhla Industrial' },
  { lat: 28.6600, lng: 77.3000, aqi: 380, name: 'Anand Vihar' },
  { lat: 28.6100, lng: 77.2300, aqi: 340, name: 'Central Delhi' },
  { lat: 28.6900, lng: 77.1400, aqi: 150, name: 'West Green Zone' },
  { lat: 28.4200, lng: 77.3200, aqi: 120, name: 'Faridabad Green Belt' }
];

export default function AQIMap({
  routeCalculated,
  simulationMode,
  simProgress,
  origin,
  destination,
}: AQIMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<Map | null>(null);
  const stdRouteLayer = useRef<Polyline | null>(null);
  const freshRouteLayer = useRef<Polyline | null>(null);
  const truckALayer = useRef<CircleMarker | null>(null);
  const truckBLayer = useRef<CircleMarker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;
    if (!leafletMap.current) {
      // Create map centered on Delhi NCR
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([28.5800, 77.2000], 11);

      // Dark theme map tiles (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Draw AQI Hotspots
      HOTSPOTS.forEach(spot => {
        let color = '#22c55e';
        if (spot.aqi > 300) color = '#ef4444';
        else if (spot.aqi > 150) color = '#f97316';

        L.circle([spot.lat, spot.lng], {
          color: 'transparent',
          fillColor: color,
          fillOpacity: 0.15,
          radius: spot.aqi > 300 ? 5000 : 3500
        }).addTo(map);

        L.circle([spot.lat, spot.lng], {
          color: 'transparent',
          fillColor: color,
          fillOpacity: 0.3,
          radius: spot.aqi > 300 ? 2500 : 1500
        }).addTo(map);

        L.marker([spot.lat, spot.lng], {
          icon: L.divIcon({
            className: 'custom-label',
            html: `<div style="color:${color}; font-size:10px; font-weight:700; text-shadow: 0 0 5px #000; white-space:nowrap;">${spot.name}</div>`,
            iconSize: [100, 20]
          })
        }).addTo(map);
      });

      // Markers for Origin / Dest
      L.circleMarker(stdPoints[0], { radius: 6, color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 1 }).addTo(map);
      L.marker(stdPoints[0], {
        icon: L.divIcon({ className: '', html: '<div style="color:#93c5fd; font-size:12px; font-weight:bold; margin-top:-20px; white-space:nowrap;">📍 Azadpur Origin</div>' })
      }).addTo(map);

      L.circleMarker(stdPoints[stdPoints.length-1], { radius: 6, color: '#a78bfa', fillColor: '#a78bfa', fillOpacity: 1 }).addTo(map);
      L.marker(stdPoints[stdPoints.length-1], {
        icon: L.divIcon({ className: '', html: '<div style="color:#c4b5fd; font-size:12px; font-weight:bold; margin-top:-20px; white-space:nowrap;">🏁 South Delhi Dest</div>' })
      }).addTo(map);

      leafletMap.current = map;
    }

    return () => {
      // Cleanup will happen when component unmounts
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []); // Run once

  // Handle Route display
  useEffect(() => {
    const map = leafletMap.current;
    if (!map) return;

    if (routeCalculated) {
      if (!stdRouteLayer.current) {
        stdRouteLayer.current = L.polyline(stdPoints, {
          color: '#ef4444', weight: 4, opacity: 0.7, lineCap: 'round', lineJoin: 'round'
        }).addTo(map);
      }
      if (!freshRouteLayer.current) {
        freshRouteLayer.current = L.polyline(freshPoints, {
          color: '#22c55e', weight: 4, opacity: 0.9, dashArray: '10, 10', lineCap: 'round', lineJoin: 'round'
        }).addTo(map);
      }
    } else {
      stdRouteLayer.current?.remove();
      freshRouteLayer.current?.remove();
      stdRouteLayer.current = null;
      freshRouteLayer.current = null;
    }
  }, [routeCalculated]);

  // Handle Simulation Animation
  useEffect(() => {
    const map = leafletMap.current;
    if (!map) return;

    if (simulationMode && routeCalculated) {
      // Calculate progress point on paths
      const getPos = (pts: [number, number][], p: number): [number, number] => {
        const segs = pts.length - 1;
        const index = Math.min(Math.floor(p * segs), segs - 1);
        const rem = (p * segs) - index;
        const p1 = pts[index];
        const p2 = pts[index + 1];
        return [
          p1[0] + (p2[0] - p1[0]) * rem,
          p1[1] + (p2[1] - p1[1]) * rem
        ];
      };

      const posA = getPos(stdPoints, simProgress);
      const posB = getPos(freshPoints, simProgress);

      if (!truckALayer.current) {
        truckALayer.current = L.circleMarker(posA, { radius: 8, color: '#ef4444', fillColor: '#ef4444', fillOpacity: 1 }).addTo(map);
      } else {
        truckALayer.current.setLatLng(posA);
      }

      if (!truckBLayer.current) {
        truckBLayer.current = L.circleMarker(posB, { radius: 8, color: '#22c55e', fillColor: '#22c55e', fillOpacity: 1 }).addTo(map);
      } else {
        truckBLayer.current.setLatLng(posB);
      }

    } else {
      truckALayer.current?.remove();
      truckBLayer.current?.remove();
      truckALayer.current = null;
      truckBLayer.current = null;
    }
  }, [simulationMode, simProgress, routeCalculated]);

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 16, border: '1px solid #1e293b', background: '#080d18' }}>
      
      {/* Simulation banner */}
      {simulationMode && (
        <div className="animate-blink" style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 400, padding: '6px 18px',
          borderRadius: 99, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', color: '#22c55e',
          fontSize: 11, fontWeight: 700, letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(8px)'
        }}>
          <span style={{ fontSize: 14 }}>⚡</span> SIMULATING DELIVERY
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{Math.round(simProgress * 100)}%</span>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* Legend overlay */}
      <div className="glass-panel" style={{ position: 'absolute', bottom: 12, left: 12, padding: '10px 14px', fontSize: 10, zIndex: 400 }}>
        <div className="section-label" style={{ marginBottom: 8, fontSize: 9 }}>AQI ZONES</div>
        {[
          { color: '#22c55e', label: 'Good (0–100)' },
          { color: '#f97316', label: 'Moderate (101–300)' },
          { color: '#ef4444', label: 'Hazardous (300+)' },
        ].map((z, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: z.color, opacity: 0.7 }} />
            <span style={{ color: '#94a3b8' }}>{z.label}</span>
          </div>
        ))}
        {routeCalculated && (
          <>
            <div style={{ height: 1, background: '#1e293b', margin: '6px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <div style={{ width: 14, height: 2, background: '#ef4444', borderRadius: 2 }} />
              <span style={{ color: '#94a3b8' }}>Standard Route</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 14, height: 2, background: '#22c55e', borderRadius: 2, borderStyle: 'dashed' }} />
              <span style={{ color: '#94a3b8' }}>Fresh Route</span>
            </div>
          </>
        )}
      </div>

      {/* Data source badge */}
      <div style={{
          position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 8, background: 'rgba(17,24,39,0.85)',
          border: '1px solid #1e293b', fontSize: 9, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, zIndex: 400, backdropFilter: 'blur(8px)'
      }}>
        <div className="animate-pulse-live" style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
        Live GEO: Leaflet Map
      </div>
    </div>
  );
}
