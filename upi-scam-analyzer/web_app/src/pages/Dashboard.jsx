import { useState, useEffect, useRef } from 'react';
import AppLayout from '../components/AppLayout';
import ResultsDashboard from '../components/ResultsDashboard';
import { 
  analyzeUrl, 
  analyzeMessage, 
  analyzePhone, 
  analyzeUpiId, 
  analyzeOcrQr 
} from '../services/analyzer';
import { 
  Globe, 
  MessageSquare, 
  PhoneCall, 
  CreditCard, 
  QrCode, 
  Search, 
  ExternalLink,
  Clock,
  Trash2,
  Shield
} from '../components/Icons';

const STORAGE_KEY = 'scam_analyzer_scan_history';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('url');
  const [inputValue, setInputValue] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const resultsRef = useRef(null);

  // Load real scan history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Fallback
    }
  }, []);

  function saveScanToHistory(res) {
    if (!res) return;
    const entry = {
      id: `scan-${Date.now()}`,
      type: res.type ? res.type.toUpperCase() : activeTab.toUpperCase(),
      target: res.input || inputValue,
      verdict: res.status,
      score: res.score,
      riskLevel: res.riskLevel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHistory((prev) => {
      const updated = [entry, ...prev.filter((i) => i.target !== entry.target)].slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Fallback
      }
      return updated;
    });
  }

  function clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Fallback
    }
    setHistory([]);
  }

  const TABS = [
    { id: 'url', label: 'Web URL', icon: <Globe className="w-4 h-4" />, placeholder: 'e.g. http://192.168.1.10/verify-bank-account' },
    { id: 'message', label: 'SMS / Text', icon: <MessageSquare className="w-4 h-4" />, placeholder: 'Paste suspicious SMS, lottery message, or KYC notification...' },
    { id: 'phone', label: 'Phone Number', icon: <PhoneCall className="w-4 h-4" />, placeholder: 'e.g. +91 9876543210 or +92 300 1234567' },
    { id: 'upi', label: 'UPI VPA', icon: <CreditCard className="w-4 h-4" />, placeholder: 'e.g. refund-care@oksbi or cashback-support@ybl' },
    { id: 'qr', label: 'QR Payload', icon: <QrCode className="w-4 h-4" />, placeholder: 'Decoded intent URI e.g. upi://pay?pa=recipient@bank&am=500' },
  ];

  const PRESETS = {
    url: [
      { label: 'Phishing IP Address', value: 'http://192.168.1.10/verify-bank-account' },
      { label: 'Suspicious Short URL', value: 'http://bit.ly/claim-sbi-reward-points' },
      { label: 'Legitimate Portal (NPCI)', value: 'https://npci.org.in' },
    ],
    message: [
      { label: 'Power Disconnection Lure', value: 'URGENT: Dear customer, your electricity power will be disconnected tonight at 9:30 PM. Immediately contact electricity officer at 9876543210.' },
      { label: 'Lottery & Prize Scam', value: 'Congratulations! You won ₹25,00,000 in Lucky Draw. To claim refund verify immediately at http://kbc-reward.com' },
      { label: 'Standard Bank Alert', value: 'Dear customer, your account XXX1234 was credited with INR 2,500.00 on 17-Nov-2026. Ref UPI/43210.' },
    ],
    phone: [
      { label: 'International Number (+92)', value: '+92 300 1234567' },
      { label: 'Suspect Toll-Free / Burner', value: '9876543210' },
      { label: 'Standard Mobile Line', value: '+91 9820012345' },
    ],
    upi: [
      { label: 'Fake Refund Desk', value: 'refund-care@oksbi' },
      { label: 'Numeric Burner Handle', value: '9876543210@paytm' },
      { label: 'Standard Merchant', value: 'store@okaxis' },
    ],
    qr: [
      { label: 'Collect Request Payload', value: 'upi://pay?pa=refund-desk@ybl&pn=RefundDesk&am=5000' },
      { label: 'Standard Merchant QR', value: 'upi://pay?pa=merchant@okaxis&pn=SuperMarket&am=250' },
    ],
  };

  function executeAnalysis(targetOverride) {
    const target = (targetOverride !== undefined ? targetOverride : inputValue).trim();
    if (!target && activeTab !== 'qr' && !fileInput) return;

    let res = null;
    if (activeTab === 'url') {
      res = analyzeUrl(target || 'http://192.168.1.10/verify-bank-account');
    } else if (activeTab === 'message') {
      res = analyzeMessage(target || 'URGENT: Your account is blocked. Verify immediately.');
    } else if (activeTab === 'phone') {
      res = analyzePhone(target || '+91 9876543210');
    } else if (activeTab === 'upi') {
      res = analyzeUpiId(target || 'refund-care@oksbi');
    } else if (activeTab === 'qr') {
      const fileName = fileInput ? fileInput.name : 'qr_payload.png';
      res = analyzeOcrQr(fileName, target);
    }

    setCurrentResult(res);
    saveScanToHistory(res);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  }

  function handlePresetSelect(val) {
    setInputValue(val);
    executeAnalysis(val);
  }

  function handleReset() {
    setCurrentResult(null);
    setInputValue('');
    setFileInput(null);
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Emergency Notice Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <span>National Cyber Crime Helpline: 1930</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                  24x7 TOLL FREE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                If money has been debited without authorization, call 1930 immediately to freeze beneficiary bank accounts.
              </p>
            </div>
          </div>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700 transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

        {/* Page Header */}
        <div className="border-b border-slate-800 pb-3">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            UPI & Cyber Fraud Identifier Inspector
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Check suspicious URLs, payment handles, telephone numbers, and SMS text against known cyber fraud patterns.
          </p>
        </div>

        {/* Inspection Form Console */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-slate-800 pb-3 mb-4 overflow-x-auto">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setInputValue('');
                    setCurrentResult(null);
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeAnalysis();
            }}
            className="space-y-4"
          >
            {activeTab !== 'qr' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Enter {TABS.find((t) => t.id === activeTab)?.label} to Inspect
                </label>
                {activeTab === 'message' ? (
                  <textarea
                    rows={4}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={TABS.find((t) => t.id === activeTab)?.placeholder}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={TABS.find((t) => t.id === activeTab)?.placeholder}
                      className="w-full pl-9 pr-16 py-2.5 bg-slate-950 border border-slate-800 rounded text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      {TABS.find((t) => t.id === activeTab)?.icon}
                    </div>
                    {inputValue && (
                      <button
                        type="button"
                        onClick={() => setInputValue('')}
                        className="absolute inset-y-0 right-3 flex items-center text-xs text-slate-400 hover:text-slate-200"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Upload Screenshot or QR Code Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFileInput(e.target.files[0])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Optional Decoded Intent URL
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. upi://pay?pa=recipient@bank&am=500"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Test Presets */}
            {PRESETS[activeTab] && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 text-[11px]">Test examples:</span>
                {PRESETS[activeTab].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(p.value)}
                    className="px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={!inputValue && activeTab !== 'qr' && !fileInput}
              className="py-2.5 px-5 rounded font-semibold text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors inline-flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Inspect Payload</span>
            </button>
          </form>
        </div>

        {/* Results Component */}
        {currentResult && (
          <div ref={resultsRef} className="pt-2">
            <ResultsDashboard
              result={currentResult}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Real User Scan History from localStorage */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Recent Scans in Current Session
              </h3>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="divide-y divide-slate-800/80">
              {history.map((scan) => {
                const isHigh = scan.riskLevel === 'high' || scan.score >= 12;
                const isMed = scan.riskLevel === 'medium' || (scan.score >= 5 && scan.score < 12);
                return (
                  <div
                    key={scan.id}
                    className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/40 px-2 rounded transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold border border-slate-700">
                        {scan.type}
                      </span>
                      <span className="font-mono text-slate-200 truncate max-w-sm sm:max-w-md">
                        {scan.target}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          isHigh
                            ? 'bg-red-950/60 text-red-300 border-red-800'
                            : isMed
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {scan.verdict}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {scan.score}/25
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {scan.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-slate-500">
              No recent inspections recorded in this browser session. Enter a target above to begin.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
