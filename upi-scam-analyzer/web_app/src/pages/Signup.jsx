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
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-[#0B1220] text-[#F1F5F9] font-sans">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm my-4">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded bg-[#3B82F6] text-white flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#F1F5F9]">Scam Shield</span>
            </Link>
            <p className="text-[#8291A6] text-xs">Create your fraud protection account</p>
          </div>

          {/* Signup Card */}
          <div className="bg-[#111C2E] border border-[#26364D] rounded-lg p-5 sm:p-6">
            <div className="mb-5 border-b border-[#26364D] pb-3">
              <h2 className="text-base font-semibold text-[#F1F5F9]">Create Account</h2>
              <p className="text-[#8291A6] text-xs mt-0.5">Verification code will be dispatched to your email.</p>
            </div>

            {error && (
              <div className="mb-4 bg-[#080F1D] border border-[#DC2626]/50 p-3 rounded flex items-start gap-2.5 text-xs text-[#DC2626]">
                <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block text-[#DC2626] font-semibold">Registration Error</strong>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label 
                  htmlFor="signup-name"
                  className="block text-xs font-medium text-[#A8B5C7] mb-1"
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
                  className="w-full px-3 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs sm:text-sm text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>

              <div>
                <label 
                  htmlFor="signup-email"
                  className="block text-xs font-medium text-[#A8B5C7] mb-1"
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
                  className="w-full px-3 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs sm:text-sm text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>

              <div>
                <label 
                  htmlFor="signup-password"
                  className="block text-xs font-medium text-[#A8B5C7] mb-1"
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
                  className="w-full px-3 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs sm:text-sm text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>

              <div>
                <label 
                  htmlFor="signup-confirm-password"
                  className="block text-xs font-medium text-[#A8B5C7] mb-1"
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
                  className="w-full px-3 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs sm:text-sm text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>

              <div className="pt-1">
                <p className="text-[11px] text-[#8291A6] leading-relaxed mb-3">
                  By registering, you agree to our{' '}
                  <Link to="/terms" className="text-[#3B82F6] hover:underline">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-[#3B82F6] hover:underline">Privacy Policy</Link>.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary h-[38px]"
                >
                  <span>{loading ? 'Sending Code...' : 'Proceed to Email Verification'}</span>
                  {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-[#26364D] text-center">
              <p className="text-xs text-[#A8B5C7]">
                Already registered?{' '}
                <Link to="/login" className="text-[#3B82F6] font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <footer className="text-center py-3 text-xs text-[#8291A6] space-x-3">
        <Link to="/privacy" className="hover:text-[#F1F5F9]">Privacy Policy</Link>
        <span>&bull;</span>
        <Link to="/terms" className="hover:text-[#F1F5F9]">Terms of Service</Link>
        <span>&bull;</span>
        <Link to="/" className="hover:text-[#F1F5F9]">Home</Link>
      </footer>
    </div>
  );
}
