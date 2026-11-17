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
  PhoneCall
} from './Icons';

export default function Sidebar() {
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
      icon: <Lock className="w-4 h-4 text-amber-400" />
    });
  }

  return (
    <aside className="w-full md:w-60 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-col justify-between flex-shrink-0 h-full">
      <div>
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-2.5 mb-6 px-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight block text-slate-100">
              UPI Scam Analyzer
            </span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              Fraud Detection Utility
            </span>
          </div>
        </Link>

        {/* Menu Navigation */}
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 px-2">
              Navigation
            </p>
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const active = path === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs transition-colors ${
                      active
                        ? 'bg-slate-900 text-white font-semibold border-l-2 border-blue-500'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <span className={active ? 'text-blue-400' : 'text-slate-500'}>
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

      <div className="pt-4 border-t border-slate-800 space-y-3">
        {/* Emergency Call Box */}
        <div className="p-3 rounded-md bg-slate-900 border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Cyber Helpline</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Call <strong className="text-slate-200">1930</strong> immediately if you transferred money to a scammer.
          </p>
        </div>

        {/* Legal Links */}
        <div className="px-1 flex items-center justify-between text-[11px] text-slate-500">
          <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          <span>&bull;</span>
          <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
          <span>&bull;</span>
          <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">Portal</a>
        </div>

        {/* Logout Link */}
        <button
          onClick={handleLogout}
          className="w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
