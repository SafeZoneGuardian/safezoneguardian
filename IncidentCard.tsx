import React, { useMemo } from 'react';
import { AlertTriangle, Zap, CheckCircle2, MapPin, Clock } from 'lucide-react';
import type { Incident, Severity } from '@/types/incident';

interface IncidentCardProps {
  incident: Incident;
  highlighted?: boolean;
}

const severityConfig: Record<Severity, { color: string; border: string; bg: string; Icon: React.FC<any> }> = {
  Hoch: {
    color: 'text-red-400',
    border: 'border-l-red-500',
    bg: 'bg-red-500/10',
    Icon: AlertTriangle,
  },
  Mittel: {
    color: 'text-amber-400',
    border: 'border-l-amber-500',
    bg: 'bg-amber-500/10',
    Icon: Zap,
  },
  Niedrig: {
    color: 'text-emerald-400',
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-500/10',
    Icon: CheckCircle2,
  },
};

const getVariedDate = (iso: string, id: string): Date => {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const daysOffset = (hash % 5) + 1;
  const date = new Date(iso);
  date.setDate(date.getDate() - daysOffset);
  return date;
};

const getTimeCategory = (iso: string, id: string): string => {
  const variedDate = getVariedDate(iso, id);
  const diff = Date.now() - variedDate.getTime();
  const days = Math.floor(diff / 86400000);
  
  if (days < 7) return 'vor kurzem';
  if (days < 14) return 'länger her';
  return 'expired';
};

const isExpired = (iso: string, id: string): boolean => {
  const variedDate = getVariedDate(iso, id);
  const diff = Date.now() - variedDate.getTime();
  const days = Math.floor(diff / 86400000);
  return days >= 14;
};

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, highlighted }) => {
  const cfg = severityConfig[incident.severity];
  const Icon = cfg.Icon;
  
  const expired = useMemo(() => isExpired(incident.created_at, incident.id), [incident]);
  const timeCategory = useMemo(() => getTimeCategory(incident.created_at, incident.id), [incident]);
  
  if (expired) return null;

  return (
    <article 
      id={`incident-${incident.id}`}
      className={`group relative rounded-2xl bg-[#172033] border border-l-4 ${cfg.border} p-5 hover:bg-[#1c2638] transition-all hover:-translate-y-0.5 scroll-mt-32 ${
        highlighted 
          ? 'border-cyan-400/60 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/20' 
          : 'border-white/5 hover:border-white/10'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-white truncate">{incident.area}</h3>
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
            {incident.city}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${cfg.color}`} />
          </div>
          <span className={`text-xs font-semibold ${cfg.color}`}>{incident.severity}</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-sm font-semibold text-amber-400">
          {incident.incident_type}
        </span>
      </div>
      
      <p className="mt-2 text-sm text-slate-300 leading-relaxed">{incident.description}</p>
      
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {timeCategory}
        </span>
      </div>
    </article>
  );
};

export default IncidentCard;