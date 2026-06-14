import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { initialGroups } from '../data/tournamentData';
import GroupCard from '../components/GroupCard';
import ScrollPredictorLayout from '../components/ScrollPredictorLayout';

/**
 * GroupStage Component
 * Renders predictions for the 12 Groups (A through L).
 * 
 * @param {Object} initialRankings - Pre-populated rankings if editing
 * @param {Function} onConfirm - Callback that receives { groupRankings, thirdPlaceTeams }
 * @param {Function} onBack - Returns to Onboarding screen
 */
export default function GroupStage({ initialRankings = {}, onConfirm, onBack }) {
  // Structure: { 'A': ['Mexico', 'South Korea', 'Czech Republic'], 'B': [], ... }
  const [rankings, setRankings] = useState(() => {
    const defaultRankings = {};
    initialGroups.forEach((g) => {
      defaultRankings[g.group] = initialRankings[g.group] || [];
    });
    return defaultRankings;
  });

  // Tap to select/deselect rankings
  const handleTeamClick = (groupLetter, teamName) => {
    const current = rankings[groupLetter] || [];
    if (current.includes(teamName)) {
      // Unrank
      const updated = current.filter((t) => t !== teamName);
      setRankings({ ...rankings, [groupLetter]: updated });
    } else {
      // Rank (only up to 3)
      if (current.length < 3) {
        setRankings({ ...rankings, [groupLetter]: [...current, teamName] });
      }
    }
  };

  // Check how many groups are fully complete (exactly 3 teams ranked)
  const completedGroupsCount = Object.values(rankings).filter((r) => r.length === 3).length;
  const isAllComplete = completedGroupsCount === 12;

  const handleProceed = () => {
    if (!isAllComplete) return;

    // Convert rankings structure to array: [{ group: 'A', rankings: [...] }]
    const formattedRankings = Object.entries(rankings).map(([group, teamList]) => ({
      group,
      rankings: teamList
    }));

    // Generate wildcard pool (the 3rd place team from each of the 12 groups)
    const thirdPlacePool = Object.entries(rankings).map(([group, teamList]) => ({
      group,
      team: teamList[2] // 3rd team (index 2)
    }));

    onConfirm(formattedRankings, thirdPlacePool);
  };

  return (
    <ScrollPredictorLayout type="groups">
      <div className="min-h-screen bg-transparent text-white px-4 py-6 flex flex-col font-sans select-none">
      {/* Header */}
      <header className="mb-5 text-center">
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-900/60 px-3 py-1.5 rounded-full border border-emerald-800">
          Stage 1 of 4
        </span>
        <h1 className="text-2xl font-black mt-3 uppercase tracking-tight drop-shadow-md">
          Group Stage
        </h1>
        <p className="text-xs text-green-200 mt-1 max-w-xs mx-auto leading-normal">
          Tap 3 teams in each group to rank them. The top 2 advance directly, and the 3rd-place team goes to the wildcard pool.
        </p>
      </header>

      {/* Progress Card */}
      <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-800/60 rounded-xl p-3.5 mb-6 shadow-md max-w-md mx-auto w-full">
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-emerald-300">
          <span>Groups Completed</span>
          <span>{completedGroupsCount} / 12 Groups Ranked</span>
        </div>
        <div className="w-full bg-emerald-950 rounded-full h-2.5 border border-emerald-850 p-0.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(234,179,8,0.4)]"
            style={{ width: `${(completedGroupsCount / 12) * 100}%` }}
          />
        </div>
      </div>

      {/* Grid of 12 Groups */}
      <main className="flex-1 max-w-md mx-auto w-full flex flex-col gap-5 mb-24">
        {initialGroups.map((g) => (
          <motion.div
            key={g.group}
            data-scroll-key={g.group}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <GroupCard
              groupData={g}
              rankedTeams={rankings[g.group]}
              onTeamClick={handleTeamClick}
            />
          </motion.div>
        ))}
      </main>

      {/* Floating Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-emerald-950/90 backdrop-blur-md border-t border-emerald-900 flex gap-3 justify-center items-center z-10">
        <div className="max-w-md w-full flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3.5 px-4 rounded-xl border border-emerald-800 bg-emerald-900/30 font-bold text-sm text-green-200 transition-all hover:bg-emerald-900/50 active:scale-98"
          >
            ← Back
          </button>
          <button
            onClick={handleProceed}
            disabled={!isAllComplete}
            className={`flex-[2] py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg ${
              isAllComplete
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-950 active:scale-98 cursor-pointer hover:brightness-105'
                : 'bg-emerald-900/50 border border-emerald-850 text-emerald-700 cursor-not-allowed'
            }`}
          >
            Go to Wildcards
          </button>
        </div>
      </footer>
      </div>
    </ScrollPredictorLayout>
  );
}
