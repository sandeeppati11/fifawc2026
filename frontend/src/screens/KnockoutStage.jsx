import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollPredictorLayout from '../components/ScrollPredictorLayout';

/**
 * KnockoutStage Component
 * Renders the interactive bracket from Round of 32 down to the Final and 3rd Place Playoff.
 * 
 * @param {Array} groupRankings - [{ group: 'A', rankings: ['Mexico', 'South Korea', 'South Africa'] }, ...]
 * @param {Array} wildcardPicks - Array of 8 selected team names
 * @param {Function} onConfirm - Receives complete knockoutBracket object and proceeds
 * @param {Function} onBack - Returns to wildcard selection screen
 */
export default function KnockoutStage({ groupRankings = [], wildcardPicks = [], onConfirm, onBack }) {
  // Define the rounds
  const rounds = [
    { key: 'roundOf32', label: 'Round of 32', matchCount: 16 },
    { key: 'roundOf16', label: 'Round of 16', matchCount: 8 },
    { key: 'quarterfinals', label: 'Quarterfinals', matchCount: 4 },
    { key: 'semifinals', label: 'Semifinals', matchCount: 2 },
    { key: 'finals', label: 'Finals', matchCount: 2 } // Renders both Final and 3rd Place Playoff
  ];

  const [activeRoundKey, setActiveRoundKey] = useState('roundOf32');
  const [bracket, setBracket] = useState(null);

  // Initialize the bracket on mount
  useEffect(() => {
    // 1. Gather Group Winners, Runners-up, and Wildcards
    const winners = {};
    const runnersUp = {};
    groupRankings.forEach((gr) => {
      winners[gr.group] = gr.rankings[0];
      runnersUp[gr.group] = gr.rankings[1];
    });

    const wc = wildcardPicks; // Array of 8 teams

    // 2. Build the 16 Round of 32 Matches using our balanced schema
    // Each match has: matchId, homeTeam, awayTeam, winner
    const r32Matches = [
      { matchId: 'R32_M1', homeTeam: winners['A'] || '', awayTeam: wc[0] || '', winner: '' },
      { matchId: 'R32_M2', homeTeam: winners['F'] || '', awayTeam: runnersUp['A'] || '', winner: '' },
      { matchId: 'R32_M3', homeTeam: winners['C'] || '', awayTeam: wc[1] || '', winner: '' },
      { matchId: 'R32_M4', homeTeam: runnersUp['B'] || '', awayTeam: runnersUp['D'] || '', winner: '' },
      { matchId: 'R32_M5', homeTeam: winners['E'] || '', awayTeam: wc[2] || '', winner: '' },
      { matchId: 'R32_M6', homeTeam: winners['H'] || '', awayTeam: runnersUp['C'] || '', winner: '' },
      { matchId: 'R32_M7', homeTeam: winners['G'] || '', awayTeam: wc[3] || '', winner: '' },
      { matchId: 'R32_M8', homeTeam: runnersUp['F'] || '', awayTeam: runnersUp['H'] || '', winner: '' },
      { matchId: 'R32_M9', homeTeam: winners['I'] || '', awayTeam: wc[4] || '', winner: '' },
      { matchId: 'R32_M10', homeTeam: winners['J'] || '', awayTeam: runnersUp['E'] || '', winner: '' },
      { matchId: 'R32_M11', homeTeam: winners['K'] || '', awayTeam: wc[5] || '', winner: '' },
      { matchId: 'R32_M12', homeTeam: runnersUp['I'] || '', awayTeam: runnersUp['J'] || '', winner: '' },
      { matchId: 'R32_M13', homeTeam: winners['B'] || '', awayTeam: wc[6] || '', winner: '' },
      { matchId: 'R32_M14', homeTeam: winners['L'] || '', awayTeam: runnersUp['G'] || '', winner: '' },
      { matchId: 'R32_M15', homeTeam: winners['D'] || '', awayTeam: wc[7] || '', winner: '' },
      { matchId: 'R32_M16', homeTeam: runnersUp['K'] || '', awayTeam: runnersUp['L'] || '', winner: '' }
    ];

    // Initialize subsequent rounds with empty matches
    const initRoundMatches = (count, prefix) => 
      Array.from({ length: count }, (_, i) => ({
        matchId: `${prefix}_M${i + 1}`,
        homeTeam: '',
        awayTeam: '',
        winner: ''
      }));

    setBracket({
      roundOf32: r32Matches,
      roundOf16: initRoundMatches(8, 'R16'),
      quarterfinals: initRoundMatches(4, 'QF'),
      semifinals: initRoundMatches(2, 'SF'),
      thirdPlacePlayoff: { matchId: 'TP_M1', homeTeam: '', awayTeam: '', winner: '' },
      final: { matchId: 'FN_M1', homeTeam: '', awayTeam: '', winner: '' }
    });
  }, [groupRankings, wildcardPicks]);

  if (!bracket) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  // Bracket synchronization function that enforces deterministic propagation and clears invalid states
  const syncBracket = (currentBracket) => {
    const nextBracket = { ...currentBracket };

    // Sync Round of 16
    for (let i = 0; i < 8; i++) {
      const home = nextBracket.roundOf32[2 * i].winner;
      const away = nextBracket.roundOf32[2 * i + 1].winner;
      nextBracket.roundOf16[i].homeTeam = home;
      nextBracket.roundOf16[i].awayTeam = away;
      if (nextBracket.roundOf16[i].winner && nextBracket.roundOf16[i].winner !== home && nextBracket.roundOf16[i].winner !== away) {
        nextBracket.roundOf16[i].winner = '';
      }
    }

    // Sync Quarterfinals
    for (let i = 0; i < 4; i++) {
      const home = nextBracket.roundOf16[2 * i].winner;
      const away = nextBracket.roundOf16[2 * i + 1].winner;
      nextBracket.quarterfinals[i].homeTeam = home;
      nextBracket.quarterfinals[i].awayTeam = away;
      if (nextBracket.quarterfinals[i].winner && nextBracket.quarterfinals[i].winner !== home && nextBracket.quarterfinals[i].winner !== away) {
        nextBracket.quarterfinals[i].winner = '';
      }
    }

    // Sync Semifinals
    for (let i = 0; i < 2; i++) {
      const home = nextBracket.quarterfinals[2 * i].winner;
      const away = nextBracket.quarterfinals[2 * i + 1].winner;
      nextBracket.semifinals[i].homeTeam = home;
      nextBracket.semifinals[i].awayTeam = away;
      if (nextBracket.semifinals[i].winner && nextBracket.semifinals[i].winner !== home && nextBracket.semifinals[i].winner !== away) {
        nextBracket.semifinals[i].winner = '';
      }
    }

    // Sync Third Place Playoff (Losers of Semifinals)
    const sf0 = nextBracket.semifinals[0];
    const sf1 = nextBracket.semifinals[1];

    const sf0Loser = sf0.winner ? (sf0.homeTeam === sf0.winner ? sf0.awayTeam : sf0.homeTeam) : '';
    const sf1Loser = sf1.winner ? (sf1.homeTeam === sf1.winner ? sf1.awayTeam : sf1.homeTeam) : '';

    nextBracket.thirdPlacePlayoff.homeTeam = sf0Loser;
    nextBracket.thirdPlacePlayoff.awayTeam = sf1Loser;
    if (nextBracket.thirdPlacePlayoff.winner && nextBracket.thirdPlacePlayoff.winner !== sf0Loser && nextBracket.thirdPlacePlayoff.winner !== sf1Loser) {
      nextBracket.thirdPlacePlayoff.winner = '';
    }

    // Sync Final (Winners of Semifinals)
    const sf0Winner = sf0.winner || '';
    const sf1Winner = sf1.winner || '';

    nextBracket.final.homeTeam = sf0Winner;
    nextBracket.final.awayTeam = sf1Winner;
    if (nextBracket.final.winner && nextBracket.final.winner !== sf0Winner && nextBracket.final.winner !== sf1Winner) {
      nextBracket.final.winner = '';
    }

    return nextBracket;
  };

  // Toggle/Select match winner
  const selectWinner = (roundKey, index, teamName) => {
    if (!teamName) return;

    let updatedBracket = { ...bracket };
    if (roundKey === 'thirdPlacePlayoff') {
      updatedBracket.thirdPlacePlayoff.winner = teamName;
    } else if (roundKey === 'final') {
      updatedBracket.final.winner = teamName;
    } else {
      updatedBracket[roundKey][index].winner = teamName;
    }

    // Propagate changes
    const synced = syncBracket(updatedBracket);
    setBracket(synced);
  };

  // Helpers to check completion
  const getRoundStatus = (roundKey) => {
    if (roundKey === 'finals') {
      const tpDone = bracket.thirdPlacePlayoff.winner ? 1 : 0;
      const fnDone = bracket.final.winner ? 1 : 0;
      return { completed: tpDone + fnDone, total: 2 };
    }
    const matches = bracket[roundKey] || [];
    const completed = matches.filter((m) => m.winner !== '').length;
    return { completed, total: matches.length };
  };

  // Total Progress Stats
  const totalMatches = 32; // 16 + 8 + 4 + 2 + 1 + 1
  const completedMatchesCount = 
    getRoundStatus('roundOf32').completed +
    getRoundStatus('roundOf16').completed +
    getRoundStatus('quarterfinals').completed +
    getRoundStatus('semifinals').completed +
    getRoundStatus('finals').completed;

  const isBracketComplete = completedMatchesCount === totalMatches;

  // Render a specific match card
  const renderMatchCard = (match, index, roundKey) => {
    const { homeTeam, awayTeam, winner, matchId } = match;
    const isHomeSelected = winner === homeTeam && homeTeam !== '';
    const isAwaySelected = winner === awayTeam && awayTeam !== '';

    return (
      <div 
        key={matchId} 
        className="bg-emerald-900/20 border border-emerald-800/80 rounded-2xl p-4 shadow-md backdrop-blur-sm flex flex-col gap-3 transition-all hover:border-emerald-700/80 w-full max-w-md mx-auto"
      >
        <div className="flex justify-between items-center border-b border-emerald-900/60 pb-2">
          <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase">
            Match {index + 1} • {matchId.replace('_', ' ')}
          </span>
          {winner && (
            <span className="text-[10px] font-bold text-yellow-400 bg-yellow-950/60 border border-yellow-800/80 px-2 py-0.5 rounded-full animate-pulse">
              ✓ Prediction Made
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Home Team Button */}
          <button
            onClick={() => selectWinner(roundKey, index, homeTeam)}
            disabled={!homeTeam}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-bold transition-all ${
              !homeTeam 
                ? 'bg-emerald-950/25 border-emerald-900/40 text-emerald-700/40 cursor-not-allowed text-sm'
                : isHomeSelected
                ? 'bg-gradient-to-r from-emerald-850 to-green-700 border-yellow-400 text-white shadow-sm'
                : 'bg-emerald-950/60 border-emerald-800/60 text-green-100 hover:bg-emerald-900/40 hover:border-emerald-700/60 active:scale-98'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">{homeTeam || 'Awaiting Team...'}</span>
            </div>
            {isHomeSelected && (
              <div className="w-5 h-5 rounded-full bg-yellow-400 border border-yellow-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-emerald-950 font-bold">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>

          {/* VS Divider */}
          <div className="flex justify-center items-center -my-1">
            <span className="bg-emerald-950 text-[10px] font-black text-emerald-500/80 px-2 py-0.5 rounded-full border border-emerald-900">VS</span>
          </div>

          {/* Away Team Button */}
          <button
            onClick={() => selectWinner(roundKey, index, awayTeam)}
            disabled={!awayTeam}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-bold transition-all ${
              !awayTeam 
                ? 'bg-emerald-950/25 border-emerald-900/40 text-emerald-700/40 cursor-not-allowed text-sm'
                : isAwaySelected
                ? 'bg-gradient-to-r from-emerald-850 to-green-700 border-yellow-400 text-white shadow-sm'
                : 'bg-emerald-950/60 border-emerald-800/60 text-green-100 hover:bg-emerald-900/40 hover:border-emerald-700/60 active:scale-98'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">{awayTeam || 'Awaiting Team...'}</span>
            </div>
            {isAwaySelected && (
              <div className="w-5 h-5 rounded-full bg-yellow-400 border border-yellow-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-emerald-950 font-bold">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <ScrollPredictorLayout type="knockout">
      <div className="min-h-screen bg-transparent text-white px-4 py-6 flex flex-col font-sans select-none">
      {/* Header */}
      <header className="mb-5 text-center">
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-900/60 px-3 py-1.5 rounded-full border border-emerald-800">
          Stage 3 of 4
        </span>
        <h1 className="text-2xl font-black mt-3 uppercase tracking-tight drop-shadow-md">
          Knockout Bracket
        </h1>
        <p className="text-xs text-green-200 mt-1 max-w-sm mx-auto leading-normal">
          Tap the winner of each matchup to advance them to the next round. Make all predictions to complete.
        </p>
      </header>

      {/* Global Bracket Progress */}
      <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-800/60 rounded-xl p-3.5 mb-5 shadow-md max-w-md mx-auto w-full">
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-emerald-300">
          <span>Tournament Progress</span>
          <span>{completedMatchesCount} / {totalMatches} Matches Predicted</span>
        </div>
        <div className="w-full bg-emerald-950 rounded-full h-2 border border-emerald-850 p-0.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(234,179,8,0.4)]"
            style={{ width: `${(completedMatchesCount / totalMatches) * 100}%` }}
          />
        </div>
      </div>

      {/* Round Selection Tabs */}
      <nav className="mb-6 flex overflow-x-auto gap-2 pb-2 scrollbar-none justify-start md:justify-center">
        {rounds.map((round) => {
          const { completed, total } = getRoundStatus(round.key);
          const isCurrent = activeRoundKey === round.key;
          const isDone = completed === total;

          return (
            <button
              key={round.key}
              onClick={() => setActiveRoundKey(round.key)}
              className={`flex-none px-4 py-2.5 rounded-xl border text-xs font-extrabold tracking-wide uppercase transition-all flex flex-col items-center gap-1 min-w-[95px] ${
                isCurrent
                  ? 'bg-yellow-400 border-yellow-400 text-emerald-950 shadow-md scale-102 font-black'
                  : isDone
                  ? 'bg-emerald-900/50 border-emerald-800 text-emerald-400'
                  : 'bg-emerald-950/60 border-emerald-900 text-green-200 hover:bg-emerald-900/30'
              }`}
            >
              <span>{round.label}</span>
              <span className={`text-[9px] font-bold ${isCurrent ? 'text-emerald-900/80' : 'text-green-300/60'}`}>
                {completed} / {total}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Matches Grid Area */}
      <main className="flex-1 flex flex-col gap-5 mb-24 max-w-md mx-auto w-full">
        {activeRoundKey === 'finals' ? (
          <div className="flex flex-col gap-6 w-full">
            {/* Third Place Match */}
            <motion.div
              data-scroll-key="finals"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <h3 className="text-center font-extrabold text-sm text-emerald-400 uppercase tracking-widest mb-3">
                Third Place Playoff
              </h3>
              {renderMatchCard(bracket.thirdPlacePlayoff, 0, 'thirdPlacePlayoff')}
            </motion.div>

            {/* Final Match */}
            <motion.div
              data-scroll-key="finals"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <h3 className="text-center font-extrabold text-sm text-yellow-400 uppercase tracking-widest mb-3">
                The Grand Final
              </h3>
              {renderMatchCard(bracket.final, 0, 'final')}
            </motion.div>

            {/* Champion Celebration Callout */}
            {bracket.final.winner && (
              <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-yellow-400/50 rounded-2xl p-5 text-center shadow-lg max-w-md mx-auto w-full mt-2 animate-bounce">
                <span className="text-3xl">🏆</span>
                <h4 className="text-lg font-black text-yellow-400 uppercase mt-2 tracking-tight">Your Champion</h4>
                <p className="text-2xl font-black text-white mt-1 tracking-wide uppercase">{bracket.final.winner}</p>
                {bracket.thirdPlacePlayoff.winner && (
                  <p className="text-xs text-green-300 mt-2 font-semibold">
                    Third Place: {bracket.thirdPlacePlayoff.winner}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-5 w-full">
            {(bracket[activeRoundKey] || []).map((match, index) => (
              <motion.div
                key={match.matchId}
                data-scroll-key={activeRoundKey}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {renderMatchCard(match, index, activeRoundKey)}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-emerald-950/90 backdrop-blur-md border-t border-emerald-900 flex gap-3 justify-center items-center z-10">
        <div className="max-w-md w-full flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3.5 px-4 rounded-xl border border-emerald-800 bg-emerald-900/30 font-bold text-sm text-green-200 transition-all hover:bg-emerald-900/50 active:scale-98"
          >
            ← Back
          </button>
          <button
            onClick={() => {
              if (isBracketComplete) {
                onConfirm({
                  ...bracket,
                  champion: bracket.final.winner,
                  thirdPlaceWinner: bracket.thirdPlacePlayoff.winner
                });
              }
            }}
            disabled={!isBracketComplete}
            className={`flex-[2] py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg ${
              isBracketComplete
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-950 active:scale-98 cursor-pointer hover:brightness-105'
                : 'bg-emerald-900/50 border border-emerald-850 text-emerald-700 cursor-not-allowed'
            }`}
          >
            Submit Prediction Bracket
          </button>
        </div>
      </footer>
      </div>
    </ScrollPredictorLayout>
  );
}
