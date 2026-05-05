import React from 'react';
import IncidentCard from './IncidentCard';
import { ShieldOff } from 'lucide-react';
import type { Incident } from '@/types/incident';

interface IncidentListProps {
  incidents: Incident[];
  loading?: boolean;
  highlightedId?: string | null;
}

const IncidentList: React.FC<IncidentListProps> = ({ incidents, loading, highlightedId }) => {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[#172033] border border-white/5 p-5 h-44 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div className="rounded-2xl bg-[#172033] border border-white/5 p-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
          <ShieldOff className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">Keine Vorfälle gefunden</h3>
        <p className="text-slate-400 text-sm">
          Probier andere Filter oder eine andere Stadt.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {incidents.map((inc) => (
        <IncidentCard
          key={inc.id}
          incident={inc}
          highlighted={highlightedId === inc.id}
        />
      ))}
    </div>
  );
};

export default IncidentList;
