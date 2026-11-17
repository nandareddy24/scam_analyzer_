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
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  ExternalLink,
  Cpu,
  Clock,
  Trash2
} from '../components/Icons';

const STORAGE_KEY = 'scam_analyzer_scan_history';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'message' | 'phone' | 'upi' | 'qr'
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
      // Local storage fallback
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
        // Storage fail-safe
      }
      return updated;
    });
  }

  function clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage fail-safe
    }
    setHistory([]);
  }

  const TABS = [
    { id: 'url', label: 'Web URL', icon: <Globe className="w-4 h-4" />, placeholder: 'e.g. http://192.168.1.10/verify-bank-account or http://kyc-update.com' },
    { id: 'message', label: 'SMS / Text', icon: <MessageSquare className="w-4 h-4" />, placeholder: 'Paste suspicious SMS, WhatsApp text, or notification content...' },
    { id: 'phone', label: 'Phone Number', icon: <PhoneCall className="w-4 h-4" />, placeholder: 'e.g. +91 9876543210 or +92 300 1234567' },
    { id: 'upi', label: 'UPI VPA', icon: <CreditCard className="w-4 h-4" />, placeholder: 'e.g. refund-care@oksbi or cashback-support@ybl' },
    { id: 'qr', label: 'QR Payload', icon: <QrCode className="w-4 h-4" />, placeholder: 'Decoded intent URI e.g. upi://pay?pa=recipient@bank&am=500' },
  ];

  const PRESETS = {
    url: [
      { label: 'Phishing IP Address', value: 'http://192.168.1.10/verify-bank-account' },
      { label: 'Obfuscated Short URL', value: 'http://bit.ly/claim-sbi-reward-points' },
      { label: 'Legitimate Portal (NPCI)', value: 'https://npci.org.in' },
    ],
    message: [
      { label: 'Electricity Disconnection Threat', value: 'URGENT: Dear customer, your electricity power will be disconnected tonight at 9:30 PM. Immediately contact electricity officer at 9876543210.' },
      { label: 'Lottery & Refund Solicitation', value: 'Congratulations! You won ₹25,00,000 in Lucky Draw. To claim refund verify immediately at http://kbc-reward.com' },
      { label: 'Standard Bank Transaction', value: 'Dear customer, your account XXX1234 was credited with INR 2,500.00 on 17-Nov-2026. Ref UPI/43210.' },
    ],
    phone: [
      { label: 'International Imposter Call (+92)', value: '+92 300 1234567' },
      { label: 'Reported Scam Number', value: '9876543210' },
      { label: 'Standard Domestic Line', value: '+91 9820012345' },
    ],
    upi: [
      { label: 'Suspect Refund Handle', value: 'refund-care@oksbi' },
      { label: 'Numeric Virtual Handle', value: '9876543210@paytm' },
      { label: 'Standard Merchant Handle', value: 'store@okaxis' },
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
    }, 50);
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
        {/* National Helpline 1930 Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                  Helpline 1930
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  National Cyber Crime Reporting Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                If you suspect unauthorized financial debit, call <strong>1930</strong> immediately to initiate account freezing through the Citizen Financial Cyber Fraud Reporting System.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Page Header */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Payment Scam and Fraud Threat Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Verify suspect URLs, SMS notifications, telephone numbers, and UPI handles against verifiable heuristic indicators and national cybercrime safety advisories.
          </p>
        </div>

        {/* Centralized Search & Input Console */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
          {/* Tab Selector */}
          <div className="flex gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto mb-5 scrollbar-none">
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
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
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
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Target {TABS.find((t) => t.id === activeTab)?.label}
                </label>
                {activeTab === 'message' ? (
                  <textarea
                    rows={4}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={TABS.find((t) => t.id === activeTab)?.placeholder}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-y"
                  />
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={TABS.find((t) => t.id === activeTab)?.placeholder}
                      className="w-full pl-10 pr-20 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      {TABS.find((t) => t.id === activeTab)?.icon}
                    </div>
                    {inputValue && (
                      <button
                        type="button"
                        onClick={() => setInputValue('')}
                        className="absolute inset-y-0 right-3 flex items-center text-xs font-mono text-slate-500 hover:text-slate-300"
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
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Select Screenshot or QR Image File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFileInput(e.target.files[0])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Optional Extracted Intent or URI
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. upi://pay?pa=recipient@bank&am=500"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Functional Sample Test Chips */}
            {PRESETS[activeTab] && (
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5 font-semibold">
                  Sample Test Inputs:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESETS[activeTab].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(p.value)}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!inputValue && activeTab !== 'qr' && !fileInput}
              className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs tracking-wide bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Execute Threat Analysis</span>
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

        {/* Core Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Rule-Based Evaluation</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Applies weighted checks for known phishing syntax, raw IP destinations, and urgency triggers.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Client-Side Processing</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Inspections run in local memory. Sensitive bank identifiers and user queries are not persisted to remote databases.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Helpline 1930 Integration</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Step-by-step reporting protocols aligned with the National Cyber Crime Reporting Portal.
              </p>
            </div>
          </div>
        </div>

        {/* Real User Scan History from localStorage */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Recent Session Inspections
              </h3>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-red-400 transition-colors"
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
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/40 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-6 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center border border-slate-700 flex-shrink-0">
                        {scan.type}
                      </span>
                      <p className="text-xs font-mono text-slate-200 truncate max-w-sm sm:max-w-md">
                        {scan.target}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          isHigh
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : isMed
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {scan.verdict}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {scan.score}/25
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {scan.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-500 font-mono">
              No recent inspections recorded in this browser session. Enter an identifier above to begin.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
