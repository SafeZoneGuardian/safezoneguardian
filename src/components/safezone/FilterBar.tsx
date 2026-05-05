import React from 'react';
import { Search, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import type { Severity } from '@/types/incident';

interface FilterBarProps {
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  query: string;
  onQueryChange: (q: string) => void;
  severityFilter: Severity | 'Alle';
  onSeverityChange: (s: Severity | 'Alle') => void;
  typeFilter: string;
  onTypeChange: (t: string) => void;
  types: string[];
  stats: { hoch: number; mittel: number; niedrig: number };
}

const FilterBar: React.FC<FilterBarProps> = ({
  cities,
  selectedCity,
  onCityChange,
  query,
  onQueryChange,
  severityFilter,
  onSeverityChange,
  typeFilter,
  onTypeChange,
  types,
  stats,
}) => {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatChip
          count={stats.hoch}
          label="Hoch"
          icon={AlertTriangle}
          active={severityFilter === 'Hoch'}
          onClick={() => onSeverityChange(severityFilter === 'Hoch' ? 'Alle' : 'Hoch')}
          color="red"
        />
        <StatChip
          count={stats.mittel}
          label="Mittel"
          icon={Zap}
          active={severityFilter === 'Mittel'}
          onClick={() => onSeverityChange(severityFilter === 'Mittel' ? 'Alle' : 'Mittel')}
          color="amber"
        />
        <StatChip
          count={stats.niedrig}
          label="Niedrig"
          icon={CheckCircle2}
          active={severityFilter === 'Niedrig'}
          onClick={() => onSeverityChange(severityFilter === 'Niedrig' ? 'Alle' : 'Niedrig')}
          color="emerald"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Stadt oder Bereich suchen..."
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#172033] border border-white/5 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
        />
      </div>

      {/* City chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {['Alle', ...cities].map((city) => (
          <button
            key={city}
            onClick={() => onCityChange(city)}
            className={`shrink-0 px-5 h-10 rounded-full text-sm font-semibold transition ${
              selectedCity === city
                ? 'bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/30'
                : 'bg-[#172033] text-slate-300 border border-white/5 hover:border-white/20'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {['Alle Typen', ...types].map((t) => {
          const active = typeFilter === t || (t === 'Alle Typen' && typeFilter === 'Alle');
          return (
            <button
              key={t}
              onClick={() => onTypeChange(t === 'Alle Typen' ? 'Alle' : t)}
              className={`shrink-0 px-4 h-9 rounded-lg text-xs font-medium transition ${
                active
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-transparent text-slate-400 border border-white/5 hover:text-slate-200 hover:border-white/10'
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const StatChip: React.FC<{
  count: number;
  label: string;
  icon: React.FC<any>;
  active: boolean;
  onClick: () => void;
  color: 'red' | 'amber' | 'emerald';
}> = ({ count, label, icon: Icon, active, onClick, color }) => {
  const styles = {
    red: 'border-red-500/30 bg-red-500/10 hover:bg-red-500/15 text-red-400',
    amber: 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 text-amber-400',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400',
  }[color];
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 h-14 rounded-xl border transition ${styles} ${
        active ? 'ring-2 ring-current/40 scale-[1.02]' : ''
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xl font-bold">{count}</span>
      <span className="text-xs font-medium opacity-80 hidden sm:inline">{label}</span>
    </button>
  );
};

export default FilterBar;
