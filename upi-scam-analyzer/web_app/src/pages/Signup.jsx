import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendOtp } from '../api/otpApi';
import { Shield, AlertCircle, ArrowRight } from '../components/Icons';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await sendOtp(email);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate('/verify-otp', { state: { email, password, name } });
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-5 sm:p-8 bg-[#F5F7FA] text-[#172B4D] font-sans">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md my-4">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-1.5">
              <div className="w-9 h-9 rounded-lg accent-blue-gradient text-white flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#14243A]">Scam Shield</span>
            </Link>
            <p className="text-[#64748B] text-sm">Create an account for heuristic scan tools</p>
          </div>

          {/* Signup Card */}
          <div className="card-enterprise p-6 sm:p-8">
            <div className="mb-6 border-b border-[#E2E8F0] pb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Create Account</h2>
              <p className="text-[#64748B] text-sm mt-1">A 6-digit verification code will be sent to your email.</p>
            </div>

            {error && (
              <div className="mb-5 bg-[#FEF2F2] border border-[#FECACA] p-3.5 rounded-lg flex items-start gap-2.5 text-sm text-[#B91C1C]">
                <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block text-[#B91C1C] font-semibold">Registration Error</strong>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-sm font-semibold text-[#0F172A] mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-[15px] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-semibold text-[#0F172A] mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-[15px] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-semibold text-[#0F172A] mb-1.5"
                >
                  Password (Min. 6 characters)
                </label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-[15px] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-sm font-semibold text-[#0F172A] mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-[15px] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div className="pt-2">
                <p className="text-xs text-[#64748B] leading-relaxed mb-3.5">
                  By registering, you agree to our{' '}
                  <Link to="/terms" className="text-[#2563EB] font-medium hover:underline">Terms and Conditions</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-[#2563EB] font-medium hover:underline">Privacy Policy</Link>.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary h-11 text-[15px]"
                >
                  <span>{loading ? 'Sending Code...' : 'Proceed to Email Verification'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center">
              <p className="text-sm text-[#475569]">
                Already registered?{' '}
                <Link to="/login" className="text-[#2563EB] font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <footer className="text-center py-3 text-xs text-[#64748B] space-x-3">
        <Link to="/privacy" className="hover:text-[#0F172A]">Privacy Policy</Link>
        <span>&bull;</span>
        <Link to="/terms" className="hover:text-[#0F172A]">Terms and Conditions</Link>
        <span>&bull;</span>
        <Link to="/" className="hover:text-[#0F172A]">Home</Link>
      </footer>
    </div>
  );
}
