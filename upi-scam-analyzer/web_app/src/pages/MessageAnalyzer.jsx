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
import { analyzeMessage } from '../services/analyzer';
import {
  getScanHistory,
  recordScanResult,
  clearScanHistory,
} from '../services/scanHistory';
import { MessageSquare, Search, RefreshCw } from '../components/Icons';

const PRESETS = [
  {
    label: 'Power Disconnection Lure',
    val: 'URGENT: Dear customer, your electricity power will be disconnected tonight at 9:30 PM because your previous bill was not updated. Immediately contact our officer at 9876543210.',
  },
  {
    label: 'Lottery & OTP Lure',
    val: 'Congratulations! Your mobile number won INR 25 Lakhs in Lucky Draw. To credit your reward immediately verify bank details and share OTP 482910 at http://kbc-reward.com',
  },
  {
    label: 'Standard Credit Notice',
    val: 'Your account XXX1234 has been credited with INR 3,000 on 17-Nov-2026. Available balance is INR 28,450.00. Thank you for banking with us.',
  },
];

const CHECK_RULES = [
  'Matches text against common scam phrases (KYC, lottery, refund, electricity, PAN/Aadhaar).',
  'Detects embedded HTTP, HTTPS, or www links inside the message body.',
  'Flags OTP mentions paired with numeric codes and urgency cues (ALL CAPS, repeated exclamation marks).',
  'Limitation: Uses static keyword and pattern rules; novel social engineering may not trigger local flags.',
];

export default function MessageAnalyzer() {
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const resultsRef = useRef(null);

  useEffect(() => {
    setHistory(getScanHistory('MESSAGE'));
  }, []);

  function runScan(rawMessage) {
    const cleaned = (rawMessage ?? msg).trim();
    setError('');

    if (!cleaned) {
      setError('Paste an SMS, WhatsApp, or email message before running an analysis.');
      return;
    }

    if (cleaned.length < 5) {
      setError('Message is too short to evaluate. Paste at least 5 characters of the suspicious text.');
      return;
    }

    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      const rawAnalysis = analyzeMessage(cleaned);
      const saved = recordScanResult(rawAnalysis, 'MESSAGE');
      setResult(saved);
      setHistory(getScanHistory('MESSAGE'));
      setIsScanning(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }, 180);
  }

  function handleSubmit(e) {
    e.preventDefault();
    runScan(msg);
  }

  function handleClear() {
    setMsg('');
    setError('');
    setResult(null);
  }

  function handleClearHistory() {
    clearScanHistory('MESSAGE');
    setHistory([]);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <ModuleHeader
          icon={<MessageSquare className="w-5 h-5" />}
          title="SMS & Message Analyzer"
          badge="Message Module"
          description="Analyze SMS, WhatsApp, and email snippets for urgency traps, fake KYC warnings, prize lures, OTP solicitation, and embedded phishing links."
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Scanner Form Card */}
          <section className="xl:col-span-8 card-enterprise p-5 sm:p-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <ValidationBanner message={error} onDismiss={() => setError('')} />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="message-text"
                    className="block text-[13px] font-semibold text-[#172B4D]"
                  >
                    Message Text (SMS, WhatsApp, or Email Snippet) <span className="text-[#DC2626]">*</span>
                  </label>
                  <span className="text-xs font-mono text-[#64748B]">
                    {msg.length} chars
                  </span>
                </div>
                <textarea
                  id="message-text"
                  rows={5}
                  value={msg}
                  onChange={(e) => {
                    setMsg(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Paste the exact text of the suspicious SMS, WhatsApp message, or payment alert..."
                  aria-invalid={Boolean(error)}
                  aria-describedby="message-helper"
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:ring-2 resize-y leading-relaxed transition-colors ${
                    error
                      ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                      : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/15'
                  }`}
                />
                <p id="message-helper" className="text-xs text-[#64748B]">
                  Remove personal account numbers or real OTPs before pasting. All heuristic text checks run locally in your browser.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-medium text-[#64748B]">Quick samples:</span>
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setMsg(p.val);
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
                  <span>{isScanning ? 'Analyzing Message...' : 'Analyze Message'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isScanning && !msg && !result}
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
              title="Message Analysis Rules"
              subtitle="Checks executed locally on pasted message text"
              checks={CHECK_RULES}
            />
          </div>
        </div>

        {isScanning && (
          <ScannerLoadingState
            label="Checking message text for scam keywords, links, and urgency signals..."
            target={msg.slice(0, 120)}
          />
        )}

        {!isScanning && result && (
          <div ref={resultsRef}>
            <ResultsDashboard result={result} onReset={handleClear} />
          </div>
        )}

        <RelevantHistorySection
          title="Recent Message Scans"
          emptyText="No SMS or message scans recorded in this session yet."
          items={history}
          onSelect={(selectedResult) => {
            setMsg(selectedResult.input || '');
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
