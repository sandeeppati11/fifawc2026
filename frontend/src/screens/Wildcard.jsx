import React, { useState } from 'react';

/**
 * Wildcard Component (Third-Place Qualification Screen)
 * @param {Array} thirdPlaceTeams - Array of objects: [{ group: 'A', team: 'South Korea' }, ...]
 * @param {Function} onConfirm - Callback when 8 teams are selected and user clicks proceed
 * @param {Function} onBack - Callback to return to the Group Stage
 */
export default function Wildcard({ thirdPlaceTeams = [], onConfirm, onBack }) {
  const [selectedTeams, setSelectedTeams] = useState([]);

  // Toggle selection state for a team
  const handleToggleTeam = (teamName) => {
    if (selectedTeams.includes(teamName)) {
      // Remove team if already selected
      setSelectedTeams(selectedTeams.filter((t) => t !== teamName));
    } else {
      // Add team only if we haven't reached the limit of 8
      if (selectedTeams.length < 8) {
        setSelectedTeams([...selectedTeams, teamName]);
      }
    }
  };

  const isComplete = selectedTeams.length === 8;
  const remaining = 8 - selectedTeams.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-green-900 to-emerald-950 text-white px-4 py-6 flex flex-col font-sans select-none">
      {/* Header Section */}
      <header className="mb-6 text-center">
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-900/60 px-3 py-1.5 rounded-full border border-emerald-800">
          Stage 2 of 4
        </span>
        <h1 className="text-2xl font-black mt-3 text-white uppercase tracking-tight drop-shadow-md">
          Wildcard Pool
        </h1>
        <p className="text-sm text-green-200 mt-1 max-w-sm mx-auto leading-relaxed">
          Select <strong className="text-yellow-400 font-semibold">exactly 8</strong> of the 12 third-place teams to advance to the Round of 32.
        </p>
      </header>

      {/* Progress / Status Bar */}
      <div className="bg-emerald-900/50 backdrop-blur-sm border border-emerald-800/80 rounded-2xl p-4 mb-6 shadow-lg text-center max-w-md mx-auto w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Selection Progress</span>
          <span className="text-sm font-bold text-white">
            {selectedTeams.length} <span className="text-emerald-400">/ 8</span> Selected
          </span>
        </div>
        
        {/* Progress Bar Track */}
        <div className="w-full bg-emerald-950 rounded-full h-3.5 border border-emerald-800 p-0.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(234,179,8,0.5)]"
            style={{ width: `${(selectedTeams.length / 8) * 100}%` }}
          />
        </div>

        <p className="text-xs mt-3 text-green-200">
          {remaining > 0 ? (
            <span>Please select <strong className="text-yellow-400">{remaining}</strong> more team{remaining > 1 ? 's' : ''}.</span>
          ) : (
            <span className="text-yellow-400 font-semibold animate-pulse">✓ Perfect! Ready to advance to the Knockouts.</span>
          )}
        </p>
      </div>

      {/* Grid of Third-Place Teams */}
      <main className="flex-1 max-w-md mx-auto w-full grid grid-cols-2 gap-3.5 mb-24">
        {thirdPlaceTeams.map(({ group, team }) => {
          const isSelected = selectedTeams.includes(team);
          const isDisabled = !isSelected && isComplete;

          return (
            <button
              key={team}
              onClick={() => handleToggleTeam(team)}
              disabled={isDisabled}
              className={`relative overflow-hidden flex flex-col justify-between items-start text-left p-4 rounded-xl border-2 transition-all duration-300 active:scale-95 shadow-md ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-800 to-green-700 border-yellow-400 text-white scale-[1.02] shadow-[0_0_15px_rgba(234,179,8,0.25)]'
                  : isDisabled
                  ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-600/50 cursor-not-allowed'
                  : 'bg-emerald-900/30 border-emerald-800/80 hover:border-emerald-700/80 text-white hover:bg-emerald-900/40'
              }`}
            >
              {/* Flag / Visual Accent (Can be replaced with dynamic flag asset) */}
              <div className="absolute -right-3 -bottom-3 text-emerald-800/20 text-6xl font-black select-none pointer-events-none">
                {group}
              </div>

              <div className="flex justify-between items-center w-full mb-4">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  isSelected 
                    ? 'bg-yellow-400 text-emerald-950' 
                    : 'bg-emerald-950/80 text-emerald-400 border border-emerald-805'
                }`}>
                  Group {group}
                </span>

                {/* Circular Selection Checkmark Indicator */}
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  isSelected 
                    ? 'bg-yellow-400 border-yellow-400' 
                    : 'border-emerald-700 bg-emerald-950/30'
                }`}>
                  {isSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-emerald-950 font-bold">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Team Name */}
              <span className={`text-base font-bold tracking-tight line-clamp-1 ${isSelected ? 'text-white' : 'text-green-50'}`}>
                {team}
              </span>
            </button>
          );
        })}
      </main>

      {/* Floating Action Bar at the Bottom */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-emerald-950/90 backdrop-blur-md border-t border-emerald-900 flex gap-3 justify-center items-center z-10">
        <div className="max-w-md w-full flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3.5 px-4 rounded-xl border border-emerald-800 bg-emerald-900/30 font-bold text-sm tracking-wide text-green-200 transition-all hover:bg-emerald-900/50 active:scale-98"
          >
            ← Back to Groups
          </button>
          <button
            onClick={() => isComplete && onConfirm(selectedTeams)}
            disabled={!isComplete}
            className={`flex-[2] py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg ${
              isComplete
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-950 active:scale-98 cursor-pointer hover:brightness-105'
                : 'bg-emerald-900/50 border border-emerald-850 text-emerald-700 cursor-not-allowed'
            }`}
          >
            Advance to Knockouts
          </button>
        </div>
      </footer>
    </div>
  );
}
