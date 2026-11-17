import { Link } from 'react-router-dom';
import { Shield, PhoneCall, ExternalLink, Lock } from './Icons';

export default function Footer() {
  return (
    <footer className="border-t border-[#26364D] bg-[#0B1220] text-[#A8B5C7] text-xs mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#3B82F6] text-white flex items-center justify-center">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-[#F1F5F9] text-sm tracking-tight">
                UPI Scam Analyzer
              </span>
            </div>
            <p className="text-[#A8B5C7] text-xs leading-relaxed max-w-md">
              Specialized cybersecurity analysis utility for inspecting payment identifiers, suspicious URLs, caller IDs, and fraudulent SMS patterns.
            </p>
            <div className="flex items-center gap-2 text-[#A8B5C7] text-xs">
              <PhoneCall className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>National Cyber Crime Helpline: <strong className="text-[#16A34A]">1930</strong> (24x7 Toll Free)</span>
            </div>
          </div>

          {/* Verification Tools */}
          <div>
            <h4 className="font-semibold text-[#F1F5F9] text-xs uppercase tracking-wider mb-3">
              Inspection Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/url" className="text-[#A8B5C7] hover:text-[#3B82F6] transition-colors">URL & Link Scanner</Link></li>
              <li><Link to="/message" className="text-[#A8B5C7] hover:text-[#3B82F6] transition-colors">SMS & Message Checker</Link></li>
              <li><Link to="/upi" className="text-[#A8B5C7] hover:text-[#3B82F6] transition-colors">UPI VPA Inspector</Link></li>
              <li><Link to="/ocr_qr" className="text-[#A8B5C7] hover:text-[#3B82F6] transition-colors">QR & Screenshot OCR</Link></li>
              <li><Link to="/report" className="text-[#A8B5C7] hover:text-[#3B82F6] transition-colors">Report Incident</Link></li>
            </ul>
          </div>

          {/* Trust & Compliance */}
          <div>
            <h4 className="font-semibold text-[#F1F5F9] text-xs uppercase tracking-wider mb-3">
              Trust & Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/privacy" className="text-[#A8B5C7] hover:text-[#3B82F6] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-[#A8B5C7] hover:text-[#3B82F6] transition-colors">Terms of Service</Link></li>
              <li>
                <a 
                  href="https://cybercrime.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-[#A8B5C7] hover:text-[#16A34A] transition-colors"
                >
                  <span>cybercrime.gov.in</span>
                  <ExternalLink className="w-3 h-3 text-[#8291A6]" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.npci.org.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-[#A8B5C7] hover:text-[#16A34A] transition-colors"
                >
                  <span>NPCI Guidelines</span>
                  <ExternalLink className="w-3 h-3 text-[#8291A6]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#26364D] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8291A6]">
          <p>
            &copy; {new Date().getFullYear()} UPI Scam Analyzer. Built for digital payment fraud defense.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-[#F1F5F9]">Privacy</Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-[#F1F5F9]">Terms</Link>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-[#A8B5C7]">
              <Lock className="w-3 h-3 text-[#16A34A]" />
              <span>In-Memory Heuristic Inspection</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
