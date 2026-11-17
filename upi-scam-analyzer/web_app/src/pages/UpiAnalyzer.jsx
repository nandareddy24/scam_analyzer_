import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import ScanningLoader from '../components/ScanningLoader';
import ResultsDashboard from '../components/ResultsDashboard';
import { analyzeUpiId } from '../services/analyzer';
import { CreditCard, Search, Zap } from '../components/Icons';

export default function UpiAnalyzer() {
  const [upi, setUpi] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    { label: 'Fraudulent Refund Handle', val: 'refund-care@oksbi' },
    { label: 'Numeric Burner VPA', val: '9876543210@paytm' },
    { label: 'Verified Merchant Handle', val: 'store@okaxis' },
  ];

  function handleCheck(e) {
    if (e) e.preventDefault();
    if (!upi.trim()) return;
    setIsScanning(true);
    setResult(null);
  }

  function handleScanComplete() {
    setResult(analyzeUpiId(upi));
    setIsScanning(false);
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">
                UPI VPA Handle Verification
              </h1>
              <p className="text-xs text-slate-400">
                Inspect suspect payment handles, refund lures, and fraudulent merchant VPAs before approving transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                UPI Virtual Payment Address (VPA)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. cashback-support@ybl or 9876543210@paytm"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2 font-bold">
                Quick Test Handles:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUpi(p.val);
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
              disabled={isScanning || !upi.trim()}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isScanning ? 'Executing Security Scan...' : 'Verify UPI VPA'}</span>
            </button>
          </form>
        </div>

        {/* Dynamic Scanning State */}
        {isScanning && (
          <ScanningLoader
            onComplete={handleScanComplete}
            targetType="UPI"
            targetValue={upi}
          />
        )}

        {/* Results Component */}
        {result && !isScanning && (
          <ResultsDashboard
            result={result}
            onReset={() => {
              setResult(null);
              setUpi('');
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}
