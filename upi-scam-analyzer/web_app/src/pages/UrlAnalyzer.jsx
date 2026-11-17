import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import ResultsDashboard from '../components/ResultsDashboard';
import { analyzeUrl } from '../services/analyzer';
import { LinkIcon, Search, Globe } from '../components/Icons';

export default function UrlAnalyzer() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);

  const presets = [
    { label: 'Phishing IP Bank Link', val: 'http://192.168.1.10/verify-bank-account' },
    { label: 'Obfuscated Shortener', val: 'http://bit.ly/claim-sbi-reward-points' },
    { label: 'Verified Portal (NPCI)', val: 'https://npci.org.in' },
  ];

  function handleCheck(e) {
    if (e) e.preventDefault();
    if (!url.trim()) return;
    setResult(analyzeUrl(url.trim()));
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded bg-slate-800 text-blue-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                Phishing URL & Domain Scanner
              </h1>
              <p className="text-xs text-slate-400">
                Inspect raw IP addresses, deceptive banking subdomains, shortened redirects, and typo-squatted domains.
              </p>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Target Web Link or URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. http://192.168.1.10/verify-bank-account or http://kyc-update.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <LinkIcon className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 text-[11px]">Test links:</span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrl(p.val);
                    setResult(analyzeUrl(p.val));
                  }}
                  className="px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!url.trim()}
              className="py-2.5 px-5 rounded font-semibold text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Analyze URL</span>
            </button>
          </form>
        </div>

        {/* Results Component */}
        {result && (
          <ResultsDashboard
            result={result}
            onReset={() => {
              setResult(null);
              setUrl('');
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}
