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
      <div className="space-y-5 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-[#26364D] pb-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded bg-[#111C2E] border border-[#26364D] text-[#3B82F6] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">
                Phishing URL & Domain Scanner
              </h1>
              <p className="text-xs text-[#A8B5C7]">
                Inspect raw IP addresses, deceptive banking subdomains, shortened redirects, and typo-squatted domains.
              </p>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-[#111C2E] rounded-lg border border-[#26364D] p-4 sm:p-5">
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label 
                htmlFor="url-target"
                className="block text-xs font-medium text-[#A8B5C7] mb-1.5"
              >
                Target Web Link or URL
              </label>
              <div className="relative">
                <input
                  id="url-target"
                  type="text"
                  placeholder="e.g. http://192.168.1.10/verify-bank-account or http://kyc-update.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs sm:text-sm text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] font-mono"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8291A6]">
                  <LinkIcon className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#8291A6] text-[11px]">Test links:</span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrl(p.val);
                    setResult(analyzeUrl(p.val));
                  }}
                  className="px-2.5 py-1 rounded text-xs bg-[#080F1D] hover:bg-[#16243b] text-[#A8B5C7] hover:text-[#F1F5F9] border border-[#26364D] transition-colors"
                >
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!url.trim()}
              className="btn-primary"
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
