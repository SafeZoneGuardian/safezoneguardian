import React, { useState } from 'react';
import { X, Send, Loader2, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { INCIDENT_TYPES, SEVERITIES } from '@/types/incident';
import type { Severity, Incident } from '@/types/incident';

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted: (incident: Incident) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ open, onClose, onSubmitted }) => {
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [incidentType, setIncidentType] = useState<string>(INCIDENT_TYPES[0]);
  const [severity, setSeverity] = useState<Severity>('Mittel');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | {
    decision: string;
    confidence?: number;
    reason?: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setCity('');
    setArea('');
    setIncidentType(INCIDENT_TYPES[0]);
    setSeverity('Mittel');
    setDescription('');
    setEmail('');
    setResult(null);
    setError(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !area.trim() || !description.trim()) {
      setError('Bitte alle Pflichtfelder ausfüllen.');
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      // Subscribe email to CRM if provided
      if (email.trim()) {
        fetch('https://famous.ai/api/crm/69f4ca634aa1fe94cf27bd45/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            source: 'incident-report',
            tags: ['safezoneguardian', 'reporter'],
          }),
        }).catch(() => {});
      }

      // 1. AI moderation
      const { data: modData, error: modErr } = await supabase.functions.invoke(
        'moderate-incident',
        {
          body: {
            city: city.trim(),
            area: area.trim(),
            incident_type: incidentType,
            severity,
            description: description.trim(),
          },
        }
      );

      const decision = modData?.decision ?? 'pending';
      const confidence = typeof modData?.confidence === 'number' ? modData.confidence : 0.5;
      const reason = modData?.reason ?? 'Manuelle Prüfung';

      // 2. Insert incident
      const status = decision === 'approved' ? 'approved' : decision === 'rejected' ? 'rejected' : 'pending';

      const { data: inserted, error: insErr } = await supabase
        .from('incidents')
        .insert({
          city: city.trim(),
          area: area.trim(),
          incident_type: incidentType,
          severity,
          description: description.trim(),
          status,
          ai_confidence: confidence,
          ai_reason: reason,
          reporter_email: email.trim() || null,
        })
        .select()
        .single();

      if (insErr) throw insErr;

      setResult({ decision: status, confidence, reason });

      if (inserted && status === 'approved') {
        onSubmitted(inserted as Incident);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Fehler beim Übermitteln.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-xl bg-[#0f1622] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0f1622]/95 backdrop-blur z-10 border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Vorfall melden</h2>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 transition"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {result ? (
          <div className="p-6">
            <ResultView result={result} onClose={handleClose} onAnother={reset} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                Deine Meldung wird automatisch von unserer KI auf Plausibilität und
                respektvolle Sprache geprüft. Diskriminierende oder unwahre Inhalte werden
                abgelehnt.
              </p>
            </div>

            <Field label="Stadt *">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="z.B. Berlin"
                className="form-input"
                required
              />
            </Field>

            <Field label="Bereich/Ort *">
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="z.B. Alexanderplatz"
                className="form-input"
                required
              />
            </Field>

            <Field label="Vorfalltyp">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {INCIDENT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setIncidentType(t)}
                    className={`shrink-0 px-4 h-10 rounded-full text-sm font-medium transition ${
                      incidentType === t
                        ? 'bg-cyan-400 text-slate-900'
                        : 'bg-[#172033] text-slate-300 border border-white/5 hover:border-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Schweregrad">
              <div className="grid grid-cols-3 gap-2">
                {SEVERITIES.map((s) => {
                  const active = severity === s;
                  const colors = {
                    Niedrig: active
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10',
                    Mittel: active
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-amber-500/40 text-amber-400 hover:bg-amber-500/10',
                    Hoch: active
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-red-500/40 text-red-400 hover:bg-red-500/10',
                  }[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeverity(s)}
                      className={`h-12 rounded-xl border-2 font-bold text-sm transition ${colors}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Beschreibung *">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschreiben Sie den Vorfall..."
                rows={4}
                className="form-input resize-none"
                required
              />
            </Field>

            <Field label="E-Mail (optional, für Updates)">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dein@email.de"
                className="form-input"
              />
            </Field>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-13 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  KI prüft Meldung...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Meldung einreichen
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <style>{`
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: #172033;
          border: 1px solid rgba(255,255,255,0.05);
          color: white;
          outline: none;
          transition: all 0.2s;
        }
        .form-input::placeholder { color: #64748b; }
        .form-input:focus {
          border-color: rgba(34, 211, 238, 0.5);
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.15);
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-sm font-bold text-white mb-2">{label}</label>
    {children}
  </div>
);

const ResultView: React.FC<{
  result: { decision: string; confidence?: number; reason?: string };
  onClose: () => void;
  onAnother: () => void;
}> = ({ result, onClose, onAnother }) => {
  const isApproved = result.decision === 'approved';
  const isRejected = result.decision === 'rejected';
  return (
    <div className="text-center py-6">
      <div
        className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 ${
          isApproved
            ? 'bg-emerald-500/15'
            : isRejected
            ? 'bg-red-500/15'
            : 'bg-amber-500/15'
        }`}
      >
        {isApproved ? (
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        ) : isRejected ? (
          <X className="w-10 h-10 text-red-400" />
        ) : (
          <AlertTriangle className="w-10 h-10 text-amber-400" />
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">
        {isApproved
          ? 'Meldung veröffentlicht!'
          : isRejected
          ? 'Meldung abgelehnt'
          : 'Manuelle Prüfung'}
      </h3>
      <p className="text-slate-300 max-w-sm mx-auto">
        {isApproved
          ? 'Vielen Dank! Deine Meldung hilft anderen Bürgern.'
          : isRejected
          ? 'Die KI hat die Meldung als ungeeignet eingestuft.'
          : 'Deine Meldung wird von unserem Team manuell geprüft.'}
      </p>
      {result.reason && (
        <div className="mt-4 inline-block px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 max-w-md">
          <span className="font-semibold text-cyan-400">KI-Begründung: </span>
          {result.reason}
        </div>
      )}
      {typeof result.confidence === 'number' && (
        <div className="mt-3 text-xs text-slate-400">
          Konfidenz: {(result.confidence * 100).toFixed(0)}%
        </div>
      )}
      <div className="mt-7 flex gap-3 justify-center">
        <button
          onClick={onAnother}
          className="px-5 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition"
        >
          Weitere Meldung
        </button>
        <button
          onClick={onClose}
          className="px-5 h-11 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold transition"
        >
          Schließen
        </button>
      </div>
    </div>
  );
};

export default ReportModal;
