import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Community Predictions Component
 * Renders global user predictions statistics and activity feed from MongoDB.
 * 
 * @param {Function} onBack - Returns back to builder onboarding
 */
export default function Community({ onBack }) {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats and recent feed on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, recentRes] = await Promise.all([
          fetch(`${API_BASE}/api/predictions/stats`),
          fetch(`${API_BASE}/api/predictions`)
        ]);

        if (!statsRes.ok || !recentRes.ok) {
          throw new Error('Failed to retrieve statistics data from the server.');
        }

        const statsData = await statsRes.json();
        const recentData = await recentRes.json();

        setStats(statsData);
        setRecent(recentData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white font-sans px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-450">Loading global stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white font-sans px-6 text-center">
        <span className="text-4xl mb-4">⚠️</span>
        <h2 className="text-lg font-black uppercase text-rose-400">Database Sync Error</h2>
        <p className="text-xs text-green-200 mt-2 max-w-xs leading-relaxed">
          Could not establish database syncing for global statistics. Check if your MongoDB backend connection is live.
        </p>
        <button
          onClick={onBack}
          className="mt-6 py-3 px-6 rounded-xl bg-emerald-900 border border-emerald-800 text-sm font-bold text-white transition-all hover:bg-emerald-900/60"
        >
          ← Go Back to Predictor
        </button>
      </div>
    );
  }

  const hasStats = stats && stats.total > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-green-900 to-emerald-950 text-white px-4 py-6 flex flex-col font-sans select-none">
      {/* Header */}
      <header className="mb-6 text-center">
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-900/60 px-3 py-1.5 rounded-full border border-emerald-800">
          Community Dashboard
        </span>
        <h1 className="text-2xl font-black mt-3 uppercase tracking-tight drop-shadow-md">
          Global Predictions
        </h1>
        <p className="text-xs text-green-200 mt-1 max-w-sm mx-auto leading-normal">
          Real-time aggregated results from football fans predicting around the globe.
        </p>
      </header>

      {/* Aggregate Stats Section */}
      <main className="flex-1 max-w-md mx-auto w-full flex flex-col gap-6 mb-24">
        {!hasStats ? (
          <div className="bg-emerald-900/20 border border-emerald-800/80 rounded-2xl p-6 text-center shadow-lg">
            <span className="text-4xl">⚽</span>
            <h3 className="text-sm font-extrabold text-white uppercase mt-4">No Predictions Yet</h3>
            <p className="text-xs text-green-300 mt-1.5 leading-relaxed">
              Be the first user to submit a prediction and kick off the global statistics!
            </p>
          </div>
        ) : (
          <>
            {/* Total submissions card */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/20 border border-emerald-800/80 rounded-2xl p-4 shadow-md text-center">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Total Brackets Logged</span>
              <p className="text-4xl font-black text-yellow-400 mt-1 tracking-wider">{stats.total}</p>
            </div>

            {/* Champion Predictions Section */}
            <section className="bg-emerald-900/20 border border-emerald-800/80 rounded-2xl p-4 shadow-md">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 border-b border-emerald-900/50 pb-2 mb-4">
                Predicted Champions
              </h3>
              <div className="flex flex-col gap-3.5">
                {stats.championStats.map((item, idx) => (
                  <div key={item.team} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-green-50 uppercase tracking-wide">
                        {idx + 1}. {item.team}
                      </span>
                      <span className="text-yellow-400">{item.percentage}% ({item.count})</span>
                    </div>
                    {/* Bar chart track */}
                    <div className="w-full bg-emerald-950/60 rounded-full h-2 border border-emerald-900/60 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Finalist Predictions Section */}
            <section className="bg-emerald-900/20 border border-emerald-800/80 rounded-2xl p-4 shadow-md">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 border-b border-emerald-900/50 pb-2 mb-4">
                Most Popular Finalists
              </h3>
              <div className="flex flex-col gap-3.5">
                {stats.finalistStats.map((item, idx) => (
                  <div key={item.team} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-green-50 uppercase tracking-wide">
                        {idx + 1}. {item.team}
                      </span>
                      <span className="text-yellow-400">{item.percentage}% ({item.count})</span>
                    </div>
                    <div className="w-full bg-emerald-950/60 rounded-full h-2 border border-emerald-900/60 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-550 to-green-500 h-full rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Activity Ticker Feed */}
            <section className="bg-emerald-900/20 border border-emerald-800/80 rounded-2xl p-4 shadow-md">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 border-b border-emerald-900/50 pb-2 mb-4">
                Recent Submissions
              </h3>
              <div className="flex flex-col gap-3 divide-y divide-emerald-900/40 max-h-[200px] overflow-y-auto pr-1">
                {recent.map((pred, i) => (
                  <div key={pred._id || i} className={`pt-3 flex justify-between items-center ${i === 0 ? 'pt-0 border-t-0' : ''}`}>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white uppercase tracking-wide">{pred.name}</span>
                      <span className="text-[10px] text-green-300">
                        {new Date(pred.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-emerald-400 block tracking-widest">Champion Pick</span>
                      <span className="text-xs font-black uppercase text-yellow-400">{pred.knockoutBracket?.champion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Floating Action Button */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-emerald-950/90 backdrop-blur-md border-t border-emerald-900 flex justify-center items-center z-10">
        <button
          onClick={onBack}
          className="max-w-md w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-800 to-green-700 border border-emerald-500 font-bold text-sm tracking-wider uppercase text-white shadow-lg transition-all active:scale-98 hover:brightness-105"
        >
          ← Back to Predictor
        </button>
      </footer>
    </div>
  );
}
