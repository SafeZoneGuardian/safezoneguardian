import React from 'react';
import { Sparkles, Bot, ShieldCheck, ScanSearch, Gauge } from 'lucide-react';

const ModerationSection: React.FC = () => {
  const steps = [
    {
      icon: ScanSearch,
      title: 'Inhaltliche Prüfung',
      desc: 'Die KI analysiert Sprache, Kontext und Plausibilität jeder Meldung in Echtzeit.',
    },
    {
      icon: ShieldCheck,
      title: 'Diskriminierungsfilter',
      desc: 'Rassistische, hasserfüllte oder verleumderische Inhalte werden automatisch entfernt.',
    },
    {
      icon: Gauge,
      title: 'Konfidenz-Bewertung',
      desc: 'Jede Meldung erhält einen KI-Score. Bei Unsicherheit prüft das Team manuell.',
    },
    {
      icon: Bot,
      title: 'Powered by Gemini',
      desc: 'Modernste Sprach-KI sorgt für faire, schnelle und transparente Moderation.',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2440] via-[#141d34] to-[#0f1622] border border-white/10 p-8 sm:p-12">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/20 blur-3xl rounded-full" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          KI-gestützte Moderation
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl">
          Wie unsere KI deine Meldung prüft
        </h2>
        <p className="mt-3 text-slate-300 max-w-2xl">
          Jede eingereichte Meldung durchläuft einen mehrstufigen automatischen
          Prüfprozess. Nur sachliche, plausible und respektvolle Beiträge erscheinen
          öffentlich auf der Plattform.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] transition"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-bold text-white">{s.title}</h3>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModerationSection;
