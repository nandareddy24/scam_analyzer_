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
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md my-4">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-3 mb-2 group">
              <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">Scam Shield</h1>
            </Link>
            <p className="text-slate-400 text-xs font-mono">Create your secure fraud protection account</p>
          </div>

          {/* Signup Card */}
          <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl rounded-2xl p-6 sm:p-8">
            <div className="mb-6 border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-100">Create Account</h2>
              <p className="text-slate-400 text-xs mt-0.5">Verification code will be dispatched to your email.</p>
            </div>

            {error && (
              <div className="mb-5 bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block text-red-400 font-bold font-mono">Registration Error</strong>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

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
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password (Min. 6 characters)
                </label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="pt-1">
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  By creating an account, you acknowledge and agree to our{' '}
                  <Link to="/terms" className="text-blue-400 font-semibold hover:underline">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-400 font-semibold hover:underline">Privacy Policy</Link>.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs tracking-wide transition-all shadow-lg shadow-blue-600/30 inline-flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Sending Verification Code...' : 'Proceed to Email Verification'}</span>
                  {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Already registered?{' '}
                <Link to="/login" className="text-blue-400 font-bold hover:underline">
                  Sign In
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
