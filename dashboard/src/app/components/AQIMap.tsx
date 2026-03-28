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
  cargoType: string;
}

const LOCATIONS: Record<string, [number, number]> = {
  'Azadpur Mandi': [28.7300, 77.1700],
  'Ghazipur Mandi': [28.6200, 77.3300],
  'Okhla Mandi': [28.5300, 77.2800],
  'Narela Mandi': [28.8500, 77.1000],
  'South Delhi': [28.4500, 77.2000],
  'Gurugram': [28.4500, 77.0500],
  'Noida': [28.5800, 77.3300],
  'Faridabad': [28.4200, 77.3200],
  'Greater Noida': [28.4700, 77.4900],
};

const HOTSPOTS = [
  // Hazardous (Red)
  { lat: 28.5300, lng: 77.2800, aqi: 480, name: 'Okhla Industrial' },
  { lat: 28.6600, lng: 77.3000, aqi: 410, name: 'Anand Vihar' },
  { lat: 28.7300, lng: 77.1700, aqi: 380, name: 'Azadpur Traffic' },
  { lat: 28.6100, lng: 77.0300, aqi: 350, name: 'Dwarka Sec 8' },
  { lat: 28.6500, lng: 77.1000, aqi: 360, name: 'Punjabi Bagh' },
  { lat: 28.7000, lng: 77.1000, aqi: 390, name: 'Rohini Sector 16' },
  { lat: 28.5000, lng: 77.0800, aqi: 320, name: 'Cyber City, Gurgaon' },
  { lat: 28.5800, lng: 77.3300, aqi: 400, name: 'Noida Sector 62' },
  { lat: 28.6600, lng: 77.4400, aqi: 450, name: 'Ghaziabad Industrial' },

  // Moderate (Orange)
  { lat: 28.6100, lng: 77.2300, aqi: 240, name: 'Central Delhi' },
  { lat: 28.5500, lng: 77.2000, aqi: 210, name: 'Hauz Khas' },
  { lat: 28.5600, lng: 77.1000, aqi: 280, name: 'IGI Airport' },
  { lat: 28.4500, lng: 77.0500, aqi: 250, name: 'Gurugram NH-48' },
  { lat: 28.5300, lng: 77.3500, aqi: 220, name: 'Noida Sec 137' },
  { lat: 28.6700, lng: 77.2200, aqi: 290, name: 'ISBT Kashmiri Gate' },

  // Good/Green (Green)
  { lat: 28.6900, lng: 77.1400, aqi: 85, name: 'West Green Zone' },
  { lat: 28.4200, lng: 77.3200, aqi: 90, name: 'Faridabad Green Belt' },
  { lat: 28.5300, lng: 77.1500, aqi: 75, name: 'Vasant Kunj Ridge' },
  { lat: 28.6100, lng: 77.1800, aqi: 65, name: 'Buddha Jayanti Park' },
  { lat: 28.5800, lng: 77.2400, aqi: 80, name: 'Lodhi Gardens' },
  { lat: 28.5000, lng: 77.2500, aqi: 90, name: 'Asola Bhatti Sanctuary' }
];

const generateRoute = (startName: string, endName: string, type: 'std' | 'fresh', cargo: string): [number, number][] => {
  const start = LOCATIONS[startName] || LOCATIONS['Azadpur Mandi'];
  const end = LOCATIONS[endName] || LOCATIONS['South Delhi'];
  
  const dx = end[1] - start[1];
  const dy = end[0] - start[0];
  const mx = start[1] + dx / 2;
  const my = start[0] + dy / 2;

  const px = -dy;
  const py = dx;

  // Add slight variance based on cargo type
  const cargoShift = cargo === 'Vegetables' ? 0.05 : cargo === 'Dairy' ? -0.05 : 0;
  
  // Standard curves slightly, Fresh curves significantly to bypass
  const factor = type === 'std' ? 0.05 : 0.35;
  
  const cx = mx + px * (factor + cargoShift);
  const cy = my + py * (factor + cargoShift);

  return [
    start,
    [start[0] + dy*0.25 + py*(factor*0.5), start[1] + dx*0.25 + px*(factor*0.5)],
    [cy, cx],
    [start[0] + dy*0.75 + py*(factor*0.5), start[1] + dx*0.75 + px*(factor*0.5)],
    end
  ];
};

export default function AQIMap({
  routeCalculated,
  simulationMode,
  simProgress,
  origin,
  destination,
  cargoType,
}: AQIMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<Map | null>(null);
  const stdRouteLayer = useRef<Polyline | null>(null);
  const freshRouteLayer = useRef<Polyline | null>(null);
  const truckALayer = useRef<CircleMarker | null>(null);
  const truckBLayer = useRef<CircleMarker | null>(null);
  const originMarkerGroup = useRef<L.LayerGroup | null>(null);
  const destMarkerGroup = useRef<L.LayerGroup | null>(null);

  const stdPoints = useMemo(() => generateRoute(origin, destination, 'std', cargoType), [origin, destination, cargoType]);
  const freshPoints = useMemo(() => generateRoute(origin, destination, 'fresh', cargoType), [origin, destination, cargoType]);

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

  // Handle Origin/Dest Markers and Route Layer
  useEffect(() => {
    const map = leafletMap.current;
    if (!map) return;

    // Remove old layers
    if (originMarkerGroup.current) { originMarkerGroup.current.remove(); originMarkerGroup.current = null; }
    if (destMarkerGroup.current) { destMarkerGroup.current.remove(); destMarkerGroup.current = null; }
    if (stdRouteLayer.current) { stdRouteLayer.current.remove(); stdRouteLayer.current = null; }
    if (freshRouteLayer.current) { freshRouteLayer.current.remove(); freshRouteLayer.current = null; }

    // Draw Markers
    const startPt = stdPoints[0];
    const endPt = stdPoints[stdPoints.length-1];

    originMarkerGroup.current = L.layerGroup([
      L.circleMarker(startPt, { radius: 6, color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 1 }),
      L.marker(startPt, { icon: L.divIcon({ className: '', html: `<div style="color:#93c5fd; font-size:12px; font-weight:bold; margin-top:-20px; white-space:nowrap;">📍 ${origin} Origin</div>` }) })
    ]).addTo(map);

    destMarkerGroup.current = L.layerGroup([
      L.circleMarker(endPt, { radius: 6, color: '#a78bfa', fillColor: '#a78bfa', fillOpacity: 1 }),
      L.marker(endPt, { icon: L.divIcon({ className: '', html: `<div style="color:#c4b5fd; font-size:12px; font-weight:bold; margin-top:-20px; white-space:nowrap;">🏁 ${destination} Dest</div>` }) })
    ]).addTo(map);

    // Dynamic map view to fit both points naturally
    const bounds = L.latLngBounds([startPt, endPt]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true });

    if (routeCalculated) {
      stdRouteLayer.current = L.polyline(stdPoints, {
        color: '#ef4444', weight: 4, opacity: 0.7, lineCap: 'round', lineJoin: 'round'
      }).addTo(map);

      freshRouteLayer.current = L.polyline(freshPoints, {
        color: '#22c55e', weight: 4, opacity: 0.9, dashArray: '10, 10', lineCap: 'round', lineJoin: 'round'
      }).addTo(map);
    }
  }, [routeCalculated, stdPoints, freshPoints, origin, destination]);

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
