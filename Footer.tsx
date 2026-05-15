import React, { useState } from 'react';
import { Shield, Mail, Loader2, Check } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showImpressum, setShowImpressum] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch('https://famous.ai/api/crm/69f4ca634aa1fe94cf27bd45/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          source: 'footer-signup',
          tags: ['safezoneguardian', 'newsletter'],
        }),
      });
      setDone(true);
      setEmail('');
      setTimeout(() => setDone(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-20 bg-[#0a1020] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-extrabold text-cyan-400">SafeZoneGuardian</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Eine Community-Plattform für mehr Sicherheit in deutschen Städten.
              Bürger melden, Community profitiert.
            </p>

            <form onSubmit={subscribe} className="mt-6 max-w-sm">
              <label className="text-xs font-semibold text-slate-300 mb-2 block">
                Newsletter abonnieren
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dein@email.de"
                    className="w-full h-11 pl-9 pr-3 rounded-lg bg-[#172033] border border-white/5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || done}
                  className="h-11 px-4 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold text-sm flex items-center gap-1.5 transition disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : done ? (
                    <>
                      <Check className="w-4 h-4" />
                      Danke
                    </>
                  ) : (
                    'Abonnieren'
                  )}
                </button>
              </div>
            </form>
          </div>

          {[
            {
              title: 'Plattform',
              links: ['Vorfälle', 'Städte', 'Karte', 'Statistiken'],
            },
            {
              title: 'Community',
              links: ['Vorfall melden', 'Richtlinien', 'Hilfe'],
            },
            {
              title: 'Rechtliches',
              links: ['Datenschutz', 'AGB', 'Impressum', 'Kontakt'],
              actions: { 'Impressum': () => setShowImpressum(true) },
            },
          ].map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="font-bold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        const action = (col as any).actions?.[l];
                        if (action) action();
                      }}
                      className="text-sm text-slate-400 hover:text-cyan-400 transition"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="font-bold text-white mb-4">Notfall</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <span className="font-semibold text-red-400">110</span> – Polizei
              </li>
              <li>
                <span className="font-semibold text-red-400">112</span> – Rettung &
                Feuer
              </li>
              <li>
                <span className="font-semibold text-amber-400">116 116</span> – Sperr-Notruf
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SafeZoneGuardian. Made with care in Germany.</p>
          <p>
            SafeZoneGuardian ersetzt keinen Notruf. Im akuten Notfall wähle bitte 110.
          </p>
        </div>
      </div>

      {/* Impressum Modal */}
      {showImpressum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowImpressum(false)} />
          <div className="relative w-full max-w-md bg-[#0f1622] border border-white/10 rounded-2xl shadow-2xl p-8">
            <button
              onClick={() => setShowImpressum(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Impressum</h2>
            <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
              <p className="font-semibold text-white">Angaben gemäß § 5 TMG</p>
              <p>Felix Hakemann</p>
              <p>28355 Oberneuland</p>
              <p>Bremen</p>
              <p className="pt-4 font-semibold text-white">Kontakt</p>
              <p>SafeZoneGuardian</p>
              <p className="pt-4 text-slate-500 text-xs">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: Felix Hakemann
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;