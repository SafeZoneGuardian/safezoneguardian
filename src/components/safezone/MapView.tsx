import React, { useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import type { Incident, Severity } from '@/types/incident';
import { getCoords, jitter } from '@/lib/cityCoords';

interface MapViewProps {
  incidents: Incident[];
  onIncidentSelect: (id: string) => void;
}

const SEVERITY_COLOR: Record<Severity, string> = {
  Hoch: '#ef4444',
  Mittel: '#f59e0b',
  Niedrig: '#10b981',
};

const SEVERITY_LABEL_COLOR: Record<Severity, string> = {
  Hoch: '#fca5a5',
  Mittel: '#fcd34d',
  Niedrig: '#6ee7b7',
};

declare global {
  interface Window {
    L: any;
  }
}

const MapView: React.FC<MapViewProps> = ({ incidents, onIncidentSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [ready, setReady] = React.useState<boolean>(typeof window !== 'undefined' && !!window.L);

  // Wait for Leaflet from CDN to load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.L) {
      setReady(true);
      return;
    }
    let cancelled = false;
    const start = Date.now();
    const interval = setInterval(() => {
      if (window.L) {
        if (!cancelled) setReady(true);
        clearInterval(interval);
      } else if (Date.now() - start > 8000) {
        clearInterval(interval);
      }
    }, 100);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Initialize map once Leaflet is ready
  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const L = window.L;

    const map = L.map(containerRef.current, {
      center: [51.1657, 10.4515], // Center of Germany
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    // Dark tile layer
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    ).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Listen to scroll-wheel hint
    const onScrollWheel = () => map.scrollWheelZoom.enable();
    const onLeave = () => map.scrollWheelZoom.disable();
    containerRef.current.addEventListener('mouseenter', onScrollWheel);
    containerRef.current.addEventListener('mouseleave', onLeave);

    // Invalidate size after mount (handles flex/grid containers)
    setTimeout(() => map.invalidateSize(), 50);

    return () => {
      containerRef.current?.removeEventListener('mouseenter', onScrollWheel);
      containerRef.current?.removeEventListener('mouseleave', onLeave);
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [ready]);

  // Update markers when incidents change
  useEffect(() => {
    if (!ready || !mapRef.current || !markersLayerRef.current) return;
    const L = window.L;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    const bounds: [number, number][] = [];

    incidents.forEach((inc) => {
      const base = getCoords(inc.city, inc.area);
      if (!base) return;
      const coords = jitter(base, inc.id);
      bounds.push(coords);

      const color = SEVERITY_COLOR[inc.severity];
      const labelColor = SEVERITY_LABEL_COLOR[inc.severity];

      const html = `
        <div style="position:relative;width:32px;height:32px;">
          <div style="
            position:absolute;inset:0;border-radius:50%;
            background:${color};opacity:0.35;
            animation:szgPulse 2s ease-out infinite;
          "></div>
          <div style="
            position:absolute;inset:6px;border-radius:50%;
            background:${color};
            border:2px solid #0f1622;
            box-shadow:0 2px 6px rgba(0,0,0,0.5);
          "></div>
        </div>`;

      const icon = L.divIcon({
        html,
        className: 'szg-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const popupHtml = `
        <div style="min-width:220px;font-family:inherit;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;">
            <strong style="color:#fff;font-size:15px;">${escapeHtml(inc.area)}</strong>
            <span style="
              color:${labelColor};
              background:${color}22;
              border:1px solid ${color}55;
              padding:2px 8px;border-radius:999px;
              font-size:11px;font-weight:700;">
              ${inc.severity}
            </span>
          </div>
          <div style="color:#94a3b8;font-size:12px;margin-bottom:8px;">${escapeHtml(inc.city)}</div>
          <div style="color:#fbbf24;font-size:12px;font-weight:600;margin-bottom:4px;">
            ${escapeHtml(inc.incident_type)}
          </div>
          <p style="color:#cbd5e1;font-size:13px;line-height:1.45;margin:0 0 10px;">
            ${escapeHtml(inc.description).slice(0, 180)}${inc.description.length > 180 ? '…' : ''}
          </p>
          <button
            data-szg-id="${inc.id}"
            style="
              width:100%;padding:8px 12px;border:none;cursor:pointer;
              background:#22d3ee;color:#0f1622;font-weight:700;
              border-radius:8px;font-size:13px;
            ">
            Details ansehen
          </button>
        </div>
      `;

      const marker = L.marker(coords, { icon }).addTo(layer);
      marker.bindPopup(popupHtml, {
        className: 'szg-popup',
        maxWidth: 280,
        closeButton: true,
      });

      marker.on('popupopen', (e: any) => {
        const node: HTMLElement = e.popup.getElement();
        const btn = node?.querySelector('[data-szg-id]') as HTMLButtonElement | null;
        if (btn) {
          btn.onclick = () => {
            onIncidentSelect(inc.id);
            mapRef.current?.closePopup();
          };
        }
      });
    });

    if (bounds.length > 0) {
      try {
        mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
      } catch {
        /* noop */
      }
    }
  }, [incidents, ready, onIncidentSelect]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a1020]">
      <div
        ref={containerRef}
        className="w-full h-[520px] sm:h-[600px]"
        style={{ background: '#0a1020' }}
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a1020]/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            Karte wird geladen...
          </div>
        </div>
      )}

      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 z-[400] flex flex-col gap-1.5 p-3 rounded-xl bg-[#0f1622]/90 backdrop-blur border border-white/10 text-xs text-slate-200">
        <div className="flex items-center gap-2 mb-0.5 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          Schweregrad
        </div>
        {(['Hoch', 'Mittel', 'Niedrig'] as Severity[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: SEVERITY_COLOR[s] }}
            />
            {s}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes szgPulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .leaflet-container { background: #0a1020 !important; }
        .leaflet-popup-content-wrapper {
          background: #0f1622 !important;
          color: #e2e8f0 !important;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
        }
        .leaflet-popup-content { margin: 14px 16px !important; }
        .leaflet-popup-tip { background: #0f1622 !important; }
        .leaflet-popup-close-button { color: #94a3b8 !important; padding: 8px !important; }
        .leaflet-control-attribution {
          background: rgba(15,22,34,0.8) !important;
          color: #94a3b8 !important;
          border-radius: 6px !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #22d3ee !important; }
        .leaflet-control-zoom a {
          background: #0f1622 !important;
          color: #e2e8f0 !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .leaflet-control-zoom a:hover { background: #1a2440 !important; }
        .szg-marker { background: transparent !important; border: none !important; }
      `}</style>
    </div>
  );
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default MapView;
