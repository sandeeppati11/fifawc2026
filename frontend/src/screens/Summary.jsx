import React, { useEffect, useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

/**
 * Summary Component (Celebration and Download Screen)
 * 
 * @param {string} name - User's name
 * @param {Array} groupRankings - [{ group: 'A', rankings: [...] }, ...]
 * @param {Array} wildcardPicks - ['Team1', 'Team2', ...]
 * @param {Object} knockoutBracket - Completed knockout matches object
 * @param {Function} onViewCommunity - Navigation to Community Stats screen
 * @param {Function} onReset - Navigation back to start over
 */
export default function Summary({ name, groupRankings, wildcardPicks, knockoutBracket, onViewCommunity, onReset, saveStatus }) {
  const printRef = useRef(null);

  // Handle PDF Generation
  const handleDownloadPDF = () => {
    const element = printRef.current;
    if (!element) return;

    // Temporary force element visible during render if necessary
    const opt = {
      margin:       0.3,
      filename:     `${name.replace(/\s+/g, '_')}_worldcup2026_bracket.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2.5, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  const champion = knockoutBracket.champion;
  const runnerUp = knockoutBracket.final.winner === knockoutBracket.final.homeTeam 
    ? knockoutBracket.final.awayTeam 
    : knockoutBracket.final.homeTeam;
  const thirdPlace = knockoutBracket.thirdPlaceWinner;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-green-900 to-emerald-950 text-white px-4 py-8 flex flex-col items-center justify-between font-sans select-none relative">
      
      {/* Confetti-like ambient decoration */}
      <div className="absolute top-10 left-10 text-3xl animate-bounce duration-1000 opacity-60">✨</div>
      <div className="absolute top-20 right-10 text-3xl animate-bounce duration-700 opacity-60">⚽</div>
      <div className="absolute bottom-32 left-12 text-3xl animate-bounce duration-800 opacity-60">🏆</div>
      <div className="absolute bottom-24 right-14 text-3xl animate-bounce duration-1200 opacity-60">✨</div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center max-w-md w-full z-10 my-4">
        {/* Celebration Trophy Header */}
        <div className="w-28 h-28 bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(234,179,8,0.4)] text-5xl mb-6 border-4 border-yellow-200 animate-pulse">
          🏆
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tight leading-none text-yellow-400">
          Bracket Complete!
        </h1>
        <p className="text-sm text-green-200 mt-2 font-semibold">
          Congratulations {name}! You have built your road to glory.
        </p>

        {/* Database Status Message */}
        <div className="mt-4 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-950/60 border inline-flex items-center gap-1.5">
          {saveStatus === 'saving' && (
            <>
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
              <span className="text-yellow-400 uppercase tracking-wider">Saving bracket to feed...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <span className="text-emerald-400">✓</span>
              <span className="text-emerald-400 uppercase tracking-wider">Bracket published to Community!</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <span className="text-rose-400">⚠️</span>
              <span className="text-rose-450 uppercase tracking-wider">Failed to publish bracket to DB.</span>
            </>
          )}
        </div>

        {/* Podiums / Results Summary */}
        <section className="w-full bg-emerald-900/40 border border-emerald-800/80 rounded-2xl p-5 shadow-lg mt-6 flex flex-col gap-4 text-left">
          <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 border-b border-emerald-900/60 pb-2">
            Your Predictions
          </h2>

          {/* Gold Podium */}
          <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-yellow-400/25 to-amber-500/10 border border-yellow-400/40 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥇</span>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-black tracking-widest text-yellow-400">Champion</span>
                <span className="text-base font-black uppercase tracking-tight">{champion}</span>
              </div>
            </div>
          </div>

          {/* Silver Podium */}
          <div className="flex items-center justify-between p-3.5 bg-slate-400/10 border border-slate-400/30 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥈</span>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-black tracking-widest text-slate-350">Runner-up</span>
                <span className="text-base font-black uppercase tracking-tight text-slate-200">{runnerUp}</span>
              </div>
            </div>
          </div>

          {/* Bronze Podium */}
          <div className="flex items-center justify-between p-3.5 bg-amber-700/10 border border-amber-700/35 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥉</span>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-black tracking-widest text-amber-500">Third Place</span>
                <span className="text-base font-black uppercase tracking-tight text-amber-100">{thirdPlace}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Action Buttons */}
      <footer className="w-full max-w-md flex flex-col gap-3.5 mt-4 z-10">
        <button
          onClick={handleDownloadPDF}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-950 font-black text-sm tracking-wider uppercase shadow-lg transition-all active:scale-98 hover:brightness-105"
        >
          Download My Bracket PDF
        </button>

        <div className="flex gap-3">
          <button
            onClick={onViewCommunity}
            className="flex-1 py-3.5 px-4 rounded-xl border border-emerald-800 bg-emerald-900/30 font-extrabold text-sm tracking-wide text-green-200 transition-all hover:bg-emerald-900/50 active:scale-98"
          >
            📊 Global Stats
          </button>
          <button
            onClick={onReset}
            className="flex-1 py-3.5 px-4 rounded-xl border border-emerald-800/80 bg-emerald-950/40 font-extrabold text-sm tracking-wide text-green-300 transition-all hover:bg-emerald-900/20 active:scale-98"
          >
            🔄 Predict Again
          </button>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* PRINTABLE PDF CONTAINER (Rendered off-screen or captured) */}
      {/* ======================================================== */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div 
          ref={printRef}
          style={{ width: '800px', padding: '40px', backgroundColor: '#022c22', color: '#ffffff', fontFamily: 'sans-serif' }}
          className="rounded-3xl border-8 border-double border-yellow-400 text-left"
        >
          {/* Certificate Header */}
          <div className="text-center border-b-2 border-emerald-800 pb-6 mb-8">
            <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', color: '#fbbf24' }}>
              FIFA World Cup 2026 Predictions
            </h1>
            <p style={{ fontSize: '14px', margin: '0', color: '#a7f3d0', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Official Prediction Certificate
            </p>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '15px', color: '#ffffff' }}>
              PREDICTED BY: <span style={{ color: '#fbbf24', textDecoration: 'underline' }}>{name.toUpperCase()}</span>
            </div>
          </div>

          {/* Podiums Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: 'rgba(251,191,36,0.1)', border: '2px solid #fbbf24', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '30px', marginBottom: '5px' }}>🥇</div>
              <div style={{ fontSize: '11px', fontWeight: '900', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '5px' }}>Champion</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>{champion}</div>
            </div>
            
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '2px solid #94a3b8', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '30px', marginBottom: '5px' }}>🥈</div>
              <div style={{ fontSize: '11px', fontWeight: '900', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '5px' }}>Runner-Up</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>{runnerUp}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(180,83,9,0.1)', border: '2px solid #b45309', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '30px', marginBottom: '5px' }}>🥉</div>
              <div style={{ fontSize: '11px', fontWeight: '900', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '5px' }}>Third Place</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>{thirdPlace}</div>
            </div>
          </div>

          {/* Detailed Path Info */}
          <div style={{ backgroundColor: '#064e3b', border: '1px solid #065f46', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0', textTransform: 'uppercase', color: '#fbbf24', borderBottom: '1px solid #065f46', paddingBottom: '8px' }}>
              Qualified Wildcard Teams (Best 3rd Place)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {wildcardPicks.map((wName, idx) => (
                <div key={wName} style={{ fontSize: '12px', fontWeight: 'bold', padding: '8px', backgroundColor: '#022c22', border: '1px solid #10b981', borderRadius: '8px', textAlign: 'center' }}>
                  #{idx + 1} • {wName}
                </div>
              ))}
            </div>
          </div>

          {/* Group Winners Table */}
          <div style={{ backgroundColor: '#064e3b', border: '1px solid #065f46', borderRadius: '15px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0', textTransform: 'uppercase', color: '#fbbf24', borderBottom: '1px solid #065f46', paddingBottom: '8px' }}>
              Group Stage Standings (Top 3)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Column 1 */}
              <div>
                {groupRankings.slice(0, 6).map((gr) => (
                  <div key={gr.group} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(16,185,129,0.15)', fontSize: '12px' }}>
                    <span style={{ fontWeight: 'bold', color: '#34d399' }}>Group {gr.group}:</span>
                    <span>{gr.rankings.join(' > ')}</span>
                  </div>
                ))}
              </div>
              {/* Column 2 */}
              <div>
                {groupRankings.slice(6, 12).map((gr) => (
                  <div key={gr.group} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(16,185,129,0.15)', fontSize: '12px' }}>
                    <span style={{ fontWeight: 'bold', color: '#34d399' }}>Group {gr.group}:</span>
                    <span>{gr.rankings.join(' > ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer watermark */}
          <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '10px', color: '#047857', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 'bold' }}>
            FIFA World Cup 2026 Prediction System • Verified Complete
          </div>
        </div>
      </div>
    </div>
  );
}
