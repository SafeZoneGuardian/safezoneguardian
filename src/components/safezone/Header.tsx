import React from 'react';
import { MapPin, Plus } from 'lucide-react';

const SZGLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <linearGradient id="hShieldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a6fa5" />
        <stop offset="50%" stopColor="#2a4a7f" />
        <stop offset="100%" stopColor="#1a3060" />
      </linearGradient>
      <linearGradient id="hShieldInner" x1="0%" y1="0%" x2="60%" y2="100%">
        <stop offset="0%" stopColor="#1e3a6e" />
        <stop offset="100%" stopColor="#0d2040" />
      </linearGradient>
      <radialGradient id="hGlowCircle" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#7ee8fa" />
        <stop offset="40%" stopColor="#38b6e8" />
        <stop offset="100%" stopColor="#1a7ab5" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hShieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6a9fd8" />
        <stop offset="50%" stopColor="#3a6aaa" />
        <stop offset="100%" stopColor="#1a3a70" />
      </linearGradient>
      <linearGradient id="hArrowGrad" x1="0%" y1="0%" x2="60%" y2="100%">
        <stop offset="0%" stopColor="#8ab4d8" />
        <stop offset="100%" stopColor="#4a7aaa" />
      </linearGradient>
      <linearGradient id="hArrowShadow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2a5080" />
        <stop offset="100%" stopColor="#1a3a60" />
      </linearGradient>
      <filter id="hCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="hShadow">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000d1f" floodOpacity="0.6"/>
      </filter>
      <clipPath id="hShieldClip">
        <path d="M200 45 L310 85 L310 195 Q310 295 200 355 Q90 295 90 195 L90 85 Z"/>
      </clipPath>
    </defs>
    <path d="M200 38 L318 80 L318 198 Q318 305 200 368 Q82 305 82 198 L82 80 Z" fill="url(#hShieldBorder)" filter="url(#hShadow)" />
    <path d="M200 50 L308 89 L308 196 Q308 296 200 356 Q92 296 92 196 L92 89 Z" fill="url(#hShieldOuter)" />
    <path d="M200 62 L298 97 L298 194 Q298 284 200 340 Q102 284 102 194 L102 97 Z" fill="url(#hShieldInner)" />
    <path d="M200 62 L298 97 L298 130 Q250 118 200 115 Q150 118 102 130 L102 97 Z" fill="#3a6aaa" opacity="0.3"/>
    <circle cx="200" cy="195" r="82" fill="#0d2040" opacity="0.8" clipPath="url(#hShieldClip)"/>
    <circle cx="200" cy="185" r="78" fill="url(#hGlowCircle)" opacity="0.5" clipPath="url(#hShieldClip)"/>
    <circle cx="200" cy="193" r="72" fill="none" stroke="#00e5ff" strokeWidth="3" opacity="0.85" filter="url(#hCyanGlow)" clipPath="url(#hShieldClip)"/>
    <circle cx="200" cy="193" r="69" fill="none" stroke="#38d4f0" strokeWidth="1.5" opacity="0.7" clipPath="url(#hShieldClip)"/>
    <polygon points="200,128 155,248 200,228" fill="url(#hArrowShadow)" clipPath="url(#hShieldClip)"/>
    <polygon points="200,128 245,248 200,228" fill="url(#hArrowGrad)" clipPath="url(#hShieldClip)"/>
    <polygon points="155,248 200,228 245,248 200,262" fill="#3a6898" clipPath="url(#hShieldClip)"/>
  </svg>
);

interface HeaderProps {
  onReport: () => void;
  onScrollTo: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onReport, onScrollTo }) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0f1622]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => onScrollTo('top')}
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-2xl group-hover:bg-cyan-400/40 transition" />
            <div className="relative w-11 h-11">
              <SZGLogo />
            </div>
          </div>
          <div className="text-left">
            <h1 className="text-lg sm:text-xl font-extrabold text-cyan-400 leading-none tracking-tight">
              SafeZoneGuardian
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Sicherheitsinfos für Deutschland
            </p>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { id: 'incidents', label: 'Vorfälle' },
            { id: 'cities', label: 'Städte' },
            { id: 'moderation', label: 'KI-Moderation' },
            { id: 'about', label: 'Über uns' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onScrollTo(item.id)}
              className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onScrollTo('cities')}
            className="hidden sm:flex w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 items-center justify-center text-slate-300 transition"
            aria-label="Karte"
          >
            <MapPin className="w-5 h-5" />
          </button>
          <button
            onClick={onReport}
            className="flex items-center gap-2 px-3 sm:px-4 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold text-sm shadow-lg shadow-cyan-500/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Vorfall melden</span>
            <span className="sm:hidden">Melden</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
