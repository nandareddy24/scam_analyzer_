import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { getCurrentUser } from '../services/authService';
import { PhoneCall, ExternalLink, Menu } from './Icons';

const ROUTE_TITLES = {
  '/': 'Analyzer Console',
  '/url': 'URL & Domain Scanner',
  '/message': 'SMS & Message Analyzer',
  '/upi': 'UPI VPA Checker',
  '/phone': 'Phone Number Analysis',
  '/ocr_qr': 'QR & Screenshot OCR',
  '/report': 'Fraud Entity Reporting',
  '/history': 'Audit History',
  '/result': 'Scan Result Report',
  '/admin': 'Local Moderation Console',
};

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const currentUser = getCurrentUser();
  const userEmail = currentUser?.email || 'Signed-in User';
  const initial = userEmail[0]?.toUpperCase() || 'U';
  const pageTitle = ROUTE_TITLES[location.pathname] || 'Threat Investigation';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F7FA] text-[#172B4D] font-sans">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <main className="flex-1 bg-[#F5F7FA] flex flex-col min-h-screen min-w-0">
        {/* Compact Top Navigation Bar */}
        <header className="bg-white border-b border-[#E2E8F0] px-5 sm:px-7 h-14 flex items-center justify-between gap-3 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-[#64748B] hover:text-[#172B4D] p-1.5 rounded-lg hover:bg-[#F5F7FA]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] truncate">
              <span className="font-medium text-[#64748B]">Console</span>
              <span className="text-[#CBD5E1]">/</span>
              <span className="font-semibold text-[#172B4D] truncate">{pageTitle}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* National Helpline 1930 */}
            <div className="flex items-center gap-1.5 text-xs text-[#172B4D] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 rounded-lg">
              <PhoneCall className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="text-[#64748B] hidden sm:inline font-medium">Helpline:</span>
              <strong className="text-[#16A34A] font-bold font-mono">1930</strong>
            </div>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#2563EB] font-medium px-2 py-1 rounded-lg hover:bg-[#F5F7FA] transition-colors"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="h-5 w-px bg-[#E2E8F0] hidden sm:block" aria-hidden="true" />

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 bg-[#F5F7FA] border border-[#E2E8F0] px-2.5 py-1 rounded-lg">
              <div className="w-6 h-6 rounded-md bg-[#14243A] text-white flex items-center justify-center font-semibold text-[11px] uppercase">
                {initial}
              </div>
              <span className="text-xs text-[#172B4D] font-medium max-w-[160px] truncate hidden sm:inline">
                {userEmail}
              </span>
            </div>
          </div>
        </header>

        {/* Full-Width Consistent Enterprise Content Grid */}
        <div className="flex-1 px-5 sm:px-7 py-6 max-w-[1360px] w-full mx-auto">
          {children}
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
