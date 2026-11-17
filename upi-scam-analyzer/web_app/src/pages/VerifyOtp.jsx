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
            <p className="text-[#8291A6] text-xs">Verify your email address</p>
          </div>

          {/* Card */}
          <div className="bg-[#111C2E] border border-[#26364D] rounded-lg p-5 sm:p-6">
            <div className="mb-5 border-b border-[#26364D] pb-3">
              <h2 className="text-base font-semibold text-[#F1F5F9]">Email Verification</h2>
              <p className="text-[#8291A6] text-xs mt-0.5">
                We sent a 6-digit code to <strong className="text-[#F1F5F9]">{email}</strong>
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-[#080F1D] border border-[#DC2626]/50 p-3 rounded flex items-start gap-2.5 text-xs text-[#DC2626]">
                <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block text-[#DC2626] font-semibold">Verification Failed</strong>
                  {error}
                </div>
              </div>
            )}

            {info && !error && (
              <div className="mb-4 bg-[#080F1D] border border-[#16A34A]/50 p-3 rounded flex items-start gap-2.5 text-xs text-[#16A34A]">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  {info}
                </div>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label 
                  htmlFor="otp-code"
                  className="block text-xs font-medium text-[#A8B5C7] mb-1.5 text-center"
                >
                  Enter 6-Digit Code
                </label>
                <input
                  id="otp-code"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full text-center tracking-[0.4em] font-mono text-2xl py-2 bg-[#080F1D] border border-[#26364D] rounded-md focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-[#3B82F6] font-semibold"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full btn-primary h-[38px]"
                >
                  <span>{verifying ? 'Validating Token...' : 'Confirm & Activate Account'}</span>
                  {!verifying && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-[#26364D] flex items-center justify-between text-xs text-[#8291A6]">
              <span>Did not receive email?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-[#3B82F6] font-medium hover:underline disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
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
