import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut, getCurrentUser } from '../services/authService';
import {
  Shield,
  LayoutDashboard,
  Camera,
  CreditCard,
  LinkIcon,
  MessageSquare,
  AlertTriangle,
  Clock,
  Lock,
  LogOut,
  PhoneCall,
  FileText,
  ExternalLink,
  X,
} from './Icons';

export default function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userEmail = currentUser?.email || '';
  const isAdmin = userEmail === 'nandakumarreddy63@gmail.com';
  const path = location.pathname;

  async function handleLogout() {
    await signOut();
    navigate('/login');
  }

  const navItems = [
    { label: 'Analyzer Console', path: '/', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
    { label: 'URL & Domain Scanner', path: '/url', icon: <LinkIcon className="w-[18px] h-[18px]" /> },
    { label: 'SMS & Message Analyzer', path: '/message', icon: <MessageSquare className="w-[18px] h-[18px]" /> },
    { label: 'UPI VPA Checker', path: '/upi', icon: <CreditCard className="w-[18px] h-[18px]" /> },
    { label: 'Phone Number Analysis', path: '/phone', icon: <PhoneCall className="w-[18px] h-[18px]" /> },
    { label: 'QR & Screenshot OCR', path: '/ocr_qr', icon: <Camera className="w-[18px] h-[18px]" /> },
    { label: 'Fraud Entity Reporting', path: '/report', icon: <AlertTriangle className="w-[18px] h-[18px]" /> },
    { label: 'Audit History', path: '/history', icon: <Clock className="w-[18px] h-[18px]" /> },
  ];

  if (isAdmin) {
    navItems.push({
      label: 'Security Admin',
      path: '/admin',
      icon: <Lock className="w-[18px] h-[18px] text-[#D97706]" />,
    });
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#14243A]/40 md:hidden transition-opacity"
        />
      )}

      {/* Full-Height White Enterprise Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 inset-y-0 left-0 z-50
          w-[264px] bg-white border-r border-[#E2E8F0] px-4 py-5
          flex flex-col justify-between flex-shrink-0 h-screen overflow-y-auto
          transform transition-transform duration-200 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg accent-blue-gradient text-white flex items-center justify-center flex-shrink-0">
                <Shield className="w-[18px] h-[18px] text-white" />
              </div>
              <div>
                <span className="text-[15px] font-bold tracking-tight block text-[#14243A] leading-tight">
                  UPI Scam Analyzer
                </span>
                <span className="text-[11px] font-medium text-[#64748B] block mt-0.5">
                  Fraud Inspection Suite
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-[#64748B] hover:text-[#172B4D] p-1.5 rounded-lg hover:bg-[#F5F7FA]"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-2 px-3">
              Security Modules
            </p>
            <nav className="space-y-0.5" aria-label="Primary navigation">
              {navItems.map((item) => {
                const active = path === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] transition-colors ${
                      active
                        ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                        : 'text-[#172B4D] hover:bg-[#F5F7FA] font-medium'
                    }`}
                  >
                    {active && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[#2563EB]"
                        aria-hidden="true"
                      />
                    )}
                    <span className={active ? 'text-[#2563EB]' : 'text-[#64748B]'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Pinned Section */}
        <div className="pt-4 mt-6 border-t border-[#E2E8F0]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-1.5 px-3">
            Legal &amp; Support
          </p>
          <div className="space-y-0.5">
            <Link
              to="/privacy"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                path === '/privacy'
                  ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                  : 'text-[#64748B] hover:text-[#172B4D] hover:bg-[#F5F7FA]'
              }`}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>Privacy Policy</span>
            </Link>

            <Link
              to="/terms"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                path === '/terms'
                  ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                  : 'text-[#64748B] hover:text-[#172B4D] hover:bg-[#F5F7FA]'
              }`}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>Terms &amp; Conditions</span>
            </Link>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-[#64748B] hover:text-[#16A34A] hover:bg-[#F0FDF4] transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                <span>1930 Cyber Crime Portal</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0" />
            </a>
          </div>

          <div className="pt-3 mt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors border border-transparent hover:border-[#FECACA]"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
