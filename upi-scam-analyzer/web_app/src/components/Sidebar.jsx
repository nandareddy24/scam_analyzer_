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
  X
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
    { label: 'Analyzer Console', path: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'URL Scanner', path: '/url', icon: <LinkIcon className="w-4 h-4" /> },
    { label: 'SMS & Message Checker', path: '/message', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'UPI VPA Inspector', path: '/upi', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'QR & Screenshot OCR', path: '/ocr_qr', icon: <Camera className="w-4 h-4" /> },
    { label: 'Report Incident', path: '/report', icon: <AlertTriangle className="w-4 h-4" /> },
    { label: 'Scan Audit History', path: '/history', icon: <Clock className="w-4 h-4" /> },
  ];

  if (isAdmin) {
    navItems.push({
      label: 'Security Admin',
      path: '/admin',
      icon: <Lock className="w-4 h-4 text-[#D97706]" />
    });
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-[#0F172A] border-r border-[#26364D] p-4 flex flex-col justify-between flex-shrink-0 h-full
        transform transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <Link 
              to="/" 
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5"
            >
              <div className="w-7 h-7 rounded bg-[#3B82F6] text-white flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold tracking-tight block text-[#F1F5F9]">
                  UPI Scam Analyzer
                </span>
                <span className="text-[10px] text-[#8291A6] block -mt-0.5">
                  Fraud Detection System
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-[#8291A6] hover:text-[#F1F5F9] p-1"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#8291A6] mb-1.5 px-2">
                Navigation
              </p>
              <nav className="space-y-0.5">
                {navItems.map((item) => {
                  const active = path === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs transition-colors ${
                        active
                          ? 'bg-[#111C2E] text-[#F1F5F9] font-medium border-l-2 border-[#3B82F6]'
                          : 'text-[#A8B5C7] hover:text-[#F1F5F9] hover:bg-[#111C2E]/60'
                      }`}
                    >
                      <span className={active ? 'text-[#3B82F6]' : 'text-[#8291A6]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#26364D] space-y-3">
          {/* Legal Links */}
          <div className="px-1 flex items-center justify-between text-[11px] text-[#8291A6]">
            <Link to="/privacy" onClick={() => setMobileOpen(false)} className="hover:text-[#F1F5F9] transition-colors">Privacy</Link>
            <span>&bull;</span>
            <Link to="/terms" onClick={() => setMobileOpen(false)} className="hover:text-[#F1F5F9] transition-colors">Terms</Link>
            <span>&bull;</span>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#F1F5F9] transition-colors">1930 Portal</a>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full text-[#A8B5C7] hover:text-[#DC2626] hover:bg-red-950/20 flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-[#8291A6]" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
