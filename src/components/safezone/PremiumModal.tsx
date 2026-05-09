import React, { useState } from 'react';
import { X, Crown } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayPal = () => {
    setLoading(true);
    window.open('https://paypal.me/Safezoneguardian/2.99', '_blank');

    setTimeout(() => {
      try {
        localStorage.setItem('szg_premium', 'true');
        onSuccess();           // Wichtig: Ruft den verbesserten Callback auf
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0f1622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-6 border-b border-white/10">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
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

        <div className="p-6 pb-8">
          <button
            onClick={handlePayPal}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-[#FFC439] text-[#003087] hover:bg-[#FFB800] disabled:opacity-75"
          >
            {loading ? 'Zahlung wird verarbeitet...' : 'Mit PayPal bezahlen'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;