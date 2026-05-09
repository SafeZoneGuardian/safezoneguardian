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

  // Premium-Status laden + auf Änderungen reagieren
  useEffect(() => {
    const loadPremium = () => {
      try {
        const saved = localStorage.getItem('szg_premium') === 'true';
        setIsPremium(saved);
      } catch (err) {
        setIsPremium(false);
      }
    };

    loadPremium();

    // Event Listener für Änderungen von anderen Tabs/Fenstern
    window.addEventListener('storage', loadPremium);
    return () => window.removeEventListener('storage', loadPremium);
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
      if (mapRef.current) mapRef.current.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [ready]);

  // Marker
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
          <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.35;animation:szgPulse 2s ease-out infinite;"></div>
          <div style="position:absolute;inset:6px;border-radius:50%;background:${color};border:2px solid #0f1622;box-shadow:0 2px 6px rgba(0,0,0,0.5);"></div>
        </div>`;

      const icon = L.divIcon({ html, className: 'szg-marker', iconSize: [32, 32], iconAnchor: [16, 16] });

      const popupHtml = `
        <div style="