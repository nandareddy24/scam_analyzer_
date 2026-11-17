import Sidebar from './Sidebar';
import Footer from './Footer';
import { getCurrentUser } from '../services/authService';
import { PhoneCall, ExternalLink } from './Icons';

export default function AppLayout({ children }) {
  const currentUser = getCurrentUser();
  const userEmail = currentUser?.email || 'analyst@scam-analyzer.internal';
  const initial = userEmail[0]?.toUpperCase() || 'A';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-950 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Console</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs font-semibold text-slate-200">Threat Investigation</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* National Helpline 1930 Notice */}
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-md">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Helpline:</span>
              <strong className="text-emerald-400 font-bold">1930</strong>
              <span className="text-slate-500 text-[11px]">(24x7)</span>
            </div>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            {/* User Session */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-md">
              <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] uppercase">
                {initial}
              </div>
              <span className="text-xs text-slate-300 max-w-[140px] truncate">
                {userEmail}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-5 sm:p-7 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
