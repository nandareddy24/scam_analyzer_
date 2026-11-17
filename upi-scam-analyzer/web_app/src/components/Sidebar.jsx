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
  FileText,
  Activity,
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
    { label: 'Defense Console', path: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Phishing URL Scanner', path: '/url', icon: <LinkIcon className="w-4 h-4" /> },
    { label: 'SMS & Message Lures', path: '/message', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'UPI VPA Checker', path: '/upi', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'OCR & QR Inspector', path: '/ocr_qr', icon: <Camera className="w-4 h-4" /> },
    { label: 'Report Fraud Entity', path: '/report', icon: <AlertTriangle className="w-4 h-4" /> },
    { label: 'Audit History', path: '/history', icon: <Clock className="w-4 h-4" /> },
  ];

  if (isAdmin) {
    navItems.push({
      label: 'Security Admin',
      path: '/admin',
      icon: <Lock className="w-4 h-4 text-amber-400" />
    });
  }

  return (
    <aside className="w-full md:w-64 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 p-5 flex flex-col justify-between flex-shrink-0 h-full overflow-y-auto">
      <div>
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-3 mb-8 px-1 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight block text-slate-100 leading-tight">
              Scam Analyzer
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider uppercase">
              Threat Intelligence
            </span>
          </div>
        </Link>

        {/* Menu Navigation */}
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2 px-3">
              DEFENSE MODULES
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = path === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
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

          {/* Quick Helpline Box */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National Helpline</span>
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Dial <strong className="text-slate-200">1930</strong> for immediate financial fraud intervention.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        {/* Legal Links */}
        <div className="px-2.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          <span>&bull;</span>
          <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
          <span>&bull;</span>
          <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">1930</a>
        </div>

        {/* Logout Link */}
        <button
          onClick={handleLogout}
          className="w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
