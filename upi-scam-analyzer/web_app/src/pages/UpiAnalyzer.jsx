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
      <div className="space-y-5 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-[#26364D] pb-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded bg-[#111C2E] border border-[#26364D] text-[#3B82F6] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">
                UPI VPA Handle Verification
              </h1>
              <p className="text-xs text-[#A8B5C7]">
                Inspect suspect payment handles, refund lures, and fraudulent merchant VPAs before approving transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-[#111C2E] rounded-lg border border-[#26364D] p-4 sm:p-5">
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label 
                htmlFor="upi-handle"
                className="block text-xs font-medium text-[#A8B5C7] mb-1.5"
              >
                UPI Virtual Payment Address (VPA)
              </label>
              <div className="relative">
                <input
                  id="upi-handle"
                  type="text"
                  placeholder="e.g. cashback-support@ybl or 9876543210@paytm"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs sm:text-sm text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] font-mono"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8291A6]">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#8291A6] text-[11px]">Test handles:</span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUpi(p.val);
                    setResult(analyzeUpiId(p.val));
                  }}
                  className="px-2.5 py-1 rounded text-xs bg-[#080F1D] hover:bg-[#16243b] text-[#A8B5C7] hover:text-[#F1F5F9] border border-[#26364D] transition-colors"
                >
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!upi.trim()}
              className="btn-primary"
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
