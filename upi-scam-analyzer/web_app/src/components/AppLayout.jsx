import { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { getCurrentUser } from '../services/authService';
import { PhoneCall, ExternalLink, Menu } from './Icons';

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentUser = getCurrentUser();
  const userEmail = currentUser?.email || 'analyst@scam-analyzer.internal';
  const initial = userEmail[0]?.toUpperCase() || 'A';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0B1220] text-[#F1F5F9] font-sans">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <main className="flex-1 bg-[#0B1220] flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-[#0F172A] border-b border-[#26364D] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-[#8291A6] hover:text-[#F1F5F9] p-1 rounded-md hover:bg-[#111C2E]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#8291A6]">Console</span>
              <span className="text-[#26364D] text-xs">/</span>
              <span className="text-xs font-medium text-[#F1F5F9]">Threat Investigation</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* National Helpline 1930 */}
            <div className="flex items-center gap-2 text-xs text-[#F1F5F9] bg-[#080F1D] border border-[#26364D] px-2.5 py-1.5 rounded-md">
              <PhoneCall className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="text-[#8291A6] hidden sm:inline">Helpline:</span>
              <strong className="text-[#16A34A] font-semibold">1930</strong>
              <span className="text-[#8291A6] text-[10px] hidden md:inline">(24x7)</span>
            </div>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 text-xs text-[#8291A6] hover:text-[#F1F5F9] transition-colors"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3 text-[#8291A6]" />
            </a>

            {/* User Avatar */}
            <div className="flex items-center gap-2 bg-[#080F1D] border border-[#26364D] px-2.5 py-1 rounded-md">
              <div className="w-5 h-5 rounded bg-[#3B82F6] text-white flex items-center justify-center font-semibold text-[10px] uppercase">
                {initial}
              </div>
              <span className="text-xs text-[#A8B5C7] max-w-[120px] truncate hidden sm:inline">
                {userEmail}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
          {children}
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
