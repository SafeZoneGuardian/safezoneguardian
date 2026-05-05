import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from './safezone/Header';
import Hero from './safezone/Hero';
import FilterBar from './safezone/FilterBar';
import IncidentList from './safezone/IncidentList';
import MapView from './safezone/MapView';
import CitiesGrid from './safezone/CitiesGrid';
import ModerationSection from './safezone/ModerationSection';
import About from './safezone/About';
import Footer from './safezone/Footer';
import ReportModal from './safezone/ReportModal';
import { Plus, List, Map as MapIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Incident, Severity } from '@/types/incident';
import { INCIDENT_TYPES } from '@/types/incident';

type ViewMode = 'list' | 'map';

const AppLayout: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState<string>('Alle');
  const [query, setQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'Alle'>('Alle');
  const [typeFilter, setTypeFilter] = useState<string>('Alle');

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const incidentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) {
        console.error(error);
      } else {
        setIncidents((data ?? []) as Incident[]);
      }
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const cities = useMemo(() => {
    const set = new Set(incidents.map((i) => i.city));
    return Array.from(set).sort();
  }, [incidents]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return incidents.filter((i) => {
      if (selectedCity !== 'Alle' && i.city !== selectedCity) return false;
      if (severityFilter !== 'Alle' && i.severity !== severityFilter) return false;
      if (typeFilter !== 'Alle' && i.incident_type !== typeFilter) return false;
      if (q) {
        const hay = `${i.city} ${i.area} ${i.incident_type} ${i.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [incidents, selectedCity, severityFilter, typeFilter, query]);

  const stats = useMemo(() => {
    return {
      hoch: filtered.filter((i) => i.severity === 'Hoch').length,
      mittel: filtered.filter((i) => i.severity === 'Mittel').length,
      niedrig: filtered.filter((i) => i.severity === 'Niedrig').length,
    };
  }, [filtered]);

  const totalStats = useMemo(
    () => ({
      hoch: incidents.filter((i) => i.severity === 'Hoch').length,
      mittel: incidents.filter((i) => i.severity === 'Mittel').length,
      niedrig: incidents.filter((i) => i.severity === 'Niedrig').length,
    }),
    [incidents]
  );

  const scrollTo = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmitted = (incident: Incident) => {
    setIncidents((prev) => [incident, ...prev]);
  };

  const handleCityFromGrid = (city: string) => {
    setSelectedCity(city);
    setTimeout(() => scrollTo('incidents'), 50);
  };

  const handleMapMarkerSelect = (id: string) => {
    setViewMode('list');
    setHighlightedId(id);
    // Wait for the list to render, then scroll to the card
    setTimeout(() => {
      const el = document.getElementById(`incident-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
    // Remove highlight after a few seconds
    setTimeout(() => setHighlightedId(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#0a1020] text-slate-100" id="top">
      <Header onReport={() => setReportOpen(true)} onScrollTo={scrollTo} />

      <Hero
        onReport={() => setReportOpen(true)}
        onScrollTo={scrollTo}
        stats={totalStats}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Incidents */}
        <section id="incidents" ref={incidentsRef} className="scroll-mt-24">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Aktuelle Vorfälle
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {filtered.length} von {incidents.length} Meldungen
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="inline-flex p-1 rounded-xl bg-[#172033] border border-white/10">
                <button
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 h-9 rounded-lg text-sm font-semibold transition ${
                    viewMode === 'list'
                      ? 'bg-cyan-400 text-slate-900 shadow shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                  Liste
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  aria-pressed={viewMode === 'map'}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 h-9 rounded-lg text-sm font-semibold transition ${
                    viewMode === 'map'
                      ? 'bg-cyan-400 text-slate-900 shadow shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <MapIcon className="w-4 h-4" />
                  Karte
                </button>
              </div>
              <button
                onClick={() => setReportOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition"
              >
                <Plus className="w-4 h-4" />
                Neue Meldung
              </button>
            </div>
          </div>

          <FilterBar
            cities={cities}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            query={query}
            onQueryChange={setQuery}
            severityFilter={severityFilter}
            onSeverityChange={setSeverityFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            types={INCIDENT_TYPES}
            stats={stats}
          />

          <div className="mt-8">
            {viewMode === 'list' ? (
              <IncidentList
                incidents={filtered}
                loading={loading}
                highlightedId={highlightedId}
              />
            ) : (
              <MapView
                incidents={filtered}
                onIncidentSelect={handleMapMarkerSelect}
              />
            )}
          </div>
        </section>

        {/* Cities */}
        <section id="cities" className="scroll-mt-24">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Nach Stadt erkunden
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Klicke auf eine Stadt, um alle Meldungen anzuzeigen.
            </p>
          </div>
          <CitiesGrid incidents={incidents} onCityClick={handleCityFromGrid} />
        </section>

        {/* AI Moderation */}
        <section id="moderation" className="scroll-mt-24">
          <ModerationSection />
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-24">
          <About />
        </section>
      </main>

      <Footer />

      {/* Floating action button (mobile) */}
      <button
        onClick={() => setReportOpen(true)}
        className="sm:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-900 shadow-2xl shadow-cyan-500/40 flex items-center justify-center transition"
        aria-label="Vorfall melden"
      >
        <Plus className="w-7 h-7" strokeWidth={2.5} />
      </button>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmitted={handleSubmitted}
      />
    </div>
  );
};

export default AppLayout;
