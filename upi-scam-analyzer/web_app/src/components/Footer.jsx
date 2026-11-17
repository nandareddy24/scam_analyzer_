import { Link } from 'react-router-dom';
import { Shield, PhoneCall, ExternalLink, Lock } from './Icons';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-100 text-sm tracking-tight">
                UPI Scam Analyzer
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A specialized cybersecurity utility dedicated to early detection of UPI payment fraud, phishing URLs, caller ID spoofing, and deceptive SMS patterns.
            </p>
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>National Cyber Crime Helpline: <strong className="text-emerald-400">1930</strong> (24x7 Toll Free)</span>
            </div>
          </div>

          {/* Verification Tools */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Inspection Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/url" className="text-slate-400 hover:text-blue-400 transition-colors">Phishing URL Scanner</Link></li>
              <li><Link to="/message" className="text-slate-400 hover:text-blue-400 transition-colors">SMS & Message Analyzer</Link></li>
              <li><Link to="/upi" className="text-slate-400 hover:text-blue-400 transition-colors">UPI VPA Inspector</Link></li>
              <li><Link to="/ocr_qr" className="text-slate-400 hover:text-blue-400 transition-colors">QR & Screenshot OCR</Link></li>
              <li><Link to="/report" className="text-slate-400 hover:text-blue-400 transition-colors">Report Fraud Incident</Link></li>
            </ul>
          </div>

          {/* Trust & Compliance */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Trust & Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li>
                <a 
                  href="https://cybercrime.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <span>National Cyber Crime Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.npci.org.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <span>NPCI Safety Guidelines</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} UPI Scam Analyzer. Built for cyber safety and payment fraud defense.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-300">Privacy</Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-slate-300">Terms</Link>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>In-Memory Heuristic Inspection</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
