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
      <div className="space-y-5 max-w-4xl mx-auto">
        <div className="border-b border-[#26364D] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#111C2E] border border-[#26364D] text-[#3B82F6] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Personal Scan Audit History</h1>
              <p className="text-xs text-[#A8B5C7]">
                Review past inspections, threat scores, and flagged payloads across your account session.
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-[#8291A6] hover:text-[#DC2626] bg-[#080F1D] border border-[#26364D] transition-colors self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Audit Log</span>
            </button>
          )}
        </div>

        <div className="bg-[#111C2E] rounded-lg border border-[#26364D] divide-y divide-[#26364D] overflow-hidden">
          {history.length > 0 ? (
            history.map((item, idx) => {
              const isHigh = item.riskLevel === 'high' || item.score >= 12;
              const isMed = item.riskLevel === 'medium' || (item.score >= 5 && item.score < 12);
              return (
                <div
                  key={item.id || idx}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-[#080F1D]/40 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded flex items-center justify-center text-xs font-mono font-semibold border ${
                        isHigh
                          ? 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30'
                          : isMed
                          ? 'bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30'
                          : 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30'
                      }`}
                    >
                      {item.type}
                    </div>

                    <div>
                      <h4 className="font-medium text-[#F1F5F9] text-xs sm:text-sm font-mono truncate max-w-sm sm:max-w-md">
                        {item.target}
                      </h4>
                      <p className="text-[11px] text-[#8291A6] mt-0.5">
                        {item.verdict} &bull; {item.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        isHigh
                          ? 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/40'
                          : isMed
                          ? 'bg-[#D97706]/20 text-[#D97706] border-[#D97706]/40'
                          : 'bg-[#16A34A]/20 text-[#16A34A] border-[#16A34A]/40'
                      }`}
                    >
                      {isHigh ? 'HIGH RISK' : isMed ? 'SUSPICIOUS' : 'SAFE'}
                    </span>
                    <div className="text-xs font-mono text-[#8291A6]">
                      Score: {item.score}/25
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-3">
              <p className="text-xs text-[#8291A6]">
                No past scans recorded in this session. Run an inspection on the Analyzer Console to log records.
              </p>
              <Link
                to="/"
                className="btn-primary"
              >
                <span>Go to Analyzer Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
