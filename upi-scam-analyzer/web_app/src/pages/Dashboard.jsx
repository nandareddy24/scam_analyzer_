import { useState, useEffect, useRef } from 'react';
import AppLayout from '../components/AppLayout';
import ResultsDashboard from '../components/ResultsDashboard';
import {
  ModuleScopeCard,
  ValidationBanner,
  ScannerLoadingState,
  RelevantHistorySection,
} from '../components/ScannerPrimitives';
import {
  analyzeUrl,
  analyzeMessage,
  analyzePhone,
  analyzeUpiId,
  analyzeOcrQr,
} from '../services/analyzer';
import {
  getScanHistory,
  recordScanResult,
  clearScanHistory,
} from '../services/scanHistory';
import {
  Globe,
  MessageSquare,
  PhoneCall,
  CreditCard,
  QrCode,
  Search,
  RefreshCw,
  Shield,
  X,
} from '../components/Icons';

const TABS = [
  {
    id: 'url',
    historyType: 'URL',
    label: 'URL & Domain',
    fieldLabel: 'Target URL or Domain',
    icon: <Globe className="w-4 h-4" />,
    placeholder: 'https://example.com/verify or http://192.168.1.10/login',
    helper: 'Checks HTTPS scheme, raw IP hostnames, URL shorteners, multi-hyphen typo-squatting, and phishing keywords.',
    checks: [
      'Verifies HTTPS vs. plaintext HTTP protocol scheme.',
      'Flags raw IPv4 addresses and known URL shortener domains.',
      'Detects multi-hyphen lookalike domains and banking lure keywords.',
      'Does not query live WHOIS records, SSL certificates, or page HTML.',
    ],
  },
  {
    id: 'message',
    historyType: 'MESSAGE',
    label: 'SMS / Message',
    fieldLabel: 'SMS, WhatsApp, or Email Message Text',
    icon: <MessageSquare className="w-4 h-4" />,
    placeholder: 'Paste the exact text of the suspicious SMS, lottery claim, or KYC alert...',
    helper: 'Scans for known scam keywords, embedded external links, OTP solicitation, and urgency markers.',
    checks: [
      'Matches known fraud phrases (KYC, electricity bill, lottery, refund).',
      'Detects embedded http://, https://, or www links inside the text.',
      'Flags OTP mentions paired with numeric codes and urgency cues.',
      'Uses static pattern rules; novel social engineering may not trigger flags.',
    ],
  },
  {
    id: 'upi',
    historyType: 'UPI',
    label: 'UPI VPA',
    fieldLabel: 'UPI Virtual Payment Address (VPA)',
    icon: <CreditCard className="w-4 h-4" />,
    placeholder: 'name@bankhandle (e.g., refund-care@oksbi or store@okaxis)',
    helper: 'Validates VPA format, checks recognized Indian bank/PSP handles, and flags impersonation keywords.',
    checks: [
      'Validates standard username@handle UPI VPA syntax.',
      'Checks whether the suffix is in the local list of major Indian bank/PSP handles.',
      'Flags impersonation keywords (refund, cashback, kyc, support) and numeric aliases.',
      'Does not query live bank account ownership or beneficiary names.',
    ],
  },
  {
    id: 'phone',
    historyType: 'PHONE',
    label: 'Phone Number',
    fieldLabel: 'Phone Number or Caller ID',
    icon: <PhoneCall className="w-4 h-4" />,
    placeholder: '+91 9820012345 or +92 300 1234567',
    helper: 'Checks digit formatting, international prefixes, telemarketer pools, synthetic patterns, and sample watchlist entries.',
    checks: [
      'Verifies minimum 10-digit telecommunication structure.',
      'Flags non-+91 international prefixes frequently seen in imposter calls.',
      'Detects telemarketing prefixes (140, 1800, 1900) and repeating digits.',
      'Checks a static local sample watchlist (not a live telecom registry).',
    ],
  },
  {
    id: 'qr',
    historyType: 'OCR',
    label: 'QR / Screenshot',
    fieldLabel: 'Decoded UPI Intent URI or Extracted Text',
    icon: <QrCode className="w-4 h-4" />,
    placeholder: 'upi://pay?pa=recipient@bank&pn=MerchantName&am=500',
    helper: 'Upload a QR/receipt image, paste a decoded payment intent URI, or provide both for local inspection.',
    checks: [
      'Validates image file type (PNG, JPG, WEBP) and 10 MB size limit locally.',
      'Inspects decoded UPI payment intent URIs (upi://pay?pa=...) for lure terms.',
      'Evaluates pasted receipt text for refund scams, OTP traps, and links.',
      'Inspects text/URI payloads locally; does not perform server-side pixel OCR.',
    ],
  },
];

const PRESETS = {
  url: [
    { label: 'Raw IP Phishing Link', value: 'http://192.168.1.10/verify-bank-account' },
    { label: 'Shortened Reward Link', value: 'http://bit.ly/claim-sbi-reward-points' },
    { label: 'Official Portal (NPCI)', value: 'https://npci.org.in' },
  ],
  message: [
    {
      label: 'Power Disconnection Lure',
      value: 'URGENT: Dear customer, your electricity power will be disconnected tonight at 9:30 PM. Immediately contact electricity officer at 9876543210.',
    },
    {
      label: 'Lottery & Prize Scam',
      value: 'Congratulations! You won INR 25,00,000 in Lucky Draw. To claim refund verify immediately at http://kbc-reward.com',
    },
    {
      label: 'Standard Credit Alert',
      value: 'Dear customer, your account XXX1234 was credited with INR 2,500.00 on 17-Nov-2026. Ref UPI/43210.',
    },
  ],
  upi: [
    { label: 'Fake Refund Desk', value: 'refund-care@oksbi' },
    { label: 'Numeric Burner Handle', value: '9876543210@paytm' },
    { label: 'Standard Merchant', value: 'store@okaxis' },
  ],
  phone: [
    { label: 'International Caller (+92)', value: '+92 300 1234567' },
    { label: 'Flagged Sample Number', value: '9876543210' },
    { label: 'Standard Domestic Line', value: '+91 9820012345' },
  ],
  qr: [
    {
      label: 'Suspicious Refund QR',
      value: 'upi://pay?pa=refund-desk@ybl&pn=RefundDesk&am=5000&tn=urgent%20kyc%20refund',
    },
    {
      label: 'Standard Merchant QR',
      value: 'upi://pay?pa=merchant@okaxis&pn=SuperMarket&am=250',
    },
  ],
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('url');
  const [inputValue, setInputValue] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const fileRef = useRef(null);
  const resultsRef = useRef(null);

  const currentTabConfig = TABS.find((t) => t.id === activeTab) || TABS[0];

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  function validateInput(target) {
    if (activeTab === 'qr') {
      if (!target && !fileInput) {
        return 'Upload a QR/screenshot image or enter a decoded UPI intent URI before scanning.';
      }
      return '';
    }

    if (!target) {
      return `Enter a ${currentTabConfig.label} value before running an inspection.`;
    }

    if (activeTab === 'url' && /\s/.test(target)) {
      return 'URLs cannot contain spaces. Paste only the web link and try again.';
    }

    if (activeTab === 'upi' && /\s/.test(target)) {
      return 'UPI IDs cannot contain spaces. Remove whitespace and try again.';
    }

    if (activeTab === 'message' && target.length < 5) {
      return 'Message text is too short. Paste at least 5 characters to analyze.';
    }

    if (activeTab === 'phone') {
      if (!/\d/.test(target)) {
        return 'Phone number must include numeric digits (for example, +91 9820012345).';
      }
      if (/[^0-9+\-\s().]/.test(target)) {
        return 'Phone number contains unsupported characters. Use digits, spaces, hyphens, or a leading +.';
      }
    }

    return '';
  }

  function executeAnalysis(targetOverride) {
    const target = (targetOverride !== undefined ? targetOverride : inputValue).trim();
    const validationErr = validateInput(target);
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setError('');
    setIsScanning(true);
    setCurrentResult(null);

    setTimeout(() => {
      let res = null;
      if (activeTab === 'url') {
        res = analyzeUrl(target);
      } else if (activeTab === 'message') {
        res = analyzeMessage(target);
      } else if (activeTab === 'phone') {
        res = analyzePhone(target);
      } else if (activeTab === 'upi') {
        res = analyzeUpiId(target);
      } else if (activeTab === 'qr') {
        const fileName = fileInput ? fileInput.name : 'qr_payload.png';
        const raw = analyzeOcrQr(fileName, target);
        res = {
          ...raw,
          input: target || fileName,
          type: 'ocr',
        };
      }

      const saved = recordScanResult(res, currentTabConfig.historyType);
      setCurrentResult(saved);
      setHistory(getScanHistory());
      setIsScanning(false);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }, 180);
  }

  function handlePresetSelect(val) {
    setInputValue(val);
    setError('');
    executeAnalysis(val);
  }

  function handleReset() {
    setCurrentResult(null);
    setInputValue('');
    setFileInput(null);
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setError('');
    if (!file) {
      setFileInput(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Unsupported file format. Select an image file (.png, .jpg, or .webp).');
      setFileInput(null);
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image exceeds the 10 MB limit. Choose a smaller file.');
      setFileInput(null);
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setFileInput(file);
  }

  function handleClearHistory() {
    clearScanHistory();
    setHistory([]);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Dashboard Hero Banner (Restrained Soft Blue Enterprise Gradient) */}
        <section className="hero-gradient-surface border border-[#DBEAFE] rounded-[10px] p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-[10px] accent-blue-gradient text-white flex items-center justify-center flex-shrink-0 shadow-[0_1px_3px_rgba(20,36,58,0.12)]">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-[22px] sm:text-2xl font-bold text-[#14243A] tracking-tight leading-tight">
                  Analyzer Console
                </h1>
                <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-[#BFDBFE] text-[11px] font-mono font-semibold uppercase tracking-wider text-[#2563EB]">
                  Unified Workspace
                </span>
              </div>
              <p className="text-[13.5px] text-[#172B4D]/85 mt-1 leading-relaxed max-w-2xl">
                Inspect URLs, SMS messages, UPI handles, phone numbers, and QR payloads in one workspace using transparent client-side heuristic rules.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-medium text-[#172B4D]">
              5 Local Scanners
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono font-semibold text-[#14243A]">
              Session Scans: {history.length}
            </span>
          </div>
        </section>

        {/* Primary 8/4 Enterprise Workspace Row */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Scanner Form Card (8 cols) */}
          <section className="xl:col-span-8 card-enterprise p-5 sm:p-6">
            {/* Module Tabs */}
            <div
              role="tablist"
              aria-label="Input Type Selector"
              className="flex gap-1 border-b border-[#E2E8F0] pb-3.5 mb-5 overflow-x-auto"
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
                      setFileInput(null);
                      setError('');
                      setCurrentResult(null);
                      if (fileRef.current) fileRef.current.value = '';
                    }}
                    className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                      active
                        ? 'bg-[#14243A] text-white'
                        : 'text-[#64748B] hover:text-[#172B4D] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    <span className={active ? 'text-[#93C5FD]' : 'text-[#64748B]'}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <form
              id={`panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                executeAnalysis();
              }}
              className="space-y-4"
            >
              <ValidationBanner message={error} onDismiss={() => setError('')} />

              {activeTab !== 'qr' ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="main-input"
                      className="block text-[13px] font-semibold text-[#172B4D]"
                    >
                      {currentTabConfig.fieldLabel} <span className="text-[#DC2626]">*</span>
                    </label>
                    {activeTab === 'message' && (
                      <span className="text-xs font-mono text-[#64748B]">
                        {inputValue.length} chars
                      </span>
                    )}
                  </div>

                  {activeTab === 'message' ? (
                    <textarea
                      id="main-input"
                      rows={5}
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={currentTabConfig.placeholder}
                      aria-invalid={Boolean(error)}
                      aria-describedby="console-input-helper"
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:ring-2 transition-colors resize-y ${
                        error
                          ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                          : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/15'
                      }`}
                    />
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                        {currentTabConfig.icon}
                      </div>
                      <input
                        id="main-input"
                        type={activeTab === 'phone' ? 'tel' : 'text'}
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder={currentTabConfig.placeholder}
                        aria-invalid={Boolean(error)}
                        aria-describedby="console-input-helper"
                        className={`w-full h-11 pl-10 pr-14 bg-white border rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:ring-2 transition-colors font-mono ${
                          error
                            ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                            : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/15'
                        }`}
                      />
                      {inputValue && (
                        <button
                          type="button"
                          onClick={() => {
                            setInputValue('');
                            setError('');
                          }}
                          className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-[#64748B] hover:text-[#172B4D]"
                          aria-label="Clear input"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  )}

                  <p id="console-input-helper" className="text-xs text-[#64748B]">
                    {currentTabConfig.helper}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="qr-file-input"
                      className="block text-[13px] font-semibold text-[#172B4D]"
                    >
                      Receipt Screenshot or QR Code Image
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileRef}
                        id="qr-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[13px] text-[#64748B] file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#EFF6FF] file:text-[#2563EB] hover:file:bg-[#DBEAFE]"
                      />
                      {fileInput && (
                        <button
                          type="button"
                          onClick={() => {
                            setFileInput(null);
                            if (fileRef.current) fileRef.current.value = '';
                          }}
                          className="btn-secondary px-2.5"
                          aria-label="Remove selected file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="qr-uri-input"
                      className="block text-[13px] font-semibold text-[#172B4D]"
                    >
                      {currentTabConfig.fieldLabel}
                    </label>
                    <input
                      id="qr-uri-input"
                      type="text"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={currentTabConfig.placeholder}
                      aria-describedby="console-input-helper"
                      className="w-full h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 font-mono"
                    />
                    <p id="console-input-helper" className="text-xs text-[#64748B]">
                      {currentTabConfig.helper}
                    </p>
                  </div>
                </div>
              )}

              {/* Sample Inputs */}
              {PRESETS[activeTab] && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-medium text-[#64748B]">Quick samples:</span>
                  {PRESETS[activeTab].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(p.value)}
                      className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-[#F5F7FA] hover:bg-[#EFF6FF] text-[#172B4D] hover:text-[#2563EB] border border-[#E2E8F0] hover:border-[#BFDBFE] transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="submit"
                  disabled={isScanning}
                  className="btn-primary"
                >
                  <Search className="w-4 h-4" />
                  <span>{isScanning ? 'Inspecting...' : 'Inspect Payload'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isScanning && !inputValue && !fileInput && !currentResult}
                  className="btn-secondary"
                >
                  <RefreshCw className="w-4 h-4 text-[#64748B]" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          </section>

          {/* Right Context Panel (4 cols) */}
          <div className="xl:col-span-4">
            <ModuleScopeCard
              title={`${currentTabConfig.label} Rules`}
              subtitle="Heuristic rules applied to this input type"
              checks={currentTabConfig.checks}
            />
          </div>
        </div>

        {/* Loading or Result Display (Full 12-col width) */}
        {isScanning && (
          <ScannerLoadingState
            label={`Running ${currentTabConfig.label} heuristic checks...`}
            target={inputValue || fileInput?.name}
          />
        )}

        {!isScanning && currentResult && (
          <div ref={resultsRef}>
            <ResultsDashboard result={currentResult} onReset={handleReset} />
          </div>
        )}

        {/* Recent Scans Table */}
        <RelevantHistorySection
          title="Recent Scans Across All Modules"
          emptyText="No recent inspections recorded in this browser session. Enter an identifier above or choose a sample to begin."
          items={history}
          maxItems={8}
          onSelect={(selectedResult) => {
            setCurrentResult(selectedResult);
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
