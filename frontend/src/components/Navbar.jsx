import React from 'react';

/**
 * Navbar Component
 * @param {string} currentScreen - The active screen key ('onboarding', 'groupstage', etc.)
 * @param {string} userName - The name of the active user
 * @param {Function} onViewCommunity - Callback to switch to community stats screen
 * @param {Function} onBackToHome - Callback to return to home screen
 */
export default function Navbar({ currentScreen, userName, onViewCommunity, onBackToHome }) {
  return (
    <header className="bg-emerald-950/80 backdrop-blur-md border-b border-emerald-900 sticky top-0 z-50 px-4 py-3.5 flex justify-between items-center select-none">
      {/* Brand Logo */}
      <button 
        onClick={onBackToHome}
        className="flex items-center gap-2 text-left focus:outline-none active:scale-95 transition-transform"
      >
        <span className="text-xl">🏆</span>
        <span className="font-black tracking-tight text-white uppercase text-sm">
          WC <span className="text-yellow-400">2026</span>
        </span>
      </button>

      {/* Stats and User Indicator */}
      <div className="flex items-center gap-2.5">
        {userName && (
          <span className="text-[10px] font-bold uppercase text-emerald-300 bg-emerald-950/60 border border-emerald-900 px-2.5 py-1.5 rounded-xl max-w-[120px] truncate">
            👤 {userName}
          </span>
        )}

        {currentScreen !== 'community' ? (
          <button
            onClick={onViewCommunity}
            className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-800 to-green-700 border border-emerald-500/50 px-3 py-1.5 rounded-lg text-white transition-all hover:brightness-105 active:scale-95"
          >
            Stats 📊
          </button>
        ) : (
          <button
            onClick={onBackToHome}
            className="text-[10px] font-black uppercase tracking-wider bg-emerald-900 border border-emerald-850 px-3 py-1.5 rounded-lg text-green-200 transition-all hover:bg-emerald-900/60 active:scale-95"
          >
            Predict ⚽
          </button>
        )}
      </div>
    </header>
  );
}
