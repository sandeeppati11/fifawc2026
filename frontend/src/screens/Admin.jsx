import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import {
  Search,
  Download,
  Eye,
  TrendingUp,
  Users,
  Award,
  ArrowLeft,
  Calendar,
  X,
  ChevronRight,
  Shield,
  Clock
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Admin({ onBack }) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const printRef = useRef(null);

  // Fetch predictions on load
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/predictions/admin/all`);
        if (!response.ok) {
          throw new Error('Failed to retrieve predictions. Please try again.');
        }
        const data = await response.json();
        setPredictions(data);
        setError('');
      } catch (err) {
        console.error('Error fetching admin predictions:', err);
        setError(err.message || 'Server error. Failed to load predictions.');
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  // Compute local metrics
  const totalSubmissions = predictions.length;

  const getTopChampion = () => {
    if (predictions.length === 0) return { name: 'N/A', count: 0, percentage: 0 };
    const counts = {};
    predictions.forEach(p => {
      const champ = p.knockoutBracket?.champion;
      if (champ) {
        counts[champ] = (counts[champ] || 0) + 1;
      }
    });
    let topName = 'N/A';
    let maxVal = 0;
    Object.keys(counts).forEach(k => {
      if (counts[k] > maxVal) {
        maxVal = counts[k];
        topName = k;
      }
    });
    const pct = ((maxVal / totalSubmissions) * 100).toFixed(1);
    return { name: topName, count: maxVal, percentage: pct };
  };

  const getLatestSubmitter = () => {
    if (predictions.length === 0) return { name: 'N/A', dateStr: 'N/A' };
    const latest = predictions[0];
    const dateStr = new Date(latest.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return { name: latest.name, dateStr };
  };

  const topChamp = getTopChampion();
  const latestSubmit = getLatestSubmitter();

  // Search logic
  const filteredPredictions = predictions.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.knockoutBracket?.champion || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate runner up helper
  const getRunnerUp = (kb) => {
    if (!kb || !kb.final) return '';
    return kb.final.winner === kb.final.homeTeam
      ? kb.final.awayTeam
      : kb.final.homeTeam;
  };

  // PDF Download handler
  const handleDownloadPDF = (prediction) => {
    // We update state first to populate the offscreen print container
    setSelectedPrediction(prediction);
    setPdfGenerating(true);

    // Timeout allows DOM to render the off-screen template
    setTimeout(() => {
      const element = printRef.current;
      if (!element) {
        setPdfGenerating(false);
        return;
      }

      const runnerUp = getRunnerUp(prediction.knockoutBracket);
      const opt = {
        margin: 0.3,
        filename: `${prediction.name.replace(/\s+/g, '_')}_worldcup2026_bracket.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2.5, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf()
        .from(element)
        .set(opt)
        .save()
        .then(() => {
          setPdfGenerating(false);
        })
        .catch(err => {
          console.error('PDF generation error:', err);
          setPdfGenerating(false);
        });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-white font-sans selection:bg-yellow-400 selection:text-emerald-950">

      {/* Admin Dashboard Header */}
      <header className="bg-emerald-900/60 backdrop-blur-md border-b border-emerald-800 sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-400 text-emerald-950 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-yellow-400/10">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              Admin <span className="text-yellow-400">Dashboard</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">
              Predictions Database Manager
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-emerald-950/80 border border-emerald-800 px-4 py-2.5 rounded-xl hover:bg-emerald-900 transition-all hover:text-yellow-400 active:scale-95 shadow-md"
        >
          <ArrowLeft size={14} />
          Logout Admin
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* Overview Metric Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Total Predictions */}
          <div className="bg-emerald-900/20 border border-emerald-800/80 rounded-2xl p-6 flex items-center justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                Total Submissions
              </span>
              <span className="text-3xl font-black tracking-tight text-white mt-1">
                {loading ? '...' : totalSubmissions}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-900/60 border border-emerald-800 flex items-center justify-center text-emerald-400 group-hover:text-white transition-colors duration-300">
              <Users size={24} />
            </div>
          </div>

          {/* Card 2: Consensus Champion */}
          <div className="bg-emerald-900/20 border border-emerald-800/80 rounded-2xl p-6 flex items-center justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-400" />
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-yellow-400">
                Consensus Champion
              </span>
              <span className="text-lg font-black uppercase tracking-tight text-white mt-1 truncate max-w-[200px]">
                {loading ? '...' : topChamp.name}
              </span>
              {totalSubmissions > 0 && (
                <span className="text-[10px] text-emerald-300 font-bold">
                  {topChamp.count} picks ({topChamp.percentage}%)
                </span>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-900/60 border border-emerald-800 flex items-center justify-center text-yellow-400 group-hover:brightness-110 transition-colors duration-300">
              <Award size={24} />
            </div>
          </div>

          {/* Card 3: Latest Activity */}
          <div className="bg-emerald-900/20 border border-emerald-800/80 rounded-2xl p-6 flex items-center justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-400" />
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400">
                Latest Activity
              </span>
              <span className="text-sm font-black uppercase tracking-tight text-white mt-2 truncate max-w-[200px]">
                {loading ? '...' : latestSubmit.name}
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">
                {loading ? '' : latestSubmit.dateStr}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-900/60 border border-emerald-800 flex items-center justify-center text-cyan-400 group-hover:text-white transition-colors duration-300">
              <Clock size={24} />
            </div>
          </div>
        </section>

        {/* Controls and Search */}
        <section className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by user or champion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-900/20 border border-emerald-800 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white placeholder-emerald-800/60 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all shadow-inner"
            />
          </div>

          <div className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-900/30 border border-emerald-800/60 px-4 py-2 rounded-xl shadow-sm self-stretch sm:self-auto text-center flex items-center justify-center">
            {loading ? 'Loading...' : `${filteredPredictions.length} Submissions Found`}
          </div>
        </section>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Fetching user prediction sheets...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-rose-950/40 border border-rose-800 text-rose-200 px-6 py-4 rounded-xl text-center font-bold text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPredictions.length === 0 && (
          <div className="bg-emerald-900/10 border border-dashed border-emerald-800/80 rounded-2xl py-16 px-6 text-center">
            <span className="text-4xl block mb-3">⚽</span>
            <h3 className="text-base font-black uppercase text-emerald-400">
              No Predictions Found
            </h3>
            <p className="text-xs text-green-200 max-w-xs mx-auto mt-2 leading-relaxed">
              {searchQuery ? `We couldn't find any results matching "${searchQuery}".` : 'No user predictions have been submitted to the database yet.'}
            </p>
          </div>
        )}

        {/* Main Grid List of predictions */}
        {!loading && !error && filteredPredictions.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPredictions.map((pred) => {
              const runUp = getRunnerUp(pred.knockoutBracket);
              return (
                <div
                  key={pred._id}
                  className="bg-emerald-900/30 border border-emerald-850 hover:border-emerald-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative"
                >
                  <div className="flex flex-col gap-3">
                    {/* Card Header Info */}
                    <div className="flex justify-between items-start border-b border-emerald-900/50 pb-3">
                      <div>
                        <h3 className="font-black uppercase tracking-tight text-yellow-400 text-base max-w-[180px] truncate" title={pred.name}>
                          {pred.name}
                        </h3>
                        <span className="text-[9px] font-bold text-emerald-400/80 block uppercase tracking-wider mt-0.5">
                          {new Date(pred.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="text-[10px] font-black tracking-widest text-emerald-300 uppercase bg-emerald-950 border border-emerald-850 px-2.5 py-1 rounded-lg">
                        DB Saved
                      </div>
                    </div>

                    {/* Quick Podium Results display */}
                    <div className="flex flex-col gap-2 my-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="grayscale-0">🥇</span>
                        <span className="font-extrabold uppercase text-[10px] text-emerald-400 w-16">Champion:</span>
                        <span className="font-black uppercase text-white truncate max-w-[150px]">{pred.knockoutBracket?.champion}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="grayscale-0">🥈</span>
                        <span className="font-extrabold uppercase text-[10px] text-emerald-400 w-16">Runner-up:</span>
                        <span className="font-black uppercase text-emerald-250 truncate max-w-[150px]">{runUp}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="grayscale-0">🥉</span>
                        <span className="font-extrabold uppercase text-[10px] text-emerald-400 w-16">3rd Place:</span>
                        <span className="font-black uppercase text-emerald-300 truncate max-w-[150px]">{pred.knockoutBracket?.thirdPlaceWinner}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex gap-2 border-t border-emerald-900/50 pt-4 mt-4">
                    <button
                      onClick={() => setSelectedPrediction(pred)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 rounded-xl font-extrabold text-[11px] uppercase tracking-wider text-green-200 transition-colors shadow-sm"
                    >
                      <Eye size={12} />
                      View details
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(pred)}
                      className="flex items-center justify-center p-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:brightness-105 rounded-xl font-bold text-emerald-950 transition-transform active:scale-95 shadow-md shadow-yellow-500/10"
                      title="Download PDF"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>

      {/* ======================================================== */}
      {/* DETAILED VIEW MODAL                                      */}
      {/* ======================================================== */}
      {selectedPrediction && !pdfGenerating && (
        <div className="fixed inset-0 bg-emerald-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-emerald-900 border border-emerald-850 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col relative animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="sticky top-0 bg-emerald-900 border-b border-emerald-800/80 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-black uppercase text-yellow-400 tracking-tight">
                  {selectedPrediction.name}'s Predictions
                </h2>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">
                  Submitted: {new Date(selectedPrediction.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedPrediction(null)}
                className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col gap-6">

              {/* Podium Highlight */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-950/50 border border-yellow-500/20 rounded-xl p-3.5 text-center">
                  <span className="text-xl block mb-1">🥇</span>
                  <span className="text-[9px] uppercase font-bold text-yellow-400 block tracking-widest">Champion</span>
                  <span className="text-xs font-black uppercase text-white mt-1 block truncate">
                    {selectedPrediction.knockoutBracket?.champion}
                  </span>
                </div>
                <div className="bg-emerald-950/50 border border-slate-500/20 rounded-xl p-3.5 text-center">
                  <span className="text-xl block mb-1">🥈</span>
                  <span className="text-[9px] uppercase font-bold text-slate-350 block tracking-widest">Runner-Up</span>
                  <span className="text-xs font-black uppercase text-white mt-1 block truncate">
                    {getRunnerUp(selectedPrediction.knockoutBracket)}
                  </span>
                </div>
                <div className="bg-emerald-950/50 border border-amber-600/20 rounded-xl p-3.5 text-center">
                  <span className="text-xl block mb-1">🥉</span>
                  <span className="text-[9px] uppercase font-bold text-amber-500 block tracking-widest">Third Place</span>
                  <span className="text-xs font-black uppercase text-white mt-1 block truncate">
                    {selectedPrediction.knockoutBracket?.thirdPlaceWinner}
                  </span>
                </div>
              </div>

              {/* Group Standings Rankings */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 border-b border-emerald-850 pb-2 mb-3">
                  Group Standings (Top 3)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedPrediction.groupStage?.map((gs) => (
                    <div key={gs.group} className="bg-emerald-950/40 border border-emerald-850/60 rounded-xl p-2.5 flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase text-yellow-400">
                        Group {gs.group}
                      </span>
                      <div className="text-[10px] font-bold flex flex-col gap-0.5 text-emerald-100">
                        {gs.rankings.map((team, rank) => (
                          <div key={team} className="truncate">
                            <span className="text-emerald-500 font-extrabold mr-1">{rank + 1}.</span>
                            {team}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wildcard selections */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 border-b border-emerald-850 pb-2 mb-3">
                  Best 3rd Place Wildcards (8 Qualified)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedPrediction.wildcardPicks?.map((wc, index) => (
                    <div key={wc} className="bg-emerald-950/30 border border-emerald-850 p-2 rounded-xl text-center text-xs font-bold text-emerald-100 flex items-center justify-center gap-1">
                      <span className="text-[9px] font-black text-emerald-500 font-mono">#{index + 1}</span>
                      <span className="truncate">{wc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Major Knockout Stage Decisions Summary */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 border-b border-emerald-850 pb-2 mb-3">
                  Knockout Stage Progression Details
                </h4>
                <div className="bg-emerald-950/40 border border-emerald-850 rounded-xl p-4 flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Semifinals */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400">Semifinals</span>
                      {selectedPrediction.knockoutBracket?.semifinals?.map((match, i) => (
                        <div key={match.matchId || i} className="bg-emerald-950/80 border border-emerald-900 rounded-lg p-2 text-xs flex justify-between items-center">
                          <span className="truncate max-w-[180px] font-semibold text-emerald-250">
                            {match.homeTeam} vs {match.awayTeam}
                          </span>
                          <span className="font-black text-yellow-400 uppercase text-[10px]">
                            🏆 {match.winner}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Final & 3rd Playoff matches */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400">Final & 3rd Place Match</span>
                      <div className="bg-emerald-950/80 border border-emerald-900 rounded-lg p-2 text-xs flex justify-between items-center">
                        <span className="truncate font-black text-yellow-400 uppercase text-[9px] border border-yellow-400/25 px-1 py-0.5 rounded">
                          Final
                        </span>
                        <span className="truncate max-w-[130px] font-semibold text-emerald-250">
                          {selectedPrediction.knockoutBracket?.final?.homeTeam} vs {selectedPrediction.knockoutBracket?.final?.awayTeam}
                        </span>
                        <span className="font-black text-yellow-400 uppercase text-[10px]">
                          {selectedPrediction.knockoutBracket?.final?.winner}
                        </span>
                      </div>
                      <div className="bg-emerald-950/80 border border-emerald-900 rounded-lg p-2 text-xs flex justify-between items-center">
                        <span className="truncate font-black text-amber-500 uppercase text-[9px] border border-amber-600/25 px-1 py-0.5 rounded">
                          3rd Place
                        </span>
                        <span className="truncate max-w-[130px] font-semibold text-emerald-250">
                          {selectedPrediction.knockoutBracket?.thirdPlacePlayoff?.homeTeam} vs {selectedPrediction.knockoutBracket?.thirdPlacePlayoff?.awayTeam}
                        </span>
                        <span className="font-black text-yellow-400 uppercase text-[10px]">
                          {selectedPrediction.knockoutBracket?.thirdPlacePlayoff?.winner}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="sticky bottom-0 bg-emerald-900 border-t border-emerald-800/80 px-6 py-4 flex justify-end gap-3 z-10">
              <button
                onClick={() => setSelectedPrediction(null)}
                className="py-2.5 px-5 rounded-xl border border-emerald-850 hover:bg-emerald-950/30 text-xs font-black uppercase tracking-wider text-green-300 transition-colors"
              >
                Close View
              </button>
              <button
                onClick={() => handleDownloadPDF(selectedPrediction)}
                className="py-2.5 px-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-950 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-105 active:scale-95 transition-transform flex items-center gap-1.5 shadow-md shadow-yellow-500/10"
              >
                <Download size={14} />
                Download Certificate PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PRINTABLE PDF CONTAINER (Rendered off-screen)            */}
      {/* ======================================================== */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        {selectedPrediction && (
          <div
            ref={printRef}
            style={{ width: '800px', padding: '25px 30px', backgroundColor: '#022c22', color: '#ffffff', fontFamily: 'sans-serif' }}
            className="rounded-3xl border-8 border-double border-yellow-400 text-left"
          >
            {/* Certificate Header */}
            <div className="text-center border-b-2 border-emerald-800 pb-3 mb-4">
              <h1 style={{ fontSize: '26px', margin: '0 0 5px 0', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', color: '#fbbf24' }}>
                FIFA World Cup 2026 Predictions
              </h1>
              <p style={{ fontSize: '11px', margin: '0', color: '#a7f3d0', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Official Prediction Certificate
              </p>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '10px', color: '#ffffff' }}>
                PREDICTED BY: <span style={{ color: '#fbbf24', textDecoration: 'underline' }}>{selectedPrediction.name?.toUpperCase()}</span>
              </div>
            </div>

            {/* Podiums Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', color: '#ffffff', fontFamily: 'sans-serif', fontSize: '11px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #fbbf24', textAlign: 'left', backgroundColor: '#064e3b' }}>
                  <th style={{ padding: '6px 8px', fontWeight: '900', color: '#fbbf24', textTransform: 'uppercase', width: '25%' }}>Position</th>
                  <th style={{ padding: '6px 8px', fontWeight: '900', color: '#fbbf24', textTransform: 'uppercase', width: '50%' }}>Predicted Team</th>
                  <th style={{ padding: '6px 8px', fontWeight: '900', color: '#fbbf24', textTransform: 'uppercase', width: '25%' }}>Award</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(251,191,36,0.3)', backgroundColor: 'rgba(251,191,36,0.05)' }}>
                  <td style={{ padding: '6px 8px', fontWeight: '900', color: '#fbbf24' }}>🥇 CHAMPION</td>
                  <td style={{ padding: '6px 8px', fontWeight: '900', textTransform: 'uppercase', fontSize: '13px', color: '#ffffff' }}>
                    {selectedPrediction.knockoutBracket?.champion}
                  </td>
                  <td style={{ padding: '6px 8px', fontWeight: 'bold', color: '#fbbf24' }}>Gold Trophy</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(203,213,225,0.3)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '6px 8px', fontWeight: '900', color: '#cbd5e1' }}>🥈 RUNNER-UP</td>
                  <td style={{ padding: '6px 8px', fontWeight: '900', textTransform: 'uppercase', fontSize: '13px', color: '#ffffff' }}>
                    {getRunnerUp(selectedPrediction.knockoutBracket)}
                  </td>
                  <td style={{ padding: '6px 8px', fontWeight: 'bold', color: '#cbd5e1' }}>Silver Medal</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(245,158,11,0.3)', backgroundColor: 'rgba(180,83,9,0.03)' }}>
                  <td style={{ padding: '6px 8px', fontWeight: '900', color: '#f59e0b' }}>🥉 THIRD PLACE</td>
                  <td style={{ padding: '6px 8px', fontWeight: '900', textTransform: 'uppercase', fontSize: '13px', color: '#ffffff' }}>
                    {selectedPrediction.knockoutBracket?.thirdPlaceWinner}
                  </td>
                  <td style={{ padding: '6px 8px', fontWeight: 'bold', color: '#f59e0b' }}>Bronze Medal</td>
                </tr>
              </tbody>
            </table>

            {/* Detailed Path Info (Wildcards Table) */}
            <div style={{ backgroundColor: '#064e3b', border: '1px solid #065f46', borderRadius: '15px', padding: '12px 15px', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '12px', margin: '0 0 8px 0', textTransform: 'uppercase', color: '#fbbf24', borderBottom: '1px solid #065f46', paddingBottom: '6px', fontWeight: '900' }}>
                Qualified Wildcard Teams (Best 3rd Place)
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ffffff', fontSize: '11px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #34d399', textAlign: 'left', backgroundColor: 'rgba(2,44,34,0.4)' }}>
                    <th style={{ padding: '4px 8px', fontWeight: '900', color: '#34d399', textTransform: 'uppercase', width: '15%' }}>Rank</th>
                    <th style={{ padding: '4px 8px', fontWeight: '900', color: '#34d399', textTransform: 'uppercase', width: '35%' }}>Team</th>
                    <th style={{ padding: '4px 8px', fontWeight: '900', color: '#34d399', textTransform: 'uppercase', width: '15%' }}>Rank</th>
                    <th style={{ padding: '4px 8px', fontWeight: '900', color: '#34d399', textTransform: 'uppercase', width: '35%' }}>Team</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2, 3].map((rowIdx) => (
                    <tr key={rowIdx} style={{ borderBottom: '1px solid rgba(16,185,129,0.1)', backgroundColor: rowIdx % 2 === 0 ? 'rgba(2,44,34,0.2)' : 'transparent' }}>
                      <td style={{ padding: '5px 8px', fontWeight: 'bold', color: '#fbbf24' }}>#{rowIdx + 1}</td>
                      <td style={{ padding: '5px 8px' }}>{selectedPrediction.wildcardPicks?.[rowIdx]}</td>
                      <td style={{ padding: '5px 8px', fontWeight: 'bold', color: '#fbbf24' }}>#{rowIdx + 5}</td>
                      <td style={{ padding: '5px 8px' }}>{selectedPrediction.wildcardPicks?.[rowIdx + 4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Group Winners Table (2-column layout) */}
            <div style={{ backgroundColor: '#064e3b', border: '1px solid #065f46', borderRadius: '15px', padding: '12px 15px' }}>
              <h3 style={{ fontSize: '12px', margin: '0 0 8px 0', textTransform: 'uppercase', color: '#fbbf24', borderBottom: '1px solid #065f46', paddingBottom: '6px', fontWeight: '900' }}>
                Group Stage Standings (Top 3 Rankings)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {/* Column 1 */}
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ffffff', fontSize: '10.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #fbbf24', textAlign: 'left', backgroundColor: 'rgba(2,44,34,0.4)' }}>
                      <th style={{ padding: '4px 6px', fontWeight: '950', color: '#fbbf24', textTransform: 'uppercase' }}>Group</th>
                      <th style={{ padding: '4px 6px', fontWeight: '950', color: '#fbbf24', textTransform: 'uppercase' }}>🥇 1st</th>
                      <th style={{ padding: '4px 6px', fontWeight: '950', color: '#fbbf24', textTransform: 'uppercase' }}>🥈 2nd</th>
                      <th style={{ padding: '4px 6px', fontWeight: '950', color: '#fbbf24', textTransform: 'uppercase' }}>🥉 3rd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPrediction.groupStage?.slice(0, 6).map((gs, idx) => (
                      <tr key={gs.group} style={{ borderBottom: '1px solid rgba(16,185,129,0.15)', backgroundColor: idx % 2 === 0 ? 'rgba(2,44,34,0.25)' : 'transparent' }}>
                        <td style={{ padding: '5px 6px', fontWeight: 'bold', color: '#34d399' }}>Group {gs.group}</td>
                        <td style={{ padding: '5px 6px' }}>{gs.rankings?.[0]}</td>
                        <td style={{ padding: '5px 6px' }}>{gs.rankings?.[1]}</td>
                        <td style={{ padding: '5px 6px' }}>{gs.rankings?.[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Column 2 */}
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ffffff', fontSize: '10.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #fbbf24', textAlign: 'left', backgroundColor: 'rgba(2,44,34,0.4)' }}>
                      <th style={{ padding: '4px 6px', fontWeight: '950', color: '#fbbf24', textTransform: 'uppercase' }}>Group</th>
                      <th style={{ padding: '4px 6px', fontWeight: '950', color: '#fbbf24', textTransform: 'uppercase' }}>🥇 1st</th>
                      <th style={{ padding: '4px 6px', fontWeight: '950', color: '#fbbf24', textTransform: 'uppercase' }}>🥈 2nd</th>
                      <th style={{ padding: '4px 6px', fontWeight: '950', color: '#fbbf24', textTransform: 'uppercase' }}>🥉 3rd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPrediction.groupStage?.slice(6, 12).map((gs, idx) => (
                      <tr key={gs.group} style={{ borderBottom: '1px solid rgba(16,185,129,0.15)', backgroundColor: idx % 2 === 0 ? 'rgba(2,44,34,0.25)' : 'transparent' }}>
                        <td style={{ padding: '5px 6px', fontWeight: 'bold', color: '#34d399' }}>Group {gs.group}</td>
                        <td style={{ padding: '5px 6px' }}>{gs.rankings?.[0]}</td>
                        <td style={{ padding: '5px 6px' }}>{gs.rankings?.[1]}</td>
                        <td style={{ padding: '5px 6px' }}>{gs.rankings?.[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer watermark */}
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '9px', color: '#047857', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 'bold' }}>
              FIFA World Cup 2026 Prediction System
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
