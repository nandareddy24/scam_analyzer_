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
  Search, 
  ExternalLink,
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
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-100 tracking-tight">UPI Scam Analyzer</span>
          </div>

          <nav className="flex items-center gap-4 text-xs">
            <a 
              href="#tools" 
              className="text-slate-400 hover:text-slate-200 hidden md:block transition-colors"
            >
              Inspection Tools
            </a>
            <a 
              href="#guidelines" 
              className="text-slate-400 hover:text-slate-200 hidden md:block transition-colors"
            >
              Safety Rules
            </a>
            <Link
              to="/login"
              className="text-slate-300 hover:text-white px-2.5 py-1.5 rounded transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 rounded transition-colors"
            >
              Create Account
            </Link>
          </nav>
        </div>
      </header>

      {/* Emergency Helpline Banner */}
      <div className="bg-slate-900/80 border-b border-slate-800 text-slate-300 py-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold text-[10px] uppercase">
              Helpline
            </span>
            <span>
              Victim of unauthorized UPI debit? Call the National Cyber Crime Helpline:
            </span>
            <strong className="text-emerald-400 font-bold">1930</strong>
            <span className="text-slate-500 text-[11px]">(24x7 Toll Free)</span>
          </div>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 text-[11px]"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="border-b border-slate-800 py-12 sm:py-16 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-100 tracking-tight leading-snug mb-3">
            Inspect Suspicious UPI IDs, Payment Links, and Messages
          </h1>

          <p className="text-sm text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Verify payment handles, phone numbers, and URLs against known cyber fraud patterns before authorizing any financial transaction.
          </p>

          {/* Quick Lookup Card */}
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5 text-left">
            <div className="flex gap-1 border-b border-slate-800 pb-2 mb-3 text-xs">
              <button
                type="button"
                onClick={() => setQuickType('upi')}
                className={`px-3 py-1 rounded transition-colors ${
                  quickType === 'upi' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                UPI VPA
              </button>
              <button
                type="button"
                onClick={() => setQuickType('url')}
                className={`px-3 py-1 rounded transition-colors ${
                  quickType === 'url' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Web URL
              </button>
              <button
                type="button"
                onClick={() => setQuickType('phone')}
                className={`px-3 py-1 rounded transition-colors ${
                  quickType === 'phone' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Phone
              </button>
              <button
                type="button"
                onClick={() => setQuickType('sms')}
                className={`px-3 py-1 rounded transition-colors ${
                  quickType === 'sms' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SMS Text
              </button>
            </div>

            <form onSubmit={handleQuickCheck} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder={
                    quickType === 'upi'
                      ? 'e.g. refund-care@oksbi'
                      : quickType === 'url'
                      ? 'e.g. http://192.168.1.10/verify-bank'
                      : quickType === 'phone'
                      ? 'e.g. +92 300 1234567 or 9876543210'
                      : 'Paste message text here...'
                  }
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>Inspect Target</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <p className="text-[11px] text-slate-500 mt-2">
              Sign in to retain audit logs, scan QR codes, and review detailed threat findings.
            </p>
          </div>
        </div>
      </section>

      {/* Core Tools Section */}
      <section id="tools" className="py-12 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Inspection Capabilities
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Targeted inspection modules built for prevalent online payment and communications fraud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-slate-800 text-blue-400 flex items-center justify-center mb-3">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">UPI VPA Inspector</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Checks Virtual Payment Addresses against impersonation keywords, fake refund desks, and unauthorized handles.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800">
              <Link to="/upi" className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                <span>Open UPI Checker</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-slate-800 text-blue-400 flex items-center justify-center mb-3">
                <LinkIcon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">URL & Link Scanner</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates URLs for raw IP routing, deceptive banking subdomains, unencrypted HTTP protocols, and link shorteners.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800">
              <Link to="/url" className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                <span>Open URL Scanner</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-slate-800 text-blue-400 flex items-center justify-center mb-3">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">SMS & Message Checker</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flags deceptive keywords common in electricity disconnection threats, lottery prizes, and fake KYC notices.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800">
              <Link to="/message" className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                <span>Open Message Checker</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-slate-800 text-blue-400 flex items-center justify-center mb-3">
                <QrCode className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">QR Code & OCR Scanner</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts recipient VPAs, payment URLs, and requested amounts from screenshots or QR code images before scanning in apps.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800">
              <Link to="/ocr_qr" className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                <span>Open QR Scanner</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Guidelines Section */}
      <section id="guidelines" className="bg-slate-900/60 border-t border-b border-slate-800 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-100">
              Essential Rules for UPI Safety
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Consumer protection principles recommended by the National Payments Corporation of India (NPCI).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <div className="text-xs font-bold text-emerald-400">Rule 1</div>
              <h3 className="text-sm font-bold text-slate-100">Never Enter PIN to Receive Money</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A UPI PIN is used exclusively to debit funds from your account. Receiving payments or refunds never requires entering your PIN.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <div className="text-xs font-bold text-emerald-400">Rule 2</div>
              <h3 className="text-sm font-bold text-slate-100">Confirm Beneficiary Name in App</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Always review the legal account name displayed by the banking network on your phone screen before approving any payment.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <div className="text-xs font-bold text-emerald-400">Rule 3</div>
              <h3 className="text-sm font-bold text-slate-100">Call 1930 in the Golden Hour</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If money has been debited fraudulently, call 1930 immediately. Rapid reporting within the first hour gives the highest chance of freezing funds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-950 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-100">
            Verify Payment Identifiers Before You Pay
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            Create an account to retain your personal inspection audit history and submit suspected fraud reports to community databases.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded border border-slate-800 transition-colors"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
