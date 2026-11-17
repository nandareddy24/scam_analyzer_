import Sidebar from './Sidebar';
import Footer from './Footer';
import { getCurrentUser } from '../services/authService';
import { Search, Shield, PhoneCall, Activity, Terminal } from './Icons';

export default function AppLayout({ children }) {
  const currentUser = getCurrentUser();
  const userEmail = currentUser?.email || 'analyst@scam-analyzer.internal';
  const initial = userEmail[0]?.toUpperCase() || 'A';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-950 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header Bar with Glassmorphic Effect */}
        <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-20 shadow-lg">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Threat Engine Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Threat Engine:</span>
              <span className="text-emerald-400 font-bold">ONLINE & SYNCED</span>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search tools, rules, feeds..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* National Helpline 1930 Pill */}
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl font-mono">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-400">Helpline:</span>
              <strong className="text-emerald-400">1930</strong>
            </div>

            {/* User Security Session Pill */}
            <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
              <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs uppercase font-mono">
                {initial}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-200 leading-tight max-w-[140px] truncate font-mono">
                  {userEmail}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono font-medium">
                  Verified Session
                </p>
              </div>
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
