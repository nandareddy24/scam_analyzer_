import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { Clock, Trash2, ArrowRight } from '../components/Icons';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'scam_analyzer_scan_history';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      } else {
        // Baseline initial entry
        setHistory([
          {
            id: 'init-1',
            type: 'UPI',
            target: 'refund-care@oksbi',
            verdict: 'High Risk Scam Handle',
            riskLevel: 'high',
            score: 18,
            timestamp: 'Session start'
          }
        ]);
      }
    } catch {
      setHistory([]);
    }
  }, []);

  function handleClearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setHistory([]);
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Personal Scan Audit History</h1>
              <p className="text-xs text-slate-400">
                Review past inspections, threat scores, and flagged payloads across your account session.
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 hover:border-red-500/30 transition-colors self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Audit Log</span>
            </button>
          )}
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl divide-y divide-slate-800/80 overflow-hidden">
          {history.length > 0 ? (
            history.map((item, idx) => {
              const isHigh = item.riskLevel === 'high' || item.score >= 12;
              const isMed = item.riskLevel === 'medium' || (item.score >= 5 && item.score < 12);
              return (
                <div
                  key={item.id || idx}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-800/40 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-mono border ${
                        isHigh
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : isMed
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {item.type}
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-200 text-xs sm:text-sm font-mono truncate max-w-sm sm:max-w-md">
                        {item.target}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.verdict} &bull; {item.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        isHigh
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : isMed
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {isHigh ? 'HIGH RISK' : isMed ? 'SUSPICIOUS' : 'SAFE'}
                    </span>
                    <div className="text-xs font-mono font-bold text-slate-400">
                      Score: {item.score}/25
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-3">
              <p className="text-xs text-slate-400 font-mono">
                No past scans recorded in this session. Run an inspection on the Defense Console to log records.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                <span>Go to Defense Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
