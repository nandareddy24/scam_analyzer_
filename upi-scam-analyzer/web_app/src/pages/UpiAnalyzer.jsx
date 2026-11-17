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
import { analyzeUpiId } from '../services/analyzer';
import {
  getScanHistory,
  recordScanResult,
  clearScanHistory,
} from '../services/scanHistory';
import { CreditCard, Search, RefreshCw } from '../components/Icons';

const PRESETS = [
  { label: 'Fake Refund Handle', val: 'refund-care@oksbi' },
  { label: 'Numeric Alias Handle', val: '9876543210@paytm' },
  { label: 'Standard Merchant VPA', val: 'store@okaxis' },
];

const CHECK_RULES = [
  'Validates UPI VPA syntax against the standard username@handle format.',
  'Checks whether the @handle suffix appears in a local list of major Indian bank/PSP handles.',
  'Flags common impersonation keywords (refund, cashback, kyc, support, helpdesk) and numeric-only aliases.',
  'Limitation: Checks VPA text locally and cannot verify live bank account ownership or beneficiary names.',
];

export default function UpiAnalyzer() {
  const [upi, setUpi] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const resultsRef = useRef(null);

  useEffect(() => {
    setHistory(getScanHistory('UPI'));
  }, []);

  function runScan(rawUpi) {
    const cleaned = (rawUpi ?? upi).trim();
    setError('');

    if (!cleaned) {
      setError('Enter a UPI Virtual Payment Address (e.g., merchant@okaxis) before running a check.');
      return;
    }

    if (/\s/.test(cleaned)) {
      setError('UPI IDs cannot contain spaces. Remove any extra spaces and try again.');
      return;
    }

    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      const rawAnalysis = analyzeUpiId(cleaned);
      const saved = recordScanResult(rawAnalysis, 'UPI');
      setResult(saved);
      setHistory(getScanHistory('UPI'));
      setIsScanning(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }, 180);
  }

  function handleSubmit(e) {
    e.preventDefault();
    runScan(upi);
  }

  function handleClear() {
    setUpi('');
    setError('');
    setResult(null);
  }

  function handleClearHistory() {
    clearScanHistory('UPI');
    setHistory([]);
  }

  const missingAtHint = upi.trim().length > 0 && !upi.includes('@');

  return (
    <AppLayout>
      <div className="space-y-6">
        <ModuleHeader
          icon={<CreditCard className="w-5 h-5" />}
          title="UPI VPA Checker"
          badge="UPI Module"
          description="Inspect Virtual Payment Addresses for valid syntax, recognized Indian bank/PSP handles, impersonation keywords, and numeric burner aliases."
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Scanner Form Card */}
          <section className="xl:col-span-8 card-enterprise p-5 sm:p-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <ValidationBanner message={error} onDismiss={() => setError('')} />

              <div className="space-y-1.5">
                <label
                  htmlFor="upi-handle"
                  className="block text-[13px] font-semibold text-[#172B4D]"
                >
                  UPI Virtual Payment Address (VPA) <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <input
                    id="upi-handle"
                    type="text"
                    value={upi}
                    onChange={(e) => {
                      setUpi(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="name@bankhandle (e.g., refund-care@oksbi or store@okaxis)"
                    aria-invalid={Boolean(error)}
                    aria-describedby="upi-helper"
                    className={`w-full h-11 pl-10 pr-14 bg-white border rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:ring-2 font-mono transition-colors ${
                      error
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                        : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/15'
                    }`}
                  />
                  {upi && (
                    <button
                      type="button"
                      onClick={() => {
                        setUpi('');
                        setError('');
                      }}
                      className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-[#64748B] hover:text-[#172B4D]"
                      aria-label="Clear UPI input"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p id="upi-helper" className="text-xs text-[#64748B]">
                  {missingAtHint ? (
                    <span className="text-[#D97706] font-medium">
                      Format note: Standard UPI IDs include an @ symbol (for example, name@oksbi). Submitting without @ will be flagged as a format violation.
                    </span>
                  ) : (
                    'Enter the recipient VPA exactly as shown in the payment request or chat. This check inspects syntax and keywords locally.'
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-medium text-[#64748B]">Quick samples:</span>
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUpi(p.val);
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
                  <span>{isScanning ? 'Checking VPA...' : 'Check UPI VPA'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isScanning && !upi && !result}
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
              title="UPI VPA Check Rules"
              subtitle="Checks executed locally on the handle string"
              checks={CHECK_RULES}
            />
          </div>
        </div>

        {isScanning && (
          <ScannerLoadingState
            label="Evaluating UPI VPA syntax, PSP handle, and keyword rules..."
            target={upi}
          />
        )}

        {!isScanning && result && (
          <div ref={resultsRef}>
            <ResultsDashboard result={result} onReset={handleClear} />
          </div>
        )}

        <RelevantHistorySection
          title="Recent UPI VPA Scans"
          emptyText="No UPI VPA scans recorded in this session yet."
          items={history}
          onSelect={(selectedResult) => {
            setUpi(selectedResult.input || '');
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
