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
  Trash2
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
      // Storage fallback
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
      { label: 'International Caller (+92)', value: '+92 300 1234567' },
      { label: 'Suspect Toll-Free / Burner', value: '9876543210' },
      { label: 'Standard Domestic Line', value: '+91 9820012345' },
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
      <div className="space-y-5 max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="border-b border-[#26364D] pb-3">
          <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">
            UPI & Financial Cyber Fraud Inspector
          </h1>
          <p className="text-xs text-[#A8B5C7] mt-1">
            Analyze suspect URLs, payment identifiers, phone numbers, and message content against verified fraud patterns.
          </p>
        </div>

        {/* Inspection Form Console */}
        <div className="bg-[#111C2E] border border-[#26364D] rounded-lg p-4 sm:p-5">
          {/* Tab Selector */}
          <div 
            role="tablist" 
            aria-label="Input Type Selector"
            className="flex gap-1 border-b border-[#26364D] pb-3 mb-4 overflow-x-auto"
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={active}
                  aria-controls={`panel-${tab.id}`}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setInputValue('');
                    setCurrentResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    active
                      ? 'bg-[#3B82F6] text-white'
                      : 'text-[#A8B5C7] hover:text-[#F1F5F9] hover:bg-[#080F1D]'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-[#8291A6]'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            onSubmit={(e) => {
              e.preventDefault();
              executeAnalysis();
            }}
            className="space-y-4"
          >
            {activeTab !== 'qr' ? (
              <div>
                <label 
                  htmlFor="main-input"
                  className="block text-xs font-medium text-[#A8B5C7] mb-1.5"
                >
                  Enter {TABS.find((t) => t.id === activeTab)?.label} to Inspect
                </label>
                {activeTab === 'message' ? (
                  <textarea
                    id="main-input"
                    rows={4}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={TABS.find((t) => t.id === activeTab)?.placeholder}
                    className="w-full px-3 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs sm:text-sm text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors resize-y"
                  />
                ) : (
                  <div className="relative">
                    <input
                      id="main-input"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={TABS.find((t) => t.id === activeTab)?.placeholder}
                      className="w-full pl-9 pr-16 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs sm:text-sm text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors font-mono"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8291A6]">
                      {TABS.find((t) => t.id === activeTab)?.icon}
                    </div>
                    {inputValue && (
                      <button
                        type="button"
                        onClick={() => setInputValue('')}
                        className="absolute inset-y-0 right-3 flex items-center text-xs text-[#8291A6] hover:text-[#F1F5F9]"
                        aria-label="Clear input"
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
                  <label 
                    htmlFor="qr-file-input"
                    className="block text-xs font-medium text-[#A8B5C7] mb-1.5"
                  >
                    Select Receipt Screenshot or QR Code Image
                  </label>
                  <input
                    id="qr-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFileInput(e.target.files[0])}
                    className="w-full px-3 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs text-[#A8B5C7] file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-medium file:bg-[#3B82F6] file:text-white"
                  />
                </div>
                <div>
                  <label 
                    htmlFor="qr-uri-input"
                    className="block text-xs font-medium text-[#A8B5C7] mb-1.5"
                  >
                    Optional Decoded Intent URI
                  </label>
                  <input
                    id="qr-uri-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. upi://pay?pa=recipient@bank&am=500"
                    className="w-full px-3 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs sm:text-sm text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] font-mono"
                  />
                </div>
              </div>
            )}

            {/* Test Presets */}
            {PRESETS[activeTab] && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#8291A6] text-[11px]">Test samples:</span>
                {PRESETS[activeTab].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(p.value)}
                    className="px-2.5 py-1 rounded text-xs bg-[#080F1D] hover:bg-[#16243b] text-[#A8B5C7] hover:text-[#F1F5F9] border border-[#26364D] transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={!inputValue && activeTab !== 'qr' && !fileInput}
              className="btn-primary"
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
        <div className="bg-[#111C2E] border border-[#26364D] rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#26364D] mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8291A6]" />
              <h2 className="text-xs font-semibold text-[#F1F5F9] uppercase tracking-wider">
                Recent Scans in Current Session
              </h2>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="inline-flex items-center gap-1 text-[11px] text-[#8291A6] hover:text-[#DC2626] transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="divide-y divide-[#26364D]">
              {history.map((scan) => {
                const isHigh = scan.riskLevel === 'high' || scan.score >= 12;
                const isMed = scan.riskLevel === 'medium' || (scan.score >= 5 && scan.score < 12);
                return (
                  <div
                    key={scan.id}
                    className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#080F1D]/60 px-2 rounded transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#080F1D] text-[#A8B5C7] font-mono text-[10px] font-semibold border border-[#26364D]">
                        {scan.type}
                      </span>
                      <span className="font-mono text-[#F1F5F9] truncate max-w-sm sm:max-w-md">
                        {scan.target}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                          isHigh
                            ? 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/40'
                            : isMed
                            ? 'bg-[#D97706]/20 text-[#D97706] border-[#D97706]/40'
                            : 'bg-[#16A34A]/20 text-[#16A34A] border-[#16A34A]/40'
                        }`}
                      >
                        {scan.verdict}
                      </span>
                      <span className="text-[#8291A6] font-mono">
                        {scan.score}/25
                      </span>
                      <span className="text-[#8291A6] text-[11px]">
                        {scan.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-[#8291A6]">
              No recent inspections recorded in this browser session. Enter an identifier above to begin.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
