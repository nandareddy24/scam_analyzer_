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
  Search,
  ExternalLink,
  Info,
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
    <div className="min-h-screen bg-[#F5F7FA] text-[#172B4D] flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg accent-blue-gradient text-white flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-[#14243A] tracking-tight">UPI Scam Analyzer</span>
          </div>

          <nav className="flex items-center gap-5 text-sm">
            <a
              href="#tools"
              className="text-[#475569] hover:text-[#0F172A] hidden md:block font-medium transition-colors"
            >
              Scanners
            </a>
            <a
              href="#limitations"
              className="text-[#475569] hover:text-[#0F172A] hidden md:block font-medium transition-colors"
            >
              How It Works
            </a>
            <a
              href="#guidelines"
              className="text-[#475569] hover:text-[#0F172A] hidden md:block font-medium transition-colors"
            >
              Safety Rules
            </a>
            <Link
              to="/login"
              className="text-[#334155] hover:text-[#0F172A] font-medium px-3 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 rounded-lg transition-colors"
            >
              Create Account
            </Link>
          </nav>
        </div>
      </header>

      {/* Official Indian Cybercrime Helpline Reference Banner */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#334155] py-2.5">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2 py-0.5 rounded bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] font-semibold font-mono text-xs uppercase">
              India Helpline
            </span>
            <span>
              Unauthorized financial debit? Call the National Cyber Crime Helpline:
            </span>
            <strong className="text-[#15803D] font-bold font-mono">1930</strong>
            <span className="text-[#64748B] text-xs">(I4C, Ministry of Home Affairs)</span>
          </div>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563EB] hover:text-[#1D4ED8] font-medium inline-flex items-center gap-1 text-xs font-mono"
          >
            <span>https://cybercrime.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Hero Section (Restrained Soft Blue Enterprise Gradient) */}
      <section className="hero-gradient-surface border-b border-[#E2E8F0] py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#14243A] tracking-tight leading-snug mb-4">
            Rule-Based Fraud Inspection for UPI IDs, URLs, SMS, Phone Numbers, and QR Payloads
          </h1>

          <p className="text-base text-[#172B4D]/85 mb-8 max-w-2xl mx-auto leading-relaxed">
            Check suspicious payment handles, links, phone numbers, and messages against transparent local heuristic rules before taking action. Results are risk indicators, not guarantees of safety.
          </p>

          {/* Quick Lookup Card */}
          <div className="max-w-2xl mx-auto bg-white border border-[#E2E8F0] shadow-[0_2px_6px_rgba(20,36,58,0.05)] rounded-[10px] p-5 sm:p-6 text-left">
            <div className="flex gap-1.5 border-b border-[#E2E8F0] pb-3 mb-4 text-sm overflow-x-auto">
              <button
                type="button"
                onClick={() => setQuickType('upi')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
                  quickType === 'upi' ? 'bg-[#2563EB] text-white' : 'text-[#475569] hover:text-[#0F172A] hover:bg-white'
                }`}
              >
                UPI VPA
              </button>
              <button
                type="button"
                onClick={() => setQuickType('url')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
                  quickType === 'url' ? 'bg-[#2563EB] text-white' : 'text-[#475569] hover:text-[#0F172A] hover:bg-white'
                }`}
              >
                Web URL
              </button>
              <button
                type="button"
                onClick={() => setQuickType('phone')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
                  quickType === 'phone' ? 'bg-[#2563EB] text-white' : 'text-[#475569] hover:text-[#0F172A] hover:bg-white'
                }`}
              >
                Phone
              </button>
              <button
                type="button"
                onClick={() => setQuickType('sms')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
                  quickType === 'sms' ? 'bg-[#2563EB] text-white' : 'text-[#475569] hover:text-[#0F172A] hover:bg-white'
                }`}
              >
                SMS Text
              </button>
            </div>

            <form onSubmit={handleQuickCheck} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
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
                      : 'Paste suspicious message text here...'
                  }
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 text-[15px] bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 text-[#0F172A] placeholder-[#64748B] font-mono"
                />
              </div>
              <button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 h-11 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Sign In to Inspect</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-xs text-[#64748B] mt-3">
              Sign in to access all five rule-based inspection modules, view detection reasons, and review session audit history.
            </p>
          </div>
        </div>
      </section>

      {/* Core Inspection Modules */}
      <section id="tools" className="py-14 max-w-6xl mx-auto px-5 sm:px-6 w-full">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            What Each Scanner Checks
          </h2>
          <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">
            Every scanner uses deterministic, client-side heuristic rules and lists the exact reasons behind each risk score (0 to 25).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center mb-4">
                <LinkIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0F172A] mb-1.5">Phishing URL and Domain Scanner</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Checks URL syntax, unencrypted HTTP schemes, raw IPv4 hosts, known URL shorteners, multi-hyphen hostnames, and common banking lure keywords.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E2E8F0]">
              <Link to="/url" className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1.5">
                <span>Open URL Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0F172A] mb-1.5">SMS and Message Lure Analyzer</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Matches text against scam phrases (KYC, electricity disconnection, lottery, refund), embedded links, OTP mentions with digits, and urgency cues.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E2E8F0]">
              <Link to="/message" className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1.5">
                <span>Open Message Analyzer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0F172A] mb-1.5">UPI VPA Checker</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Validates username@handle syntax, checks whether the suffix appears in a list of major Indian bank/PSP handles, and flags impersonation keywords or numeric aliases.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E2E8F0]">
              <Link to="/upi" className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1.5">
                <span>Open UPI Checker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center mb-4">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0F172A] mb-1.5">Phone Number Analysis</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Checks digit length, non-+91 international prefixes, telemarketing/toll-free pools (140, 1800, 1900), synthetic repeating digits, and a static sample watchlist.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E2E8F0]">
              <Link to="/phone" className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1.5">
                <span>Open Phone Analyzer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 flex flex-col justify-between md:col-span-2">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0F172A] mb-1.5">QR Code and Screenshot Payload Inspector</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Validates uploaded image format and size locally and runs heuristic checks on decoded UPI intent URIs (upi://pay?pa=...) or text copied from payment screenshots. It does not upload images or perform automated server-side pixel OCR.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E2E8F0]">
              <Link to="/ocr_qr" className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1.5">
                <span>Open QR &amp; Payload Inspector</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency & Limitations Section */}
      <section id="limitations" className="bg-[#F8FAFC] border-t border-[#E2E8F0] py-14">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-xl font-bold text-[#0F172A]">
              How Rule-Based Detection Works and Its Limitations
            </h2>
            <p className="text-sm text-[#475569] mt-1 leading-relaxed">
              Understand what these risk assessments can and cannot tell you before relying on them for financial decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div className="p-5 bg-white border border-[#E2E8F0] rounded-lg space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#0F172A]">
                <Info className="w-4 h-4 text-[#2563EB]" />
                <span>Indicators, Not Guarantees</span>
              </div>
              <p className="text-[#475569] leading-relaxed">
                Every scan produces a heuristic score from 0 to 25 mapped to Safe (0-4), Warning (5-11), or Dangerous (12-25). A Safe score only means no local rules matched; it never guarantees that a transaction or recipient is legitimate. A Warning or Dangerous score indicates rule matches, not legal confirmation of fraud.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E2E8F0] rounded-lg space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#0F172A]">
                <Info className="w-4 h-4 text-[#D97706]" />
                <span>Scope and Limitations of Static Rules</span>
              </div>
              <p className="text-[#475569] leading-relaxed">
                Local heuristic rules do not query live bank account registries, real-time domain WHOIS/SSL certificates, or government fraud databases. Legitimate inputs may occasionally trigger false positives, and newly created or disguised scams may bypass static rules.
              </p>
            </div>
          </div>

          <div className="panel-navy-gradient rounded-[10px] p-4 sm:p-5 text-sm text-[#CBD5E1] leading-relaxed">
            <strong className="text-white">Independent Tool Notice:</strong> UPI Scam Analyzer is an independent utility. It is not affiliated with, certified by, or endorsed by NPCI, RBI, I4C, any bank, or the Government of India.
          </div>
        </div>
      </section>

      {/* Safety Guidelines Section */}
      <section id="guidelines" className="bg-white border-t border-b border-[#E2E8F0] py-14">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="border-b border-[#E2E8F0] pb-4 mb-6">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Essential UPI Payment Safety Rules
            </h2>
            <p className="text-sm text-[#475569] mt-1">
              Practical checks to follow inside your banking or UPI app regardless of any scanner result.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
              <div className="text-xs font-bold text-[#15803D] font-mono">RULE 01</div>
              <h3 className="text-base font-semibold text-[#0F172A]">Never Enter PIN to Receive Money</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                A UPI PIN authorizes outgoing debits from your bank account. Receiving payments, refunds, or cashback never requires entering your UPI PIN.
              </p>
            </div>

            <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
              <div className="text-xs font-bold text-[#15803D] font-mono">RULE 02</div>
              <h3 className="text-base font-semibold text-[#0F172A]">Confirm Beneficiary Name in App</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Check the legal account holder name displayed by your UPI app on screen before approving any transfer or collect request.
              </p>
            </div>

            <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
              <div className="text-xs font-bold text-[#15803D] font-mono">RULE 03</div>
              <h3 className="text-base font-semibold text-[#0F172A]">Report Financial Fraud to 1930</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                If money is debited fraudulently, call the National Cyber Crime Helpline at 1930 and file a complaint at cybercrime.gov.in as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#F8FAFC] py-12">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#0F172A]">
            Inspect Suspicious Identifiers Before Transacting
          </h2>
          <p className="text-sm text-[#475569] max-w-lg mx-auto leading-relaxed">
            Create an account to access all five heuristic scanning modules and keep a session audit history of your checks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/signup"
              className="btn-primary w-full sm:w-auto h-10"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="btn-secondary w-full sm:w-auto h-10"
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
