import React from 'react';
import { X, Crown, Map, Bell, TrendingUp, Shield, Check } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleStripe = () => {
    window.open('https://buy.stripe.com/aFadR2gp9b4F6C990W2Ry00', '_blank');
  };

  const features = [
    { icon: <Map className="w-5 h-5 text-cyan-400" />, text: 'Live-Karte mit Echtzeit-Vorfällen' },
    { icon: <Bell className="w-5 h-5 text-cyan-400" />, text: 'Benachrichtigungen in deiner Nähe' },
    { icon: <TrendingUp className="w-5 h-5 text-cyan-400" />, text: 'Detaillierte Risikozonen pro Stadtteil' },
    { icon: <Shield className="w-5 h-5 text-cyan-400" />, text: 'Priorisierter Support' },
  ];

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0f1622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-6 border-b border-white/10">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">SafeZone Premium</h2>
              <p className="text-slate-400">Vollzugriff auf alle Features</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1 mt-6">
            <span className="text-5xl font-bold text-white">2,99</span>
            <span className="text-2xl text-slate-400">€</span>
            <span className="text-slate-400 ml-1">/Monat</span>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <span className="text-slate-200 text-sm">{f.text}</span>
              <Check className="w-4 h-4 text-cyan-400 ml-auto flex-shrink-0" />
            </div>
          ))}
        </div>

        <div className="px-6 pb-8 space-y-3">
          <button
            onClick={handleStripe}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white transition shadow-lg shadow-cyan-500/20"
          >
            Jetzt Premium freischalten
          </button>
          <p className="text-center text-slate-500 text-xs">
            Sichere Zahlung über Stripe · Jederzeit kündbar
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;