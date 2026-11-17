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
        <div className="w-full max-w-sm">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-100">Scam Shield</h1>
            </Link>
            <p className="text-slate-400 text-xs">UPI & Cyber Fraud Intelligence Platform</p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="mb-5 border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100">Sign In to Account</h2>
              <p className="text-slate-400 text-xs mt-0.5">Enter your credentials to access security analysis tools.</p>
            </div>

            {error && (
              <div className="mb-4 bg-slate-950 border border-red-800 bg-red-50 border-red-200 p-3 rounded flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Invalid Credentials</h4>
                  <p className="text-xs font-medium text-red-300 mt-0.5 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-400">
                    Password
                  </label>
                  <Link to="/verify-otp" className="text-xs text-blue-400 hover:text-blue-300">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-xs transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard →'}</span>
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Do not have an account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>National Cyber Crime Helpline: 1930 (Toll Free)</span>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-600 py-2">
        <Link to="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
        <span className="mx-2">&bull;</span>
        <Link to="/terms" className="hover:text-slate-400">Terms of Service</Link>
      </div>
    </div>
  );
}
