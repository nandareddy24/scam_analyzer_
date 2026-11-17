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
import { analyzePhone } from '../services/analyzer';
import {
  getScanHistory,
  recordScanResult,
  clearScanHistory,
} from '../services/scanHistory';
import { PhoneCall, Search, RefreshCw } from '../components/Icons';

const PRESETS = [
  { label: 'International Prefix (+92)', val: '+92 300 1234567' },
  { label: 'Flagged Sample Number', val: '9876543210' },
  { label: 'Telemarketer Pool (140)', val: '1409876543' },
  { label: 'Standard Domestic Number', val: '+91 9820012345' },
];

const CHECK_RULES = [
  'Verifies minimum telecommunication digit length (10 digits) and formatting.',
  'Flags non-+91 international prefixes frequently seen in imposter calls.',
  'Identifies telemarketing/toll-free pools (140, 1800, 1900) and synthetic digit patterns.',
  'Limitation: Checks a static local sample watchlist (does not query live telecom or government registries).',
];

export default function PhoneAnalyzer() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const resultsRef = useRef(null);

  useEffect(() => {
    setHistory(getScanHistory('PHONE'));
  }, []);

  function runScan(rawPhone) {
    const cleaned = (rawPhone ?? phone).trim();
    setError('');

    if (!cleaned) {
      setError('Enter a phone number or caller ID before running an analysis.');
      return;
    }

    if (!/\d/.test(cleaned)) {
      setError('Phone number must contain numeric digits (for example, +91 9820012345).');
      return;
    }

    if (/[^0-9+\-\s().]/.test(cleaned)) {
      setError('Phone number contains unsupported characters. Use only digits, spaces, hyphens, parentheses, or a leading +.');
      return;
    }

    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      const rawAnalysis = analyzePhone(cleaned);
      const saved = recordScanResult(rawAnalysis, 'PHONE');
      setResult(saved);
      setHistory(getScanHistory('PHONE'));
      setIsScanning(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }, 180);
  }

  function handleSubmit(e) {
    e.preventDefault();
    runScan(phone);
  }

  function handleClear() {
    setPhone('');
    setError('');
    setResult(null);
  }

  function handleClearHistory() {
    clearScanHistory('PHONE');
    setHistory([]);
  }

  const digitCount = phone.replace(/\D/g, '').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <ModuleHeader
          icon={<PhoneCall className="w-5 h-5" />}
          title="Phone Number Analysis"
          badge="Phone Module"
          description="Analyze caller IDs and WhatsApp numbers for international prefixes, telemarketer pools, synthetic burner patterns, and locally flagged sample numbers."
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Scanner Form Card */}
          <section className="xl:col-span-8 card-enterprise p-5 sm:p-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <ValidationBanner message={error} onDismiss={() => setError('')} />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="phone-target"
                    className="block text-[13px] font-semibold text-[#172B4D]"
                  >
                    Phone Number or Caller ID <span className="text-[#DC2626]">*</span>
                  </label>
                  {phone && (
                    <span className="text-xs font-mono text-[#64748B]">
                      {digitCount} {digitCount === 1 ? 'digit' : 'digits'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <input
                    id="phone-target"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="+91 9820012345 or +92 300 1234567"
                    aria-invalid={Boolean(error)}
                    aria-describedby="phone-helper"
                    className={`w-full h-11 pl-10 pr-14 bg-white border rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:ring-2 font-mono transition-colors ${
                      error
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                        : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/15'
                    }`}
                  />
                  {phone && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhone('');
                        setError('');
                      }}
                      className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-[#64748B] hover:text-[#172B4D]"
                      aria-label="Clear phone input"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p id="phone-helper" className="text-xs text-[#64748B]">
                  Include the country code (such as +91 or +92) when inspecting international calls or WhatsApp messages.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-medium text-[#64748B]">Quick samples:</span>
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPhone(p.val);
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
                  <span>{isScanning ? 'Analyzing Number...' : 'Analyze Phone Number'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isScanning && !phone && !result}
                  className="btn-secondary"
                >
                  <RefreshCw className="w-4 h-4 text-[#64748B]" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          </section>

          <div className="xl:col-span-4">
            <ModuleScopeCard
              title="Phone Analysis Rules"
              subtitle="Checks executed locally on caller identifiers"
              checks={CHECK_RULES}
            />
          </div>
        </div>

        {isScanning && (
          <ScannerLoadingState
            label="Checking prefix rules, synthetic patterns, and sample watchlist records..."
            target={phone}
          />
        )}

        {!isScanning && result && (
          <div ref={resultsRef}>
            <ResultsDashboard result={result} onReset={handleClear} />
          </div>
        )}

        <RelevantHistorySection
          title="Recent Phone Number Scans"
          emptyText="No phone number scans recorded in this session yet."
          items={history}
          onSelect={(selectedResult) => {
            setPhone(selectedResult.input || '');
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
