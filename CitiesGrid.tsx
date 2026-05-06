import React from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';
import type { Incident } from '@/types/incident';

interface CitiesGridProps {
  incidents: Incident[];
  onCityClick: (city: string) => void;
}

const CITIES_META: Record<string, { color: string; emoji?: string }> = {
  Berlin: { color: 'from-red-500/20 to-orange-500/10' },
  München: { color: 'from-blue-500/20 to-cyan-500/10' },
  Hamburg: { color: 'from-cyan-500/20 to-blue-600/10' },
  Köln: { color: 'from-amber-500/20 to-red-500/10' },
  Frankfurt: { color: 'from-purple-500/20 to-pink-500/10' },
  Stuttgart: { color: 'from-emerald-500/20 to-teal-500/10' },
  Düsseldorf: { color: 'from-pink-500/20 to-rose-500/10' },
  Leipzig: { color: 'from-indigo-500/20 to-violet-500/10' },
  Bremen: { color: 'from-teal-500/20 to-cyan-500/10' },
  Hannover: { color: 'from-rose-500/20 to-pink-500/10' },
  Dortmund: { color: 'from-yellow-500/20 to-amber-500/10' },
  Essen: { color: 'from-violet-500/20 to-purple-500/10' },
};

const CitiesGrid: React.FC<CitiesGridProps> = ({ incidents, onCityClick }) => {
  const grouped = incidents.reduce<Record<string, Incident[]>>((acc, inc) => {
    if (!acc[inc.city]) acc[inc.city] = [];
    acc[inc.city].push(inc);
    return acc;
  }, {});

  const cities = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {cities.map(([city, items]) => {
        const hoch = items.filter((i) => i.severity === 'Hoch').length;
        const mittel = items.filter((i) => i.severity === 'Mittel').length;
        const niedrig = items.filter((i) => i.severity === 'Niedrig').length;
        const meta = CITIES_META[city] ?? { color: 'from-slate-500/20 to-slate-700/10' };
        return (
          <button
            key={city}
            onClick={() => onCityClick(city)}
            className={`relative overflow-hidden text-left p-5 rounded-2xl bg-gradient-to-br ${meta.color} bg-[#172033] border border-white/5 hover:border-white/20 transition group hover:-translate-y-0.5`}
          >
            <div className="flex items-center gap-2 text-slate-300 mb-3">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase tracking-wider font-semibold">
                Stadt
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">{city}</h3>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              {items.length} Meldungen
            </div>
            <div className="mt-3 flex gap-1.5">
              {hoch > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                  {hoch} Hoch
                </span>
              )}
              {mittel > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                  {mittel} Mittel
                </span>
              )}
              {niedrig > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  {niedrig}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CitiesGrid;
