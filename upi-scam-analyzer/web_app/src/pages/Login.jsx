import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { Shield, AlertCircle } from '../components/Icons';

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
    <div className="min-h-screen flex flex-col justify-between p-5 sm:p-8 bg-[#F5F7FA] text-[#172B4D] font-sans">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-1.5">
              <div className="w-9 h-9 rounded-lg accent-blue-gradient text-white flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#14243A]">Scam Shield</h1>
            </Link>
            <p className="text-[#64748B] text-sm">UPI &amp; Cyber Fraud Intelligence Platform</p>
          </div>

          {/* Login Card */}
          <div className="card-enterprise p-6 sm:p-8">
            <div className="mb-6 border-b border-[#E2E8F0] pb-4">
              <h2 className="text-lg font-bold text-[#14243A]">Sign In to Account</h2>
              <p className="text-[#64748B] text-sm mt-1">Enter your credentials to access security analysis tools.</p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 p-3.5 rounded-lg flex items-start gap-2.5 text-sm text-[#B91C1C]">
                <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <h4 className="text-xs font-bold text-[#B91C1C] uppercase tracking-wider">Invalid Credentials</h4>
                  <p className="text-sm font-medium text-[#B91C1C] mt-0.5 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-semibold text-[#0F172A] mb-1.5"
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
                  className="w-full h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-[15px] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-semibold text-[#0F172A]"
                  >
                    Password
                  </label>
                  <Link to="/verify-otp" className="text-xs font-medium text-[#2563EB] hover:underline">
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
                  className="w-full h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-[15px] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary h-11 text-[15px]"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard →'}</span>
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center">
              <p className="text-sm text-[#475569]">
                Do not have an account?{' '}
                <Link to="/signup" className="text-[#2563EB] font-semibold hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-[#64748B]">
            <span>National Cyber Crime Helpline: <strong className="text-[#15803D] font-mono">1930</strong> (Toll Free)</span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-[#64748B] py-3">
        <Link to="/privacy" className="hover:text-[#0F172A]">Privacy Policy</Link>
        <span className="mx-2">&bull;</span>
        <Link to="/terms" className="hover:text-[#0F172A]">Terms and Conditions</Link>
      </div>
    </div>
  );
}
