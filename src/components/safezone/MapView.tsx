import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, Crown, Lock } from 'lucide-react';
import type { Incident, Severity } from '@/types/incident';
import { getCoords, jitter } from '@/lib/cityCoords';
import PremiumModal from './PremiumModal';

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

  const [ready, setReady] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Premium Status laden
  useEffect(() => {
    try {
      const saved = localStorage.getItem('szg_premium') === 'true';
      setIsPremium(saved);
    } catch {
      setIsPremium(false);
    }
  }, []);

  // Leaflet laden
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.L) {
      setReady(true);
      return;
    }

    const interval = setInterval(() => {
      if (window.L) {
        setReady(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Karte initialisieren
  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const L = window.L;

    const map = L.map(containerRef.current, {
      center: [51.1657, 10.4515],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const onScrollWheel = () => map.scrollWheelZoom.enable();
    const onLeave = () => map.scrollWheelZoom.disable();

    containerRef.current.addEventListener('mouseenter', onScrollWheel);
    containerRef.current.addEventListener('mouseleave', onLeave);

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      containerRef.current?.removeEventListener('mouseenter', onScrollWheel);
      containerRef.current?.removeEventListener('mouseleave', onLeave);
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [ready]);

  // Marker Logic (gekürzt)
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

      const html = `<div style="position:relative;width:32px;height:32px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.35;animation:szgPulse 2s ease-out infinite;"></div>
        <div style="position:absolute;inset:6px;border-radius:50%;background:${color};border:2px solid #0f1622;box-shadow:0 2px 6px rgba(0,0,0,0.5);"></div>
      </div>`;

      const icon = L.divIcon({ html, className: 'szg-marker', iconSize: [32, 32], iconAnchor: [16, 16] });

      const marker = L.marker(coords, { icon }).addTo(layer);
      // Popup-Logik hier einfügen falls nötig...
    });

    if (bounds.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
    }
  }, [incidents, ready, onIncidentSelect]);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a1020]">
        <div
          ref={containerRef}
          className={`w-full h-[520px] sm:h-[600px] ${!isPremium ? 'blur-sm pointer-events-none select-none' : ''}`}
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

        {!isPremium && (
          <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-[#0a1020]/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-[#0f1622] border border-white/10 shadow-2xl max-w-sm mx-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Premium Feature</h3>
                <p className="text-slate-400 text-sm">Die Live-Karte ist nur für Premium-Nutzer verfügbar.</p>
              </div>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:opacity-90 transition"
              >
                <Crown className="w-4 h-4 inline mr-2" />
                Premium freischalten – 2,99€/Monat
              </button>
            </div>
          </div>
        )}

        {isPremium && (
          <div className="absolute bottom-4 left-4 z-[400] flex flex-col gap-1.5 p-3 rounded-xl bg-[#0f1622]/90 backdrop-blur border border-white/10 text-xs text-slate-200">
            <div className="flex items-center gap-2 mb-0.5 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Schweregrad
            </div>
            {(['Hoch', 'Mittel', 'Niedrig'] as Severity[]).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: SEVERITY_COLOR[s] }} />
                {s}
              </div>
            ))}
          </div>
        )}

        <style>{`
          @keyframes szgPulse { 0% { transform: scale(0.9); opacity: 0.6; } 70% { transform: scale(1.6); opacity: 0; } 100% { transform: scale(1.6); opacity: 0; } }
          .leaflet-container { background: #0a1020 !important; }
        `}</style>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSuccess={() => {
          localStorage.setItem('szg_premium', 'true');
          setIsPremium(true);
          setShowPremiumModal(false);
          // Seite neu laden für sauberen State
          setTimeout(() => window.location.reload(), 800);
        }}
      />
    </>
  );
};

function escapeHtml(s: string): string { /* ... */ }

export default MapView;