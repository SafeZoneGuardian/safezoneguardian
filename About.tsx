import React from 'react';
import { Users, Lock, Globe2, HeartHandshake } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Community-getrieben',
      desc: 'Tausende Bürger melden täglich Vorfälle und schützen ihre Mitmenschen.',
    },
    {
      icon: Lock,
      title: 'Datenschutz zuerst',
      desc: 'Anonymes Melden möglich. Keine Speicherung personenbezogener Daten ohne Einwilligung.',
    },
    {
      icon: Globe2,
      title: 'Bald auch international',
      desc: 'Aktuell für Deutschland – weitere Länder wie Österreich und Schweiz folgen.',
    },
    {
      icon: HeartHandshake,
      title: 'Kostenlos & gemeinnützig',
      desc: 'SafeZoneGuardian ist und bleibt für jeden frei zugänglich.',
    },
  ];

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Mehr Sicherheit durch Transparenz
        </h2>
        <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
          SafeZoneGuardian ist eine ehrenamtliche Initiative. Unser Ziel: Bürger sollen
          informierte Entscheidungen treffen können – ohne Panikmache, ohne Vorurteile,
          ohne Diskriminierung.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-[#172033] border border-white/5 hover:border-white/15 hover:-translate-y-0.5 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg">{f.title}</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default About;
