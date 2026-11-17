import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CreditCard, 
  LinkIcon, 
  MessageSquare, 
  QrCode, 
  ArrowRight, 
  PhoneCall, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  ExternalLink,
  Terminal,
  Activity,
  Smartphone
} from '../components/Icons';
import Footer from '../components/Footer';

export default function Landing() {
  const navigate = useNavigate();
  const [quickInput, setQuickInput] = useState('');
  const [quickType, setQuickType] = useState('upi');

  function handleQuickCheck(e) {
    e.preventDefault();
    if (!quickInput.trim()) return;
    navigate('/login', { state: { prefill: quickInput.trim(), type: quickType } });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-100">UPI Scam Analyzer</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider border-l border-slate-800 pl-2">
                Cyber Intelligence Utility
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-3 sm:gap-5">
            <a 
              href="#tools" 
              className="text-xs font-semibold text-slate-400 hover:text-slate-100 hidden md:block transition-colors"
            >
              Inspection Tools
            </a>
            <a 
              href="#guidelines" 
              className="text-xs font-semibold text-slate-400 hover:text-slate-100 hidden md:block transition-colors"
            >
              Safety Rules
            </a>
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 border border-transparent transition-colors font-mono"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/30 inline-flex items-center gap-1.5 font-mono"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Emergency Helpline Banner */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-[10px] uppercase tracking-wider">
              Emergency
            </span>
            <span className="text-slate-400">
              Active financial fraud victim? Call National Cyber Crime Helpline:
            </span>
            <strong className="text-emerald-400 font-bold">1930</strong>
            <span className="text-slate-500 hidden sm:inline">(24x7 Toll Free)</span>
          </div>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 text-[11px]"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="border-b border-slate-800 py-14 sm:py-20 bg-slate-950 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-semibold uppercase tracking-wider mb-6">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Independent Digital Payment Security Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight mb-5 max-w-4xl mx-auto">
            Verify Suspicious UPI Handles, Links, and Fraudulent Messages
          </h1>

          <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            An automated cybersecurity verification utility providing instant heuristic threat analysis for payment VPAs, phishing URLs, caller IDs, and SMS lures before financial authorization occurs.
          </p>

          {/* Quick Lookup Card */}
          <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl text-left backdrop-blur-sm">
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 mb-4 text-xs font-mono font-semibold">
              <button
                type="button"
                onClick={() => setQuickType('upi')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  quickType === 'upi'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>UPI Handle</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickType('url')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  quickType === 'url'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Web URL</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickType('phone')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  quickType === 'phone'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone / Caller</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickType('sms')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  quickType === 'sms'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>SMS Text</span>
              </button>
            </div>

            <form onSubmit={handleQuickCheck} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder={
                    quickType === 'upi'
                      ? 'e.g. cashback-claim@ybl or refund-care@oksbi'
                      : quickType === 'url'
                      ? 'e.g. http://192.168.1.10/verify-bank-account'
                      : quickType === 'phone'
                      ? 'e.g. +923001234567 or +9118001239999'
                      : 'Paste suspicious SMS message text here...'
                  }
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl text-xs font-bold font-mono transition-colors shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Verify Payload</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <p className="text-[11px] text-slate-400 mt-3 font-mono">
              Sign in to retain scan history, run OCR image extraction, and review detailed threat indicators.
            </p>
          </div>
        </div>
      </section>

      {/* Core Tools Section */}
      <section id="tools" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Specialized Threat Verification Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Each scanner module utilizes targeted heuristic rules designed for prevalent digital payment scam patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">UPI Identifier Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspects suspicious Virtual Payment Addresses against known patterns of impersonation, fake customer service desks, lottery claims, and unauthorized merchant handles.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <Link to="/upi" className="text-xs font-mono font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                <span>Open UPI Checker</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                <LinkIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Phishing Link Inspector</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates URLs for raw IP address routing, deceptive banking subdomains, unencrypted HTTP protocols, and link shorteners used in credential harvesting campaigns.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <Link to="/url" className="text-xs font-mono font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                <span>Open Link Scanner</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">SMS & Messaging Lures</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flags deceptive keywords common in electricity bill power cut threats, fake lottery awards, urgent bank KYC verification requests, and malicious APK installation lures.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <Link to="/message" className="text-xs font-mono font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                <span>Open SMS Analyzer</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">OCR & QR Code Scanner</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts payment URLs, recipient VPAs, and requested amounts from QR code images or transaction screenshots for automated safety analysis before scanning in banking apps.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <Link to="/ocr_qr" className="text-xs font-mono font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                <span>Open QR Inspector</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Guidelines Section */}
      <section id="guidelines" className="bg-slate-900/60 border-t border-b border-slate-800 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-slate-800 pb-6 mb-8 text-center sm:text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Crucial Awareness</span>
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight mt-1">
              Essential Rules for UPI Safety
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Standard consumer protections published by the National Payments Corporation of India (NPCI).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center font-bold text-xs font-mono">
                Rule 1
              </div>
              <h3 className="text-sm font-bold text-slate-100">Never Enter PIN to Receive Money</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A UPI PIN is exclusively required to debit money from your account. Receiving funds, refunds, or cashbacks never requires entering your secret PIN.
              </p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                Rule 2
              </div>
              <h3 className="text-sm font-bold text-slate-100">Verify Beneficiary Name in App</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Always confirm the actual account holder name displayed by the banking network on your phone screen before entering any amount or authorization.
              </p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">
                Rule 3
              </div>
              <h3 className="text-sm font-bold text-slate-100">Act Fast in the Golden Hour</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If money has been wrongfully transferred, dial 1930 immediately. Rapid reporting within the first hour gives law enforcement the highest chance of freezing funds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="bg-slate-950 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Protect Your Digital Transactions
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Create an account to retain a persistent log of verified handles, monitor blacklist updates, and report active fraud attempts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/30 font-mono"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 transition-colors font-mono"
            >
              Sign In to Console
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
