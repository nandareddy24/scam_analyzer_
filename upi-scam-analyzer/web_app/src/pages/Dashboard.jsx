import { useState, useRef } from 'react';
import AppLayout from '../components/AppLayout';
import ScanningLoader from '../components/ScanningLoader';
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
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  ExternalLink,
  Cpu,
  Activity,
  Zap,
  Terminal,
  Clock,
  Sparkles,
  Check
} from '../components/Icons';

/**
 * Modern Cybersecurity Dashboard
 * Centralized Threat Detection Console featuring:
 * - Sleek dark slate & glassmorphism aesthetic
 * - Multi-tab input for URLs, SMS/Text, Phone Numbers, UPI VPAs, and QR screenshots
 * - 1-Click quick test presets for testing threat vectors
 * - Real-time dynamic multi-stage scanning loader
 * - Comprehensive Results Dashboard with Risk Score Gauge & Categorized Threat Indicators
 * - Session audit log of recent scans
 */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'message' | 'phone' | 'upi' | 'qr'
  const [inputValue, setInputValue] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const resultsRef = useRef(null);

  // In-session scan history log
  const [recentScans, setRecentScans] = useState([
    {
      id: 'scan-1',
      type: 'URL',
      target: 'http://192.168.1.10/verify-bank-account',
      verdict: 'CRITICAL THREAT',
      score: 22,
      riskLevel: 'high',
      time: '2 mins ago',
    },
    {
      id: 'scan-2',
      type: 'SMS',
      target: 'URGENT: Electricity disconnected tonight. Call 9876543210...',
      verdict: 'CRITICAL THREAT',
      score: 19,
      riskLevel: 'high',
      time: '14 mins ago',
    },
    {
      id: 'scan-3',
      type: 'UPI',
      target: 'merchant@okaxis',
      verdict: 'VERIFIED SAFE',
      score: 0,
      riskLevel: 'low',
      time: '1 hour ago',
    },
  ]);

  // Tab configurations
  const TABS = [
    { id: 'url', label: 'Web URL', icon: <Globe className="w-4 h-4" />, placeholder: 'e.g. http://192.168.1.10/verify-bank-account or http://kyc-update.com' },
    { id: 'message', label: 'Text / SMS', icon: <MessageSquare className="w-4 h-4" />, placeholder: 'Paste suspicious SMS, WhatsApp message, or urgent lottery/KYC notification...' },
    { id: 'phone', label: 'Phone Number', icon: <PhoneCall className="w-4 h-4" />, placeholder: 'e.g. +91 9876543210 or +92 300 1234567' },
    { id: 'upi', label: 'UPI VPA', icon: <CreditCard className="w-4 h-4" />, placeholder: 'e.g. refund-care@oksbi or cashback-support@ybl' },
    { id: 'qr', label: 'QR / Image', icon: <QrCode className="w-4 h-4" />, placeholder: 'Extracted payment URI or QR intent payload (optional)' },
  ];

  // Quick preset test chips
  const PRESETS = {
    url: [
      { label: 'Phishing Bank URL (IP)', value: 'http://192.168.1.10/verify-bank-account' },
      { label: 'Shortened Link Lure', value: 'http://bit.ly/claim-sbi-reward-points' },
      { label: 'Verified Safe (NPCI)', value: 'https://npci.org.in' },
    ],
    message: [
      { label: 'Electricity Disconnection Scam', value: 'URGENT: Dear customer, your electricity power will be disconnected tonight at 9:30 PM. Immediately contact electricity officer at 9876543210.' },
      { label: 'Lottery & KYC Lure', value: 'Congratulations! You won ₹25,00,000 in Kaun Banega Crorepati. To claim refund verify immediately at http://kbc-reward.com' },
      { label: 'Standard Bank Transaction', value: 'Dear customer, your account XXX1234 was credited with INR 2,500.00 on 17-Nov-2026. Ref UPI/43210.' },
    ],
    phone: [
      { label: 'International Imposter (+92)', value: '+92 300 1234567' },
      { label: '1930 Blacklisted Number', value: '9876543210' },
      { label: 'Standard Verified Mobile', value: '+91 9820012345' },
    ],
    upi: [
      { label: 'Fraudulent Refund Handle', value: 'refund-care@oksbi' },
      { label: 'Numeric Burner VPA', value: '9876543210@paytm' },
      { label: 'Verified Merchant Handle', value: 'store@okaxis' },
    ],
    qr: [
      { label: 'Phishing QR Intent', value: 'upi://pay?pa=refund-desk@ybl&pn=RefundDesk&am=5000' },
      { label: 'Standard QR Intent', value: 'upi://pay?pa=merchant@okaxis&pn=SuperMarket&am=250' },
    ],
  };

  function executeAnalysis(targetToAnalyze) {
    const val = targetToAnalyze !== undefined ? targetToAnalyze : inputValue;
    if (!val && activeTab !== 'qr' && !fileInput) return;

    setIsScanning(true);
    setCurrentResult(null);
  }

  function handleScanningComplete() {
    let res = null;
    const target = inputValue.trim();

    if (activeTab === 'url') {
      res = analyzeUrl(target || 'http://192.168.1.10/verify-bank-account');
    } else if (activeTab === 'message') {
      res = analyzeMessage(target || 'URGENT: Your account is blocked. Verify immediately.');
    } else if (activeTab === 'phone') {
      res = analyzePhone(target || '+91 9876543210');
    } else if (activeTab === 'upi') {
      res = analyzeUpiId(target || 'refund-care@oksbi');
    } else if (activeTab === 'qr') {
      const fileName = fileInput ? fileInput.name : 'scanned_qr_payload.png';
      res = analyzeOcrQr(fileName, target);
    }

    setCurrentResult(res);
    setIsScanning(false);

    // Prepend to recent scans log
    if (res) {
      const newEntry = {
        id: `scan-${Date.now()}`,
        type: activeTab.toUpperCase(),
        target: res.input || target,
        verdict: res.status,
        score: res.score,
        riskLevel: res.riskLevel,
        time: 'Just now',
      };
      setRecentScans((prev) => [newEntry, ...prev.slice(0, 9)]);
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function handlePresetClick(presetValue) {
    setInputValue(presetValue);
    executeAnalysis(presetValue);
  }

  function handleReset() {
    setCurrentResult(null);
    setInputValue('');
    setFileInput(null);
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* National Cyber Crime Helpline 1930 Intelligence Banner */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                  Helpline 1930 Active
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  National Cyber Crime Reporting Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                If you suspect unauthorized financial debit or scam solicitation, call <strong>1930</strong> immediately to invoke the Citizen Financial Cyber Fraud Reporting System within the golden hour.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center flex-shrink-0">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Trust Payment Threat Intelligence Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-100 tracking-tight">
            Scam Analyzer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">Defense Console</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Verify suspicious phishing URLs, urgent SMS lures, spoofed caller IDs, and fraudulent UPI addresses in real time before sending money.
          </p>
        </div>

        {/* Centralized Search & Input Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" />
                <span>Multi-Vector Threat Inspection</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select an entity category below, paste your suspicious payload, and run comprehensive heuristic checks.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>42k+ Rules Synced</span>
            </div>
          </div>

          {/* Intuitive Segmented Pill Selector Tabs */}
          <div className="flex gap-2 p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 overflow-x-auto mb-6 scrollbar-none">
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
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-slate-400'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeAnalysis();
            }}
            className="space-y-4"
          >
            {activeTab !== 'qr' ? (
              <div className="relative">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Target {TABS.find((t) => t.id === activeTab)?.label}
                </label>
                {activeTab === 'message' ? (
                  <textarea
                    rows={4}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={TABS.find((t) => t.id === activeTab)?.placeholder}
                    className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y"
                  />
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={TABS.find((t) => t.id === activeTab)?.placeholder}
                      className="w-full pl-11 pr-24 py-3.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Upload Screenshot or QR Code Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFileInput(e.target.files[0])}
                    className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Optional Extracted Intent or URI
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. upi://pay?pa=recipient@bank&am=500"
                    className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Quick Test Presets */}
            {PRESETS[activeTab] && (
              <div className="pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2 font-bold">
                  Quick-Test Presets (Click to run):
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESETS[activeTab].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetClick(p.value)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition-all flex items-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isScanning || (!inputValue && activeTab !== 'qr' && !fileInput)}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5"
              >
                {isScanning ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Engaging Threat Intelligence Engine...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Execute Threat Analysis</span>
                    <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded bg-blue-700/60 text-[10px] font-mono text-blue-200">
                      Enter ↵
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Dynamic Scanning & Loader State */}
        {isScanning && (
          <div className="animate-fadeIn">
            <ScanningLoader
              onComplete={handleScanningComplete}
              targetType={activeTab.toUpperCase()}
              targetValue={inputValue}
            />
          </div>
        )}

        {/* Modular Results Dashboard Component */}
        {currentResult && !isScanning && (
          <div ref={resultsRef} className="animate-fadeIn">
            <ResultsDashboard
              result={currentResult}
              onReset={handleReset}
            />
          </div>
        )}

        {/* System Capabilities Overview (Heuristics & Threat Feeds) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Multi-Vector Heuristics</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Evaluates URLs, SMS lures, Phone numbers, and UPI handles with weighted pattern matching.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Zero Retention Guarantee</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                All scans execute safely in temporary memory. Sensitive bank account and personal data are never logged.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Golden Hour Rapid Action</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Direct integration guidance with the National Cyber Crime Reporting Portal (1930) for quick account freeze.
              </p>
            </div>
          </div>
        </div>

        {/* Live Session Activity / Recent Audit Log */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-blue-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Live Session Threat Log</h3>
                <p className="text-[11px] text-slate-400">Inspections recorded during your verified security session</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              {recentScans.length} Entries Logged
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentScans.map((scan) => {
              const isHigh = scan.riskLevel === 'high' || scan.score >= 12;
              const isMed = scan.riskLevel === 'medium' || (scan.score >= 5 && scan.score < 12);
              return (
                <div
                  key={scan.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-3 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-7 rounded-md bg-slate-800 text-blue-400 font-mono text-[10px] font-bold flex items-center justify-center border border-slate-700 flex-shrink-0">
                      {scan.type}
                    </span>
                    <div>
                      <p className="text-xs font-mono font-bold text-slate-200 truncate max-w-sm sm:max-w-md">
                        {scan.target}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {scan.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : isMed
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {scan.verdict}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {scan.score}/25
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
