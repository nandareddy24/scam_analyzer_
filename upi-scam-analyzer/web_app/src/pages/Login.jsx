import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { Shield, AlertCircle, ArrowRight } from '../components/Icons';

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
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-[#0B1220] text-[#F1F5F9] font-sans">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded bg-[#3B82F6] text-white flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[#F1F5F9]">Scam Shield</h1>
            </Link>
            <p className="text-[#8291A6] text-xs">UPI & Cyber Fraud Intelligence Platform</p>
          </div>

          {/* Login Card */}
          <div className="bg-[#111C2E] border border-[#26364D] rounded-lg p-5 sm:p-6">
            <div className="mb-5 border-b border-[#26364D] pb-3">
              <h2 className="text-base font-semibold text-[#F1F5F9]">Sign In to Account</h2>
              <p className="text-[#8291A6] text-xs mt-0.5">Enter your credentials to access security analysis tools.</p>
            </div>

            {error && (
              <div className="mb-4 bg-[#080F1D] border border-[#DC2626]/50 bg-red-50 border-red-200 p-3 rounded flex items-start gap-2.5 text-xs text-[#DC2626]">
                <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <h4 className="text-xs font-semibold text-[#DC2626] uppercase tracking-wider">Invalid Credentials</h4>
                  <p className="text-xs font-medium text-[#DC2626] mt-0.5 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label 
                  htmlFor="login-email"
                  className="block text-xs font-medium text-[#A8B5C7] mb-1"
                >
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs sm:text-sm text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label 
                    htmlFor="login-password"
                    className="block text-xs font-medium text-[#A8B5C7]"
                  >
                    Password
                  </label>
                  <Link to="/verify-otp" className="text-xs text-[#3B82F6] hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs sm:text-sm text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary h-[38px]"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard →'}</span>
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-[#26364D] text-center">
              <p className="text-xs text-[#A8B5C7]">
                Do not have an account?{' '}
                <Link to="/signup" className="text-[#3B82F6] font-medium hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#8291A6]">
            <span>National Cyber Crime Helpline: 1930 (Toll Free)</span>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#8291A6] py-2">
        <Link to="/privacy" className="hover:text-[#F1F5F9]">Privacy Policy</Link>
        <span className="mx-2">&bull;</span>
        <Link to="/terms" className="hover:text-[#F1F5F9]">Terms of Service</Link>
      </div>
    </div>
  );
}
