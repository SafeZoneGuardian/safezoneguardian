import React from 'react';
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

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'gerade eben';
  if (m < 60) return `vor ${m} Min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `vor ${h} Std`;
  const d = Math.floor(h / 24);
  if (d < 30) return `vor ${d} Tg`;
  return new Date(iso).toLocaleDateString('de-DE');
};

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, highlighted }) => {
  const cfg = severityConfig[incident.severity];
  const Icon = cfg.Icon;

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
          {timeAgo(incident.created_at)}
        </span>
        {typeof incident.ai_confidence === 'number' && (
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            KI-Score {(incident.ai_confidence * 100).toFixed(0)}%
          </span>
        )}
      </div>
    </article>
  );
};

export default IncidentCard;
