import { useState, useEffect, useRef } from 'react';
import AppLayout from '../components/AppLayout';
import ResultsDashboard from '../components/ResultsDashboard';
import {
  ModuleHeader,
  ModuleScopeCard,
  ValidationBanner,
  ScannerLoadingState,
  RelevantHistorySection,
} from '../components/ScannerPrimitives';
import { analyzeUrl } from '../services/analyzer';
import {
  getScanHistory,
  recordScanResult,
  clearScanHistory,
} from '../services/scanHistory';
import { LinkIcon, Search, Globe, RefreshCw } from '../components/Icons';

const PRESETS = [
  { label: 'Raw IP Phishing Link', val: 'http://192.168.1.10/verify-bank-account' },
  { label: 'Shortened Reward Link', val: 'http://bit.ly/claim-sbi-reward-points' },
  { label: 'Official Portal (NPCI)', val: 'https://npci.org.in' },
];

const CHECK_RULES = [
  'Checks whether the URL uses the HTTPS scheme or plaintext HTTP.',
  'Detects raw IPv4 hostnames and known URL shortener domains.',
  'Identifies multi-hyphen lookalike hostnames and common banking phishing keywords.',
  'Limitation: Inspects URL text locally and does not verify live SSL certificates, WHOIS age, or webpage content.',
];

export default function UrlAnalyzer() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const resultsRef = useRef(null);

  useEffect(() => {
    setHistory(getScanHistory('URL'));
  }, []);

  function runScan(rawTarget) {
    const cleaned = (rawTarget ?? url).trim();
    setError('');

    if (!cleaned) {
      setError('Enter a URL or domain name before running an analysis.');
      return;
    }

    if (/\s/.test(cleaned)) {
      setError('URLs cannot contain spaces. Remove any whitespace or copy only the web link.');
      return;
    }

    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      const rawAnalysis = analyzeUrl(cleaned);
      const saved = recordScanResult(rawAnalysis, 'URL');
      setResult(saved);
      setHistory(getScanHistory('URL'));
      setIsScanning(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }, 180);
  }

  function handleSubmit(e) {
    e.preventDefault();
    runScan(url);
  }

  function handleClear() {
    setUrl('');
    setError('');
    setResult(null);
  }

  function handleClearHistory() {
    clearScanHistory('URL');
    setHistory([]);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <ModuleHeader
          icon={<Globe className="w-5 h-5" />}
          title="URL & Domain Scanner"
          badge="URL Module"
          description="Inspect web links and domain names for missing HTTPS, raw IP routing, link shorteners, lookalike hyphens, and banking phishing keywords."
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Scanner Form Card */}
          <section className="xl:col-span-8 card-enterprise p-5 sm:p-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <ValidationBanner message={error} onDismiss={() => setError('')} />

              <div className="space-y-1.5">
                <label
                  htmlFor="url-target"
                  className="block text-[13px] font-semibold text-[#172B4D]"
                >
                  Target URL or Domain <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="url-target"
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="https://example.com/verify-account or http://192.168.1.10/login"
                    aria-invalid={Boolean(error)}
                    aria-describedby="url-helper"
                    className={`w-full h-11 pl-10 pr-14 bg-white border rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:ring-2 font-mono transition-colors ${
                      error
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                        : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/15'
                    }`}
                  />
                  {url && (
                    <button
                      type="button"
                      onClick={() => {
                        setUrl('');
                        setError('');
                      }}
                      className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-[#64748B] hover:text-[#172B4D]"
                      aria-label="Clear URL input"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p id="url-helper" className="text-xs text-[#64748B]">
                  Paste the link directly from an SMS, email, or browser without opening it. Links without a scheme default to http://.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-medium text-[#64748B]">Quick samples:</span>
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUrl(p.val);
                      runScan(p.val);
                    }}
                    className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-[#F5F7FA] hover:bg-[#EFF6FF] text-[#172B4D] hover:text-[#2563EB] border border-[#E2E8F0] hover:border-[#BFDBFE] transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#E2E8F0]">
                <button type="submit" disabled={isScanning} className="btn-primary">
                  <Search className="w-4 h-4" />
                  <span>{isScanning ? 'Analyzing URL...' : 'Analyze URL'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isScanning && !url && !result}
                  className="btn-secondary"
                >
                  <RefreshCw className="w-4 h-4 text-[#64748B]" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          </section>

          {/* Right Context Panel */}
          <div className="xl:col-span-4">
            <ModuleScopeCard
              title="URL Inspection Rules"
              subtitle="Checks executed locally on the submitted link"
              checks={CHECK_RULES}
            />
          </div>
        </div>

        {isScanning && (
          <ScannerLoadingState
            label="Evaluating URL scheme, hostname, and phishing indicators..."
            target={url}
          />
        )}

        {!isScanning && result && (
          <div ref={resultsRef}>
            <ResultsDashboard result={result} onReset={handleClear} />
          </div>
        )}

        <RelevantHistorySection
          title="Recent URL Scans"
          emptyText="No URL scans recorded in this session yet."
          items={history}
          onSelect={(selectedResult) => {
            setUrl(selectedResult.input || '');
            setResult(selectedResult);
            setError('');
            setTimeout(() => {
              resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 30);
          }}
          onClear={handleClearHistory}
        />
      </div>
    </AppLayout>
  );
}
