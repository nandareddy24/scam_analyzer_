import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import ScanningLoader from '../components/ScanningLoader';
import ResultsDashboard from '../components/ResultsDashboard';
import { analyzeMessage } from '../services/analyzer';
import { MessageSquare, Search, Zap } from '../components/Icons';

export default function MessageAnalyzer() {
  const [msg, setMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    { 
      label: 'Electricity Power Disconnection', 
      val: 'URGENT: Dear customer, your electricity power will be disconnected tonight at 9:30 PM because your previous bill was not updated. Immediately contact our officer at 9876543210.' 
    },
    { 
      label: 'Lottery & KYC Prize Lure', 
      val: 'Congratulations! Your mobile number won ₹25 Lakhs in Lucky Draw. To credit your reward immediately verify bank details and OTP.' 
    },
    { 
      label: 'Standard Account Alert', 
      val: 'Your account XXX1234 has been credited with INR 3,000 on 17-Nov-2026. Available balance is INR 28,450.00. Thank you for banking with us.' 
    },
  ];

  function handleCheck(e) {
    if (e) e.preventDefault();
    if (!msg.trim()) return;
    setIsScanning(true);
    setResult(null);
  }

  function handleScanComplete() {
    setResult(analyzeMessage(msg));
    setIsScanning(false);
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">
                SMS & Message Scam Lure Scanner
              </h1>
              <p className="text-xs text-slate-400">
                Detect urgent electricity disconnection threats, fake bank lottery claims, and OTP harvesting traps.
              </p>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                Message Content (SMS, WhatsApp, or Email Snippet)
              </label>
              <textarea
                rows={4}
                placeholder="Paste the SMS or WhatsApp message content here..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-y"
              />
            </div>

            {/* Quick Test Presets */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2 font-bold">
                Quick Test Scam Templates:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setMsg(p.val);
                      setIsScanning(true);
                      setResult(null);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isScanning || !msg.trim()}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isScanning ? 'Executing Security Scan...' : 'Analyze Message Content'}</span>
            </button>
          </form>
        </div>

        {/* Dynamic Scanning State */}
        {isScanning && (
          <ScanningLoader
            onComplete={handleScanComplete}
            targetType="SMS"
            targetValue={msg.slice(0, 60) + '...'}
          />
        )}

        {/* Results Component */}
        {result && !isScanning && (
          <ResultsDashboard
            result={result}
            onReset={() => {
              setResult(null);
              setMsg('');
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}
