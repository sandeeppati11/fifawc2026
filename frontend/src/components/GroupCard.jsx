import React from 'react';

/**
 * GroupCard Component
 * Renders a group card for ranking top 3 teams.
 * 
 * @param {Object} groupData - { group: 'A', teams: ['Mexico', 'South Africa', ...] }
 * @param {Array} rankedTeams - Array of 0 to 3 team names in ranked order (1st, 2nd, 3rd)
 * @param {Function} onTeamClick - Callback when a team is tapped
 */
export default function GroupCard({ groupData, rankedTeams = [], onTeamClick }) {
  const { group, teams } = groupData;
  const isComplete = rankedTeams.length === 3;

  // Render rank badge (1st, 2nd, 3rd)
  const renderRankBadge = (teamName) => {
    const rankIndex = rankedTeams.indexOf(teamName);
    if (rankIndex === -1) {
      return (
        <span className="w-7 h-7 rounded-full border-2 border-emerald-800 bg-emerald-950/40 text-[11px] font-bold text-emerald-600/70 flex items-center justify-center">
          -
        </span>
      );
    }

    if (rankIndex === 0) {
      return (
        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 text-emerald-950 font-black text-xs flex items-center justify-center shadow-md animate-scale">
          1st
        </span>
      );
    }
    if (rankIndex === 1) {
      return (
        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 via-slate-350 to-slate-400 text-emerald-950 font-black text-xs flex items-center justify-center shadow-md">
          2nd
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white font-black text-[10px] flex items-center justify-center shadow-md">
        3rd
      </span>
    );
  };

  return (
    <div className={`bg-emerald-900/20 border-2 rounded-2xl p-4 shadow-md backdrop-blur-sm transition-all duration-300 ${
      isComplete 
        ? 'border-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.15)] bg-emerald-900/30' 
        : 'border-emerald-850/80 hover:border-emerald-800'
    }`}>
      {/* Card Header */}
      <div className="flex justify-between items-center mb-3 border-b border-emerald-900/60 pb-2">
        <h3 className="text-base font-black tracking-wide text-white">
          GROUP <span className="text-yellow-400 font-extrabold">{group}</span>
        </h3>
        {isComplete ? (
          <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Complete
          </span>
        ) : (
          <span className="text-[10px] font-bold text-amber-500 bg-amber-950/60 border border-amber-900/60 px-2 py-0.5 rounded-full uppercase tracking-wide">
            Rank Top 3
          </span>
        )}
      </div>

      {/* Teams List */}
      <div className="flex flex-col gap-2">
        {teams.map((teamName) => {
          const rankIndex = rankedTeams.indexOf(teamName);
          const isSelected = rankIndex !== -1;

          return (
            <button
              key={teamName}
              onClick={() => onTeamClick(group, teamName)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-850/60 border-emerald-500 text-white font-bold'
                  : 'bg-emerald-950/40 border-emerald-900/40 hover:border-emerald-800 text-green-200 hover:text-white'
              }`}
            >
              <span className="text-sm tracking-tight">{teamName}</span>
              {renderRankBadge(teamName)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
