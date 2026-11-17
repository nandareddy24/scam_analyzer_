import { Link } from 'react-router-dom';
import { Shield, PhoneCall, ExternalLink, Lock } from './Icons';

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white text-[#64748B] text-[13px] mt-auto">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-7 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand & Scope */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg accent-blue-gradient text-white flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[#14243A] text-sm tracking-tight">
                UPI Scam Analyzer
              </span>
            </div>
            <p className="text-[#64748B] text-[13px] leading-relaxed max-w-md">
              Independent rule-based inspection tool for checking suspicious URLs, SMS messages, UPI IDs, phone numbers, and QR payloads. Results are heuristic indicators, not guarantees of transaction safety.
            </p>
            <div className="flex items-center gap-2 text-[#172B4D] text-[13px]">
              <PhoneCall className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
              <span>
                National Cyber Crime Helpline (India): <strong className="text-[#16A34A] font-mono">1930</strong> (I4C, Ministry of Home Affairs)
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-md">
              Not affiliated with, endorsed by, or certified by NPCI, RBI, I4C, any bank, or the Government of India.
            </p>
          </div>

          {/* Inspection Modules */}
          <div>
            <h4 className="font-semibold text-[#14243A] text-[11px] uppercase tracking-wider mb-3">
              Inspection Modules
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li><Link to="/url" className="text-[#64748B] hover:text-[#2563EB] transition-colors">URL &amp; Domain Scanner</Link></li>
              <li><Link to="/message" className="text-[#64748B] hover:text-[#2563EB] transition-colors">SMS &amp; Message Analyzer</Link></li>
              <li><Link to="/upi" className="text-[#64748B] hover:text-[#2563EB] transition-colors">UPI VPA Checker</Link></li>
              <li><Link to="/phone" className="text-[#64748B] hover:text-[#2563EB] transition-colors">Phone Number Analysis</Link></li>
              <li><Link to="/ocr_qr" className="text-[#64748B] hover:text-[#2563EB] transition-colors">QR &amp; Screenshot OCR</Link></li>
              <li><Link to="/report" className="text-[#64748B] hover:text-[#2563EB] transition-colors">Fraud Entity Reporting</Link></li>
            </ul>
          </div>

          {/* Legal & External Resources */}
          <div>
            <h4 className="font-semibold text-[#14243A] text-[11px] uppercase tracking-wider mb-3">
              Legal &amp; Official Portals
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li><Link to="/privacy" className="text-[#64748B] hover:text-[#2563EB] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-[#64748B] hover:text-[#2563EB] transition-colors">Terms and Conditions</Link></li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#64748B] hover:text-[#16A34A] transition-colors"
                >
                  <span>cybercrime.gov.in (Official)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.npci.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#64748B] hover:text-[#16A34A] transition-colors"
                >
                  <span>npci.org.in (NPCI)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-5 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <p>
            &copy; {new Date().getFullYear()} UPI Scam Analyzer. Independent rule-based fraud awareness utility.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy" className="hover:text-[#172B4D]">Privacy Policy</Link>
            <span className="text-[#CBD5E1]">&bull;</span>
            <Link to="/terms" className="hover:text-[#172B4D]">Terms and Conditions</Link>
            <span className="text-[#CBD5E1]">&bull;</span>
            <span className="flex items-center gap-1.5 text-[#172B4D] font-medium">
              <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Local Rule-Based Inspection</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
