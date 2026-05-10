import React from 'react';
import { Shield, AlertTriangle, Users } from 'lucide-react';

interface HeroProps {
  onReport: () => void;
  onScrollTo: (id: string) => void;
  stats: { hoch: number; mittel: number; niedrig: number };
}

const Hero: React.FC<HeroProps> = ({ onReport, onScrollTo, stats }) => {
  const total = stats.hoch + stats.mittel + stats.niedrig;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1622] via-[#111a2c] to-[#0a1020]" />
      <div className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 20%, rgba(34,211,238,0.4), transparent 35%), radial-gradient(circle at 75% 80%, rgba(59,130,246,0.35), transparent 40%)',
        }}
      />
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><path d='M0 0h40v40H0z' fill='none'/><path d='M0 0h1v40H0zM0 0h40v1H0z' fill='%23ffffff'/></svg>\")",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-medium mb-6">
              <Shield className="w-3.5 h-3.5" />
              Community-Plattform für Deutschland
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
              Gemeinsam{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                sicherer
              </span>{' '}
              unterwegs.
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-xl">
              Bürger melden, Community profitiert. Erfahre in Echtzeit, wo in
              deutschen Großstädten Vorsicht geboten ist – von Taschendiebstahl bis
              Raubdelikten.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onReport}
                className="px-6 h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold shadow-lg shadow-cyan-500/30 transition"
              >
                Vorfall melden
              </button>
              <button
                onClick={() => onScrollTo('incidents')}
                className="px-6 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition"
              >
                Aktuelle Vorfälle ansehen
              </button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white">{total}+</div>
                <div className="text-xs text-slate-400 mt-0.5">Aktive Meldungen</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-xs text-slate-400 mt-0.5">Großstädte</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-slate-400 mt-0.5">Echtzeit</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-3xl rounded-full" />
            <div className="relative bg-gradient-to-br from-[#1a2440] to-[#111a2c] border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Live-Übersicht</div>
                    <div className="text-xs text-slate-400">Letzte 24 Stunden</div>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatBox count={stats.hoch} label="Hoch" color="red" />
                <StatBox count={stats.mittel} label="Mittel" color="amber" />
                <StatBox count={stats.niedrig} label="Niedrig" color="emerald" />
              </div>

              <div className="mt-5 space-y-2">
                {[
                  { city: 'Berlin', area: 'Alexanderplatz', sev: 'Hoch' },
                  { city: 'Hamburg', area: 'Reeperbahn', sev: 'Hoch' },
                  { city: 'München', area: 'Hauptbahnhof', sev: 'Mittel' },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-1 h-8 rounded-full ${
                          p.sev === 'Hoch' ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">{p.area}</div>
                        <div className="text-xs text-slate-400">{p.city}</div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        p.sev === 'Hoch' ? 'text-red-400' : 'text-amber-400'
                      }`}
                    >
                      {p.sev}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
                <Users className="w-4 h-4" />
                <span>Über 12.000 Bürger schützen sich gegenseitig</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatBox: React.FC<{ count: number; label: string; color: 'red' | 'amber' | 'emerald' }> = ({
  count,
  label,
  color,
}) => {
  const styles = {
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  }[color];
  return (
    <div className={`p-3 rounded-xl border ${styles}`}>
      <div className="flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold mt-1">{count}</div>
    </div>
  );
};

export default Hero;