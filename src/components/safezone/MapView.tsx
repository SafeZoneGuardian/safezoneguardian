import React, { useState } from 'react';
import { X, Shield, Map, Bell, TrendingUp, Check, Crown } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayPal = () => {
    setLoading(true);
    
    // PayPal in neuem Tab öffnen
    window.open('https://paypal.me/Safezoneguardian/2.99', '_blank');
    
    // Optimistisches Unlock nach kurzer Verzögerung
    setTimeout(() => {
      try {
        localStorage.setItem('szg_premium', 'true');
        onSuccess();
      } catch (err) {
        console.error('Fehler beim Speichern des Premium-Status:', err);
      }
      
      onClose();
      setLoading(false);
    }, 2500);
  };

  const features = [
    { 
      icon: <Map className="w-5 h-5 text-cyan-400" />, 
      text: 'Live-Karte mit Echtzeit-Vorfällen' 
    },
    { 
      icon: <Bell className="w-5 h-5 text-cyan-400" />, 
      text: 'Benachrichtigungen in deiner Nähe' 
    },
    { 
      icon: <TrendingUp className="w-5 h-5 text-cyan-400" />, 
      text: 'Detaillierte Risikozonen pro Stadtteil' 
    },
    { 
      icon: <Shield className="w-5 h-5 text-cyan-400" />, 
      text: 'Priorisierter Support' 
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0f1622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-6 border-b border-white/10">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-all"
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

        {/* Features */}
        <div className="p-6 space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                {feature.icon}
              </div>
              <span className="text-slate-200 text-[15px] leading-tight">
                {feature.text}
              </span>
              <Check className="w-5 h-5 text-cyan-400 ml-auto flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Payment Section */}
        <div className="px-6 pb-8 space-y-4">
          <button
            onClick={handlePayPal}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-[#FFC439] text-[#003087] hover:bg-[#FFB800] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? (
              <>Bitte warten...</>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#003087">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.243-8.558 6.243H9.828L8.17 23.337h3.822l.387-2.457.025-.156h1.934c4.062 0 6.931-1.647 7.82-6.412.397-2.144.122-3.84-.936-5.395z"/>
                </svg>
                Mit PayPal bezahlen
              </>
            )}
          </button>

          <p className="text-center text-slate-500 text-xs px-4">
            Nach der Zahlung wird Premium sofort freigeschaltet.<br />
            Du kannst jederzeit kündigen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
