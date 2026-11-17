import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { Shield, AlertCircle, ArrowRight, Lock } from '../components/Icons';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Enter your account password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }
    navigate('/');
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-3 mb-2 group">
              <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">Scam Shield</h1>
            </Link>
            <p className="text-slate-400 text-xs mt-1 font-mono">UPI & Cyber Fraud Intelligence Platform</p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl rounded-2xl p-6 sm:p-8">
            <div className="mb-6 border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-100">Sign In to Account</h2>
              <p className="text-slate-400 text-xs mt-0.5">Enter your credentials to access security analysis tools.</p>
            </div>

            {error && (
              <div className="mb-5 bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono">Invalid Credentials</h4>
                  <p className="text-xs font-medium text-red-300 mt-0.5 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  <Link to="/verify-otp" className="text-xs font-mono font-semibold text-blue-400 hover:text-blue-300">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs tracking-wide transition-all shadow-lg shadow-blue-600/30 inline-flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard →'}</span>
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-400 font-bold hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Legal Footer */}
      <footer className="text-center py-4 text-xs font-mono text-slate-500 space-x-3">
        <Link to="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
        <span>&bull;</span>
        <Link to="/terms" className="hover:text-slate-300">Terms of Service</Link>
        <span>&bull;</span>
        <Link to="/" className="hover:text-slate-300">Home</Link>
      </footer>
    </div>
  );
}
