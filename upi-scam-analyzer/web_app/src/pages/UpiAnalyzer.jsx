import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import ResultsDashboard from '../components/ResultsDashboard';
import { analyzeUpiId } from '../services/analyzer';
import { CreditCard, Search } from '../components/Icons';

export default function UpiAnalyzer() {
  const [upi, setUpi] = useState('');
  const [result, setResult] = useState(null);

  const presets = [
    { label: 'Fraudulent Refund Handle', val: 'refund-care@oksbi' },
    { label: 'Numeric Burner VPA', val: '9876543210@paytm' },
    { label: 'Verified Merchant Handle', val: 'store@okaxis' },
  ];

  function handleCheck(e) {
    if (e) e.preventDefault();
    if (!upi.trim()) return;
    setResult(analyzeUpiId(upi.trim()));
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded bg-slate-800 text-blue-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                UPI VPA Handle Verification
              </h1>
              <p className="text-xs text-slate-400">
                Inspect suspect payment handles, refund lures, and fraudulent merchant VPAs before approving transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                UPI Virtual Payment Address (VPA)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. cashback-support@ybl or 9876543210@paytm"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 text-[11px]">Test handles:</span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUpi(p.val);
                    setResult(analyzeUpiId(p.val));
                  }}
                  className="px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!upi.trim()}
              className="py-2.5 px-5 rounded font-semibold text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify UPI VPA</span>
            </button>
          </form>
        </div>

        {/* Results Component */}
        {result && (
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
