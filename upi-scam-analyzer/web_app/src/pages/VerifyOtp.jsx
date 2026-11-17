import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyOtp, sendOtp } from '../api/otpApi';
import { signUp } from '../services/authService';
import { Shield, AlertCircle, CheckCircle2, ArrowRight } from '../components/Icons';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, password } = location.state || {};

  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (!email || !password) {
    navigate('/signup');
    return null;
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError('');

    if (otp.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setVerifying(true);
    const verifyResult = await verifyOtp(email, otp.trim());

    if (!verifyResult.success) {
      setVerifying(false);
      setError(verifyResult.message);
      return;
    }

    const signupResult = await signUp(email, password);
    setVerifying(false);

    if (!signupResult.success) {
      setError(signupResult.message);
      return;
    }

    navigate('/');
  }

  async function handleResend() {
    setResending(true);
    setError('');
    setInfo('');
    const result = await sendOtp(email);
    setResending(false);
    setInfo(result.success ? 'A new 6-digit verification code was sent to your email.' : '');
    if (!result.success) setError(result.message);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm my-4">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-100">Scam Shield</span>
            </Link>
            <p className="text-slate-400 text-xs">Verify your email address</p>
          </div>

          {/* Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="mb-5 border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100">Email Verification</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                We sent a 6-digit code to <strong className="text-slate-200">{email}</strong>
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-slate-950 border border-red-800 p-3 rounded flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block text-red-400 font-bold">Verification Failed</strong>
                  {error}
                </div>
              </div>
            )}

            {info && !error && (
              <div className="mb-4 bg-slate-950 border border-emerald-800 p-3 rounded flex items-start gap-2.5 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  {info}
                </div>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full text-center tracking-[0.4em] font-mono text-2xl py-2.5 bg-slate-950 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-blue-400 font-bold"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-xs transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <span>{verifying ? 'Validating Token...' : 'Confirm & Activate Account'}</span>
                  {!verifying && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Did not receive email?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-blue-400 font-semibold hover:underline disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <footer className="text-center py-3 text-xs text-slate-500 space-x-3">
        <Link to="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
        <span>&bull;</span>
        <Link to="/terms" className="hover:text-slate-300">Terms of Service</Link>
        <span>&bull;</span>
        <Link to="/" className="hover:text-slate-300">Home</Link>
      </footer>
    </div>
  );
}
