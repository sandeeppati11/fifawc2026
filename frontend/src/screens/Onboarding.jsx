import React, { useState } from 'react';

/**
 * Onboarding Component (Welcome Screen)
 * @param {Function} onStart - Callback when the user submits their name and starts predicting
 * @param {string} initialName - Default pre-populated name if any
 */
export default function Onboarding({ onStart, initialName = '' }) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to begin!');
      return;
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }
    setError('');
    onStart(name.trim());
  };

  return (
    <div className="min-h-screen pitch-lawn text-white flex flex-col justify-between items-center px-6 py-12 font-sans select-none overflow-hidden relative">
      {/* Soccer Pitch Overlay Lines */}
      <svg viewBox="0 0 100 200" className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" preserveAspectRatio="none">
        {/* Outer boundary */}
        <rect x="2" y="2" width="96" height="196" fill="none" stroke="#ffffff" strokeWidth="0.5" />
        {/* Midfield line */}
        <line x1="2" y1="100" x2="98" y2="100" stroke="#ffffff" strokeWidth="0.5" />
        {/* Center circle */}
        <circle cx="50" cy="100" r="18" fill="none" stroke="#ffffff" strokeWidth="0.5" />
        <circle cx="50" cy="100" r="1" fill="#ffffff" />
        {/* Penalty Area Top */}
        <rect x="25" y="2" width="50" height="30" fill="none" stroke="#ffffff" strokeWidth="0.5" />
        <rect x="38" y="2" width="24" height="10" fill="none" stroke="#ffffff" strokeWidth="0.5" />
        <circle cx="50" cy="22" r="1" fill="#ffffff" />
        <path d="M 38 32 A 15 15 0 0 0 62 32" fill="none" stroke="#ffffff" strokeWidth="0.5" />
        {/* Penalty Area Bottom */}
        <rect x="25" y="168" width="50" height="30" fill="none" stroke="#ffffff" strokeWidth="0.5" />
        <rect x="38" y="188" width="24" height="10" fill="none" stroke="#ffffff" strokeWidth="0.5" />
        <circle cx="50" cy="178" r="1" fill="#ffffff" />
        <path d="M 38 168 A 15 15 0 0 1 62 168" fill="none" stroke="#ffffff" strokeWidth="0.5" />
      </svg>

      {/* Decorative background lights / patterns */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Section */}
      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-sm mt-8 z-15">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-800 to-green-700 rounded-3xl border-2 border-yellow-400 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.25)] text-4xl mb-6 relative animate-bounce">
          <span>🏆</span>
          <span className="absolute -right-1 -bottom-1 text-sm bg-yellow-400 text-emerald-950 px-1.5 py-0.5 rounded-md font-extrabold font-mono border border-emerald-950">
            2026
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase leading-none drop-shadow-lg text-white">
          World Cup <br />
          <span className="text-yellow-400">Prediction</span> System
        </h1>
        <p className="text-sm text-green-200 mt-4 leading-relaxed max-w-xs">
          Build your custom tournament bracket for the 48-team FIFA World Cup 2026. Predict the groups, choose wildcard qualifiers, and crown your Champion!
        </p>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-sm bg-emerald-900/30 border border-emerald-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl z-15 mb-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name-input" className="block text-xs font-black uppercase tracking-wider text-emerald-400 mb-2">
              Enter Your Name
            </label>
            <input
              id="name-input"
              type="text"
              placeholder="e.g. Cristiano Ronaldo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-3.5 text-sm font-bold text-white placeholder-emerald-800/60 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all text-center uppercase tracking-wide"
              maxLength={25}
            />
            {error && (
              <p className="text-xs text-rose-400 font-bold mt-2 text-center flex items-center justify-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 font-black text-sm tracking-widest text-emerald-950 uppercase shadow-lg transition-all active:scale-98 hover:brightness-105"
          >
            Start Predicting →
          </button>
        </form>
      </div>

      {/* Footer Branding */}
      <footer className="text-[10px] font-bold text-green-500/50 tracking-widest uppercase z-10">
        USA • Canada • Mexico 2026
      </footer>
    </div>
  );
}
